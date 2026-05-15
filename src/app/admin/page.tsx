"use client";

import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  organizations,
  platformStats,
  revenueByMonth,
  planDistribution,
} from "@/lib/mock-data";
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
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { FadeIn, StaggerContainer, StaggerItem, GlowCard } from "@/components/motion";
import { motion } from "framer-motion";
import Link from "next/link";

function formatCFA(amount: number) {
  return new Intl.NumberFormat("fr-FR").format(amount) + " F";
}

export default function AdminDashboardPage() {
  const recentOrgs = [...organizations].sort(
    (a, b) => new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime()
  ).slice(0, 5);

  return (
    <div>
      <Header title="Super Admin — CyberSense" />
      <div className="space-y-6 p-6">
        <FadeIn>
          <div className="flex items-center gap-3">
            <Badge className="border-0 bg-rht-orange/10 text-rht-orange">Rostel High-Tech</Badge>
            <p className="text-sm text-muted-foreground">
              Vue globale de la plateforme CyberSense
            </p>
          </div>
        </FadeIn>

        <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: DollarSign,
              label: "MRR",
              value: formatCFA(platformStats.mrrTotal),
              sub: `+${platformStats.mrrGrowth}% ce mois`,
              color: "rht-orange",
            },
            {
              icon: Building2,
              label: "Organisations",
              value: platformStats.totalOrganizations.toString(),
              sub: `${platformStats.activeOrganizations} actives`,
              color: "rht-violet",
            },
            {
              icon: Users,
              label: "Employés totaux",
              value: platformStats.totalEmployees.toString(),
              sub: "sur toutes les orgs",
              color: "rht-violet-light",
            },
            {
              icon: Target,
              label: "Campagnes lancées",
              value: platformStats.totalCampaigns.toString(),
              sub: `Score moyen : ${platformStats.avgRiskScore}%`,
              color: "cyber-green",
            },
          ].map((s) => (
            <StaggerItem key={s.label}>
              <GlowCard>
                <Card className="transition-all duration-300 hover:border-rht-orange/20">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-${s.color}/10`}>
                        <s.icon className={`h-5 w-5 text-${s.color}`} />
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
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Évolution du MRR (FCFA)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueByMonth}>
                      <defs>
                        <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#fa990e" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#fa990e" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="month" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                      <YAxis
                        tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                        tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: "12px",
                          fontSize: "12px",
                          color: "var(--foreground)",
                        }}
                        formatter={(value) => [formatCFA(value as number), "MRR"]}
                      />
                      <Area type="monotone" dataKey="mrr" stroke="#fa990e" fill="url(#mrrGrad)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
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
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={planDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {planDistribution.map((entry) => (
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
                  {planDistribution.map((p) => (
                    <div key={p.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                        <span>{p.name}</span>
                      </div>
                      <span className="font-semibold">{p.value} orgs</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <FadeIn delay={0.15}>
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
                  {recentOrgs.map((org, i) => (
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
                        <Badge
                          className={`border-0 text-[10px] ${
                            org.status === "active"
                              ? "bg-cyber-green/10 text-cyber-green"
                              : org.status === "trial"
                              ? "bg-rht-orange/10 text-rht-orange"
                              : "bg-cyber-red/10 text-cyber-red"
                          }`}
                        >
                          {org.status === "active" ? "Actif" : org.status === "trial" ? "Essai" : "Expiré"}
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">{org.plan}</Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn delay={0.2}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Nouvelles inscriptions par mois</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueByMonth}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="month" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                      <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: "12px",
                          fontSize: "12px",
                          color: "var(--foreground)",
                        }}
                      />
                      <Bar dataKey="newOrgs" name="Nouvelles orgs" fill="#9c1e99" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Métriques clés</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Taux de churn", value: `${platformStats.churnRate}%`, progress: platformStats.churnRate * 10, good: true },
                  { label: "Formations complétées", value: platformStats.totalTrainingsCompleted.toString(), progress: 72, good: false },
                  { label: "Score de risque moyen", value: `${platformStats.avgRiskScore}%`, progress: platformStats.avgRiskScore, good: true },
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
    </div>
  );
}
