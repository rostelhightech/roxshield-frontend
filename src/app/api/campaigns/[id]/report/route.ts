import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionOrFail, sessionUser } from "@/lib/api-auth";
import { checkAndAwardBadges } from "@/lib/badges";

// Employee reports a phishing simulation email
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSessionOrFail();
  if (session instanceof NextResponse) return session;

  const { id: campaignId } = await params;
  const orgId = sessionUser(session).organizationId;

  // Verify campaign belongs to user's organization
  const campaign = await db.phishingCampaign.findFirst({
    where: { id: campaignId, organizationId: orgId! },
    select: { id: true, name: true, organizationId: true },
  });
  if (!campaign) {
    return NextResponse.json({ error: "Campagne introuvable" }, { status: 404 });
  }

  try {
    // Update result to REPORTED
    const updated = await db.phishingResult.updateMany({
      where: {
        campaignId,
        userId: session.user.id,
        action: { in: ["SENT", "OPENED"] },
      },
      data: { action: "REPORTED", reportedAt: new Date() },
    });

    if (updated.count === 0) {
      return NextResponse.json(
        { error: "Aucune simulation trouvee ou deja signalee" },
        { status: 404 },
      );
    }

    // Increment report count on campaign
    await db.phishingCampaign.update({
      where: { id: campaignId },
      data: { reportCount: { increment: 1 } },
    });

    // Decrease user risk score (reward for reporting, floor at 0)
    const reporter = await db.user.findUnique({ where: { id: session.user.id }, select: { riskScore: true } });
    await db.user.update({
      where: { id: session.user.id },
      data: { riskScore: Math.max((reporter?.riskScore || 50) - 3, 0) },
    });

    // Log activity
    await db.activityLog.create({
      data: {
        action: "phishing_reported",
        description: `Email de simulation "${campaign.name}" signale`,
        userId: session.user.id,
        organizationId: campaign.organizationId,
      },
    });

    // Reward notification for the employee
    await db.notification.create({
      data: {
        title: "Bien joue !",
        message: "Vous avez correctement identifie et signale un email de simulation. Votre score de risque a ete ameliore.",
        type: "success",
        link: "/employee/results",
        userId: session.user.id,
      },
    });

    // Check for new badges (non-blocking)
    checkAndAwardBadges(session.user.id).catch(() => {});

    return NextResponse.json({ success: true, message: "Email signale avec succes !" });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
