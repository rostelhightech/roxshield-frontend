"use client";

import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem, GlowCard } from "@/components/motion";
import { motion } from "framer-motion";
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

const actionStyle = {
  REPORTED: { label: "Signalé", style: "bg-cyber-green/10 text-cyber-green", icon: CheckCircle },
  CLICKED: { label: "Cliqué", style: "bg-cyber-red/10 text-cyber-red", icon: XCircle },
  SENT: { label: "Envoyé", style: "bg-muted text-muted-foreground", icon: AlertTriangle },
  OPENED: { label: "Ouvert", style: "bg-rht-orange/10 text-rht-orange", icon: AlertTriangle },
  IGNORED: { label: "Ignoré", style: "bg-rht-orange/10 text-rht-orange", icon: AlertTriangle },
} as const;

export default function EmployeeResultsPage() {
  const { t } = useTranslation();
  const { data, loading } = useApi<ResultsResponse>("/api/employee/results");

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
              label: "Score de risque actuel",
              value: `${stats.riskScore}%`,
              sub: stats.riskScore <= 30 ? "Zone sûre" : stats.riskScore <= 60 ? "Modéré" : "À risque",
              bg: "bg-rht-orange/10",
              text: stats.riskScore <= 30 ? "text-cyber-green" : stats.riskScore <= 60 ? "text-rht-orange" : "text-cyber-red",
            },
            {
              icon: Target,
              label: "Simulations détectées",
              value: `${stats.phishingReported}/${stats.phishingTotal}`,
              sub: `${phishingDetectRate}% de réussite`,
              bg: "bg-cyber-green/10",
              text: "text-cyber-green",
            },
            {
              icon: BarChart3,
              label: "Score quiz moyen",
              value: `${stats.avgQuizScore}%`,
              sub: `Sur ${stats.trainingsCompleted} module${stats.trainingsCompleted > 1 ? "s" : ""}`,
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
                <CardTitle className="text-sm font-semibold">Historique des simulations</CardTitle>
              </CardHeader>
              <CardContent>
                {phishing.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">Aucune simulation reçue</p>
                ) : (
                  <div className="space-y-3">
                    {phishing.map((sim, i) => {
                      const res = actionStyle[sim.action as keyof typeof actionStyle] || actionStyle.SENT;
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
                                  {sim.templateType} — {new Date(sim.createdAt).toLocaleDateString("fr-FR")}
                                </p>
                              </div>
                            </div>
                            <Badge className={`shrink-0 border-0 text-[10px] ${res.style}`}>{res.label}</Badge>
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
                <CardTitle className="text-sm font-semibold">Scores des quiz</CardTitle>
              </CardHeader>
              <CardContent>
                {completedTrainings.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">Aucun quiz complété</p>
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
                            {new Date(quiz.completedAt).toLocaleDateString("fr-FR")}
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
