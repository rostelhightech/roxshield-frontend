"use client";

import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Award,
  Shield,
  Target,
  Flame,
  BookOpen,
  Eye,
  Zap,
  Lock,
  Trophy,
  Crown,
} from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion";
import { Confetti } from "@/components/confetti";
import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "@/lib/i18n";
import { useApi } from "@/hooks/use-api";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Award, Shield, Target, Flame, BookOpen, Eye, Zap, Lock, Trophy, Crown,
};

interface BadgeItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  earned: boolean;
  earnedAt: string | null;
}

interface BadgesResponse {
  badges: BadgeItem[];
  stats: { total: number; earned: number; completion: number };
}

export default function BadgesPage() {
  const { t, locale } = useTranslation();
  const { data, loading } = useApi<BadgesResponse>("/api/employee/badges");
  const [showConfetti, setShowConfetti] = useState(false);

  if (loading) {
    return (
      <div>
        <Header title={t("badges.title")} />
        <div className="space-y-6 p-6">
          <Card><CardContent className="p-6"><Skeleton className="h-20 w-full" /></CardContent></Card>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}><CardContent className="p-6"><Skeleton className="h-32 w-full" /></CardContent></Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const badges = data?.badges || [];
  const stats = data?.stats || { total: 0, earned: 0, completion: 0 };
  const earned = badges.filter((b) => b.earned);
  const locked = badges.filter((b) => !b.earned);

  return (
    <div>
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />
      <Header title={t("badges.title")} />
      <div className="space-y-6 p-6">
        <FadeIn>
          <Card>
            <CardContent className="flex items-center gap-6 p-6">
              <motion.div
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rht-orange to-rht-orange-light"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Award className="h-8 w-8 text-white" />
              </motion.div>
              <div className="flex-1">
                <h2 className="text-lg font-bold">
                  {stats.earned} / {stats.total} {t("badges.earned")}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t("badges.continueTraining")}
                </p>
                <Progress value={stats.completion} className="mt-3 h-2" />
              </div>
              <div className="hidden text-right sm:block">
                <p className="text-3xl font-bold text-rht-orange">{stats.completion}%</p>
                <p className="text-xs text-muted-foreground">{t("badges.completion")}</p>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        {earned.length > 0 && (
          <>
            <FadeIn delay={0.1}>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                {t("badges.unlocked")}
              </h3>
            </FadeIn>
            <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {earned.map((badge) => {
                const Icon = iconMap[badge.icon] || Award;
                return (
                  <StaggerItem key={badge.id}>
                    <motion.div
                      whileHover={{ y: -4, scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => setShowConfetti(true)}
                      className="cursor-pointer"
                    >
                      <Card className="h-full border-rht-violet/20 transition-all hover:shadow-md">
                        <CardContent className="flex flex-col items-center p-6 text-center">
                          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${badge.color} shadow-lg`}>
                            <Icon className="h-7 w-7 text-white" />
                          </div>
                          <h4 className="mt-3 font-semibold text-sm">{badge.name}</h4>
                          <p className="mt-1 text-xs text-muted-foreground">{badge.description}</p>
                          {badge.earnedAt && (
                            <Badge className="mt-3 border-0 bg-cyber-green/10 text-cyber-green text-[10px]">
                              {t("badges.earnedOn")} {new Date(badge.earnedAt).toLocaleDateString(locale === "en" ? "en-US" : "fr-FR", { day: "numeric", month: "short" })}
                            </Badge>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </>
        )}

        {locked.length > 0 && (
          <>
            <FadeIn delay={0.2}>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                {t("badges.inProgress")}
              </h3>
            </FadeIn>
            <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {locked.map((badge) => {
                const Icon = iconMap[badge.icon] || Award;
                return (
                  <StaggerItem key={badge.id}>
                    <Card className="h-full opacity-75 transition-all hover:opacity-100">
                      <CardContent className="flex flex-col items-center p-6 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                          <Icon className="h-7 w-7 text-muted-foreground" />
                        </div>
                        <h4 className="mt-3 font-semibold text-sm">{badge.name}</h4>
                        <p className="mt-1 text-xs text-muted-foreground">{badge.description}</p>
                        <Badge className="mt-3 border-0 bg-muted text-muted-foreground text-[10px]">
                          🔒 {t("badges.locked")}
                        </Badge>
                      </CardContent>
                    </Card>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </>
        )}
      </div>
    </div>
  );
}
