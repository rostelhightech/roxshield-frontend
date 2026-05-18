"use client";

import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

const emailScore = 68;

const threatTypes = [
  { nameKey: "emailSecurity.threat.phishing", count: 142, blocked: 128, color: "#ef4444" },
  { nameKey: "emailSecurity.threat.spearPhishing", count: 23, blocked: 18, color: "#fa990e" },
  { nameKey: "emailSecurity.threat.bec", count: 8, blocked: 6, color: "#9c1e99" },
  { nameKey: "emailSecurity.threat.spoofing", count: 34, blocked: 31, color: "#c428c0" },
  { nameKey: "emailSecurity.threat.malware", count: 19, blocked: 17, color: "#ef4444" },
];

function getBarColor(score: number) {
  if (score >= 70) return "#16a34a";
  if (score >= 50) return "#fa990e";
  return "#ef4444";
}

export default function EmailSecurityPage() {
  const { t } = useTranslation();

  const departmentData = [
    { dept: t("shadowIt.dept.finance" as any), score: 45, incidents: 12 },
    { dept: t("shadowIt.dept.rh" as any), score: 62, incidents: 7 },
    { dept: t("shadowIt.dept.it" as any), score: 85, incidents: 2 },
    { dept: t("shadowIt.dept.direction" as any), score: 38, incidents: 15 },
    { dept: t("shadowIt.dept.commercial" as any), score: 55, incidents: 9 },
    { dept: "Juridique", score: 72, incidents: 4 },
  ];

  const recentIncidents = [
    { date: "17 Mai", typeKey: "emailSecurity.incident1.type", targetKey: "emailSecurity.incident1.target", status: "blocked" as const, deptKey: "shadowIt.dept.finance" },
    { date: "16 Mai", typeKey: "emailSecurity.incident2.type", targetKey: "emailSecurity.incident2.target", status: "clicked" as const, deptKey: "shadowIt.dept.rh" },
    { date: "15 Mai", typeKey: "emailSecurity.incident3.type", targetKey: "emailSecurity.incident3.target", status: "blocked" as const, deptKey: "shadowIt.dept.commercial" },
    { date: "14 Mai", typeKey: "emailSecurity.incident4.type", targetKey: "emailSecurity.incident4.target", status: "reported" as const, deptKey: "shadowIt.dept.finance" },
    { date: "13 Mai", typeKey: "emailSecurity.incident5.type", targetKey: "emailSecurity.incident5.target", status: "blocked" as const, deptKey: "shadowIt.dept.operations" },
  ];

  const statusStyleMap = {
    blocked: { className: "bg-cyber-green/10 text-cyber-green", label: t("status.blocked" as any) },
    reported: { className: "bg-rht-orange/10 text-rht-orange", label: t("status.reported" as any) },
    clicked: { className: "bg-cyber-red/10 text-cyber-red", label: t("status.clicked" as any) },
  };

  return (
    <div>
      <Header title={t("emailSecurity.title" as any)} />
      <div className="space-y-6 p-6">
        {/* Stats */}
        <FadeIn>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: t("emailSecurity.score" as any), value: `${emailScore}/100`, icon: Mail, color: "text-rht-violet-light", badge: t("status.intermediate" as any) },
              { label: t("emailSecurity.threatsBlocked" as any), value: "200/226", icon: ShieldAlert, color: "text-cyber-green", badge: "88.5%" },
              { label: t("emailSecurity.atRiskEmployees" as any), value: "12", icon: Users, color: "text-cyber-red", badge: `${t("emailSecurity.on" as any)} 45` },
              { label: t("emailSecurity.trend" as any), value: "-23%", icon: TrendingDown, color: "text-cyber-green", badge: t("common.vsLastMonth" as any) },
            ].map((stat) => (
              <Card key={stat.label}>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rht-violet/10">
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="text-xl font-bold">{stat.value}</p>
                    <p className="text-[11px] text-muted-foreground">{stat.badge}</p>
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
                <div className="space-y-4">
                  {threatTypes.map((threat) => (
                    <div key={threat.nameKey}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{t(threat.nameKey as any)}</span>
                        <span className="text-xs text-muted-foreground">
                          {threat.blocked}/{threat.count} {t("emailSecurity.blocked" as any)}
                        </span>
                      </div>
                      <div className="mt-1.5 flex gap-1">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${(threat.blocked / threat.count) * 100}%`,
                            backgroundColor: "#16a34a",
                          }}
                        />
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${((threat.count - threat.blocked) / threat.count) * 100}%`,
                            backgroundColor: threat.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Score par département */}
          <FadeIn delay={0.15}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("emailSecurity.deptScore" as any)}</CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          </FadeIn>
        </div>

        {/* Incidents récents */}
        <FadeIn delay={0.2}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("emailSecurity.recentIncidents" as any)}</CardTitle>
            </CardHeader>
            <CardContent>
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
                    {recentIncidents.map((inc, i) => {
                      const style = statusStyleMap[inc.status];
                      return (
                        <tr key={i} className="hover:bg-accent/30">
                          <td className="py-3 pr-4 text-xs text-muted-foreground">{inc.date}</td>
                          <td className="py-3 pr-4 font-medium">{t(inc.typeKey as any)}</td>
                          <td className="py-3 pr-4 text-xs">{t(inc.targetKey as any)}</td>
                          <td className="py-3 pr-4 text-xs">{t(inc.deptKey as any)}</td>
                          <td className="py-3">
                            <Badge className={`text-[10px] ${style.className}`}>
                              {style.label}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </div>
  );
}
