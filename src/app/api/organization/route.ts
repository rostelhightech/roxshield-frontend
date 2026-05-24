import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionOrFail, sessionUser } from "@/lib/api-auth";

function sanitize(str: string) {
  return str.replace(/[<>]/g, "").trim().slice(0, 200);
}

export const runtime = "nodejs";

export async function GET() {
  const session = await getSessionOrFail();
  if (session instanceof NextResponse) return session;

  const orgId = sessionUser(session).organizationId;
  if (!orgId) return NextResponse.json({ error: "Aucune organisation" }, { status: 400 });

  const org = await db.organization.findUnique({
    where: { id: orgId },
    include: {
      _count: { select: { users: true, phishingCampaigns: true } },
    },
  });

  if (!org) return NextResponse.json({ error: "Organisation non trouvée" }, { status: 404 });

  return NextResponse.json({
    id: org.id,
    name: org.name,
    plan: org.plan,
    sector: org.sector,
    country: org.country,
    city: org.city,
    size: org.size,
    logo: org.logo,
    sessionTimeoutMinutes: org.sessionTimeoutMinutes,
    employeeCount: org._count.users,
    campaignCount: org._count.phishingCampaigns,
    createdAt: org.createdAt.toISOString(),
  });
}

export async function PATCH(request: NextRequest) {
  const session = await getSessionOrFail();
  if (session instanceof NextResponse) return session;

  const orgId = sessionUser(session).organizationId;
  const role = sessionUser(session).role;
  if (!orgId) return NextResponse.json({ error: "Aucune organisation" }, { status: 400 });
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const body = await request.json();
  const name = body.name !== undefined ? sanitize(body.name) : undefined;
  const sector = body.sector !== undefined ? sanitize(body.sector) : undefined;
  const country = body.country !== undefined ? sanitize(body.country) : undefined;
  const city = body.city !== undefined ? sanitize(body.city) : undefined;
  const size = body.size !== undefined ? (Number(body.size) > 0 && Number(body.size) <= 100000 ? Number(body.size) : null) : undefined;
  const VALID_TIMEOUTS = [0, 5, 10, 15, 30, 60];
  const sessionTimeoutMinutes = body.sessionTimeoutMinutes !== undefined && VALID_TIMEOUTS.includes(Number(body.sessionTimeoutMinutes))
    ? Number(body.sessionTimeoutMinutes)
    : undefined;

  const updated = await db.organization.update({
    where: { id: orgId },
    data: {
      ...(name !== undefined && { name }),
      ...(sector !== undefined && { sector }),
      ...(country !== undefined && { country }),
      ...(city !== undefined && { city }),
      ...(size !== undefined && { size }),
      ...(sessionTimeoutMinutes !== undefined && { sessionTimeoutMinutes }),
    },
    select: {
      id: true,
      name: true,
      plan: true,
      sector: true,
      country: true,
      city: true,
      size: true,
      sessionTimeoutMinutes: true,
    },
  });

  await db.activityLog.create({
    data: {
      action: "organization_updated",
      description: "Informations de l'organisation mises à jour",
      userId: session.user.id,
      organizationId: orgId,
    },
  });

  return NextResponse.json(updated);
}
