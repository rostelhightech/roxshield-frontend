"use client";

import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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

const shadowScore = 35;

const riskLevelStyle = {
  high: "bg-cyber-red/10 text-cyber-red",
  medium: "bg-rht-orange/10 text-rht-orange",
  low: "bg-cyber-green/10 text-cyber-green",
};

export default function ShadowITPage() {
  const { t } = useTranslation();

  const riskApps = [
    { name: "WhatsApp", usage: 89, risk: t("status.high" as any), riskLevel: "high" as const, dataShared: t("shadowIt.app.whatsapp.data" as any) },
    { name: "Telegram", usage: 34, risk: t("status.high" as any), riskLevel: "high" as const, dataShared: t("shadowIt.app.telegram.data" as any) },
    { name: "Google Drive perso", usage: 45, risk: t("status.medium" as any), riskLevel: "medium" as const, dataShared: t("shadowIt.app.gdrive.data" as any) },
    { name: "Gmail perso", usage: 52, risk: t("status.high" as any), riskLevel: "high" as const, dataShared: t("shadowIt.app.gmail.data" as any) },
    { name: "WeTransfer", usage: 28, risk: t("status.medium" as any), riskLevel: "medium" as const, dataShared: t("shadowIt.app.wetransfer.data" as any) },
    { name: "Dropbox perso", usage: 18, risk: t("status.low" as any), riskLevel: "low" as const, dataShared: t("shadowIt.app.dropbox.data" as any) },
  ];

  const deptExposure = [
    { dept: t("shadowIt.dept.commercial" as any), score: 78 },
    { dept: t("shadowIt.dept.finance" as any), score: 65 },
    { dept: t("shadowIt.dept.direction" as any), score: 58 },
    { dept: t("shadowIt.dept.rh" as any), score: 52 },
    { dept: t("shadowIt.dept.operations" as any), score: 45 },
    { dept: t("shadowIt.dept.it" as any), score: 15 },
  ];

  const incidents = [
    { date: "16 Mai", desc: t("shadowIt.incident1" as any), dept: t("shadowIt.dept.commercial" as any), severityKey: "critical" },
    { date: "15 Mai", desc: t("shadowIt.incident2" as any), dept: t("shadowIt.dept.finance" as any), severityKey: "critical" },
    { date: "14 Mai", desc: t("shadowIt.incident3" as any), dept: t("shadowIt.dept.finance" as any), severityKey: "high" },
    { date: "12 Mai", desc: t("shadowIt.incident4" as any), dept: t("shadowIt.dept.direction" as any), severityKey: "high" },
    { date: "10 Mai", desc: t("shadowIt.incident5" as any), dept: t("shadowIt.dept.rh" as any), severityKey: "medium" },
  ];

  const severityLabel: Record<string, string> = {
    critical: t("status.critical" as any),
    high: t("status.high" as any),
    medium: t("status.medium" as any),
  };

  return (
    <div>
      <Header title={t("shadowIt.title" as any)} />
      <div className="space-y-6 p-6">
        {/* Alerte principale */}
        <FadeIn>
          <Card className="border-cyber-red/30 bg-cyber-red/5">
            <CardContent className="flex items-start gap-4 p-5">
              <ShieldAlert className="mt-0.5 h-6 w-6 shrink-0 text-cyber-red" />
              <div>
                <h3 className="font-semibold text-cyber-red">{t("shadowIt.alertTitle" as any)}</h3>
                <p className="mt-1 text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: t("shadowIt.alertDesc" as any) }} />
                <Button variant="outline" size="sm" className="mt-3 gap-2 border-cyber-red/30 text-cyber-red hover:bg-cyber-red/10">
                  {t("shadowIt.launchTraining" as any)}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        {/* Stats */}
        <FadeIn delay={0.05}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">{t("shadowIt.score" as any)}</p>
                <p className="mt-1 text-2xl font-bold text-cyber-red">{shadowScore}/100</p>
                <p className="text-[11px] text-muted-foreground">{t("shadowIt.highRisk" as any)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">{t("shadowIt.unauthorizedApps" as any)}</p>
                <p className="mt-1 text-2xl font-bold text-rht-orange">6</p>
                <p className="text-[11px] text-muted-foreground">{t("common.detected" as any)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">{t("shadowIt.exposedEmployees" as any)}</p>
                <p className="mt-1 text-2xl font-bold text-cyber-red">40/45</p>
                <p className="text-[11px] text-muted-foreground">89% {t("common.ofStaff" as any)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">{t("shadowIt.potentialLeaks" as any)}</p>
                <p className="mt-1 text-2xl font-bold text-rht-orange">23</p>
                <p className="text-[11px] text-muted-foreground">{t("common.thisMonth" as any)}</p>
              </CardContent>
            </Card>
          </div>
        </FadeIn>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Apps à risque */}
          <FadeIn delay={0.1}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Smartphone className="h-4 w-4 text-rht-orange" />
                  {t("shadowIt.riskApps" as any)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {riskApps.map((app) => (
                  <div key={app.name} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{app.name}</span>
                        <Badge className={`text-[10px] ${riskLevelStyle[app.riskLevel]}`}>
                          {app.risk}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">{app.usage}% {t("passwords.ofEmployees" as any)}</span>
                    </div>
                    <Progress value={app.usage} className="mt-2 h-1.5" />
                    <p className="mt-2 text-[11px] text-muted-foreground">
                      <FileWarning className="mr-1 inline h-3 w-3" />
                      {t("shadowIt.dataShared" as any)} : {app.dataShared}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </FadeIn>

          <div className="space-y-6">
            {/* Exposition par département */}
            <FadeIn delay={0.15}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t("shadowIt.deptExposure" as any)}</CardTitle>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>
            </FadeIn>

            {/* Incidents */}
            <FadeIn delay={0.2}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t("shadowIt.recentIncidents" as any)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {incidents.map((inc, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm">
                        <span className="shrink-0 text-[11px] text-muted-foreground w-12">{inc.date}</span>
                        <div className="flex-1">
                          <p>{inc.desc}</p>
                          <p className="text-[11px] text-muted-foreground">{inc.dept}</p>
                        </div>
                        <Badge className={`shrink-0 text-[10px] ${
                          inc.severityKey === "critical" ? "bg-cyber-red/10 text-cyber-red"
                          : inc.severityKey === "high" ? "bg-rht-orange/10 text-rht-orange"
                          : "bg-yellow-500/10 text-yellow-500"
                        }`}>
                          {severityLabel[inc.severityKey]}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
}
