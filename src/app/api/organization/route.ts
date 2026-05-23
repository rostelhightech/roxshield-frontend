import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionOrFail } from "@/lib/api-auth";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSessionOrFail();
  if (session instanceof NextResponse) return session;

  const orgId = (session.user as any).organizationId;
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
    employeeCount: org._count.users,
    campaignCount: org._count.phishingCampaigns,
    createdAt: org.createdAt.toISOString(),
  });
}

export async function PATCH(request: NextRequest) {
  const session = await getSessionOrFail();
  if (session instanceof NextResponse) return session;

  const orgId = (session.user as any).organizationId;
  const role = (session.user as any).role;
  if (!orgId) return NextResponse.json({ error: "Aucune organisation" }, { status: 400 });
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const body = await request.json();
  const { name, sector, country, city, size } = body;

  const updated = await db.organization.update({
    where: { id: orgId },
    data: {
      ...(name !== undefined && { name }),
      ...(sector !== undefined && { sector }),
      ...(country !== undefined && { country }),
      ...(city !== undefined && { city }),
      ...(size !== undefined && { size: Number(size) || null }),
    },
    select: {
      id: true,
      name: true,
      plan: true,
      sector: true,
      country: true,
      city: true,
      size: true,
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
