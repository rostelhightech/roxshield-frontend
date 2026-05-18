"use client";

import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
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

const encryptionScore = 48;

export default function EncryptionPage() {
  const { t } = useTranslation();

  const statusStyle = {
    critical: { bg: "bg-cyber-red/10", text: "text-cyber-red", label: t("status.critical" as any) },
    warning: { bg: "bg-rht-orange/10", text: "text-rht-orange", label: t("status.warning" as any) },
    good: { bg: "bg-cyber-green/10", text: "text-cyber-green", label: t("status.good" as any) },
  };

  const auditAreas = [
    {
      area: t("encryption.zone.emails" as any),
      icon: Mail,
      score: 35,
      status: "critical" as const,
      findings: [
        { text: t("encryption.finding.tlsActive" as any), ok: true },
        { text: t("encryption.finding.e2e" as any), ok: false },
        { text: t("encryption.finding.pjPolicy" as any), ok: false },
        { text: t("encryption.finding.signatures" as any), ok: false },
      ],
    },
    {
      area: t("encryption.zone.files" as any),
      icon: FileText,
      score: 45,
      status: "warning" as const,
      findings: [
        { text: t("encryption.finding.hrDocs" as any), ok: true },
        { text: t("encryption.finding.financeDocs" as any), ok: true },
        { text: t("encryption.finding.usbPolicy" as any), ok: false },
        { text: t("encryption.finding.csvExport" as any), ok: false },
      ],
    },
    {
      area: t("encryption.zone.disks" as any),
      icon: HardDrive,
      score: 62,
      status: "warning" as const,
      findings: [
        { text: t("encryption.finding.bitlocker" as any), ok: true },
        { text: t("encryption.finding.serverEncryption" as any), ok: true },
        { text: t("encryption.finding.byodPolicy" as any), ok: false },
        { text: t("encryption.finding.diskInventory" as any), ok: true },
      ],
    },
    {
      area: t("encryption.zone.cloud" as any),
      icon: Cloud,
      score: 70,
      status: "good" as const,
      findings: [
        { text: t("encryption.finding.https" as any), ok: true },
        { text: t("encryption.finding.tls13" as any), ok: true },
        { text: t("encryption.finding.vpn" as any), ok: true },
        { text: t("encryption.finding.cloudBackup" as any), ok: false },
      ],
    },
    {
      area: t("encryption.zone.wifi" as any),
      icon: Wifi,
      score: 55,
      status: "warning" as const,
      findings: [
        { text: t("encryption.finding.wpa3" as any), ok: true },
        { text: t("encryption.finding.vlan" as any), ok: true },
        { text: t("encryption.finding.guestWifi" as any), ok: false },
        { text: t("encryption.finding.rogueAp" as any), ok: false },
      ],
    },
  ];

  const trainingModules = [
    { title: t("encryption.training.understand" as any), duration: "12 min", level: t("status.beginner" as any), completion: 34 },
    { title: t("encryption.training.smime" as any), duration: "18 min", level: t("status.intermediate" as any), completion: 12 },
    { title: t("encryption.training.protectFiles" as any), duration: "10 min", level: t("status.beginner" as any), completion: 45 },
    { title: t("encryption.training.vpn" as any), duration: "15 min", level: t("status.beginner" as any), completion: 28 },
    { title: t("encryption.training.e2e" as any), duration: "20 min", level: t("status.advanced" as any), completion: 8 },
  ];

  return (
    <div>
      <Header title={t("encryption.title" as any)} />
      <div className="space-y-6 p-6">
        {/* Score global */}
        <FadeIn>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="sm:col-span-2 lg:col-span-1">
              <CardContent className="flex flex-col items-center p-6">
                <Lock className="mb-2 h-8 w-8 text-rht-orange" />
                <p className="text-3xl font-bold text-rht-orange">{encryptionScore}/100</p>
                <p className="mt-1 text-xs text-muted-foreground">{t("encryption.maturityScore" as any)}</p>
                <Badge className="mt-2 bg-rht-orange/10 text-rht-orange">{t("status.warning" as any)}</Badge>
              </CardContent>
            </Card>
            {[
              { label: t("encryption.auditedZones" as any), value: "5/5", color: "text-cyber-green" },
              { label: t("encryption.compliantPoints" as any), value: "12/20", color: "text-rht-orange" },
              { label: t("encryption.urgentActions" as any), value: "8", color: "text-cyber-red" },
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
              <CardTitle className="text-base">{t("encryption.auditByZone" as any)}</CardTitle>
            </CardHeader>
            <CardContent>
              <StaggerContainer className="space-y-4">
                {auditAreas.map((area) => {
                  const Icon = area.icon;
                  const style = statusStyle[area.status];
                  return (
                    <StaggerItem key={area.area}>
                      <div className="rounded-xl border p-4 transition-colors hover:bg-accent/30">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${style.bg}`}>
                              <Icon className={`h-4 w-4 ${style.text}`} />
                            </div>
                            <div>
                              <h4 className="font-semibold text-sm">{area.area}</h4>
                              <Badge className={`text-[10px] ${style.bg} ${style.text}`}>
                                {style.label}
                              </Badge>
                            </div>
                          </div>
                          <span className={`text-xl font-bold ${style.text}`}>{area.score}%</span>
                        </div>
                        <Progress value={area.score} className="mt-3 h-1.5" />
                        <div className="mt-3 grid gap-1.5 sm:grid-cols-2">
                          {area.findings.map((f, i) => (
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
                      </div>
                    </StaggerItem>
                  );
                })}
              </StaggerContainer>
            </CardContent>
          </Card>
        </FadeIn>

        {/* Formations chiffrement */}
        <FadeIn delay={0.2}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="h-4 w-4 text-rht-violet-light" />
                {t("encryption.trainings" as any)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {trainingModules.map((mod) => (
                  <div key={mod.title} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">{mod.title}</h4>
                      <div className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
                        <span>{mod.duration}</span>
                        <Badge variant="outline" className="text-[10px]">{mod.level}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-bold">{mod.completion}%</p>
                        <p className="text-[10px] text-muted-foreground">{t("common.completion" as any)}</p>
                      </div>
                      <Button size="sm" variant="outline" className="text-xs">
                        {t("common.launch" as any)}
                      </Button>
                    </div>
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
