import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionOrFail, sessionUser } from "@/lib/api-auth";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSessionOrFail();
  if (session instanceof NextResponse) return session;

  const user = sessionUser(session);

  // Training progress
  const trainings = await db.trainingProgress.findMany({
    where: { userId: user.id },
    include: {
      module: {
        select: { title: true, category: true, difficulty: true, durationMinutes: true, badgeName: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  // Phishing results (last 50)
  const phishingResults = await db.phishingResult.findMany({
    where: { userId: user.id },
    include: {
      campaign: {
        select: { name: true, templateType: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  // Activity logs
  const activities = await db.activityLog.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  // User profile for risk score
  const profile = await db.user.findUnique({
    where: { id: user.id },
    select: { riskScore: true, name: true, email: true },
  });

  // Calculate stats
  const completedTrainings = trainings.filter((t) => t.status === "COMPLETED");
  const avgQuizScore = completedTrainings.length > 0
    ? Math.round(completedTrainings.reduce((sum, t) => sum + (t.quizScore || 0), 0) / completedTrainings.length)
    : 0;

  const phishingReported = phishingResults.filter((r) => r.action === "REPORTED").length;
  const phishingClicked = phishingResults.filter((r) => r.action === "CLICKED").length;
  const phishingTotal = phishingResults.length;

  return NextResponse.json({
    stats: {
      riskScore: profile?.riskScore || 50,
      trainingsCompleted: completedTrainings.length,
      trainingsTotal: trainings.length,
      avgQuizScore,
      phishingReported,
      phishingClicked,
      phishingTotal,
    },
    trainings: trainings.map((t) => ({
      id: t.id,
      moduleTitle: t.module.title,
      category: t.module.category,
      difficulty: t.module.difficulty,
      duration: t.module.durationMinutes,
      badgeName: t.module.badgeName,
      status: t.status,
      progressPercent: t.progressPercent,
      quizScore: t.quizScore,
      completedAt: t.completedAt,
    })),
    phishing: phishingResults.map((r) => ({
      id: r.id,
      campaignName: r.campaign.name,
      templateType: r.campaign.templateType,
      action: r.action,
      clickedAt: r.clickedAt,
      reportedAt: r.reportedAt,
      createdAt: r.createdAt,
    })),
    recentActivity: activities.map((a) => ({
      id: a.id,
      action: a.action,
      description: a.description,
      createdAt: a.createdAt,
    })),
  });
}
