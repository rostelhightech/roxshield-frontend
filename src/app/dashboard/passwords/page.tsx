"use client";

import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ShieldAlert,
  AlertTriangle,
  XCircle,
  ExternalLink,
} from "lucide-react";
import { FadeIn } from "@/components/motion";
import { useTranslation } from "@/lib/i18n";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useApi } from "@/hooks/use-api";

interface PasswordsResponse {
  audit: any;
  stats: {
    hygieneScore: number;
    weakPercent: number;
    reusedPercent: number;
    mfaPercent: number;
    mfaEnabled?: number;
    noMfa?: number;
    totalAccounts: number;
  };
}

export default function PasswordsPage() {
  const { t } = useTranslation();
  const { data, loading } = useApi<PasswordsResponse>("/api/passwords");

  if (loading) {
    return (
      <div>
        <Header title={t("passwords.title" as any)} />
        <div className="space-y-6 p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}><CardContent className="p-4"><Skeleton className="h-16 w-full" /></CardContent></Card>
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card><CardContent className="p-6"><Skeleton className="h-[300px] w-full" /></CardContent></Card>
            <Card><CardContent className="p-6"><Skeleton className="h-[300px] w-full" /></CardContent></Card>
          </div>
        </div>
      </div>
    );
  }

  const stats = data?.stats || { hygieneScore: 0, weakPercent: 0, reusedPercent: 0, mfaPercent: 0, totalAccounts: 0 };
  const audit = data?.audit;

  const mfaEnabled = stats.mfaEnabled || 0;
  const noMfa = stats.noMfa || 0;
  const mfaData = [
    { name: "enabled", value: mfaEnabled, color: "#16a34a" },
    { name: "disabled", value: noMfa, color: "#ef4444" },
  ].filter((d) => d.value > 0);

  const sevStyle = {
    critical: "bg-cyber-red/10 text-cyber-red",
    high: "bg-rht-orange/10 text-rht-orange",
    medium: "bg-yellow-500/10 text-yellow-500",
  };

  // Issues from audit JSON or derive from stats
  const issues = audit?.issues as any[] || [];
  const passwordIssues = issues.length > 0 ? issues : [
    { issue: t("passwords.issue.short" as any), count: Math.round(stats.weakPercent * stats.totalAccounts / 100), severity: "critical" as const },
    { issue: t("passwords.issue.reused" as any), count: Math.round(stats.reusedPercent * stats.totalAccounts / 100), severity: "high" as const },
    { issue: t("passwords.issue.noSpecial" as any), count: Math.round(stats.weakPercent * stats.totalAccounts / 200), severity: "high" as const },
  ].filter((i) => i.count > 0);

  const recommendations = [
    {
      title: t("passwords.rec.manager" as any),
      desc: t("passwords.rec.manager.desc" as any),
      priority: t("status.urgent" as any),
      priorityKey: "urgent",
      link: "https://bitwarden.com",
    },
    {
      title: t("passwords.rec.mfa" as any),
      desc: t("passwords.rec.mfa.desc" as any),
      priority: t("status.urgent" as any),
      priorityKey: "urgent",
      link: null,
    },
    {
      title: t("passwords.rec.training" as any),
      desc: t("passwords.rec.training.desc" as any),
      priority: t("status.important" as any),
      priorityKey: "important",
      link: null,
    },
    {
      title: t("passwords.rec.rotation" as any),
      desc: t("passwords.rec.rotation.desc" as any),
      priority: t("status.recommended" as any),
      priorityKey: "recommended",
      link: null,
    },
  ];

  return (
    <div>
      <Header title={t("passwords.title" as any)} />
      <div className="space-y-6 p-6">
        {/* Stats */}
        <FadeIn>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: t("passwords.hygieneScore" as any), value: `${stats.hygieneScore}/100`, color: stats.hygieneScore < 50 ? "text-cyber-red" : "text-rht-orange" },
              { label: t("passwords.weakDetected" as any), value: `${stats.weakPercent}%`, color: "text-cyber-red" },
              { label: t("passwords.reused" as any), value: `${stats.reusedPercent}%`, color: "text-rht-orange" },
              { label: t("passwords.mfaActive" as any), value: `${stats.mfaPercent}%`, color: stats.mfaPercent < 50 ? "text-rht-orange" : "text-cyber-green" },
            ].map((s) => (
              <Card key={s.label}>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className={`mt-1 text-2xl font-bold ${s.color}`}>{s.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </FadeIn>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Problemes detectes */}
          <FadeIn delay={0.1}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <ShieldAlert className="h-4 w-4 text-cyber-red" />
                  {t("passwords.issuesDetected" as any)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {passwordIssues.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">{t("passwords.noIssues" as any)}</p>
                ) : (
                  <div className="space-y-3">
                    {passwordIssues.map((issue: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between rounded-lg border p-3">
                        <div className="flex items-center gap-3">
                          {issue.severity === "critical" ? (
                            <XCircle className="h-4 w-4 shrink-0 text-cyber-red" />
                          ) : (
                            <AlertTriangle className={`h-4 w-4 shrink-0 ${issue.severity === "high" ? "text-rht-orange" : "text-yellow-500"}`} />
                          )}
                          <span className="text-sm">{issue.issue}</span>
                        </div>
                        <Badge className={`text-[10px] ${sevStyle[issue.severity as keyof typeof sevStyle] || sevStyle.medium}`}>
                          {issue.count} {t("common.employees" as any)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </FadeIn>

          {/* MFA + Recommendations */}
          <div className="space-y-6">
            <FadeIn delay={0.15}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t("passwords.mfaAdoption" as any)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6">
                    <div className="h-32 w-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={mfaData} cx="50%" cy="50%" innerRadius={30} outerRadius={55} dataKey="value" paddingAngle={3}>
                            {mfaData.map((entry, i) => (
                              <Cell key={i} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-cyber-green" />
                        <span className="text-sm">{t("passwords.mfaEnabled" as any)} — {mfaEnabled} ({stats.mfaPercent}%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-cyber-red" />
                        <span className="text-sm">{t("passwords.mfaDisabled" as any)} — {noMfa} ({100 - stats.mfaPercent}%)</span>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {t("passwords.mfaGoal" as any)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={0.2}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t("passwords.recommendations" as any)}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recommendations.map((rec) => (
                    <div key={rec.title} className="rounded-lg border p-3">
                      <div className="flex items-start justify-between">
                        <h4 className="text-sm font-semibold">{rec.title}</h4>
                        <Badge className={`text-[10px] ${
                          rec.priorityKey === "urgent" ? "bg-cyber-red/10 text-cyber-red"
                          : rec.priorityKey === "important" ? "bg-rht-orange/10 text-rht-orange"
                          : "bg-rht-violet/10 text-rht-violet-light"
                        }`}>
                          {rec.priority}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{rec.desc}</p>
                      {rec.link && (
                        <a href={rec.link} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs text-rht-violet-light hover:underline">
                          {t("passwords.learnMore" as any)} <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
}
