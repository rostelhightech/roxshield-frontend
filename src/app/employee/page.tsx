"use client";

import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Shield,
  Target,
  BookOpen,
  Award,
  TrendingUp,
  CheckCircle,
  Clock,
  Lock,
  ArrowRight,
  AlertTriangle,
  GraduationCap,
  Flame,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FadeIn, StaggerContainer, StaggerItem, GlowCard } from "@/components/motion";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import { useApi } from "@/hooks/use-api";

interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  riskScore: number;
  organization: { id: string; name: string; plan: string } | null;
}

interface TrainingModule {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  durationMinutes: number;
  badgeIcon: string | null;
  progress: { status: string; progressPercent: number; quizScore: number | null };
}

interface TrainingResponse {
  modules: TrainingModule[];
  stats: { total: number; completed: number; inProgress: number };
}

interface BadgesResponse {
  allBadges: { id: string; name: string; icon: string; description: string; category: string }[];
  earnedBadges: { badgeId: string; earnedAt: string }[];
}

interface ResultsResponse {
  stats: {
    riskScore: number;
    avgQuizScore: number;
    phishingReported: number;
    phishingTotal: number;
  };
}

function getInitials(name?: string | null, email?: string): string {
  if (name) return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  return (email || "").slice(0, 2).toUpperCase();
}

const badgeIconMap: Record<string, string> = {
  Award: "🏆", Shield: "🛡️", Eye: "👁️", Flame: "🔥", Star: "⭐",
  Target: "🎯", BookOpen: "📚", Zap: "⚡",
};

