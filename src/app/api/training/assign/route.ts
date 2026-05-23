import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionOrFail } from "@/lib/api-auth";

export const runtime = "nodejs";

/** POST — Assigner un module de formation à un employé */
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
  const { userId, moduleId } = body;

  if (!userId || !moduleId) {
    return NextResponse.json({ error: "userId et moduleId requis" }, { status: 400 });
  }

  // Vérifier que l'employé appartient à l'org
  const employee = await db.user.findFirst({
    where: { id: userId, organizationId: orgId },
    select: { id: true, name: true, email: true },
  });
  if (!employee) return NextResponse.json({ error: "Employé non trouvé" }, { status: 404 });

  // Vérifier que le module existe
  const module = await db.trainingModule.findUnique({
    where: { id: moduleId },
    select: { id: true, title: true },
  });
  if (!module) return NextResponse.json({ error: "Module non trouvé" }, { status: 404 });

  // Créer ou reset la progression
  const progress = await db.trainingProgress.upsert({
    where: { userId_moduleId: { userId, moduleId } },
    update: {
      status: "NOT_STARTED",
      progressPercent: 0,
      quizScore: null,
      completedAt: null,
    },
    create: {
      userId,
      moduleId,
      status: "NOT_STARTED",
      progressPercent: 0,
    },
  });

  // Créer une notification pour l'employé
  await db.notification.create({
    data: {
      type: "info",
      title: `Formation assignée : ${module.title}`,
      message: `L'administrateur vous a assigné la formation "${module.title}". Accédez à votre espace formation pour commencer.`,
      userId,
    },
  });

  // Log
  await db.activityLog.create({
    data: {
      action: "training_assigned",
      description: `Formation "${module.title}" assignée à ${employee.name || employee.email}`,
      userId: session.user.id,
      organizationId: orgId,
    },
  });

  return NextResponse.json({ success: true, progress });
}
