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
import { useTranslation } from "@/lib/i18n";

// Données de support (fonctionnalité à venir — pas de modèle DB)
const supportTicketsMeta = [
  { id: "TK-001", subjectKey: "support.ticket1" as const, org: "TechDakar SARL", date: "2025-05-22", priority: "high", status: "open" },
  { id: "TK-002", subjectKey: "support.ticket2" as const, org: "SenFinance SA", date: "2025-05-21", priority: "medium", status: "in-progress" },
  { id: "TK-003", subjectKey: "support.ticket3" as const, org: "EduCampus Thiès", date: "2025-05-20", priority: "low", status: "resolved" },
  { id: "TK-004", subjectKey: "support.ticket4" as const, org: "TechDakar SARL", date: "2025-05-19", priority: "medium", status: "open" },
  { id: "TK-005", subjectKey: "support.ticket5" as const, org: "SenFinance SA", date: "2025-05-18", priority: "low", status: "resolved" },
];

const priorityKeys = {
  low: "support.priorityLow" as const,
  medium: "support.priorityMedium" as const,
  high: "support.priorityHigh" as const,
};

const priorityStyleMap = {
  low: "bg-cyber-green/10 text-cyber-green",
  medium: "bg-rht-orange/10 text-rht-orange",
  high: "bg-cyber-red/10 text-cyber-red",
};

const statusKeys = {
  open: "support.statusOpen" as const,
  "in-progress": "support.statusInProgress" as const,
  resolved: "support.statusResolved" as const,
};

const statusStyleMap = {
  open: { style: "bg-rht-violet/10 text-rht-violet-light", icon: Clock },
  "in-progress": { style: "bg-rht-orange/10 text-rht-orange", icon: AlertTriangle },
  resolved: { style: "bg-cyber-green/10 text-cyber-green", icon: CheckCircle },
};

export default function SupportPage() {
  const { t, locale } = useTranslation();

  const supportTickets = supportTicketsMeta.map((tk) => ({
    ...tk,
    subject: t(tk.subjectKey),
    dateDisplay: new Date(tk.date).toLocaleDateString(locale === "en" ? "en-US" : "fr-FR", { day: "numeric", month: "short", year: "numeric" }),
  }));

  const open = supportTickets.filter((tk) => tk.status === "open").length;
  const inProgress = supportTickets.filter((tk) => tk.status === "in-progress").length;
  const resolved = supportTickets.filter((tk) => tk.status === "resolved").length;

  return (
    <div>
      <Header title={t("support.title")} />
      <div className="space-y-6 p-6">
        <FadeIn>
          <p className="text-sm text-muted-foreground">
            {t("support.description")}
          </p>
        </FadeIn>

        <StaggerContainer className="grid gap-4 sm:grid-cols-3">
          {[
            { icon: Clock, label: t("support.openTickets"), value: open, bg: "bg-rht-violet/10", text: "text-rht-violet" },
            { icon: AlertTriangle, label: t("support.inProgress"), value: inProgress, bg: "bg-rht-orange/10", text: "text-rht-orange" },
            { icon: CheckCircle, label: t("support.resolved"), value: resolved, bg: "bg-cyber-green/10", text: "text-cyber-green" },
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
                  <CardTitle className="text-sm font-semibold">{t("support.allTickets")}</CardTitle>
                </div>
                <Button size="sm" className="bg-gradient-to-r from-rht-orange to-rht-orange-light text-white hover:opacity-90">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  {t("support.newTicket")}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {supportTickets.map((ticket, i) => {
                  const statusInfo = statusStyleMap[ticket.status as keyof typeof statusStyleMap];
                  const statusKey = statusKeys[ticket.status as keyof typeof statusKeys];
                  const priorityKey = priorityKeys[ticket.priority as keyof typeof priorityKeys];
                  const priorityClass = priorityStyleMap[ticket.priority as keyof typeof priorityStyleMap];
                  const StatusIcon = statusInfo.icon;

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
                          <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${statusInfo.style}`}>
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
                              <span>{ticket.dateDisplay}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge className={`border-0 text-[10px] ${priorityClass}`}>
                            {t(priorityKey)}
                          </Badge>
                          <Badge className={`border-0 text-[10px] ${statusInfo.style}`}>
                            {t(statusKey)}
                          </Badge>
                          <Button variant="ghost" size="sm" className="text-xs">
                            {t("support.view")}
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
              <CardTitle className="text-sm font-semibold">{t("support.avgResponseTime")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { label: t("support.firstResponse"), value: "2h 15min", target: "< 4h" },
                  { label: t("support.resolution"), value: "18h 30min", target: "< 24h" },
                  { label: t("support.clientSatisfaction"), value: "4.6/5", target: "> 4.0" },
                ].map((m) => (
                  <div key={m.label} className="rounded-xl border p-4 text-center">
                    <p className="text-2xl font-bold text-rht-orange">{m.value}</p>
                    <p className="text-xs font-medium">{m.label}</p>
                    <p className="mt-1 text-[10px] text-muted-foreground">{t("admin.goal")} : {m.target}</p>
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
