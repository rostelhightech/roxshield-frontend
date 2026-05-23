import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionOrFail } from "@/lib/api-auth";

// Employee reports a phishing simulation email
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSessionOrFail();
  if (session instanceof NextResponse) return session;

  const { id: campaignId } = await params;

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

    // Decrease user risk score (reward for reporting)
    await db.user.update({
      where: { id: session.user.id },
      data: { riskScore: { decrement: 3 } },
    });

    // Log activity
    const campaign = await db.phishingCampaign.findUnique({
      where: { id: campaignId },
      select: { name: true, organizationId: true },
    });

    if (campaign) {
      await db.activityLog.create({
        data: {
          action: "phishing_reported",
          description: `Email de simulation "${campaign.name}" signale`,
          userId: session.user.id,
          organizationId: campaign.organizationId,
        },
      });
    }

    return NextResponse.json({ success: true, message: "Email signale avec succes !" });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
