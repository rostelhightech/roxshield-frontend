import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionOrFail, sessionUser } from "@/lib/api-auth";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSessionOrFail();
  if (session instanceof NextResponse) return session;

  const user = sessionUser(session);

  if (!user.organizationId) {
    return NextResponse.json({ leaderboard: [], currentUser: null });
  }

  // Get employees in the same organization (top 100 for performance)
  const employees = await db.user.findMany({
    where: {
      organizationId: user.organizationId,
      role: { in: ["EMPLOYEE", "ADMIN"] },
    },
    take: 100,
    select: {
      id: true,
      name: true,
      email: true,
      department: true,
      riskScore: true,
      trainingProgress: {
        where: { status: "COMPLETED" },
        select: { quizScore: true },
      },
      badges: {
        select: { id: true },
      },
      phishingResults: {
        where: { action: "REPORTED" },
        select: { id: true },
      },
    },
  });

  // Calculate points for each employee
  const leaderboard = employees.map((emp) => {
    const trainingsCompleted = emp.trainingProgress.length;
    const avgQuizScore = emp.trainingProgress.length > 0
      ? Math.round(emp.trainingProgress.reduce((sum, t) => sum + (t.quizScore || 0), 0) / emp.trainingProgress.length)
      : 0;
    const badgesCount = emp.badges.length;
    const phishingReported = emp.phishingResults.length;

    // Point system
    const points =
      trainingsCompleted * 100 +      // 100 pts per training
      avgQuizScore * 2 +               // up to 200 pts from quiz
      badgesCount * 50 +               // 50 pts per badge
      phishingReported * 75 +           // 75 pts per reported phishing
      Math.max(0, 100 - emp.riskScore) * 3; // lower risk = more points

    return {
      id: emp.id,
      name: emp.name || emp.email,
      department: emp.department || "—",
      points,
      trainingsCompleted,
      badgesCount,
      phishingReported,
      riskScore: emp.riskScore,
      isCurrentUser: emp.id === user.id,
    };
  });

  // Sort by points descending
  leaderboard.sort((a, b) => b.points - a.points);

  // Add ranks
  const ranked = leaderboard.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));

  const currentUser = ranked.find((e) => e.isCurrentUser) || null;

  return NextResponse.json({
    leaderboard: ranked,
    currentUser,
  });
}
