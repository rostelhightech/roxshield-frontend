"use client";

import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ShieldAlert,
  Users,
  GraduationCap,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { FadeIn, StaggerContainer, StaggerItem, GlowCard } from "@/components/motion";
import { useTranslation } from "@/lib/i18n";
import { useApi } from "@/hooks/use-api";

interface DashboardData {
  totalEmployees: number;
  employeesAtRisk: number;
  avgRiskScore: number;
  trainingsCompleted: number;
  totalTrainings: number;
  trainingRate: number;
  activeCampaigns: number;
  recentActivity: Array<{
    id: string;
    action: string;
    description: string | null;
    createdAt: string;
    user: { name: string | null; email: string; department: string | null } | null;
  }>;
  deptRisk: Array<{
    department: string | null;
    avgRisk: number;
    count: number;
  }>;
}

interface EmployeesData {
  employees: Array<{
    id: string;
    name: string | null;
    email: string;
    department: string | null;
    position: string | null;
    role: string;
    riskScore: number;
    trainingsCompleted: number;
  }>;
}

interface CampaignsData {
  campaigns: Array<{
    id: string;
    name: string;
    templateType: string;
    status: string;
    totalTargets: number;
    sentCount: number;
    clickCount: number;
    reportCount: number;
    startedAt: string | null;
  }>;
  stats: {
    totalCampaigns: number;
    totalSent: number;
    clickRate: number;
    reportRate: number;
  };
}

function getRiskColor(score: number) {
  if (score <= 30) return "text-cyber-green";
  if (score <= 60) return "text-rht-orange";
  return "text-cyber-red";
}

function getBarColor(score: number) {
  if (score <= 30) return "#16a34a";
  if (score <= 60) return "#fa990e";
  return "#ef4444";
}

