import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionOrFail } from "@/lib/api-auth";

export async function GET() {
  const session = await getSessionOrFail();
  if (session instanceof NextResponse) return session;

  const orgId = (session.user as any).organizationId;
  if (!orgId) return NextResponse.json({ error: "Aucune organisation" }, { status: 400 });

  const [threats, stats] = await Promise.all([
    db.emailThreat.findMany({
      where: { organizationId: orgId },
      orderBy: { detectedAt: "desc" },
      take: 50,
    }),
    db.emailThreat.groupBy({
      by: ["type"],
      where: { organizationId: orgId },
      _count: true,
    }),
  ]);

  const totalThreats = threats.length;
  const blocked = threats.filter((t) => t.status === "BLOCKED").length;
  const critical = threats.filter((t) => t.severity === "CRITICAL").length;

  return NextResponse.json({
    threats,
    stats: {
      total: totalThreats,
      blocked,
      critical,
      blockRate: totalThreats > 0 ? Math.round((blocked / totalThreats) * 100) : 100,
      byType: stats.map((s) => ({ type: s.type, count: s._count })),
    },
  });
}
