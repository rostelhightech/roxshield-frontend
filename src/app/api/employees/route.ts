import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionOrFail, sessionUser } from "@/lib/api-auth";
import { sendInvitationEmail } from "@/lib/email";
import { hash } from "bcryptjs";

export const runtime = "nodejs";

function sanitize(str: string) {
  return str.replace(/[<>]/g, "").trim().slice(0, 200);
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

/** Génère un mot de passe temporaire lisible : 3 lettres + 4 chiffres + 3 lettres (ex: Kxm4927Bpq) */
function generateTempPassword(): string {
  const alpha = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz";
  const digits = "23456789";
  const pick = (chars: string, n: number) =>
    Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return pick(alpha, 3) + pick(digits, 4) + pick(alpha, 3);
}

export async function GET(request: NextRequest) {
  const session = await getSessionOrFail();
  if (session instanceof NextResponse) return session;

  const orgId = sessionUser(session).organizationId;
  if (!orgId) return NextResponse.json({ error: "Aucune organisation" }, { status: 400 });

  const { searchParams } = new URL(request.url);
  const search = sanitize(searchParams.get("search") || "").slice(0, 100);
  const department = sanitize(searchParams.get("department") || "").slice(0, 100);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Prisma dynamic where
  const where: any = { organizationId: orgId };
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }
  if (department) {
    where.department = department;
  }

  const [employees, departments] = await Promise.all([
    db.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        department: true,
        position: true,
        role: true,
        riskScore: true,
        createdAt: true,
        _count: {
          select: {
            trainingProgress: { where: { status: "COMPLETED" } },
          },
        },
      },
      orderBy: { riskScore: "desc" },
    }),
    db.user.groupBy({
      by: ["department"],
      where: { organizationId: orgId, department: { not: null } },
      _count: true,
    }),
  ]);

  return NextResponse.json({
    employees: employees.map((e) => ({
      ...e,
      trainingsCompleted: e._count.trainingProgress,
      _count: undefined,
    })),
    departments: departments.map((d) => d.department).filter(Boolean),
  });
}

export async function POST(request: NextRequest) {
  const session = await getSessionOrFail();
  if (session instanceof NextResponse) return session;

  const orgId = sessionUser(session).organizationId;
  const role = sessionUser(session).role;
  if (!orgId) return NextResponse.json({ error: "Aucune organisation" }, { status: 400 });
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const body = await request.json();
  const email = sanitize(body.email || "");
  const name = sanitize(body.name || "");
  const department = sanitize(body.department || "");
  const position = sanitize(body.position || "");

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "Email valide requis" }, { status: 400 });
  }

  // Vérifier la limite du plan
  const [orgPlan, currentCount] = await Promise.all([
    db.organization.findUnique({ where: { id: orgId }, select: { plan: true } }),
    db.user.count({ where: { organizationId: orgId } }),
  ]);
  const planLimits: Record<string, number> = { STARTER: 50, BUSINESS: 200, CAMPUS: 500, ENTERPRISE: 10000 };
  const maxEmployees = planLimits[orgPlan?.plan || "STARTER"] || 50;
  if (currentCount >= maxEmployees) {
    return NextResponse.json(
      { error: `Limite du plan ${orgPlan?.plan || "Starter"} atteinte (${maxEmployees} employes). Passez au plan superieur.` },
      { status: 403 },
    );
  }

  // Vérifier si l'email existe déjà
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ error: "Cet email existe déjà" }, { status: 409 });

  // Générer un mot de passe temporaire
  const tempPassword = generateTempPassword();
  const hashedPassword = await hash(tempPassword, 12);

  const user = await db.user.create({
    data: {
      email,
      name: name || null,
      password: hashedPassword,
      department: department || null,
      position: position || null,
      role: "EMPLOYEE",
      organizationId: orgId,
      riskScore: 50,
    },
    select: {
      id: true,
      name: true,
      email: true,
      department: true,
      position: true,
      role: true,
      riskScore: true,
      createdAt: true,
    },
  });

  // Récupérer le nom de l'organisation et de l'inviteur
  const [org, inviter] = await Promise.all([
    db.organization.findUnique({ where: { id: orgId }, select: { name: true } }),
    db.user.findUnique({ where: { id: session.user.id }, select: { name: true } }),
  ]);

  // Envoyer l'email d'invitation (non bloquant)
  const emailResult = await sendInvitationEmail({
    to: email,
    employeeName: name || "",
    organizationName: org?.name || "votre organisation",
    invitedBy: inviter?.name || "L'administrateur",
    tempPassword,
  });

  // Log
  await db.activityLog.create({
    data: {
      action: "employee_added",
      description: `Employé "${name || email}" ajouté${emailResult.success ? " — invitation envoyée" : ""}`,
      userId: session.user.id,
      organizationId: orgId,
    },
  });

  // Welcome notification for the new employee
  await db.notification.create({
    data: {
      title: "Bienvenue sur RoxShield !",
      message: `Vous avez ete ajoute a ${org?.name || "votre organisation"}. Commencez par explorer vos formations.`,
      type: "info",
      link: "/employee/training",
      userId: user.id,
    },
  });

  return NextResponse.json({ ...user, emailSent: emailResult.success }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const session = await getSessionOrFail();
  if (session instanceof NextResponse) return session;

  const orgId = sessionUser(session).organizationId;
  const role = sessionUser(session).role;
  if (!orgId) return NextResponse.json({ error: "Aucune organisation" }, { status: 400 });
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id requis" }, { status: 400 });

  // Vérifier que l'employé appartient à l'org
  const user = await db.user.findFirst({
    where: { id, organizationId: orgId },
    select: { id: true, name: true, email: true, role: true },
  });
  if (!user) return NextResponse.json({ error: "Employé non trouvé" }, { status: 404 });

  // Ne pas permettre de supprimer un admin
  if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
    return NextResponse.json({ error: "Impossible de supprimer un administrateur" }, { status: 403 });
  }

  // Supprimer les données liées puis l'utilisateur
  await db.userBadge.deleteMany({ where: { userId: id } });
  await db.phishingResult.deleteMany({ where: { userId: id } });
  await db.trainingProgress.deleteMany({ where: { userId: id } });
  await db.activityLog.deleteMany({ where: { userId: id } });
  await db.notification.deleteMany({ where: { userId: id } });
  await db.user.delete({ where: { id } });

  await db.activityLog.create({
    data: {
      action: "employee_removed",
      description: `Employé "${user.name || user.email}" supprimé`,
      userId: session.user.id,
      organizationId: orgId,
    },
  });

  return NextResponse.json({ success: true });
}