function getActivityIcon(action: string) {
  switch (action) {
    case "training_completed": return { icon: GraduationCap, color: "text-cyber-green", bg: "bg-cyber-green/10" };
    case "campaign_created": return { icon: ShieldAlert, color: "text-rht-violet-light", bg: "bg-rht-violet/10" };
    case "threat_blocked": return { icon: AlertTriangle, color: "text-rht-orange", bg: "bg-rht-orange/10" };
    case "user_flagged": return { icon: AlertTriangle, color: "text-cyber-red", bg: "bg-cyber-red/10" };
    default: return { icon: CheckCircle, color: "text-muted-foreground", bg: "bg-muted" };
  }
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `Il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  return `Il y a ${days}j`;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}><CardContent className="p-5"><Skeleton className="h-20 w-full" /></CardContent></Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2"><CardContent className="p-6"><Skeleton className="h-[280px] w-full" /></CardContent></Card>
        <Card><CardContent className="p-6"><Skeleton className="h-[280px] w-full" /></CardContent></Card>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { t } = useTranslation();
  const { data, loading } = useApi<DashboardData>("/api/dashboard");
  const { data: empData } = useApi<EmployeesData>("/api/employees");
  const { data: campData } = useApi<CampaignsData>("/api/campaigns");

  if (loading || !data) {
    return (
      <div>
        <Header title={t("dashboard.title")} />
        <LoadingSkeleton />
      </div>
    );
  }

  const safeCount = data.totalEmployees - data.employeesAtRisk;
  const atRiskEmployees = empData?.employees.filter((e) => e.riskScore > 60).sort((a, b) => b.riskScore - a.riskScore) || [];
  const completedCampaigns = campData?.campaigns.filter((c) => c.status === "COMPLETED" || c.status === "ACTIVE") || [];

  return (
    <div>
      <Header title={t("dashboard.title")} />
      <div className="space-y-6 p-6">
        {/* ── KPI Cards ── */}
        <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StaggerItem>
            <GlowCard>
              <Card className="transition-all duration-300 hover:border-rht-orange/20">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">{t("dashboard.riskScore")}</p>
                      <p className={`mt-1 text-3xl font-bold ${getRiskColor(data.avgRiskScore)}`}>{data.avgRiskScore}%</p>
                    </div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rht-orange/10">
                      <ShieldAlert className="h-5 w-5 text-rht-orange" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-xs text-cyber-green">
                    <ArrowDownRight className="h-3.5 w-3.5" />
                    <span>{t("dashboard.thisMonth")}</span>
                  </div>
                </CardContent>
              </Card>
            </GlowCard>
          </StaggerItem>

          <StaggerItem>
            <GlowCard>
              <Card className="transition-all duration-300 hover:border-cyber-red/20">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">{t("dashboard.atRiskEmployees")}</p>
                      <p className="mt-1 text-3xl font-bold text-cyber-red">{data.employeesAtRisk}</p>
                    </div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyber-red/10">
                      <AlertTriangle className="h-5 w-5 text-cyber-red" />
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground">{t("dashboard.outOf")} {data.totalEmployees} {t("dashboard.employees")}</div>
                </CardContent>
              </Card>
            </GlowCard>
          </StaggerItem>

          <StaggerItem>
            <GlowCard>
              <Card className="transition-all duration-300 hover:border-rht-violet/20">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">{t("dashboard.trainingsCompleted")}</p>
                      <p className="mt-1 text-3xl font-bold text-rht-violet-light">{data.trainingRate}%</p>
                    </div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rht-violet/10">
                      <GraduationCap className="h-5 w-5 text-rht-violet-light" />
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground">
                    {data.trainingsCompleted}/{data.totalTrainings} formations
                  </div>
                </CardContent>
              </Card>
            </GlowCard>
          </StaggerItem>

          <StaggerItem>
            <GlowCard>
              <Card className="transition-all duration-300 hover:border-rht-violet/20">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">{t("dashboard.totalEmployees")}</p>
                      <p className="mt-1 text-3xl font-bold">{data.totalEmployees}</p>
                    </div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rht-violet/10">
                      <Users className="h-5 w-5 text-rht-violet" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-xs text-cyber-green">
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span>{safeCount} {t("dashboard.safeZone")}</span>
                  </div>
                </CardContent>
              </Card>
            </GlowCard>
          </StaggerItem>
        </StaggerContainer>

        {/* ── Charts ── */}
        <div className="grid gap-6 lg:grid-cols-3">
          <FadeIn className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">{t("dashboard.riskEvolution")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  {data.deptRisk.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data.deptRisk.map((d) => ({ name: d.department || "N/A", riskScore: d.avgRisk }))}>
                        <defs>
                          <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#9c1e99" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#9c1e99" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="name" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                        <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                        <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", fontSize: "12px", color: "var(--foreground)" }} />
                        <Area type="monotone" dataKey="riskScore" stroke="#c428c0" strokeWidth={2.5} fillOpacity={1} fill="url(#riskGradient)" name="Score de risque" />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Aucune donnée disponible</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn delay={0.1}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">{t("dashboard.riskByDept")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  {data.deptRisk.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.deptRisk.map((d) => ({ name: d.department || "N/A", riskScore: d.avgRisk }))} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
                        <XAxis type="number" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                        <YAxis dataKey="name" type="category" width={85} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                        <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", fontSize: "12px", color: "var(--foreground)" }} />
                        <Bar dataKey="riskScore" radius={[0, 6, 6, 0]} name="Score de risque">
                          {data.deptRisk.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getBarColor(entry.avgRisk)} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Aucune donnée</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </div>

        {/* ── Activité récente ── */}
        <FadeIn delay={0.15}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyber-green opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-cyber-green" /></span>
                Activité récente
              </CardTitle>
              <Badge variant="outline" className="text-[10px]">{data.recentActivity.length} items</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.recentActivity.map((activity) => {
                  const { icon: Icon, color, bg } = getActivityIcon(activity.action);
                  return (
                    <div key={activity.id} className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-accent/50">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${bg}`}>
                        <Icon className={`h-4 w-4 ${color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          <span className="font-medium">{activity.user?.name || "Système"}</span>
                          {" — "}
                          <span className="text-muted-foreground">{activity.description}</span>
                        </p>
                      </div>
                      <span className="shrink-0 text-[11px] text-muted-foreground">{timeAgo(activity.createdAt)}</span>
                    </div>
                  );
                })}
                {data.recentActivity.length === 0 && (
                  <p className="py-4 text-center text-sm text-muted-foreground">Aucune activité récente</p>
                )}
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        {/* ── Employés à risque + Campagnes ── */}
        <div className="grid gap-6 lg:grid-cols-2">
          <FadeIn>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">{t("dashboard.highRiskEmployees")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {atRiskEmployees.slice(0, 5).map((emp) => (
                    <div key={emp.id} className="flex items-center gap-3 rounded-xl border p-3 transition-colors hover:bg-accent">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-cyber-red/10 text-xs text-cyber-red">
                          {(emp.name || "?").split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{emp.name}</p>
                        <p className="text-xs text-muted-foreground">{emp.department} — {emp.position}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="destructive" className="mb-1 text-[10px]">{emp.riskScore}% risque</Badge>
                        <p className="text-[10px] text-muted-foreground">{emp.trainingsCompleted} formations</p>
                      </div>
                    </div>
                  ))}
                  {atRiskEmployees.length === 0 && (
                    <p className="py-4 text-center text-sm text-muted-foreground">Aucun employé à risque</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn delay={0.1}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Dernières simulations de phishing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {completedCampaigns.slice(0, 4).map((camp) => {
                    const clickRate = camp.sentCount > 0 ? Math.round((camp.clickCount / camp.sentCount) * 100) : 0;
                    const reportRate = camp.sentCount > 0 ? Math.round((camp.reportCount / camp.sentCount) * 100) : 0;
                    return (
                      <div key={camp.id} className="space-y-2 rounded-xl border p-3 transition-colors hover:bg-accent">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{camp.name}</p>
                          <Badge variant={camp.status === "ACTIVE" ? "default" : "outline"} className="text-[10px]">{camp.templateType}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{camp.status === "ACTIVE" ? "En cours" : "Terminée"}</span>
                          <span>{camp.totalTargets} cibles</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-cyber-red">{clickRate}% ont cliqué</span>
                            <span className="text-cyber-green">{reportRate}% ont signalé</span>
                          </div>
                          <Progress value={clickRate} className="h-2" />
                        </div>
                      </div>
                    );
                  })}
                  {completedCampaigns.length === 0 && (
                    <p className="py-4 text-center text-sm text-muted-foreground">Aucune campagne</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
