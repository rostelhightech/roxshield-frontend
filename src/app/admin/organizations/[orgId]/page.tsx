"use client";

import { use } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Building2,
  Users,
  Target,
  GraduationCap,
  Globe,
  Mail,
  Calendar,
  ArrowLeft,
  DollarSign,
  Shield,
  AlertTriangle,
  CheckCircle,
  Phone,
} from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem, GlowCard } from "@/components/motion";
import { motion } from "framer-motion";
import { useApi } from "@/hooks/use-api";

interface OrgDetail {
  id: string;
  name: string;
  plan: string;
  sector: string;
  country: string;
  city: string;
  status: string;
  employees: number;
  maxEmployees: number;
  campaignsRun: number;
  trainingsCompleted: number;
  riskScore: number;
  mrr: number;
  joinedDate: string;
  contactName: string;
  contactEmail: string;
  recentEmployees: {
    id: string;
    name: string;
    email: string;
    department: string;
    riskScore: number;
    role: string;
  }[];
}

interface OrgsResponse {
  organizations: OrgDetail[];
}

function formatCFA(amount: number) {
  return new Intl.NumberFormat("fr-FR").format(amount) + " F";
}

const statusLabel: Record<string, string> = { active: "Actif", trial: "Essai", expired: "Expiré" };
const statusStyle: Record<string, string> = {
  active: "bg-cyber-green/10 text-cyber-green",
  trial: "bg-rht-orange/10 text-rht-orange",
  expired: "bg-cyber-red/10 text-cyber-red",
};

export default function OrganizationDetailPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = use(params);
  const { data, loading } = useApi<OrgsResponse>("/api/admin/organizations");

  if (loading || !data) {
    return (
      <div>
        <Header title="Chargement..." />
        <div className="space-y-6 p-6">
          <Skeleton className="h-10 w-48" />
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

  const org = data.organizations.find((o) => o.id === orgId);

  if (!org) {
    return (
      <div>
        <Header title="Organisation introuvable" />
        <div className="p-6">
          <Link href="/admin/organizations">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const completionRate = org.employees > 0 ? Math.round((org.trainingsCompleted / (org.employees * 6)) * 100) : 0;

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
                  <Badge className={`border-0 text-[10px] ${statusStyle[org.status] || statusStyle.active}`}>
                    {statusLabel[org.status] || "Actif"}
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
                  {org.recentEmployees.length === 0 ? (
                    <p className="py-8 text-center text-sm text-muted-foreground">Aucun employé</p>
                  ) : (
                    org.recentEmployees.map((emp, i) => (
                      <motion.div
                        key={emp.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="flex items-center justify-between rounded-xl border p-3 transition-colors hover:bg-accent"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rht-violet/10 text-xs font-bold text-rht-violet-light">
                            {emp.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
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
                    ))
                  )}
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
                    { icon: Phone, label: "Téléphone", value: "—" },
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
                  { label: "Signalements suspects", value: 0, target: "> 50%", status: false },
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
