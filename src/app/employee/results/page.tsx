"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Shield,
  Target,
  TrendingDown,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BarChart3,
  Flag,
} from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem, GlowCard } from "@/components/motion";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useTranslation } from "@/lib/i18n";
import { useApi } from "@/hooks/use-api";

interface ResultsResponse {
  stats: {
    riskScore: number;
    trainingsCompleted: number;
    trainingsTotal: number;
    avgQuizScore: number;
    phishingReported: number;
    phishingClicked: number;
    phishingTotal: number;
  };
  trainings: {
    id: string;
    moduleTitle: string;
    category: string;
    difficulty: string;
    duration: number;
    badgeName: string | null;
    status: string;
    progressPercent: number;
    quizScore: number | null;
    completedAt: string | null;
  }[];
  phishing: {
    id: string;
    campaignId: string;
    campaignName: string;
    templateType: string;
    action: string;
    clickedAt: string | null;
    reportedAt: string | null;
    createdAt: string;
  }[];
  recentActivity: {
    id: string;
    action: string;
    description: string | null;
    createdAt: string;
  }[];
}

const actionStyleBase = {
  REPORTED: { style: "bg-cyber-green/10 text-cyber-green", icon: CheckCircle },
  CLICKED: { style: "bg-cyber-red/10 text-cyber-red", icon: XCircle },
  SENT: { style: "bg-muted text-muted-foreground", icon: AlertTriangle },
  OPENED: { style: "bg-rht-orange/10 text-rht-orange", icon: AlertTriangle },
  IGNORED: { style: "bg-rht-orange/10 text-rht-orange", icon: AlertTriangle },
} as const;

const actionLabels: Record<string, Record<string, string>> = {
  fr: { REPORTED: "Signalé", CLICKED: "Cliqué", SENT: "Envoyé", OPENED: "Ouvert", IGNORED: "Ignoré" },
  en: { REPORTED: "Reported", CLICKED: "Clicked", SENT: "Sent", OPENED: "Opened", IGNORED: "Ignored" },
};

export default function EmployeeResultsPage() {
  const { t, locale } = useTranslation();
  const dateLocale = locale === "en" ? "en-US" : "fr-FR";
  const { data, loading, refetch } = useApi<ResultsResponse>("/api/employee/results");
  const [reporting, setReporting] = useState<string | null>(null);

  const handleReport = async (campaignId: string) => {
    setReporting(campaignId);
    try {
      const res = await fetch(`/api/campaigns/${campaignId}/report`, { method: "POST" });
      if (res.ok) {
        toast.success(t("results.emailReported"));
        await refetch();
      } else {
        const body = await res.json().catch(() => ({}));
        toast.error(body.error || t("common.error"));
      }
    } catch {
      toast.error(t("profile.networkError"));
    } finally {
      setReporting(null);
    }
  };

  if (loading) {
    return (
      <div>
        <Header title={t("nav.results")} />
        <div className="space-y-6 p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}><CardContent className="p-5"><Skeleton className="h-16 w-full" /></CardContent></Card>
            ))}
          </div>
          <Card><CardContent className="p-6"><Skeleton className="h-[300px] w-full" /></CardContent></Card>
        </div>
      </div>
    );
  }

  const stats = data?.stats || { riskScore: 50, trainingsCompleted: 0, trainingsTotal: 0, avgQuizScore: 0, phishingReported: 0, phishingClicked: 0, phishingTotal: 0 };
  const trainings = data?.trainings || [];
  const phishing = data?.phishing || [];
  const completedTrainings = trainings.filter((t) => t.status === "COMPLETED");
  const phishingDetectRate = stats.phishingTotal > 0 ? Math.round((stats.phishingReported / stats.phishingTotal) * 100) : 0;

  return (
    <div>
      <Header title={t("nav.results")} />
      <div className="space-y-6 p-6">
        <StaggerContainer className="grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: Shield,
              label: t("results.currentRiskScore"),
              value: `${stats.riskScore}%`,
              sub: stats.riskScore <= 30 ? t("results.safeZone") : stats.riskScore <= 60 ? t("results.moderate") : t("results.atRisk"),
              bg: "bg-rht-orange/10",
              text: stats.riskScore <= 30 ? "text-cyber-green" : stats.riskScore <= 60 ? "text-rht-orange" : "text-cyber-red",
            },
            {
              icon: Target,
              label: t("results.simulationsDetected"),
              value: `${stats.phishingReported}/${stats.phishingTotal}`,
              sub: `${phishingDetectRate}% ${t("results.successRate")}`,
              bg: "bg-cyber-green/10",
              text: "text-cyber-green",
            },
            {
              icon: BarChart3,
              label: t("results.avgQuizScore"),
              value: `${stats.avgQuizScore}%`,
              sub: `${t("results.over")} ${stats.trainingsCompleted} module${stats.trainingsCompleted > 1 ? "s" : ""}`,
              bg: "bg-rht-violet-light/10",
              text: "text-rht-violet-light",
            },
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
                        <p className="text-2xl font-bold">{s.value}</p>
                        <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <TrendingDown className="h-3 w-3 text-cyber-green" />
                          {s.sub}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </GlowCard>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <div className="grid gap-6 lg:grid-cols-2">
          <FadeIn delay={0.1}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">{t("results.simulationHistory")}</CardTitle>
              </CardHeader>
              <CardContent>
                {phishing.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">{t("results.noSimulations")}</p>
                ) : (
                  <div className="space-y-3">
                    {phishing.map((sim, i) => {
                      const res = actionStyleBase[sim.action as keyof typeof actionStyleBase] || actionStyleBase.SENT;
                      const actionLabel = (actionLabels[locale] || actionLabels.fr)[sim.action] || sim.action;
                      const ResIcon = res.icon;
                      return (
                        <motion.div
                          key={sim.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.08 }}
                          className="rounded-xl border p-4 transition-colors hover:bg-accent"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
                              <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${res.style}`}>
                                <ResIcon className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">{sim.campaignName}</p>
                                <p className="text-xs text-muted-foreground">
                                  {sim.templateType} — {new Date(sim.createdAt).toLocaleDateString(dateLocale)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {(sim.action === "SENT" || sim.action === "OPENED") && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 border-cyber-green/30 text-cyber-green text-[10px] hover:bg-cyber-green/10"
                                  disabled={reporting === sim.campaignId}
                                  onClick={() => handleReport(sim.campaignId)}
                                >
                                  <Flag className="mr-1 h-3 w-3" />
                                  {reporting === sim.campaignId ? "..." : t("results.report")}
                                </Button>
                              )}
                              <Badge className={`shrink-0 border-0 text-[10px] ${res.style}`}>{actionLabel}</Badge>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn delay={0.15}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">{t("results.quizScores")}</CardTitle>
              </CardHeader>
              <CardContent>
                {completedTrainings.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">{t("results.noQuiz")}</p>
                ) : (
                  <div className="space-y-3">
                    {completedTrainings.map((quiz, i) => (
                      <motion.div
                        key={quiz.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="rounded-xl border p-3"
                      >
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{quiz.moduleTitle}</span>
                          <span className={`font-bold ${
                            (quiz.quizScore || 0) >= 80 ? "text-cyber-green" : (quiz.quizScore || 0) >= 60 ? "text-rht-orange" : "text-cyber-red"
                          }`}>{quiz.quizScore || 0}%</span>
                        </div>
                        <Progress value={quiz.quizScore || 0} className="mt-2 h-2" />
                        {quiz.completedAt && (
                          <p className="mt-1 text-[10px] text-muted-foreground">
                            {new Date(quiz.completedAt).toLocaleDateString(dateLocale)}
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
