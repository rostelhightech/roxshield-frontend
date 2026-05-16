"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Building2,
  Users,
  Target,
  GraduationCap,
  Globe,
  Mail,
  Calendar,
  ArrowLeft,
  TrendingDown,
  TrendingUp,
  DollarSign,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Phone,
} from "lucide-react";
import { organizations, employees } from "@/lib/mock-data";
import { FadeIn, StaggerContainer, StaggerItem, GlowCard } from "@/components/motion";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function formatCFA(amount: number) {
  return new Intl.NumberFormat("fr-FR").format(amount) + " F";
}

const riskHistory = [
  { month: "Jan", score: 58 },
  { month: "Fév", score: 52 },
  { month: "Mar", score: 48 },
  { month: "Avr", score: 45 },
  { month: "Mai", score: 42 },
];

const recentActivity = [
  { type: "campaign", text: "Campagne « Virement urgent » lancée", date: "Il y a 2j", icon: Target, color: "text-rht-orange", bg: "bg-rht-orange/10" },
  { type: "training", text: "12 employés ont complété « Phishing 101 »", date: "Il y a 4j", icon: GraduationCap, color: "text-cyber-green", bg: "bg-cyber-green/10" },
  { type: "alert", text: "Taux de clic élevé détecté (60%)", date: "Il y a 5j", icon: AlertTriangle, color: "text-cyber-red", bg: "bg-cyber-red/10" },
  { type: "training", text: "Module « Sécurité Mobile Money » assigné", date: "Il y a 1sem", icon: GraduationCap, color: "text-rht-violet-light", bg: "bg-rht-violet/10" },
  { type: "campaign", text: "Campagne « Facture fournisseur » terminée", date: "Il y a 2sem", icon: CheckCircle, color: "text-cyber-green", bg: "bg-cyber-green/10" },
];

const statusLabel = { active: "Actif", trial: "Essai", expired: "Expiré" } as const;
const statusStyle = {
  active: "bg-cyber-green/10 text-cyber-green",
  trial: "bg-rht-orange/10 text-rht-orange",
  expired: "bg-cyber-red/10 text-cyber-red",
} as const;

export default function OrganizationDetailPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = use(params);
  const org = organizations.find((o) => o.id === orgId);

  if (!org) return notFound();

  const orgEmployees = employees.slice(0, Math.min(org.employees, 5));
  const completionRate = Math.round((org.trainingsCompleted / (org.employees * 6)) * 100);

  return (
    <div>
      <Header title={org.name} />
      <div className="space-y-6 p-6">
        <FadeIn>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Link href="/admin/organizations">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-rht-violet/10 to-rht-orange/10">
                <Building2 className="h-6 w-6 text-rht-violet-light" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">{org.name}</h2>
                  <Badge className={`border-0 text-[10px] ${statusStyle[org.status]}`}>
                    {statusLabel[org.status]}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    {org.city}, {org.country}
                  </span>
                  <span>{org.sector}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">{org.plan}</Badge>
              <Button variant="outline" size="sm">
                <Mail className="mr-2 h-3 w-3" />
                Contacter
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-rht-orange to-rht-orange-light text-white hover:opacity-90">
                Gérer
              </Button>
            </div>
          </div>
        </FadeIn>

        <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: DollarSign,
              label: "MRR",
              value: formatCFA(org.mrr),
              sub: org.plan,
              bg: "bg-rht-orange/10",
              text: "text-rht-orange",
            },
            {
              icon: Users,
              label: "Employés",
              value: `${org.employees}/${org.maxEmployees}`,
              sub: `${Math.round((org.employees / org.maxEmployees) * 100)}% utilisé`,
              bg: "bg-rht-violet/10",
              text: "text-rht-violet-light",
            },
            {
              icon: Target,
              label: "Campagnes",
              value: org.campaignsRun.toString(),
              sub: "lancées",
              bg: "bg-rht-violet-light/10",
              text: "text-rht-violet-light",
            },
            {
              icon: GraduationCap,
              label: "Formations",
              value: org.trainingsCompleted.toString(),
              sub: `${completionRate}% complétion`,
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
                        <p className="text-2xl font-bold">{s.value}</p>
                        <p className="text-xs text-muted-foreground">{s.label}</p>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">{s.sub}</p>
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
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">Évolution du score de risque</CardTitle>
                  <div className="flex items-center gap-1 text-xs text-cyber-green">
                    <TrendingDown className="h-3 w-3" />
                    -16 pts en 5 mois
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={riskHistory}>
                      <defs>
                        <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#9c1e99" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#9c1e99" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="month" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                      <YAxis domain={[0, 100]} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: "12px",
                          fontSize: "12px",
                          color: "var(--foreground)",
                        }}
                        formatter={(value) => [`${value}%`, "Score"]}
                      />
                      <Area type="monotone" dataKey="score" stroke="#9c1e99" fill="url(#riskGrad)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn delay={0.1}>
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { icon: Mail, label: "Contact", value: org.contactName },
                    { icon: Mail, label: "Email", value: org.contactEmail },
                    { icon: Phone, label: "Téléphone", value: "+221 7X XXX XX XX" },
                    { icon: Calendar, label: "Inscription", value: org.joinedDate },
                    { icon: Globe, label: "Localisation", value: `${org.city}, ${org.country}` },
                    { icon: Shield, label: "Secteur", value: org.sector },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3 text-sm">
                      <item.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <div>
                        <p className="text-[10px] text-muted-foreground">{item.label}</p>
                        <p className="font-medium">{item.value}</p>
                      </div>
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
                  <CardTitle className="text-sm font-semibold">Employés récents</CardTitle>
                  <Badge variant="outline" className="text-[10px]">
                    {org.employees} total
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {orgEmployees.map((emp, i) => (
                    <motion.div
                      key={emp.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="flex items-center justify-between rounded-xl border p-3 transition-colors hover:bg-accent"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rht-violet/10 text-xs font-bold text-rht-violet-light">
                          {emp.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{emp.name}</p>
                          <p className="text-xs text-muted-foreground">{emp.department}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={`border-0 text-[10px] ${
                            emp.riskScore < 35
                              ? "bg-cyber-green/10 text-cyber-green"
                              : emp.riskScore < 55
                              ? "bg-rht-orange/10 text-rht-orange"
                              : "bg-cyber-red/10 text-cyber-red"
                          }`}
                        >
                          {emp.riskScore}%
                        </Badge>
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
                <CardTitle className="text-sm font-semibold">Activité récente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((activity, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="flex items-start gap-3"
                    >
                      <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${activity.bg}`}>
                        <activity.icon className={`h-3.5 w-3.5 ${activity.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{activity.text}</p>
                        <p className="text-[10px] text-muted-foreground">{activity.date}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </div>

        <FadeIn delay={0.25}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Score de risque par métrique</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Taux de clic phishing", value: org.riskScore, target: "< 20%", status: org.riskScore < 20 },
                  { label: "Formations complétées", value: completionRate, target: "> 80%", status: completionRate > 80 },
                  { label: "Signalements suspects", value: 67, target: "> 50%", status: true },
                ].map((m) => (
                  <div key={m.label} className="rounded-xl border p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">{m.label}</p>
                      {m.status ? (
                        <CheckCircle className="h-4 w-4 text-cyber-green" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-rht-orange" />
                      )}
                    </div>
                    <p className="mt-1 text-2xl font-bold">{m.value}%</p>
                    <Progress value={m.value} className="mt-2 h-2" />
                    <p className="mt-1 text-[10px] text-muted-foreground">Objectif : {m.target}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </div>
  );
}
