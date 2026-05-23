"use client";

import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, BookOpen, ArrowRight } from "lucide-react";
import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem, GlowCard } from "@/components/motion";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { useApi } from "@/hooks/use-api";

interface TrainingModule {
  id: string;
  title: string;
  description: string | null;
  category: string;
  difficulty: string;
  durationMinutes: number;
  badgeIcon: string | null;
  badgeName: string | null;
  progress: {
    status: string;
    progressPercent: number;
    quizScore: number | null;
  };
}

interface TrainingResponse {
  modules: TrainingModule[];
  stats: {
    total: number;
    completed: number;
    inProgress: number;
  };
}

function difficultyLabel(d: string, t: (key: any) => string): string {
  switch (d) {
    case "beginner": return t("status.beginner" as any);
    case "intermediate": return t("status.intermediate" as any);
    case "advanced": return t("status.advanced" as any);
    default: return d;
  }
}

function difficultyColor(d: string) {
  switch (d) {
    case "beginner": return "border-0 bg-cyber-green/10 text-cyber-green";
    case "intermediate": return "border-0 bg-rht-orange/10 text-rht-orange";
    case "advanced": return "border-0 bg-cyber-red/10 text-cyber-red";
    default: return "";
  }
}

const categoryIcons: Record<string, string> = {
  phishing: "🎣",
  passwords: "🔑",
  social_engineering: "🎭",
  data_protection: "🛡️",
  email_security: "📧",
  encryption: "🔒",
};

export default function TrainingPage() {
  const { t } = useTranslation();
  const { data, loading } = useApi<TrainingResponse>("/api/training");

  if (loading) {
    return (
      <div>
        <Header title={t("training.title")} />
        <div className="space-y-6 p-6">
          <div className="grid gap-3 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}><CardContent className="p-4"><Skeleton className="h-12 w-full" /></CardContent></Card>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}><CardContent className="p-5"><Skeleton className="h-48 w-full" /></CardContent></Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const modules = data?.modules || [];
  const stats = data?.stats || { total: 0, completed: 0, inProgress: 0 };
  const avgCompletion = modules.length > 0
    ? Math.round(modules.reduce((a, m) => a + m.progress.progressPercent, 0) / modules.length)
    : 0;

  return (
    <div>
      <Header title={t("training.title")} />
      <div className="space-y-6 p-6">
        <StaggerContainer className="grid gap-3 sm:grid-cols-3">
          {[
            { value: stats.total, label: t("training.availableModules" as any) },
            { value: avgCompletion + "%", label: t("training.avgCompletion" as any), highlight: true },
            { value: stats.completed, label: t("training.completed" as any) },
          ].map((s) => (
            <StaggerItem key={s.label}>
              <Card>
                <CardContent className="p-4">
                  <p className={`text-2xl font-bold ${s.highlight ? "text-rht-violet-light" : ""}`}>{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {modules.length === 0 ? (
          <FadeIn>
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="mx-auto mb-3 h-8 w-8 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">{t("training.noModules" as any)}</p>
              </CardContent>
            </Card>
          </FadeIn>
        ) : (
          <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((module) => (
              <StaggerItem key={module.id}>
                <GlowCard className="h-full">
                  <Card className="group h-full transition-all duration-300 hover:border-rht-violet/20">
                    <CardContent className="p-5">
                      <div className="mb-4 flex items-start justify-between">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className="flex h-12 w-12 items-center justify-center rounded-xl bg-rht-violet/10 text-2xl"
                        >
                          {module.badgeIcon || categoryIcons[module.category] || "📚"}
                        </motion.div>
                        <Badge className={difficultyColor(module.difficulty)}>
                          {difficultyLabel(module.difficulty, t)}
                        </Badge>
                      </div>
                      <h3 className="mb-1 text-base font-semibold">{module.title}</h3>
                      <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
                        {module.description || ""}
                      </p>
                      <div className="mb-4 flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {module.durationMinutes} min
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3.5 w-3.5" />
                          {module.category}
                        </span>
                      </div>
                      <div className="mb-4 space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">{t("common.completion" as any)}</span>
                          <span className="font-medium">{module.progress.progressPercent}%</span>
                        </div>
                        <Progress value={module.progress.progressPercent} className="h-2" />
                      </div>
                      <Link href={`/dashboard/training/${module.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-rht-violet group-hover:to-rht-violet-light group-hover:border-transparent group-hover:text-white"
                        >
                          {module.progress.status === "COMPLETED"
                            ? t("training.review" as any)
                            : module.progress.status === "IN_PROGRESS"
                            ? t("training.continue" as any)
                            : t("training.start")}
                          <ArrowRight className="ml-2 h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </GlowCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>
    </div>
  );
}
