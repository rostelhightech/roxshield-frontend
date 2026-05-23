import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionOrFail } from "@/lib/api-auth";

export async function GET() {
  const session = await getSessionOrFail();
  if (session instanceof NextResponse) return session;

  const orgId = (session.user as any).organizationId;
  const userId = session.user.id;

  // Modules disponibles (globaux + spécifiques à l'org)
  const modules = await db.trainingModule.findMany({
    where: {
      isActive: true,
      OR: [{ organizationId: null }, { organizationId: orgId }],
    },
    orderBy: { createdAt: "asc" },
  });

  // Progression de l'utilisateur
  const progress = await db.trainingProgress.findMany({
    where: { userId },
    select: { moduleId: true, status: true, progressPercent: true, quizScore: true, completedAt: true },
  });

  const progressMap = Object.fromEntries(progress.map((p) => [p.moduleId, p]));

  const enrichedModules = modules.map((m) => ({
    id: m.id,
    title: m.title,
    description: m.description,
    category: m.category,
    difficulty: m.difficulty,
    durationMinutes: m.durationMinutes,
    badgeIcon: m.badgeIcon,
    badgeName: m.badgeName,
    progress: progressMap[m.id] || { status: "NOT_STARTED", progressPercent: 0, quizScore: null },
  }));

  return NextResponse.json({
    modules: enrichedModules,
    stats: {
      total: modules.length,
      completed: progress.filter((p) => p.status === "COMPLETED").length,
      inProgress: progress.filter((p) => p.status === "IN_PROGRESS").length,
    },
  });
}

// Mettre à jour la progression d'un module
export async function POST(request: NextRequest) {
  const session = await getSessionOrFail();
  if (session instanceof NextResponse) return session;

  const userId = session.user.id;
  const orgId = (session.user as any).organizationId;
  const body = await request.json();
  const { moduleId, progressPercent, quizScore } = body;

  if (!moduleId) return NextResponse.json({ error: "moduleId requis" }, { status: 400 });

  const status = progressPercent >= 100 ? "COMPLETED" : progressPercent > 0 ? "IN_PROGRESS" : "NOT_STARTED";

  const progress = await db.trainingProgress.upsert({
    where: { userId_moduleId: { userId, moduleId } },
    update: {
      progressPercent: Math.min(progressPercent, 100),
      quizScore,
      status,
      completedAt: status === "COMPLETED" ? new Date() : null,
    },
    create: {
      userId,
      moduleId,
      progressPercent: Math.min(progressPercent, 100),
      quizScore,
      status,
      completedAt: status === "COMPLETED" ? new Date() : null,
    },
  });

  // Log si complété
  if (status === "COMPLETED" && orgId) {
    const mod = await db.trainingModule.findUnique({ where: { id: moduleId }, select: { title: true } });
    await db.activityLog.create({
      data: {
        action: "training_completed",
        description: `Formation "${mod?.title}" complétée`,
        userId,
        organizationId: orgId,
      },
    });
  }

  return NextResponse.json(progress);
}
