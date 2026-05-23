import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionOrFail } from "@/lib/api-auth";

export async function GET() {
  const session = await getSessionOrFail();
  if (session instanceof NextResponse) return session;

  const orgId = (session.user as any).organizationId;
  if (!orgId) {
    return NextResponse.json({ error: "Aucune organisation associée" }, { status: 400 });
  }

  const [
    totalEmployees,
    employeesAtRisk,
    avgRiskScore,
    trainingsCompleted,
    totalTrainings,
    activeCampaigns,
    recentActivity,
    deptRisk,
  ] = await Promise.all([
    // Total employés de l'org
    db.user.count({ where: { organizationId: orgId } }),
    // Employés à risque (score > 60)
    db.user.count({ where: { organizationId: orgId, riskScore: { gt: 60 } } }),
    // Score de risque moyen
    db.user.aggregate({ where: { organizationId: orgId }, _avg: { riskScore: true } }),
    // Formations complétées
    db.trainingProgress.count({
      where: { user: { organizationId: orgId }, status: "COMPLETED" },
    }),
    // Total formations assignées
    db.trainingProgress.count({
      where: { user: { organizationId: orgId } },
    }),
    // Campagnes actives
    db.phishingCampaign.count({ where: { organizationId: orgId, status: "ACTIVE" } }),
    // Activité récente
    db.activityLog.findMany({
      where: { organizationId: orgId },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { user: { select: { name: true, email: true, department: true } } },
    }),
    // Risque par département
    db.user.groupBy({
      by: ["department"],
      where: { organizationId: orgId, department: { not: null } },
      _avg: { riskScore: true },
      _count: true,
    }),
  ]);

  return NextResponse.json({
    totalEmployees,
    employeesAtRisk,
    avgRiskScore: Math.round(avgRiskScore._avg.riskScore ?? 50),
    trainingsCompleted,
    totalTrainings,
    trainingRate: totalTrainings > 0 ? Math.round((trainingsCompleted / totalTrainings) * 100) : 0,
    activeCampaigns,
    recentActivity,
    deptRisk: deptRisk.map((d) => ({
      department: d.department,
      avgRisk: Math.round(d._avg.riskScore ?? 50),
      count: d._count,
    })),
  });
}
