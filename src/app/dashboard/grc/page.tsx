"use client";

import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  FileText,
  AlertTriangle,
  Download,
  TrendingUp,
  Search,
} from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion";
import { useTranslation } from "@/lib/i18n";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

const maturityScore = 62;
const maturityData = [{ name: "score", value: maturityScore, fill: "#9c1e99" }];

const gapData = [
  { name: "compliant", value: 12, color: "#16a34a" },
  { name: "partial", value: 5, color: "#fa990e" },
  { name: "missing", value: 3, color: "#ef4444" },
];

export default function GRCPage() {
  const { t } = useTranslation();

  const frameworks = [
    { name: t("grc.framework.rgpd" as any), scope: t("grc.framework.rgpd.desc" as any), score: 55, articles: 12 },
    { name: t("grc.framework.iso" as any), scope: t("grc.framework.iso.desc" as any), score: 48, articles: 114 },
    { name: t("grc.framework.localLaw" as any), scope: t("grc.framework.localLaw.desc" as any), score: 70, articles: 8 },
    { name: t("grc.framework.pci" as any), scope: t("grc.framework.pci.desc" as any), score: 35, articles: 12 },
  ];

  const riskRegister = [
    { risk: t("grc.risk.phishing" as any), impact: 5, probability: 4, score: 20, mitigation: t("grc.risk.phishing.mitigation" as any), status: t("grc.riskStatus.inProgress" as any) },
    { risk: t("grc.risk.whatsapp" as any), impact: 4, probability: 5, score: 20, mitigation: t("grc.risk.whatsapp.mitigation" as any), status: t("grc.riskStatus.open" as any) },
    { risk: t("grc.risk.passwords" as any), impact: 4, probability: 4, score: 16, mitigation: t("grc.risk.passwords.mitigation" as any), status: t("grc.riskStatus.inProgress" as any) },
    { risk: t("grc.risk.rgpd" as any), impact: 5, probability: 3, score: 15, mitigation: t("grc.risk.rgpd.mitigation" as any), status: t("grc.riskStatus.open" as any) },
    { risk: t("grc.risk.ransomware" as any), impact: 5, probability: 3, score: 15, mitigation: t("grc.risk.ransomware.mitigation" as any), status: t("grc.riskStatus.inProgress" as any) },
  ];

  const gapLabels: Record<string, string> = {
    compliant: t("status.compliant" as any),
    partial: t("status.partial" as any),
    missing: t("status.missing" as any),
  };

  return (
    <div>
      <Header title={t("grc.title" as any)} />
      <div className="space-y-6 p-6">
        {/* Score + Gap */}
        <FadeIn>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("grc.maturityScore" as any)}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-6">
                <div className="h-40 w-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      cx="50%" cy="50%" innerRadius="70%" outerRadius="100%"
                      barSize={14} data={maturityData} startAngle={210} endAngle={-30}
                    >
                      <RadialBar background dataKey="value" cornerRadius={10} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <p className="text-4xl font-bold text-rht-violet-light">{maturityScore}<span className="text-lg text-muted-foreground">/100</span></p>
                  <Badge className="mt-2 bg-rht-orange/10 text-rht-orange">{t("status.intermediate" as any)}</Badge>
                  <p className="mt-2 text-xs text-muted-foreground">{t("grc.level" as any)}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("grc.gapAnalysis" as any)}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-6">
                <div className="h-40 w-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={gapData} cx="50%" cy="50%" innerRadius={35} outerRadius={65} dataKey="value" paddingAngle={3}>
                        {gapData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2">
                  {gapData.map((d) => (
                    <div key={d.name} className="flex items-center gap-2 text-sm">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: d.color }} />
                      <span>{gapLabels[d.name]}</span>
                      <span className="font-bold">{d.value}</span>
                    </div>
                  ))}
                  <p className="mt-2 text-xs text-muted-foreground">20 {t("grc.controlsAnalyzed" as any)}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </FadeIn>

        {/* Frameworks */}
        <FadeIn delay={0.1}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("grc.complianceFrameworks" as any)}</CardTitle>
            </CardHeader>
            <CardContent>
              <StaggerContainer className="grid gap-4 sm:grid-cols-2">
                {frameworks.map((fw) => (
                  <StaggerItem key={fw.name}>
                    <div className="rounded-xl border p-4 transition-colors hover:bg-accent/30">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm">{fw.name}</h4>
                        <span className={`text-lg font-bold ${fw.score >= 60 ? "text-cyber-green" : fw.score >= 40 ? "text-rht-orange" : "text-cyber-red"}`}>
                          {fw.score}%
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{fw.scope}</p>
                      <Progress value={fw.score} className="mt-3 h-1.5" />
                      <p className="mt-2 text-[11px] text-muted-foreground">{fw.articles} {t("grc.articles" as any)}</p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </CardContent>
          </Card>
        </FadeIn>

        {/* Registre des risques */}
        <FadeIn delay={0.15}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="h-4 w-4 text-rht-orange" />
                {t("grc.riskRegister" as any)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs text-muted-foreground">
                      <th className="pb-3 pr-4">{t("grc.risk" as any)}</th>
                      <th className="pb-3 pr-4">{t("grc.impact" as any)}</th>
                      <th className="pb-3 pr-4">{t("grc.probability" as any)}</th>
                      <th className="pb-3 pr-4">{t("common.score" as any)}</th>
                      <th className="pb-3 pr-4">{t("grc.mitigation" as any)}</th>
                      <th className="pb-3">{t("common.status" as any)}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {riskRegister.map((r) => (
                      <tr key={r.risk} className="hover:bg-accent/30">
                        <td className="py-3 pr-4 font-medium">{r.risk}</td>
                        <td className="py-3 pr-4 text-center">{r.impact}/5</td>
                        <td className="py-3 pr-4 text-center">{r.probability}/5</td>
                        <td className="py-3 pr-4">
                          <Badge className={`${r.score >= 16 ? "bg-cyber-red/10 text-cyber-red" : "bg-rht-orange/10 text-rht-orange"}`}>
                            {r.score}
                          </Badge>
                        </td>
                        <td className="py-3 pr-4 text-xs text-muted-foreground max-w-[200px]">{r.mitigation}</td>
                        <td className="py-3">
                          <Badge variant="outline" className="text-[10px]">{r.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        {/* Actions rapides */}
        <FadeIn delay={0.2}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("grc.quickActions" as any)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { icon: Download, label: t("grc.exportPdf" as any), color: "text-rht-violet-light" },
                  { icon: FileText, label: t("grc.generateAudit" as any), color: "text-cyber-green" },
                  { icon: TrendingUp, label: t("grc.sectorBenchmark" as any), color: "text-rht-orange" },
                  { icon: Search, label: t("grc.launchFullAudit" as any), color: "text-cyber-red" },
                ].map((action) => (
                  <Button key={action.label} variant="outline" className="h-auto flex-col gap-2 p-4">
                    <action.icon className={`h-5 w-5 ${action.color}`} />
                    <span className="text-xs text-center">{action.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </div>
  );
}
