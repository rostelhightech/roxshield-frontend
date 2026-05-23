import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionOrFail } from "@/lib/api-auth";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSessionOrFail();
  if (session instanceof NextResponse) return session;

  const role = (session.user as any).role;
  if (role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const orgs = await db.organization.findMany({
    include: {
      _count: {
        select: {
          users: true,
          phishingCampaigns: true,
          trainingModules: true,
        },
      },
      users: {
        select: { id: true, name: true, email: true, department: true, riskScore: true, role: true },
        take: 10,
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Get completed trainings per org
  const trainingsByOrg = await db.trainingProgress.groupBy({
    by: ["moduleId"],
    where: { status: "COMPLETED" },
    _count: true,
  });

  const enrichedOrgs = orgs.map((org) => {
    const planLimits: Record<string, number> = {
      STARTER: 50,
      BUSINESS: 200,
      ENTERPRISE: 9999,
      CAMPUS: 500,
    };

    // Avg risk score for this org
    const empScores = org.users.filter((u) => u.riskScore > 0).map((u) => u.riskScore);
    const avgRisk = empScores.length > 0 ? Math.round(empScores.reduce((a, b) => a + b, 0) / empScores.length) : 0;

    return {
      id: org.id,
      name: org.name,
      plan: org.plan === "STARTER" ? "Starter" : org.plan === "BUSINESS" ? "Business" : org.plan === "ENTERPRISE" ? "Enterprise" : "Campus",
      sector: org.sector || "—",
      country: org.country || "—",
      city: org.city || "—",
      status: "active" as const,
      employees: org._count.users,
      maxEmployees: planLimits[org.plan] || 50,
      campaignsRun: org._count.phishingCampaigns,
      trainingsCompleted: 0,
      riskScore: avgRisk,
      mrr: 0,
      createdAt: org.createdAt.toISOString(),
      joinedDate: org.createdAt.toLocaleDateString("fr-FR"),
      contactName: org.users[0]?.name || "—",
      contactEmail: org.users[0]?.email || "—",
      recentEmployees: org.users.slice(0, 5).map((u) => ({
        id: u.id,
        name: u.name || u.email,
        email: u.email,
        department: u.department || "—",
        riskScore: u.riskScore,
        role: u.role,
      })),
    };
  });

  return NextResponse.json({ organizations: enrichedOrgs });
}
