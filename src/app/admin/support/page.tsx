"use client";

import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  HeadphonesIcon,
  Clock,
  CheckCircle,
  AlertTriangle,
  Building2,
  MessageSquare,
} from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem, GlowCard } from "@/components/motion";
import { motion } from "framer-motion";

// Données de support (fonctionnalité à venir — pas de modèle DB)
const supportTickets = [
  { id: "TK-001", subject: "Impossible de lancer une campagne", org: "TechDakar SARL", date: "22 mai 2025", priority: "high", status: "open" },
  { id: "TK-002", subject: "Export PDF ne fonctionne pas", org: "SenFinance SA", date: "21 mai 2025", priority: "medium", status: "in-progress" },
  { id: "TK-003", subject: "Demande d'ajout de module personnalisé", org: "EduCampus Thiès", date: "20 mai 2025", priority: "low", status: "resolved" },
  { id: "TK-004", subject: "Erreur lors de l'import CSV employés", org: "TechDakar SARL", date: "19 mai 2025", priority: "medium", status: "open" },
  { id: "TK-005", subject: "Question sur la facturation Enterprise", org: "SenFinance SA", date: "18 mai 2025", priority: "low", status: "resolved" },
];

const priorityStyle = {
  low: { label: "Basse", style: "bg-cyber-green/10 text-cyber-green" },
  medium: { label: "Moyenne", style: "bg-rht-orange/10 text-rht-orange" },
  high: { label: "Haute", style: "bg-cyber-red/10 text-cyber-red" },
} as const;

const statusStyle = {
  open: { label: "Ouvert", style: "bg-rht-violet/10 text-rht-violet-light", icon: Clock },
  "in-progress": { label: "En cours", style: "bg-rht-orange/10 text-rht-orange", icon: AlertTriangle },
  resolved: { label: "Résolu", style: "bg-cyber-green/10 text-cyber-green", icon: CheckCircle },
} as const;

export default function SupportPage() {
  const open = supportTickets.filter((t) => t.status === "open").length;
  const inProgress = supportTickets.filter((t) => t.status === "in-progress").length;
  const resolved = supportTickets.filter((t) => t.status === "resolved").length;

  return (
    <div>
      <Header title="Support" />
      <div className="space-y-6 p-6">
        <FadeIn>
          <p className="text-sm text-muted-foreground">
            Gérez les demandes de support des organisations clientes
          </p>
        </FadeIn>

        <StaggerContainer className="grid gap-4 sm:grid-cols-3">
          {[
            { icon: Clock, label: "Tickets ouverts", value: open, bg: "bg-rht-violet/10", text: "text-rht-violet" },
            { icon: AlertTriangle, label: "En cours", value: inProgress, bg: "bg-rht-orange/10", text: "text-rht-orange" },
            { icon: CheckCircle, label: "Résolus", value: resolved, bg: "bg-cyber-green/10", text: "text-cyber-green" },
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
                  </CardContent>
                </Card>
              </GlowCard>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeIn delay={0.1}>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HeadphonesIcon className="h-4 w-4 text-rht-orange" />
                  <CardTitle className="text-sm font-semibold">Tous les tickets</CardTitle>
                </div>
                <Button size="sm" className="bg-gradient-to-r from-rht-orange to-rht-orange-light text-white hover:opacity-90">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Nouveau ticket
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {supportTickets.map((ticket, i) => {
                  const status = statusStyle[ticket.status as keyof typeof statusStyle];
                  const priority = priorityStyle[ticket.priority as keyof typeof priorityStyle];
                  const StatusIcon = status.icon;

                  return (
                    <motion.div
                      key={ticket.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="rounded-xl border p-4 transition-colors hover:bg-accent"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${status.style}`}>
                            <StatusIcon className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono text-muted-foreground">{ticket.id}</span>
                              <h3 className="text-sm font-medium">{ticket.subject}</h3>
                            </div>
                            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                              <Building2 className="h-3 w-3" />
                              <span>{ticket.org}</span>
                              <span>·</span>
                              <span>{ticket.date}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge className={`border-0 text-[10px] ${priority.style}`}>
                            {priority.label}
                          </Badge>
                          <Badge className={`border-0 text-[10px] ${status.style}`}>
                            {status.label}
                          </Badge>
                          <Button variant="ghost" size="sm" className="text-xs">
                            Voir
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delay={0.2}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Temps de réponse moyen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Première réponse", value: "2h 15min", target: "< 4h" },
                  { label: "Résolution", value: "18h 30min", target: "< 24h" },
                  { label: "Satisfaction client", value: "4.6/5", target: "> 4.0" },
                ].map((m) => (
                  <div key={m.label} className="rounded-xl border p-4 text-center">
                    <p className="text-2xl font-bold text-rht-orange">{m.value}</p>
                    <p className="text-xs font-medium">{m.label}</p>
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
