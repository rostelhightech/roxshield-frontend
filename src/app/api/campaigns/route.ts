import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionOrFail, sessionUser } from "@/lib/api-auth";

function sanitize(str: string) {
  return str.replace(/[<>]/g, "").trim().slice(0, 200);
}

const VALID_TEMPLATES = ["mobile_money", "bank", "delivery", "internal", "email_phishing"];

export async function GET() {
  const session = await getSessionOrFail();
  if (session instanceof NextResponse) return session;

  const orgId = sessionUser(session).organizationId;
  if (!orgId) return NextResponse.json({ error: "Aucune organisation" }, { status: 400 });

  const campaigns = await db.phishingCampaign.findMany({
    where: { organizationId: orgId },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { results: true } },
    },
  });

  // Stats globales
  const stats = await db.phishingCampaign.aggregate({
    where: { organizationId: orgId },
    _sum: { sentCount: true, clickCount: true, reportCount: true },
    _count: true,
  });

  const totalSent = stats._sum.sentCount ?? 0;
  const totalClicks = stats._sum.clickCount ?? 0;
  const totalReports = stats._sum.reportCount ?? 0;

  return NextResponse.json({
    campaigns,
    stats: {
      totalCampaigns: stats._count,
      totalSent,
      clickRate: totalSent > 0 ? Math.round((totalClicks / totalSent) * 100) : 0,
      reportRate: totalSent > 0 ? Math.round((totalReports / totalSent) * 100) : 0,
    },
  });
}

export async function POST(request: NextRequest) {
  const session = await getSessionOrFail();
  if (session instanceof NextResponse) return session;

  const orgId = sessionUser(session).organizationId;
  const role = sessionUser(session).role;
  if (!orgId) return NextResponse.json({ error: "Aucune organisation" }, { status: 400 });
  if (role === "EMPLOYEE") return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const body = await request.json();
  const name = sanitize(body.name || "");
  const description = sanitize(body.description || "");
  const templateType = (body.templateType || "").trim();
  const targetDepts = Array.isArray(body.targetDepts) ? body.targetDepts.map((d: string) => sanitize(d)) : [];

  if (!name || !templateType) {
    return NextResponse.json({ error: "Nom et type de template requis" }, { status: 400 });
  }

  if (!VALID_TEMPLATES.includes(templateType)) {
    return NextResponse.json({ error: "Type de template invalide" }, { status: 400 });
  }

  // Compter les cibles
  const targetCount = await db.user.count({
    where: {
      organizationId: orgId,
      ...(targetDepts?.length ? { department: { in: targetDepts } } : {}),
    },
  });

  const campaign = await db.phishingCampaign.create({
    data: {
      name,
      description,
      templateType,
      targetDepts: targetDepts || [],
      totalTargets: targetCount,
      organizationId: orgId,
    },
  });

  // Log activité
  await db.activityLog.create({
    data: {
      action: "campaign_created",
      description: `Campagne "${name}" créée`,
      userId: session.user.id,
      organizationId: orgId,
    },
  });

  return NextResponse.json(campaign, { status: 201 });
}
