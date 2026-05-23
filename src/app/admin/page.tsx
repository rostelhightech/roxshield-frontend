"use client";

import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Building2,
  Users,
  TrendingUp,
  DollarSign,
  Target,
  GraduationCap,
  Globe,
  ArrowUpRight,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FadeIn, StaggerContainer, StaggerItem, GlowCard } from "@/components/motion";
import { motion } from "framer-motion";
import Link from "next/link";
import { useApi } from "@/hooks/use-api";

interface AdminStats {
  totalOrganizations: number;
  activeOrganizations: number;
  totalEmployees: number;
  totalCampaigns: number;
  totalTrainingsCompleted: number;
  avgRiskScore: number;
  mrrTotal: number;
  mrrGrowth: number;
  churnRate: number;
  planDistribution: { name: string; value: number; color: string }[];
  recentOrgs: {
    id: string;
    name: string;
    plan: string;
    sector: string;
    country: string;
    city: string;
    status: string;
    employees: number;
    campaigns: number;
    createdAt: string;
  }[];
}

function formatCFA(amount: number) {
  return new Intl.NumberFormat("fr-FR").format(amount) + " F";
}

export default function AdminDashboardPage() {
  const { data, loading } = useApi<AdminStats>("/api/admin/stats");

  if (loading || !data) {
    return (
      <div>
        <Header title="Super Admin — RoxShield" />
        <div className="space-y-6 p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}><CardContent className="p-5"><Skeleton className="h-20 w-full" /></CardContent></Card>
            ))}
          </div>
          <Card><CardContent className="p-6"><Skeleton className="h-[300px] w-full" /></CardContent></Card>
        </div>
      </div>
    );
  }

  const recentOrgs = data.recentOrgs.slice(0, 5);

  return (
    <div>
      <Header title="Super Admin — RoxShield" />
      <div className="space-y-6 p-6">
        <FadeIn>
          <div className="flex items-center gap-3">
            <Badge className="border-0 bg-rht-orange/10 text-rht-orange">Rostel High-Tech</Badge>
            <p className="text-sm text-muted-foreground">
              Vue globale de la plateforme RoxShield
            </p>
          </div>
        </FadeIn>

        <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: DollarSign,
              label: "MRR",
              value: formatCFA(data.mrrTotal),
              sub: data.mrrGrowth > 0 ? `+${data.mrrGrowth}% ce mois` : "—",
              bg: "bg-rht-orange/10",
              text: "text-rht-orange",
            },
            {
              icon: Building2,
              label: "Organisations",
              value: data.totalOrganizations.toString(),
              sub: `${data.activeOrganizations} actives`,
              bg: "bg-rht-violet/10",
              text: "text-rht-violet",
            },
            {
              icon: Users,
              label: "Employés totaux",
              value: data.totalEmployees.toString(),
              sub: "sur toutes les orgs",
              bg: "bg-rht-violet-light/10",
              text: "text-rht-violet-light",
            },
            {
              icon: Target,
              label: "Campagnes lancées",
              value: data.totalCampaigns.toString(),
              sub: `Score moyen : ${data.avgRiskScore}%`,
              bg: "bg-cyber-green/10",
              text: "text-cyber-green",
            },
          ].map((s) => (
            <StaggerItem key={s.label}>
              <GlowCard>
                <Card className="transition-all duration-300 hover:border-rht-orange/20">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.bg}`}>
                        <s.icon className={`h-5 w-5 ${s.text}`} />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{s.label}</p>
                        <p className="text-2xl font-bold">{s.value}</p>
                      </div>
                    </div>
                    <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                      <TrendingUp className="h-3 w-3 text-cyber-green" />
                      {s.sub}
                    </p>
                  </CardContent>
                </Card>
              </GlowCard>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <div className="grid gap-6 lg:grid-cols-3">
          <FadeIn className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">Organisations récentes</CardTitle>
                  <Link href="/admin/organizations">
                    <Badge variant="outline" className="cursor-pointer text-[10px] hover:bg-accent">
                      Voir tout <ArrowUpRight className="ml-1 h-3 w-3" />
                    </Badge>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentOrgs.length === 0 ? (
                    <p className="py-8 text-center text-sm text-muted-foreground">Aucune organisation</p>
                  ) : (
                    recentOrgs.map((org, i) => (
                      <motion.div
                        key={org.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="flex items-center justify-between rounded-xl border p-3 transition-colors hover:bg-accent"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rht-violet/10">
                            <Building2 className="h-4 w-4 text-rht-violet-light" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{org.name}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Globe className="h-3 w-3" />
                              <span>{org.city}, {org.country}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="border-0 bg-cyber-green/10 text-cyber-green text-[10px]">
                            Actif
                          </Badge>
                          <Badge variant="outline" className="text-[10px]">{org.plan}</Badge>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn delay={0.1}>
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Répartition des plans</CardTitle>
              </CardHeader>
              <CardContent>
                {data.planDistribution.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">Aucune donnée</p>
                ) : (
                  <>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={data.planDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={75}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {data.planDistribution.map((entry) => (
                              <Cell key={entry.name} fill={entry.color} />
                            ))}
                          </Pie>
                          <Legend
                            formatter={(value) => (
                              <span style={{ color: "var(--foreground)", fontSize: "12px" }}>{value}</span>
                            )}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "var(--card)",
                              border: "1px solid var(--border)",
                              borderRadius: "12px",
                              fontSize: "12px",
                              color: "var(--foreground)",
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 space-y-2">
                      {data.planDistribution.map((p) => (
                        <div key={p.name} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                            <span>{p.name}</span>
                          </div>
                          <span className="font-semibold">{p.value} orgs</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </FadeIn>
        </div>

        <FadeIn delay={0.2}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Métriques clés</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Taux de churn", value: `${data.churnRate}%`, progress: data.churnRate * 10 },
                { label: "Formations complétées", value: data.totalTrainingsCompleted.toString(), progress: 72 },
                { label: "Score de risque moyen", value: `${data.avgRiskScore}%`, progress: data.avgRiskScore },
              ].map((m) => (
                <div key={m.label}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{m.label}</span>
                    <span className="font-semibold">{m.value}</span>
                  </div>
                  <Progress value={m.progress} className="mt-1 h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </div>
  );
}
