import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionOrFail } from "@/lib/api-auth";

export const runtime = "nodejs";

/** POST — Inclure un employé dans une campagne de phishing */
export async function POST(request: NextRequest) {
  const session = await getSessionOrFail();
  if (session instanceof NextResponse) return session;

  const orgId = (session.user as any).organizationId;
  const role = (session.user as any).role;
  if (!orgId) return NextResponse.json({ error: "Aucune organisation" }, { status: 400 });
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const body = await request.json();
  const { userId, campaignId } = body;

  if (!userId || !campaignId) {
    return NextResponse.json({ error: "userId et campaignId requis" }, { status: 400 });
  }

  // Vérifier que l'employé appartient à l'org
  const employee = await db.user.findFirst({
    where: { id: userId, organizationId: orgId },
    select: { id: true, name: true, email: true },
  });
  if (!employee) return NextResponse.json({ error: "Employé non trouvé" }, { status: 404 });

  // Vérifier que la campagne appartient à l'org
  const campaign = await db.phishingCampaign.findFirst({
    where: { id: campaignId, organizationId: orgId },
    select: { id: true, name: true },
  });
  if (!campaign) return NextResponse.json({ error: "Campagne non trouvée" }, { status: 404 });

  // Vérifier si déjà inclus
  const existing = await db.phishingResult.findUnique({
    where: { userId_campaignId: { userId, campaignId } },
  });
  if (existing) {
    return NextResponse.json({ error: "Cet employé est déjà inclus dans cette campagne" }, { status: 409 });
  }

  // Créer le résultat (statut SENT = cible ajoutée)
  const result = await db.phishingResult.create({
    data: {
      userId,
      campaignId,
      action: "SENT",
    },
  });

  // Mettre à jour le compteur de la campagne
  await db.phishingCampaign.update({
    where: { id: campaignId },
    data: { sentCount: { increment: 1 } },
  });

  // Notification pour l'employé
  await db.notification.create({
    data: {
      type: "info",
      title: "Campagne de sensibilisation",
      message: `Vous avez été inclus dans la campagne "${campaign.name}". Restez vigilant face aux emails suspects.`,
      userId,
    },
  });

  // Log
  await db.activityLog.create({
    data: {
      action: "campaign_target_added",
      description: `${employee.name || employee.email} ajouté à la campagne "${campaign.name}"`,
      userId: session.user.id,
      organizationId: orgId,
    },
  });

  return NextResponse.json({ success: true, result });
}
