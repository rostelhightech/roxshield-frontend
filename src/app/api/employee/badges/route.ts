import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionOrFail, sessionUser } from "@/lib/api-auth";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSessionOrFail();
  if (session instanceof NextResponse) return session;

  const user = sessionUser(session);

  // All available badges
  const allBadges = await db.badge.findMany({
    orderBy: { createdAt: "asc" },
  });

  // User's earned badges
  const earned = await db.userBadge.findMany({
    where: { userId: user.id },
    include: { badge: true },
  });

  const earnedSlugs = new Set(earned.map((e) => e.badge.slug));

  const badges = allBadges.map((badge) => {
    const userBadge = earned.find((e) => e.badgeId === badge.id);
    return {
      id: badge.id,
      slug: badge.slug,
      name: badge.name,
      description: badge.description,
      icon: badge.icon,
      color: badge.color,
      category: badge.category,
      earned: earnedSlugs.has(badge.slug),
      earnedAt: userBadge?.earnedAt || null,
    };
  });

  return NextResponse.json({
    badges,
    stats: {
      total: allBadges.length,
      earned: earned.length,
      completion: allBadges.length > 0 ? Math.round((earned.length / allBadges.length) * 100) : 0,
    },
  });
}
