"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Building2,
  Search,
  Plus,
  Globe,
  Users,
  Target,
  GraduationCap,
  Mail,
  Calendar,
} from "lucide-react";
import { organizations } from "@/lib/mock-data";
import { FadeIn, StaggerContainer, StaggerItem, GlowCard } from "@/components/motion";
import { motion } from "framer-motion";

function formatCFA(amount: number) {
  return new Intl.NumberFormat("fr-FR").format(amount) + " F";
}

const statusLabel = { active: "Actif", trial: "Essai", expired: "Expiré" } as const;
const statusStyle = {
  active: "bg-cyber-green/10 text-cyber-green",
  trial: "bg-rht-orange/10 text-rht-orange",
  expired: "bg-cyber-red/10 text-cyber-red",
} as const;

const planStyle = {
  Starter: "bg-cyber-green/10 text-cyber-green",
  Business: "bg-rht-orange/10 text-rht-orange",
  Enterprise: "bg-rht-violet/10 text-rht-violet-light",
} as const;

export default function OrganizationsPage() {
  const [search, setSearch] = useState("");
  const [filterPlan, setFilterPlan] = useState<string>("all");

  const filtered = organizations.filter((org) => {
    const matchSearch =
      org.name.toLowerCase().includes(search.toLowerCase()) ||
      org.country.toLowerCase().includes(search.toLowerCase()) ||
      org.sector.toLowerCase().includes(search.toLowerCase());
    const matchPlan = filterPlan === "all" || org.plan === filterPlan;
    return matchSearch && matchPlan;
  });

  return (
    <div>
      <Header title="Organisations" />
      <div className="space-y-6 p-6">
        <FadeIn>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center gap-3">
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une organisation..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-1.5">
                {["all", "Starter", "Business", "Enterprise"].map((plan) => (
                  <Button
                    key={plan}
                    variant={filterPlan === plan ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterPlan(plan)}
                    className={filterPlan === plan ? "bg-rht-violet text-white hover:bg-rht-violet/90" : ""}
                  >
                    {plan === "all" ? "Tous" : plan}
                  </Button>
                ))}
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Button className="bg-gradient-to-r from-rht-orange to-rht-orange-light text-white hover:opacity-90">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter
              </Button>
            </motion.div>
          </div>
        </FadeIn>

        <StaggerContainer className="grid gap-3 sm:grid-cols-3">
          {[
            { label: "Total organisations", value: organizations.length },
            { label: "MRR total", value: formatCFA(organizations.reduce((a, o) => a + o.mrr, 0)), highlight: true },
            { label: "Employés couverts", value: organizations.reduce((a, o) => a + o.employees, 0) },
          ].map((s) => (
            <StaggerItem key={s.label}>
              <Card>
                <CardContent className="p-4">
                  <p className={`text-2xl font-bold ${s.highlight ? "text-rht-orange" : ""}`}>{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <div className="space-y-4">
          {filtered.map((org, i) => (
            <motion.div
              key={org.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <GlowCard>
                <Card className="transition-all duration-300 hover:border-rht-orange/20">
                  <CardContent className="p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rht-violet/10 to-rht-orange/10">
                          <Building2 className="h-6 w-6 text-rht-violet-light" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{org.name}</h3>
                            <Badge className={`border-0 text-[10px] ${statusStyle[org.status]}`}>
                              {statusLabel[org.status]}
                            </Badge>
                            <Badge className={`border-0 text-[10px] ${planStyle[org.plan]}`}>
                              {org.plan}
                            </Badge>
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Globe className="h-3 w-3" />
                              {org.city}, {org.country}
                            </span>
                            <span>{org.sector}</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Inscrit le {org.joinedDate}
                            </span>
                          </div>
                          <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {org.contactName} — {org.contactEmail}
                          </div>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2 text-right">
                        {org.mrr > 0 && (
                          <span className="text-lg font-bold text-rht-orange">{formatCFA(org.mrr)}<span className="text-xs font-normal text-muted-foreground">/mois</span></span>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-4">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-semibold">{org.employees}<span className="text-xs font-normal text-muted-foreground">/{org.maxEmployees}</span></p>
                          <p className="text-[10px] text-muted-foreground">Employés</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-semibold">{org.trainingsCompleted}</p>
                          <p className="text-[10px] text-muted-foreground">Formations</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-semibold">{org.campaignsRun}</p>
                          <p className="text-[10px] text-muted-foreground">Campagnes</p>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Score de risque</span>
                          <span className={`font-semibold ${
                            org.riskScore < 35 ? "text-cyber-green" : org.riskScore < 55 ? "text-rht-orange" : "text-cyber-red"
                          }`}>{org.riskScore}%</span>
                        </div>
                        <Progress value={org.riskScore} className="mt-1 h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </GlowCard>
            </motion.div>
          ))}

          {filtered.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              <Building2 className="mx-auto mb-3 h-10 w-10 opacity-20" />
              <p>Aucune organisation trouvée</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
