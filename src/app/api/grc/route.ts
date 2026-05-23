import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionOrFail } from "@/lib/api-auth";

export async function GET() {
  const session = await getSessionOrFail();
  if (session instanceof NextResponse) return session;

  const orgId = (session.user as any).organizationId;
  if (!orgId) return NextResponse.json({ error: "Aucune organisation" }, { status: 400 });

  const [frameworks, risks] = await Promise.all([
    db.complianceFramework.findMany({
      where: { organizationId: orgId },
      orderBy: { name: "asc" },
    }),
    db.riskEntry.findMany({
      where: { organizationId: orgId },
      orderBy: { riskScore: "desc" },
    }),
  ]);

  // Calcul score de maturité global
  const maturityScore = frameworks.length > 0
    ? Math.round(frameworks.reduce((acc, f) => acc + f.overallScore, 0) / frameworks.length)
    : 0;

  // Gap analysis
  const compliant = frameworks.filter((f) => f.status === "compliant").length;
  const inProgress = frameworks.filter((f) => f.status === "in_progress").length;
  const nonCompliant = frameworks.filter((f) => f.status === "non_compliant").length;

  return NextResponse.json({
    frameworks,
    risks,
    maturityScore,
    gapAnalysis: {
      compliant,
      partial: inProgress,
      missing: nonCompliant,
      total: frameworks.length,
    },
  });
}
