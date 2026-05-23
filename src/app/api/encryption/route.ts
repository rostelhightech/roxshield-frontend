import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionOrFail } from "@/lib/api-auth";

export async function GET() {
  const session = await getSessionOrFail();
  if (session instanceof NextResponse) return session;

  const orgId = (session.user as any).organizationId;
  if (!orgId) return NextResponse.json({ error: "Aucune organisation" }, { status: 400 });

  const audits = await db.encryptionAudit.findMany({
    where: { organizationId: orgId },
    orderBy: { auditedAt: "desc" },
  });

  // Prendre le dernier audit par zone
  const latestByZone = new Map<string, typeof audits[0]>();
  audits.forEach((a) => {
    if (!latestByZone.has(a.zone)) {
      latestByZone.set(a.zone, a);
    }
  });

  const zones = Array.from(latestByZone.values());
  const overallScore = zones.length > 0
    ? Math.round(zones.reduce((acc, z) => acc + z.score, 0) / zones.length)
    : 0;

  const compliantCount = zones.filter((z) => z.status === "compliant").length;
  const urgentActions = zones.filter((z) => z.status === "non_compliant").length;

  return NextResponse.json({
    zones,
    stats: {
      overallScore,
      totalZones: zones.length,
      compliantCount,
      urgentActions,
      totalFindings: zones.reduce((acc, z) => {
        const findings = z.findings as any[];
        return acc + (Array.isArray(findings) ? findings.length : 0);
      }, 0),
    },
  });
}
