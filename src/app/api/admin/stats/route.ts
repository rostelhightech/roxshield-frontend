import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionOrFail, sessionUser } from "@/lib/api-auth";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSessionOrFail();
  if (session instanceof NextResponse) return session;

  const role = sessionUser(session).role;
  if (role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const [
    totalOrganizations,
    totalEmployees,
    totalCampaigns,
    totalTrainingsCompleted,
    orgs,
  ] = await Promise.all([
    db.organization.count(),
    db.user.count({ where: { role: { in: ["EMPLOYEE", "ADMIN"] } } }),
    db.phishingCampaign.count(),
    db.trainingProgress.count({ where: { status: "COMPLETED" } }),
    db.organization.findMany({
      include: {
        _count: { select: { users: true, phishingCampaigns: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  // Avg risk score across all employees
  const avgResult = await db.user.aggregate({
    _avg: { riskScore: true },
    where: { role: { in: ["EMPLOYEE", "ADMIN"] } },
  });

  // Plan distribution
  const planCounts = await db.organization.groupBy({
    by: ["plan"],
    _count: true,
  });

  const planColors: Record<string, string> = {
    STARTER: "#25d366",
    BUSINESS: "#fa990e",
    ENTERPRISE: "#9c1e99",
    CAMPUS: "#0ea5e9",
  };

  const planDistribution = planCounts.map((p) => ({
    name: p.plan === "STARTER" ? "Starter" : p.plan === "BUSINESS" ? "Business" : p.plan === "ENTERPRISE" ? "Enterprise" : "Campus",
    value: p._count,
    color: planColors[p.plan] || "#888",
  }));

  // Recent organizations enriched
  const recentOrgs = orgs.slice(0, 10).map((org) => ({
    id: org.id,
    name: org.name,
    plan: org.plan === "STARTER" ? "Starter" : org.plan === "BUSINESS" ? "Business" : org.plan === "ENTERPRISE" ? "Enterprise" : "Campus",
    sector: org.sector || "—",
    country: org.country || "—",
    city: org.city || "—",
    status: "active" as const,
    employees: org._count.users,
    campaigns: org._count.phishingCampaigns,
    createdAt: org.createdAt.toISOString(),
  }));

  return NextResponse.json({
    totalOrganizations,
    activeOrganizations: totalOrganizations,
    totalEmployees,
    totalCampaigns,
    totalTrainingsCompleted,
    avgRiskScore: Math.round(avgResult._avg.riskScore || 0),
    mrrTotal: 0,
    mrrGrowth: 0,
    churnRate: 0,
    planDistribution,
    recentOrgs,
  });
}
