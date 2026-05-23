"use client";

import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Trophy,
  Medal,
  Flame,
  Shield,
  Crown,
} from "lucide-react";
import { FadeIn, StaggerContainer } from "@/components/motion";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { useApi } from "@/hooks/use-api";

interface LeaderboardEntry {
  id: string;
  name: string;
  department: string;
  points: number;
  trainingsCompleted: number;
  badgesCount: number;
  phishingReported: number;
  riskScore: number;
  isCurrentUser: boolean;
  rank: number;
}

interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[];
  currentUser: LeaderboardEntry | null;
}

function RankDisplay({ rank }: { rank: number }) {
  if (rank === 1) return <Crown className="h-6 w-6 text-yellow-500" />;
  if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
  if (rank === 3) return <Medal className="h-6 w-6 text-amber-600" />;
  return <span className="text-lg font-bold text-muted-foreground">{rank}</span>;
}

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function LeaderboardPage() {
  const { t } = useTranslation();
  const { data, loading } = useApi<LeaderboardResponse>("/api/employee/leaderboard");

  if (loading) {
    return (
      <div>
        <Header title={t("leaderboard.title")} />
        <div className="space-y-6 p-6">
          <Card><CardContent className="p-6"><Skeleton className="h-20 w-full" /></CardContent></Card>
          <Card><CardContent className="p-6"><Skeleton className="h-[400px] w-full" /></CardContent></Card>
        </div>
      </div>
    );
  }

  const leaderboard = data?.leaderboard || [];
  const currentUser = data?.currentUser;

  return (
    <div>
      <Header title={t("leaderboard.title")} />
      <div className="space-y-6 p-6">
        {/* Current user position */}
        {currentUser && (
          <FadeIn>
            <Card className="border-cyber-green/30 bg-cyber-green/5">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyber-green/80 to-cyber-green">
                  <Trophy className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{t("leaderboard.yourPosition")}</p>
                  <p className="text-2xl font-bold">
                    {currentUser.rank}<sup className="text-sm">e</sup> / {leaderboard.length}
                  </p>
                </div>
                <div className="hidden gap-6 sm:flex">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-rht-violet-light">{currentUser.points}</p>
                    <p className="text-xs text-muted-foreground">{t("leaderboard.points")}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-cyber-green">{currentUser.badgesCount}</p>
                    <p className="text-xs text-muted-foreground">Badges</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        )}

        {/* Podium top 3 */}
        {leaderboard.length >= 3 && (
          <FadeIn delay={0.1}>
            <div className="grid grid-cols-3 gap-3">
              {[leaderboard[1], leaderboard[0], leaderboard[2]].map((user, i) => {
                const order = [2, 1, 3][i];
                const heights = ["h-28", "h-36", "h-24"];
                const gradients = [
                  "from-gray-300 to-gray-400",
                  "from-yellow-400 to-yellow-500",
                  "from-amber-500 to-amber-600",
                ];
                return (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15 }}
                    className="flex flex-col items-center"
                  >
                    <Avatar className="mb-2 h-12 w-12 border-2 border-background shadow-md">
                      <AvatarFallback className={`bg-gradient-to-br ${gradients[i]} text-sm font-bold text-white`}>
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-xs font-semibold text-center truncate w-full">{user.name.split(" ")[0]}</p>
                    <p className="text-[10px] text-muted-foreground">{user.points} pts</p>
                    <div className={`mt-2 w-full ${heights[i]} rounded-t-xl bg-gradient-to-t ${gradients[i]} flex items-end justify-center pb-2`}>
                      <span className="text-xl font-bold text-white">{order}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </FadeIn>
        )}

        {/* Full ranking table */}
        <FadeIn delay={0.2}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Shield className="h-4 w-4 text-rht-violet-light" />
                {t("leaderboard.fullRanking")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {leaderboard.map((user, i) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={`flex items-center gap-4 px-6 py-3 transition-colors hover:bg-accent ${
                      user.isCurrentUser ? "bg-cyber-green/5 border-l-2 border-l-cyber-green" : ""
                    }`}
                  >
                    <div className="flex h-8 w-8 items-center justify-center">
                      <RankDisplay rank={user.rank} />
                    </div>
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-gradient-to-br from-rht-violet/60 to-rht-violet-light text-[11px] text-white">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">
                          {user.name}
                          {user.isCurrentUser && (
                            <span className="ml-2 text-[10px] text-cyber-green">({t("leaderboard.you")})</span>
                          )}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">{user.department}</p>
                    </div>
                    <div className="hidden items-center gap-1 sm:flex">
                      {user.badgesCount > 0 && (
                        <Badge variant="outline" className="gap-1 text-[10px]">
                          <Flame className="h-3 w-3 text-rht-orange" />
                          {user.badgesCount}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-12 text-right text-sm font-semibold">{user.points}</span>
                      <span className="text-[10px] text-muted-foreground">pts</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        {/* How points work */}
        <FadeIn delay={0.3}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">{t("leaderboard.howToEarn")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { action: t("leaderboard.detectPhishing"), points: "+75", color: "text-cyber-green" },
                  { action: t("leaderboard.completeTraining"), points: "+100", color: "text-rht-violet-light" },
                  { action: t("leaderboard.earnBadge"), points: "+50", color: "text-yellow-500" },
                  { action: "Score de risque bas", points: "+3/pt", color: "text-rht-orange" },
                ].map((item) => (
                  <div key={item.action} className="flex items-center gap-3 rounded-xl border p-3">
                    <span className={`text-lg font-bold ${item.color}`}>{item.points}</span>
                    <span className="text-sm text-muted-foreground">{item.action}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </div>
  );
}
