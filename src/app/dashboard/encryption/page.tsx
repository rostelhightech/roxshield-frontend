"use client";

import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Lock,
  CheckCircle,
  XCircle,
  HardDrive,
  Mail,
  FileText,
  Cloud,
  Wifi,
  Shield,
} from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion";
import { useTranslation } from "@/lib/i18n";
import { useApi } from "@/hooks/use-api";
import type { LucideIcon } from "lucide-react";

interface EncryptionZone {
  id: string;
  zone: string;
  score: number;
  status: string;
  findings: any;
  recommendations: any;
  auditedAt: string;
}

interface EncryptionResponse {
  zones: EncryptionZone[];
  stats: {
    overallScore: number;
    totalZones: number;
    compliantCount: number;
    urgentActions: number;
    totalFindings: number;
  };
}

const zoneIcons: Record<string, LucideIcon> = {
  email: Mail,
  storage: FileText,
  endpoints: HardDrive,
  cloud: Cloud,
  transit: Wifi,
};

const zoneLabelsFr: Record<string, string> = {
  email: "Emails",
  storage: "Stockage",
  endpoints: "Endpoints",
  cloud: "Cloud",
  transit: "Transit",
};

const zoneLabelsEn: Record<string, string> = {
  email: "Emails",
  storage: "Storage",
  endpoints: "Endpoints",
  cloud: "Cloud",
  transit: "Transit",
};

export default function EncryptionPage() {
  const { t, locale } = useTranslation();
  const zoneLabels = locale === "en" ? zoneLabelsEn : zoneLabelsFr;
  const { data, loading } = useApi<EncryptionResponse>("/api/encryption");

  if (loading) {
    return (
      <div>
        <Header title={t("encryption.title")} />
        <div className="space-y-6 p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}><CardContent className="p-4"><Skeleton className="h-16 w-full" /></CardContent></Card>
            ))}
          </div>
          <Card><CardContent className="p-6"><Skeleton className="h-[400px] w-full" /></CardContent></Card>
        </div>
      </div>
    );
  }

  const zones = data?.zones || [];
  const stats = data?.stats || { overallScore: 0, totalZones: 0, compliantCount: 0, urgentActions: 0, totalFindings: 0 };

  const statusStyle: Record<string, { bg: string; text: string; label: string }> = {
    non_compliant: { bg: "bg-cyber-red/10", text: "text-cyber-red", label: t("status.critical") },
    warning: { bg: "bg-rht-orange/10", text: "text-rht-orange", label: t("status.warning") },
    compliant: { bg: "bg-cyber-green/10", text: "text-cyber-green", label: t("status.good") },
  };

  return (
    <div>
      <Header title={t("encryption.title")} />
      <div className="space-y-6 p-6">
        {/* Score global */}
        <FadeIn>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="sm:col-span-2 lg:col-span-1">
              <CardContent className="flex flex-col items-center p-6">
                <Lock className={`mb-2 h-8 w-8 ${stats.overallScore >= 70 ? "text-cyber-green" : stats.overallScore >= 50 ? "text-rht-orange" : "text-cyber-red"}`} />
                <p className={`text-3xl font-bold ${stats.overallScore >= 70 ? "text-cyber-green" : stats.overallScore >= 50 ? "text-rht-orange" : "text-cyber-red"}`}>
                  {stats.overallScore}/100
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{t("encryption.maturityScore")}</p>
                <Badge className={`mt-2 ${stats.overallScore >= 70 ? "bg-cyber-green/10 text-cyber-green" : stats.overallScore >= 50 ? "bg-rht-orange/10 text-rht-orange" : "bg-cyber-red/10 text-cyber-red"}`}>
                  {stats.overallScore >= 70 ? t("status.good") : stats.overallScore >= 50 ? t("status.warning") : t("status.critical")}
                </Badge>
              </CardContent>
            </Card>
            {[
              { label: t("encryption.auditedZones"), value: `${stats.totalZones}/5`, color: "text-cyber-green" },
              { label: t("encryption.compliantPoints"), value: `${stats.compliantCount}/${stats.totalZones}`, color: stats.compliantCount > 0 ? "text-cyber-green" : "text-rht-orange" },
              { label: t("encryption.urgentActions"), value: String(stats.urgentActions), color: stats.urgentActions > 0 ? "text-cyber-red" : "text-cyber-green" },
            ].map((s) => (
              <Card key={s.label}>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className={`mt-1 text-2xl font-bold ${s.color}`}>{s.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </FadeIn>

        {/* Audit par zone */}
        <FadeIn delay={0.1}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("encryption.auditByZone")}</CardTitle>
            </CardHeader>
            <CardContent>
              {zones.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">{t("encryption.noAudits")}</p>
              ) : (
                <StaggerContainer className="space-y-4">
                  {zones.map((zone) => {
                    const Icon = zoneIcons[zone.zone] || Shield;
                    const style = statusStyle[zone.status] || statusStyle.warning;
                    const findings = Array.isArray(zone.findings) ? zone.findings : [];
                    return (
                      <StaggerItem key={zone.id}>
                        <div className="rounded-xl border p-4 transition-colors hover:bg-accent/30">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${style.bg}`}>
                                <Icon className={`h-4 w-4 ${style.text}`} />
                              </div>
                              <div>
                                <h4 className="font-semibold text-sm">{zoneLabels[zone.zone] || zone.zone}</h4>
                                <Badge className={`text-[10px] ${style.bg} ${style.text}`}>
                                  {style.label}
                                </Badge>
                              </div>
                            </div>
                            <span className={`text-xl font-bold ${style.text}`}>{zone.score}%</span>
                          </div>
                          <Progress value={zone.score} className="mt-3 h-1.5" />
                          {findings.length > 0 && (
                            <div className="mt-3 grid gap-1.5 sm:grid-cols-2">
                              {findings.map((f: any, i: number) => (
                                <div key={i} className="flex items-center gap-2 text-xs">
                                  {f.ok ? (
                                    <CheckCircle className="h-3.5 w-3.5 shrink-0 text-cyber-green" />
                                  ) : (
                                    <XCircle className="h-3.5 w-3.5 shrink-0 text-cyber-red" />
                                  )}
                                  <span className={f.ok ? "text-muted-foreground" : ""}>{f.text}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </StaggerItem>
                    );
                  })}
                </StaggerContainer>
              )}
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </div>
  );
}
