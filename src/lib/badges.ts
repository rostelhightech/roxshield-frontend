import { db } from "@/lib/db";

/**
 * Check and auto-award badges for a user based on their current achievements.
 * Called after training completion, phishing report, quiz score, etc.
 * Idempotent — safe to call multiple times.
 */
export async function checkAndAwardBadges(userId: string): Promise<string[]> {
  const awarded: string[] = [];

  // Fetch all badges with conditions
  const badges = await db.badge.findMany({
    where: { condition: { not: { equals: undefined } } },
  });

  // Fetch user's already earned badges
  const earned = await db.userBadge.findMany({
    where: { userId },
    select: { badgeId: true },
  });
  const earnedIds = new Set(earned.map((e) => e.badgeId));

  // Filter to unevaluated badges
  const unevaluated = badges.filter((b) => !earnedIds.has(b.id));
  if (unevaluated.length === 0) return awarded;

  // Fetch user stats in parallel
  const [trainingsCompleted, phishingReported, bestQuizScore, totalModules] =
    await Promise.all([
      db.trainingProgress.count({
        where: { userId, status: "COMPLETED" },
      }),
      db.phishingResult.count({
        where: { userId, action: "REPORTED" },
      }),
      db.trainingProgress.aggregate({
        where: { userId, status: "COMPLETED" },
        _max: { quizScore: true },
      }),
      db.trainingModule.count({ where: { isActive: true } }),
    ]);

  const maxQuiz = bestQuizScore._max.quizScore ?? 0;

  for (const badge of unevaluated) {
    const condition = badge.condition as { type: string; threshold: number } | null;
    if (!condition) continue;

    let qualifies = false;

    switch (condition.type) {
      case "trainings_completed":
        qualifies = trainingsCompleted >= condition.threshold;
        break;

      case "phishing_reported":
        qualifies = phishingReported >= condition.threshold;
        break;

      case "quiz_perfect":
        qualifies = maxQuiz >= 100;
        break;

      case "all_trainings_completed":
        qualifies = totalModules > 0 && trainingsCompleted >= totalModules;
        break;

      // streak_days not checked here — would need login tracking
      // can be implemented later with a daily cron
      default:
        break;
    }

    if (qualifies) {
      try {
        await db.userBadge.create({
          data: { userId, badgeId: badge.id },
        });

        // Notification
        await db.notification.create({
          data: {
            title: `Badge debloque : ${badge.name} !`,
            message: badge.description,
            type: "success",
            link: "/employee/results",
            userId,
          },
        });

        awarded.push(badge.slug);
      } catch {
        // Already awarded (unique constraint) — skip
      }
    }
  }

  return awarded;
}
