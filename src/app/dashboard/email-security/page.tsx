"use client";

import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Mail,
  ShieldAlert,
  Users,
  TrendingDown,
} from "lucide-react";
import { FadeIn } from "@/components/motion";
import { useTranslation } from "@/lib/i18n";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useApi } from "@/hooks/use-api";

interface EmailThreat {
  id: string;
  type: string;
  subject: string | null;
  senderEmail: string | null;
  targetEmail: string | null;
  targetDept: string | null;
  severity: string;
  status: string;
  detectedAt: string;
}

interface EmailThreatsResponse {
  threats: EmailThreat[];
  stats: {
    total: number;
    blocked: number;
    critical: number;
    blockRate: number;
    byType: { type: string; count: number }[];
  };
}

function getBarColor(score: number) {
  if (score >= 70) return "#16a34a";
  if (score >= 50) return "#fa990e";
  return "#ef4444";
}

const statusStyleMap: Record<string, { className: string; labelKey: string }> = {
  BLOCKED: { className: "bg-cyber-green/10 text-cyber-green", labelKey: "status.blocked" },
  RESOLVED: { className: "bg-cyber-green/10 text-cyber-green", labelKey: "status.resolved" },
  DETECTED: { className: "bg-rht-orange/10 text-rht-orange", labelKey: "status.detected" },
  INVESTIGATING: { className: "bg-cyber-red/10 text-cyber-red", labelKey: "status.investigating" },
};

const typeLabels: Record<string, string> = {
  phishing: "Phishing",
  spear_phishing: "Spear Phishing",
  bec: "BEC",
  spoofing: "Spoofing",
  malware: "Malware",
};

export default function EmailSecurityPage() {
  const { t } = useTranslation();
  const { data, loading } = useApi<EmailThreatsResponse>("/api/email-threats");

  if (loading) {
    return (
      <div>
        <Header title={t("emailSecurity.title" as any)} />
        <div className="space-y-6 p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}><CardContent className="p-4"><Skeleton className="h-16 w-full" /></CardContent></Card>
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card><CardContent className="p-6"><Skeleton className="h-[250px] w-full" /></CardContent></Card>
            <Card><CardContent className="p-6"><Skeleton className="h-[250px] w-full" /></CardContent></Card>
          </div>
        </div>
      </div>
    );
  }

  const threats = data?.threats || [];
  const stats = data?.stats || { total: 0, blocked: 0, critical: 0, blockRate: 100, byType: [] };

  // Score email security
  const emailScore = stats.blockRate;

  // Group by department for chart
  const deptMap = new Map<string, { score: number; incidents: number }>();
  threats.forEach((th) => {
    const dept = th.targetDept || "Autre";
    const existing = deptMap.get(dept) || { score: 100, incidents: 0 };
    existing.incidents += 1;
    existing.score = Math.max(0, 100 - existing.incidents * 8);
    deptMap.set(dept, existing);
  });
  const departmentData = Array.from(deptMap.entries())
    .map(([dept, v]) => ({ dept, score: v.score, incidents: v.incidents }))
    .sort((a, b) => a.score - b.score);

  // Recent incidents (last 10)
  const recentIncidents = threats.slice(0, 10);

  return (
    <div>
      <Header title={t("emailSecurity.title" as any)} />
      <div className="space-y-6 p-6">
        {/* Stats */}
        <FadeIn>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: t("emailSecurity.score" as any), value: `${emailScore}/100`, icon: Mail, color: emailScore >= 70 ? "text-cyber-green" : "text-rht-violet-light" },
              { label: t("emailSecurity.threatsBlocked" as any), value: `${stats.blocked}/${stats.total}`, icon: ShieldAlert, color: "text-cyber-green", badge: `${stats.blockRate}%` },
              { label: t("emailSecurity.criticalThreats" as any), value: String(stats.critical), icon: Users, color: "text-cyber-red" },
              { label: t("emailSecurity.totalDetected" as any), value: String(stats.total), icon: TrendingDown, color: "text-rht-orange" },
            ].map((stat) => (
              <Card key={stat.label}>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rht-violet/10">
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="text-xl font-bold">{stat.value}</p>
                    {stat.badge && <p className="text-[11px] text-muted-foreground">{stat.badge}</p>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </FadeIn>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Types de menaces */}
          <FadeIn delay={0.1}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("emailSecurity.threatTypes" as any)}</CardTitle>
              </CardHeader>
              <CardContent>
                {stats.byType.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">{t("emailSecurity.noThreats" as any)}</p>
                ) : (
                  <div className="space-y-4">
                    {stats.byType.map((threat) => {
                      const total = threat.count;
                      const blocked = threats.filter((th) => th.type === threat.type && th.status === "BLOCKED").length;
                      return (
                        <div key={threat.type}>
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">{typeLabels[threat.type] || threat.type}</span>
                            <span className="text-xs text-muted-foreground">
                              {blocked}/{total} {t("emailSecurity.blocked" as any)}
                            </span>
                          </div>
                          <div className="mt-1.5 flex gap-1">
                            <div
                              className="h-2 rounded-full"
                              style={{ width: `${total > 0 ? (blocked / total) * 100 : 0}%`, backgroundColor: "#16a34a" }}
                            />
                            <div
                              className="h-2 rounded-full"
                              style={{ width: `${total > 0 ? ((total - blocked) / total) * 100 : 0}%`, backgroundColor: "#ef4444" }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </FadeIn>

          {/* Score par departement */}
          <FadeIn delay={0.15}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("emailSecurity.deptScore" as any)}</CardTitle>
              </CardHeader>
              <CardContent>
                {departmentData.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">{t("emailSecurity.noData" as any)}</p>
                ) : (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={departmentData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="dept" tick={{ fontSize: 11 }} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                          {departmentData.map((entry, i) => (
                            <Cell key={i} fill={getBarColor(entry.score)} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </FadeIn>
        </div>

        {/* Incidents recents */}
        <FadeIn delay={0.2}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("emailSecurity.recentIncidents" as any)}</CardTitle>
            </CardHeader>
            <CardContent>
              {recentIncidents.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">{t("emailSecurity.noIncidents" as any)}</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-xs text-muted-foreground">
                        <th className="pb-3 pr-4">{t("common.date" as any)}</th>
                        <th className="pb-3 pr-4">{t("common.type" as any)}</th>
                        <th className="pb-3 pr-4">{t("common.target" as any)}</th>
                        <th className="pb-3 pr-4">{t("common.department" as any)}</th>
                        <th className="pb-3">{t("common.status" as any)}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {recentIncidents.map((inc) => {
                        const style = statusStyleMap[inc.status] || statusStyleMap.DETECTED;
                        return (
                          <tr key={inc.id} className="hover:bg-accent/30">
                            <td className="py-3 pr-4 text-xs text-muted-foreground">
                              {new Date(inc.detectedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                            </td>
                            <td className="py-3 pr-4 font-medium">{typeLabels[inc.type] || inc.type}</td>
                            <td className="py-3 pr-4 text-xs">{inc.targetEmail || "—"}</td>
                            <td className="py-3 pr-4 text-xs">{inc.targetDept || "—"}</td>
                            <td className="py-3">
                              <Badge className={`text-[10px] ${style.className}`}>
                                {t(style.labelKey as any)}
                              </Badge>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </div>
  );
}
