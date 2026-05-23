import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionOrFail } from "@/lib/api-auth";

export async function GET() {
  const session = await getSessionOrFail();
  if (session instanceof NextResponse) return session;

  const orgId = (session.user as any).organizationId;
  if (!orgId) return NextResponse.json({ error: "Aucune organisation" }, { status: 400 });

  const audit = await db.passwordAudit.findFirst({
    where: { organizationId: orgId },
    orderBy: { auditedAt: "desc" },
  });

  if (!audit) {
    return NextResponse.json({
      audit: null,
      stats: {
        hygieneScore: 0,
        weakPercent: 0,
        reusedPercent: 0,
        mfaPercent: 0,
        totalAccounts: 0,
      },
    });
  }

  const total = audit.totalAccounts || 1;

  return NextResponse.json({
    audit,
    stats: {
      hygieneScore: audit.avgStrength,
      weakPercent: Math.round((audit.weakPasswords / total) * 100),
      reusedPercent: Math.round((audit.reusedPasswords / total) * 100),
      mfaPercent: Math.round((audit.mfaEnabled / total) * 100),
      mfaEnabled: audit.mfaEnabled,
      noMfa: audit.noMfaCount,
      totalAccounts: total,
    },
  });
}
