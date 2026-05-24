"use client";

import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
import { useApi } from "@/hooks/use-api";

interface ComplianceFramework {
  id: string;
  name: string;
  overallScore: number;
  status: string;
  categories: any;
  lastAuditDate: string | null;
  nextAuditDate: string | null;
}

interface RiskEntry {
  id: string;
  title: string;
  description: string | null;
  category: string;
  likelihood: number;
  impact: number;
  riskScore: number;
  status: string;
  mitigation: string | null;
  owner: string | null;
}

interface GrcResponse {
  frameworks: ComplianceFramework[];
  risks: RiskEntry[];
  maturityScore: number;
  gapAnalysis: {
    compliant: number;
    partial: number;
    missing: number;
    total: number;
  };
}

const statusLabelsFr: Record<string, string> = {
  open: "Ouvert",
  mitigating: "En cours",
  accepted: "Accepté",
  closed: "Fermé",
};

const statusLabelsEn: Record<string, string> = {
  open: "Open",
  mitigating: "Mitigating",
  accepted: "Accepted",
  closed: "Closed",
};

export default function GRCPage() {
  const { t, locale } = useTranslation();
  const statusLabels = locale === "en" ? statusLabelsEn : statusLabelsFr;
  const { data, loading } = useApi<GrcResponse>("/api/grc");

  if (loading) {
    return (
      <div>
        <Header title={t("grc.title")} />
        <div className="space-y-6 p-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card><CardContent className="p-6"><Skeleton className="h-40 w-full" /></CardContent></Card>
            <Card><CardContent className="p-6"><Skeleton className="h-40 w-full" /></CardContent></Card>
          </div>
          <Card><CardContent className="p-6"><Skeleton className="h-[200px] w-full" /></CardContent></Card>
        </div>
      </div>
    );
  }

  const frameworks = data?.frameworks || [];
  const risks = data?.risks || [];
  const maturityScore = data?.maturityScore || 0;
  const gap = data?.gapAnalysis || { compliant: 0, partial: 0, missing: 0, total: 0 };

  const maturityData = [{ name: "score", value: maturityScore, fill: "#9c1e99" }];
  const gapData = [
    { name: "compliant", value: gap.compliant, color: "#16a34a" },
    { name: "partial", value: gap.partial, color: "#fa990e" },
    { name: "missing", value: gap.missing, color: "#ef4444" },
  ].filter((d) => d.value > 0);

  const gapLabels: Record<string, string> = {
    compliant: t("status.compliant"),
    partial: t("status.partial"),
    missing: t("status.missing"),
  };

  return (
    <div>
      <Header title={t("grc.title")} />
      <div className="space-y-6 p-6">
        {/* Score + Gap */}
        <FadeIn>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("grc.maturityScore")}</CardTitle>
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
                  <Badge className={`mt-2 ${maturityScore >= 70 ? "bg-cyber-green/10 text-cyber-green" : maturityScore >= 40 ? "bg-rht-orange/10 text-rht-orange" : "bg-cyber-red/10 text-cyber-red"}`}>
                    {maturityScore >= 70 ? t("status.good") : maturityScore >= 40 ? t("status.intermediate") : t("status.critical")}
                  </Badge>
                  <p className="mt-2 text-xs text-muted-foreground">{t("grc.level")}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("grc.gapAnalysis")}</CardTitle>
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
                  <p className="mt-2 text-xs text-muted-foreground">{gap.total} {t("grc.controlsAnalyzed")}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </FadeIn>

        {/* Frameworks */}
        {frameworks.length > 0 && (
          <FadeIn delay={0.1}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("grc.complianceFrameworks")}</CardTitle>
              </CardHeader>
              <CardContent>
                <StaggerContainer className="grid gap-4 sm:grid-cols-2">
                  {frameworks.map((fw) => (
                    <StaggerItem key={fw.id}>
                      <div className="rounded-xl border p-4 transition-colors hover:bg-accent/30">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-sm">{fw.name}</h4>
                          <span className={`text-lg font-bold ${fw.overallScore >= 60 ? "text-cyber-green" : fw.overallScore >= 40 ? "text-rht-orange" : "text-cyber-red"}`}>
                            {fw.overallScore}%
                          </span>
                        </div>
                        <Badge variant="outline" className="mt-1 text-[10px]">{fw.status}</Badge>
                        <Progress value={fw.overallScore} className="mt-3 h-1.5" />
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </CardContent>
            </Card>
          </FadeIn>
        )}

        {/* Registre des risques */}
        {risks.length > 0 && (
          <FadeIn delay={0.15}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <AlertTriangle className="h-4 w-4 text-rht-orange" />
                  {t("grc.riskRegister")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-xs text-muted-foreground">
                        <th className="pb-3 pr-4">{t("grc.risk")}</th>
                        <th className="pb-3 pr-4">{t("grc.impact")}</th>
                        <th className="pb-3 pr-4">{t("grc.probability")}</th>
                        <th className="pb-3 pr-4">{t("common.score")}</th>
                        <th className="pb-3 pr-4">{t("grc.mitigation")}</th>
                        <th className="pb-3">{t("common.status")}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {risks.map((r) => (
                        <tr key={r.id} className="hover:bg-accent/30">
                          <td className="py-3 pr-4 font-medium">{r.title}</td>
                          <td className="py-3 pr-4 text-center">{r.impact}/5</td>
                          <td className="py-3 pr-4 text-center">{r.likelihood}/5</td>
                          <td className="py-3 pr-4">
                            <Badge className={`${r.riskScore >= 16 ? "bg-cyber-red/10 text-cyber-red" : r.riskScore >= 9 ? "bg-rht-orange/10 text-rht-orange" : "bg-cyber-green/10 text-cyber-green"}`}>
                              {r.riskScore}
                            </Badge>
                          </td>
                          <td className="py-3 pr-4 text-xs text-muted-foreground max-w-[200px]">{r.mitigation || "—"}</td>
                          <td className="py-3">
                            <Badge variant="outline" className="text-[10px]">{statusLabels[r.status] || r.status}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        )}

        {/* Actions rapides */}
        <FadeIn delay={0.2}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("grc.quickActions")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { icon: Download, label: t("grc.exportPdf"), color: "text-rht-violet-light" },
                  { icon: FileText, label: t("grc.generateAudit"), color: "text-cyber-green" },
                  { icon: TrendingUp, label: t("grc.sectorBenchmark"), color: "text-rht-orange" },
                  { icon: Search, label: t("grc.launchFullAudit"), color: "text-cyber-red" },
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
