import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionOrFail, sessionUser } from "@/lib/api-auth";
import { hash } from "bcryptjs";
import { sendInvitationEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

function generateTempPassword(): string {
  const alpha = "abcdefghjkmnpqrstuvwxyz";
  const digits = "23456789";
  let pwd = "";
  for (let i = 0; i < 3; i++) pwd += alpha[Math.floor(Math.random() * alpha.length)];
  for (let i = 0; i < 4; i++) pwd += digits[Math.floor(Math.random() * digits.length)];
  for (let i = 0; i < 3; i++) pwd += alpha[Math.floor(Math.random() * alpha.length)];
  return pwd;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

function parseCSV(text: string): string[][] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  return lines.map((line) => {
    // Handle quoted fields
    const fields: string[] = [];
    let current = "";
    let inQuotes = false;
    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        fields.push(current.trim());
        current = "";
      } else if (char === ";" && !inQuotes) {
        // Support semicolon separator (common in French CSVs)
        fields.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    fields.push(current.trim());
    return fields;
  });
}

export async function POST(request: NextRequest) {
  const session = await getSessionOrFail();
  if (session instanceof NextResponse) return session;

  // Rate limit: 3 imports per minute
  const { success: rlOk } = rateLimit(`import:${session.user.id}`, { maxRequests: 3, windowMs: 60_000 });
  if (!rlOk) {
    return NextResponse.json({ error: "Trop d'imports. Reessayez dans une minute." }, { status: 429 });
  }

  const orgId = sessionUser(session).organizationId;
  const role = sessionUser(session).role;
  if (!orgId) return NextResponse.json({ error: "Aucune organisation" }, { status: 400 });
  if (role === "EMPLOYEE") return NextResponse.json({ error: "Acces refuse" }, { status: 403 });

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "Fichier CSV requis" }, { status: 400 });
  }

  if (file.size > 1024 * 1024) {
    return NextResponse.json({ error: "Fichier trop volumineux (max 1 Mo)" }, { status: 400 });
  }

  const text = await file.text();
  const rows = parseCSV(text);

  if (rows.length < 2) {
    return NextResponse.json({ error: "Le fichier doit contenir un en-tete et au moins une ligne" }, { status: 400 });
  }

  // Parse header to find columns
  const header = rows[0].map((h) => h.toLowerCase().replace(/[^a-z]/g, ""));
  const emailIdx = header.findIndex((h) => h === "email" || h === "mail" || h === "courriel");
  const nameIdx = header.findIndex((h) => h === "nom" || h === "name" || h === "nomcomplet" || h === "fullname");
  const deptIdx = header.findIndex((h) => h === "departement" || h === "department" || h === "dept" || h === "service");
  const posIdx = header.findIndex((h) => h === "poste" || h === "position" || h === "fonction" || h === "titre" || h === "title");

  if (emailIdx === -1) {
    return NextResponse.json(
      { error: "Colonne 'email' introuvable. Colonnes detectees: " + rows[0].join(", ") },
      { status: 400 },
    );
  }

  const dataRows = rows.slice(1);
  const [org, inviter, currentCount] = await Promise.all([
    db.organization.findUnique({ where: { id: orgId }, select: { name: true, plan: true } }),
    db.user.findUnique({ where: { id: session.user.id }, select: { name: true } }),
    db.user.count({ where: { organizationId: orgId } }),
  ]);

  // Vérifier la limite du plan
  const planLimits: Record<string, number> = { STARTER: 50, BUSINESS: 200, CAMPUS: 500, ENTERPRISE: 10000 };
  const maxEmployees = planLimits[org?.plan || "STARTER"] || 50;
  const slotsLeft = Math.max(0, maxEmployees - currentCount);
  if (slotsLeft === 0) {
    return NextResponse.json(
      { error: `Limite du plan atteinte (${maxEmployees} employes). Passez au plan superieur.` },
      { status: 403 },
    );
  }

  const results = {
    total: dataRows.length,
    created: 0,
    skipped: 0,
    errors: [] as string[],
  };

  for (const row of dataRows) {
    // Check plan limit
    if (results.created >= slotsLeft) {
      results.skipped++;
      results.errors.push("Limite du plan atteinte — employes restants ignores");
      break;
    }

    const email = row[emailIdx]?.trim();
    if (!email || !isValidEmail(email)) {
      results.skipped++;
      if (email) results.errors.push(`${email}: email invalide`);
      continue;
    }

    const name = nameIdx >= 0 ? row[nameIdx]?.trim() || null : null;
    const department = deptIdx >= 0 ? row[deptIdx]?.trim() || null : null;
    const position = posIdx >= 0 ? row[posIdx]?.trim() || null : null;

    // Check if already exists
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      results.skipped++;
      results.errors.push(`${email}: existe deja`);
      continue;
    }

    const tempPassword = generateTempPassword();
    const hashedPassword = await hash(tempPassword, 12);

    try {
      await db.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          department,
          position,
          role: "EMPLOYEE",
          organizationId: orgId,
          riskScore: 50,
        },
      });

      // Send invitation (best-effort, don't block)
      sendInvitationEmail({
        to: email,
        employeeName: name || "",
        organizationName: org?.name || "votre organisation",
        invitedBy: inviter?.name || "L'administrateur",
        tempPassword,
      }).catch(() => {});

      results.created++;
    } catch {
      results.skipped++;
      results.errors.push(`${email}: erreur creation`);
    }
  }

  // Log activity
  await db.activityLog.create({
    data: {
      action: "employees_imported",
      description: `Import CSV: ${results.created} crees, ${results.skipped} ignores sur ${results.total}`,
      userId: session.user.id,
      organizationId: orgId,
    },
  });

  return NextResponse.json(results);
}
