"use client";

import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Smartphone,
  FileWarning,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import { FadeIn } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useApi } from "@/hooks/use-api";

interface ShadowItApp {
  id: string;
  appName: string;
  category: string;
  usersCount: number;
  departments: string[];
  riskLevel: string;
  isApproved: boolean;
  dataExposure: string | null;
}

interface ShadowItResponse {
  apps: ShadowItApp[];
  stats: {
    shadowScore: number;
    totalApps: number;
    unapprovedCount: number;
    highRiskCount: number;
    totalEmployees: number;
  };
  deptExposure: { dept: string; score: number }[];
}

const riskLevelStyle: Record<string, string> = {
  CRITICAL: "bg-cyber-red/10 text-cyber-red",
  HIGH: "bg-cyber-red/10 text-cyber-red",
  MEDIUM: "bg-rht-orange/10 text-rht-orange",
  LOW: "bg-cyber-green/10 text-cyber-green",
};

const riskLabelsFr: Record<string, string> = {
  CRITICAL: "Critique",
  HIGH: "Élevé",
  MEDIUM: "Moyen",
  LOW: "Faible",
};

const riskLabelsEn: Record<string, string> = {
  CRITICAL: "Critical",
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
};

export default function ShadowITPage() {
  const { t, locale } = useTranslation();
  const riskLabels = locale === "en" ? riskLabelsEn : riskLabelsFr;
  const { data, loading } = useApi<ShadowItResponse>("/api/shadow-it");

  if (loading) {
    return (
      <div>
        <Header title={t("shadowIt.title")} />
        <div className="space-y-6 p-6">
          <Card><CardContent className="p-5"><Skeleton className="h-20 w-full" /></CardContent></Card>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}><CardContent className="p-4"><Skeleton className="h-16 w-full" /></CardContent></Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const apps = data?.apps || [];
  const stats = data?.stats || { shadowScore: 100, totalApps: 0, unapprovedCount: 0, highRiskCount: 0, totalEmployees: 0 };
  const deptExposure = data?.deptExposure || [];
  const unapprovedApps = apps.filter((a) => !a.isApproved);

  return (
    <div>
      <Header title={t("shadowIt.title")} />
      <div className="space-y-6 p-6">
        {/* Alerte principale */}
        {stats.highRiskCount > 0 && (
          <FadeIn>
            <Card className="border-cyber-red/30 bg-cyber-red/5">
              <CardContent className="flex items-start gap-4 p-5">
                <ShieldAlert className="mt-0.5 h-6 w-6 shrink-0 text-cyber-red" />
                <div>
                  <h3 className="font-semibold text-cyber-red">{t("shadowIt.alertTitle")}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {stats.highRiskCount} {t("shadowIt.highRiskAppsDetected")}
                  </p>
                  <Button variant="outline" size="sm" className="mt-3 gap-2 border-cyber-red/30 text-cyber-red hover:bg-cyber-red/10">
                    {t("shadowIt.launchTraining")}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        )}

        {/* Stats */}
        <FadeIn delay={0.05}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">{t("shadowIt.score")}</p>
                <p className={`mt-1 text-2xl font-bold ${stats.shadowScore < 50 ? "text-cyber-red" : stats.shadowScore < 70 ? "text-rht-orange" : "text-cyber-green"}`}>
                  {stats.shadowScore}/100
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">{t("shadowIt.unauthorizedApps")}</p>
                <p className="mt-1 text-2xl font-bold text-rht-orange">{stats.unapprovedCount}</p>
                <p className="text-[11px] text-muted-foreground">{t("common.detected")}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">{t("shadowIt.totalApps")}</p>
                <p className="mt-1 text-2xl font-bold">{stats.totalApps}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">{t("shadowIt.highRiskApps")}</p>
                <p className="mt-1 text-2xl font-bold text-cyber-red">{stats.highRiskCount}</p>
              </CardContent>
            </Card>
          </div>
        </FadeIn>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Apps a risque */}
          <FadeIn delay={0.1}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Smartphone className="h-4 w-4 text-rht-orange" />
                  {t("shadowIt.riskApps")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {unapprovedApps.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">{t("shadowIt.noApps")}</p>
                ) : (
                  unapprovedApps.map((app) => {
                    const usagePercent = stats.totalEmployees > 0 ? Math.round((app.usersCount / stats.totalEmployees) * 100) : 0;
                    return (
                      <div key={app.id} className="rounded-lg border p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">{app.appName}</span>
                            <Badge className={`text-[10px] ${riskLevelStyle[app.riskLevel] || riskLevelStyle.MEDIUM}`}>
                              {riskLabels[app.riskLevel] || app.riskLevel}
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">{usagePercent}% {t("passwords.ofEmployees")}</span>
                        </div>
                        <Progress value={usagePercent} className="mt-2 h-1.5" />
                        {app.dataExposure && (
                          <p className="mt-2 text-[11px] text-muted-foreground">
                            <FileWarning className="mr-1 inline h-3 w-3" />
                            {t("shadowIt.dataShared")} : {app.dataExposure}
                          </p>
                        )}
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </FadeIn>

          {/* Exposition par departement */}
          <FadeIn delay={0.15}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("shadowIt.deptExposure")}</CardTitle>
              </CardHeader>
              <CardContent>
                {deptExposure.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">{t("shadowIt.noData")}</p>
                ) : (
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={deptExposure} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                        <YAxis dataKey="dept" type="category" tick={{ fontSize: 11 }} width={80} />
                        <Tooltip />
                        <Bar dataKey="score" fill="#ef4444" radius={[0, 6, 6, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
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
