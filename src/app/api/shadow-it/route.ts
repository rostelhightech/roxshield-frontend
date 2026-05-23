import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionOrFail } from "@/lib/api-auth";

export async function GET() {
  const session = await getSessionOrFail();
  if (session instanceof NextResponse) return session;

  const orgId = (session.user as any).organizationId;
  if (!orgId) return NextResponse.json({ error: "Aucune organisation" }, { status: 400 });

  const [apps, totalEmployees] = await Promise.all([
    db.shadowItApp.findMany({
      where: { organizationId: orgId },
      orderBy: { riskLevel: "desc" },
    }),
    db.user.count({ where: { organizationId: orgId } }),
  ]);

  const unapproved = apps.filter((a) => !a.isApproved);
  const highRiskCount = apps.filter((a) => a.riskLevel === "HIGH" || a.riskLevel === "CRITICAL").length;

  // Score Shadow IT (plus il y a d'apps non approuvées, plus le score est bas)
  const shadowScore = apps.length > 0
    ? Math.max(0, 100 - Math.round((unapproved.length / Math.max(apps.length, 1)) * 100))
    : 100;

  // Exposition par département
  const deptMap = new Map<string, number>();
  apps.forEach((app) => {
    app.departments.forEach((dept) => {
      deptMap.set(dept, (deptMap.get(dept) || 0) + app.usersCount);
    });
  });
  const deptExposure = Array.from(deptMap.entries())
    .map(([dept, exposure]) => ({
      dept,
      score: Math.min(100, Math.round((exposure / Math.max(totalEmployees, 1)) * 100)),
    }))
    .sort((a, b) => b.score - a.score);

  return NextResponse.json({
    apps,
    stats: {
      shadowScore,
      totalApps: apps.length,
      unapprovedCount: unapproved.length,
      highRiskCount,
      totalEmployees,
    },
    deptExposure,
  });
}