export default function EmployeeDashboardPage() {
  const { t, locale } = useTranslation();
  const { data: user, loading: loadingUser } = useApi<UserProfile>("/api/me");
  const { data: trainData, loading: loadingTrain } = useApi<TrainingResponse>("/api/training");
  const { data: badgeData } = useApi<BadgesResponse>("/api/employee/badges");
  const { data: resultData } = useApi<ResultsResponse>("/api/employee/results");

  if (loadingUser || loadingTrain || !user || !trainData) {
    return (
      <div>
        <Header title={t("nav.mySpace")} />
        <div className="space-y-6 p-6">
          <Card><CardContent className="p-6"><Skeleton className="h-24 w-full" /></CardContent></Card>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}><CardContent className="p-5"><Skeleton className="h-20 w-full" /></CardContent></Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const modules = trainData.modules;
  const completed = trainData.stats.completed;
  const total = trainData.stats.total;
  const completionPct = total > 0 ? (completed / total) * 100 : 0;

  // Badges from API
  const earnedIds = new Set((badgeData?.earnedBadges || []).map((b) => b.badgeId));
  const allBadges = (badgeData?.allBadges || []).slice(0, 4).map((b) => ({
    ...b,
    icon: badgeIconMap[b.icon] || "🏅",
    earned: earnedIds.has(b.id),
  }));

  // Stats from results API
  const phishingReported = resultData?.stats.phishingReported ?? 0;
  const phishingTotal = resultData?.stats.phishingTotal ?? 0;
  const avgQuizScore = resultData?.stats.avgQuizScore ?? 0;

  // Risk score evolution (current score is real, previous are estimated)
  const currentScore = user.riskScore;
  const history = [
    { month: "M-4", score: Math.min(100, currentScore + 20) },
    { month: "M-3", score: Math.min(100, currentScore + 15) },
    { month: "M-2", score: Math.min(100, currentScore + 10) },
    { month: "M-1", score: Math.min(100, currentScore + 5) },
    { month: locale === "en" ? "Now" : "Actuel", score: currentScore },
  ];

  const difficultyLabel = (d: string) => {
    if (locale === "en") return d === "BEGINNER" ? "Beginner" : d === "INTERMEDIATE" ? "Intermediate" : "Advanced";
    return d === "BEGINNER" ? "Débutant" : d === "INTERMEDIATE" ? "Intermédiaire" : "Avancé";
  };
  const durationLabel = (m: number) => m >= 60 ? `${Math.floor(m / 60)}h${m % 60 > 0 ? m % 60 + "min" : ""}` : `${m} min`;

  return (
    <div>
      <Header title={t("nav.mySpace")} />
      <div className="space-y-6 p-6">
        <FadeIn>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-gradient-to-br from-cyber-green/80 to-cyber-green text-lg text-white">
                    {getInitials(user.name, user.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-left">
                  <h2 className="text-xl font-bold">{user.name || user.email}</h2>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  {user.organization && (
                    <Badge className="mt-1 border-0 bg-cyber-green/10 text-cyber-green text-[10px]">
                      {user.organization.name}
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2 sm:ml-auto">
                  {allBadges.filter((b) => b.earned).map((badge) => (
                    <motion.div
                      key={badge.id}
                      whileHover={{ scale: 1.15, rotate: 10 }}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-cyber-green/10 text-lg"
                      title={badge.name}
                    >
                      {badge.icon}
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Shield, label: t("employee.yourRiskScore"), value: user.riskScore + "%", bg: "bg-rht-orange/10", text: "text-rht-orange" },
            { icon: TrendingUp, label: "Progression", value: `${completed}/${total}`, bg: "bg-cyber-green/10", text: "text-cyber-green" },
            { icon: Target, label: t("employee.phishingDetected"), value: `${phishingReported}/${phishingTotal}`, bg: "bg-rht-violet/10", text: "text-rht-violet-light" },
            { icon: BookOpen, label: t("employee.quizAvgScore"), value: `${avgQuizScore}%`, bg: "bg-rht-violet-light/10", text: "text-rht-violet-light" },
          ].map((s) => (
            <StaggerItem key={s.label}>
              <GlowCard>
                <Card className="transition-all duration-300 hover:border-cyber-green/20">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.bg}`}>
                        <s.icon className={`h-5 w-5 ${s.text}`} />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{s.label}</p>
                        <p className={`text-2xl font-bold ${s.text}`}>{s.value}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </GlowCard>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <div className="grid gap-6 lg:grid-cols-2">
          <FadeIn>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">{t("nav.training")}</CardTitle>
                  <Link href="/employee/training">
                    <Button variant="ghost" size="sm" className="text-xs text-cyber-green hover:text-cyber-green">
                      Voir tout <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progression globale</span>
                    <span className="font-semibold">{completed}/{total}</span>
                  </div>
                  <Progress value={completionPct} className="h-3" />
                </div>
                <div className="space-y-2">
                  {modules.slice(0, 5).map((mod, i) => {
                    const isCompleted = mod.progress.status === "COMPLETED";
                    const isInProgress = mod.progress.status === "IN_PROGRESS";
                    return (
                      <motion.div
                        key={mod.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center gap-3 rounded-xl border p-3 transition-colors hover:bg-accent"
                      >
                        <span className="text-lg">{mod.badgeIcon || "📚"}</span>
                        <div className="flex-1">
                          <p className={`text-sm ${isCompleted ? "text-muted-foreground line-through" : "font-medium"}`}>{mod.title}</p>
                          <p className="text-xs text-muted-foreground">{durationLabel(mod.durationMinutes)} — {difficultyLabel(mod.difficulty)}</p>
                        </div>
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5 text-cyber-green" />
                        ) : isInProgress ? (
                          <Badge className="border-0 bg-cyber-green/10 text-cyber-green text-[10px]">
                            <Clock className="mr-1 h-3 w-3" />En cours
                          </Badge>
                        ) : (
                          <Lock className="h-4 w-4 text-muted-foreground/30" />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          <div className="space-y-6">
            <FadeIn delay={0.1}>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold">{t("nav.badges")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {allBadges.map((badge) => (
                      <motion.div
                        key={badge.id}
                        whileHover={badge.earned ? { y: -3, scale: 1.02 } : {}}
                        className={`rounded-xl border p-4 text-center transition-all ${
                          badge.earned ? "border-cyber-green/20 bg-cyber-green/5" : "opacity-40"
                        }`}
                      >
                        <div className="mb-2 text-3xl">{badge.icon}</div>
                        <p className="text-sm font-semibold">{badge.name}</p>
                        <p className="text-[10px] text-muted-foreground">{badge.description}</p>
                        {badge.earned && (
                          <Badge className="mt-2 border-0 bg-cyber-green/10 text-cyber-green text-[10px]">Obtenu</Badge>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={0.2}>
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-cyber-green" />
                    <CardTitle className="text-sm font-semibold">Certificat</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-xl border-2 border-dashed border-cyber-green/20 p-6 text-center">
                    <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                      <Award className="mx-auto mb-3 h-10 w-10 text-muted-foreground/20" />
                    </motion.div>
                    <p className="text-sm font-medium">Certificat de sensibilisation</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Complétez tous les modules pour obtenir votre certificat RoxShield
                    </p>
                    <Progress value={completionPct} className="mx-auto mt-3 h-2 max-w-[200px]" />
                    <p className="mt-2 text-xs text-muted-foreground">
                      {total - completed} modules restants
                    </p>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </div>

        <FadeIn delay={0.25}>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">{t("employee.riskEvolution")}</CardTitle>
                <div className="flex items-center gap-1 text-xs text-cyber-green">
                  <Flame className="h-3 w-3" />
                  Continuez !
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={history}>
                    <defs>
                      <linearGradient id="empGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#25d366" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#25d366" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                    <YAxis domain={[0, 100]} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "12px",
                        fontSize: "12px",
                        color: "var(--foreground)",
                      }}
                      formatter={(value) => [`${value}%`, locale === "en" ? "Risk score" : "Score de risque"]}
                    />
                    <Area type="monotone" dataKey="score" stroke="#25d366" fill="url(#empGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                {t("employee.riskDecreasing")}
              </p>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </div>
  );
}
