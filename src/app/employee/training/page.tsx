"use client";

import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckCircle,
  Clock,
  Lock,
  PlayCircle,
  GraduationCap,
} from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import Link from "next/link";
import { useApi } from "@/hooks/use-api";

interface TrainingModule {
  id: string;
  title: string;
  description: string | null;
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

const difficultyStyle: Record<string, string> = {
  BEGINNER: "bg-cyber-green/10 text-cyber-green",
  INTERMEDIATE: "bg-rht-orange/10 text-rht-orange",
  ADVANCED: "bg-cyber-red/10 text-cyber-red",
};

const difficultyLabel: Record<string, string> = {
  BEGINNER: "Débutant",
  INTERMEDIATE: "Intermédiaire",
  ADVANCED: "Avancé",
};

export default function EmployeeTrainingPage() {
  const { t } = useTranslation();
  const { data, loading } = useApi<TrainingResponse>("/api/training");

  if (loading || !data) {
    return (
      <div>
        <Header title={t("training.title")} />
        <div className="space-y-6 p-6">
          <Card><CardContent className="p-5"><Skeleton className="h-20 w-full" /></CardContent></Card>
          {[1, 2, 3].map((i) => (
            <Card key={i}><CardContent className="p-5"><Skeleton className="h-28 w-full" /></CardContent></Card>
          ))}
        </div>
      </div>
    );
  }

  const modules = data.modules;
  const completed = data.stats.completed;
  const total = data.stats.total;
  const completionPct = total > 0 ? (completed / total) * 100 : 0;

  const durationLabel = (m: number) =>
    m >= 60 ? `${Math.floor(m / 60)}h${m % 60 > 0 ? m % 60 + "min" : ""}` : `${m} min`;

  return (
    <div>
      <Header title={t("training.title")} />
      <div className="space-y-6 p-6">
        <FadeIn>
          <Card>
            <CardContent className="p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyber-green/10">
                    <GraduationCap className="h-6 w-6 text-cyber-green" />
                  </div>
                  <div>
                    <p className="text-lg font-bold">{completed}/{total} modules complétés</p>
                    <p className="text-sm text-muted-foreground">Continuez pour obtenir votre certificat !</p>
                  </div>
                </div>
                <div className="w-full sm:w-48">
                  <Progress value={completionPct} className="h-3" />
                  <p className="mt-1 text-right text-xs text-muted-foreground">{Math.round(completionPct)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        <StaggerContainer className="space-y-3">
          {modules.map((mod) => {
            const isCompleted = mod.progress.status === "COMPLETED";
            const isInProgress = mod.progress.status === "IN_PROGRESS";
            const isLocked = mod.progress.status === "NOT_STARTED" && !isInProgress;

            return (
              <StaggerItem key={mod.id}>
                <motion.div whileHover={!isLocked ? { scale: 1.005 } : {}}>
                  <Card className={`transition-all duration-300 ${
                    isInProgress ? "border-cyber-green/30 shadow-[0_0_15px_rgba(37,211,102,0.08)]" : ""
                  } ${isLocked ? "opacity-60" : "hover:border-cyber-green/20"}`}>
                    <CardContent className="p-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${
                            isCompleted ? "bg-cyber-green/10" : isInProgress ? "bg-cyber-green/10" : "bg-muted"
                          }`}>
                            {mod.badgeIcon || "📚"}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className={`font-semibold ${isCompleted ? "text-muted-foreground line-through" : ""}`}>
                                {mod.title}
                              </h3>
                              <Badge className={`border-0 text-[10px] ${difficultyStyle[mod.difficulty] || ""}`}>
                                {difficultyLabel[mod.difficulty] || mod.difficulty}
                              </Badge>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">{mod.description}</p>
                            <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                              <span>{durationLabel(mod.durationMinutes)}</span>
                              <span>·</span>
                              <span>{mod.category}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 sm:shrink-0">
                          {isCompleted ? (
                            <Link href={`/dashboard/training/${mod.id}`}>
                              <div className="flex items-center gap-2 text-cyber-green">
                                <CheckCircle className="h-5 w-5" />
                                <span className="text-sm font-medium">Revoir</span>
                              </div>
                            </Link>
                          ) : isInProgress ? (
                            <Link href={`/dashboard/training/${mod.id}`}>
                              <Button className="bg-gradient-to-r from-cyber-green/90 to-cyber-green text-white hover:opacity-90">
                                <PlayCircle className="mr-2 h-4 w-4" />
                                {t("training.continue")}
                              </Button>
                            </Link>
                          ) : (
                            <Link href={`/dashboard/training/${mod.id}`}>
                              <div className="flex items-center gap-2 text-muted-foreground/40">
                                <PlayCircle className="h-4 w-4" />
                                <span className="text-sm">Commencer</span>
                              </div>
                            </Link>
                          )}
                        </div>
                      </div>

                      {isInProgress && (
                        <div className="mt-4">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Progression du module</span>
                            <span>{mod.progress.progressPercent}%</span>
                          </div>
                          <Progress value={mod.progress.progressPercent} className="mt-1 h-2" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </div>
  );
}
