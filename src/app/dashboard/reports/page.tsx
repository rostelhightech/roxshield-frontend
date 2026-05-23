"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileBarChart,
  Download,
  TrendingDown,
  TrendingUp,
  Shield,
  Users,
  AlertTriangle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import {
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
import { toast } from "sonner";
import { useTranslation } from "@/lib/i18n";
import { useApi } from "@/hooks/use-api";
import { generatePdfReport } from "@/lib/export-pdf";

interface DashboardData {
  totalEmployees: number;
  employeesAtRisk: number;
  avgRiskScore: number;
  trainingsCompleted: number;
  totalTrainings: number;
  trainingRate: number;
  activeCampaigns: number;
  deptRisk: { department: string | null; avgRisk: number; count: number }[];
}

interface EmployeesData {
  employees: {
    id: string;
    name: string | null;
    email: string;
    department: string | null;
    riskScore: number;
    trainingsCompleted: number;
    role: string;
  }[];
}

interface CampaignsData {
  campaigns: any[];
  stats: { totalCampaigns: number; totalSent: number; clickRate: number; reportRate: number };
}

interface TrainingData {
  modules: { id: string; title: string; category: string; progress: { progressPercent: number } }[];
  stats: { total: number; completed: number; inProgress: number };
}

function getStatus(riskScore: number) {
  if (riskScore <= 30) return "safe";
  if (riskScore <= 60) return "moderate";
  return "at-risk";
}

export default function ReportsPage() {
  const { t } = useTranslation();
  const { data: dashData, loading: l1 } = useApi<DashboardData>("/api/dashboard");
  const { data: empData, loading: l2 } = useApi<EmployeesData>("/api/employees");
  const { data: campData } = useApi<CampaignsData>("/api/campaigns");
  const { data: trainData } = useApi<TrainingData>("/api/training");
  const { data: orgData } = useApi<{ name: string }>("/api/organization");
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);

  if (l1 || l2 || !dashData || !empData) {
    return (
      <div>
        <Header title={t("reports.title")} />
        <div className="space-y-6 p-6">
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

  const employees = empData.employees;
  const safeCount = employees.filter((e) => getStatus(e.riskScore) === "safe").length;
  const moderateCount = employees.filter((e) => getStatus(e.riskScore) === "moderate").length;
  const atRiskCount = employees.filter((e) => getStatus(e.riskScore) === "at-risk").length;

  const statusData = [
    { name: t("employees.safe"), value: safeCount, color: "#25d366" },
    { name: t("employees.moderate"), value: moderateCount, color: "#fa990e" },
    { name: t("employees.atRisk"), value: atRiskCount, color: "#ef4444" },
  ];

  const clickRate = campData?.stats.clickRate || 0;

  const handleExport = () => {
    setExporting(true);
    try {
      const topRisk = [...employees]
        .sort((a, b) => b.riskScore - a.riskScore)
        .slice(0, 10)
        .map((e) => ({
          name: e.name || "",
          email: e.email,
          department: e.department || "",
          riskScore: e.riskScore,
        }));

      generatePdfReport({
        organizationName: orgData?.name || "Mon Organisation",
        date: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
        avgRiskScore: dashData.avgRiskScore,
        totalEmployees: dashData.totalEmployees,
        trainingRate: dashData.trainingRate,
        clickRate,
        employeesAtRisk: atRiskCount,
        activeCampaigns: dashData.activeCampaigns,
        statusDistribution: { safe: safeCount, moderate: moderateCount, atRisk: atRiskCount },
        departments: dashData.deptRisk.map((d) => ({ name: d.department || "—", avgRisk: d.avgRisk, count: d.count })),
        topRiskEmployees: topRisk,
        trainingModules: modules.map((m) => ({ title: m.title, progressPercent: m.progress.progressPercent })),
      });

      toast.success("Rapport PDF généré — utilisez 'Enregistrer en PDF' dans la boîte d'impression");
      setExported(true);
      setTimeout(() => setExported(false), 3000);
    } catch {
      toast.error("Erreur lors de la génération du rapport");
    } finally {
      setExporting(false);
    }
  };

  const handleCSV = () => {
    const headers = ["Nom", "Email", "Departement", "Role", "Score de risque", "Formations completees"];
    const rows = employees.map((e) => [
      e.name || "",
      e.email,
      e.department || "",
      e.role,
      String(e.riskScore),
      String(e.trainingsCompleted),
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `roxshield-employes-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Export CSV telecharge");
  };

  const modules = trainData?.modules || [];

  return (
    <div>
      <Header title={t("reports.title")} />
      <div className="space-y-6 p-6">
        <FadeIn>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{t("reports.description" as any)}</p>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleCSV}>
                <Download className="mr-2 h-4 w-4" />
                {t("reports.exportCSV")}
              </Button>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Button
                  className="bg-gradient-to-r from-rht-violet to-rht-violet-light text-white hover:opacity-90"
                  onClick={handleExport}
                  disabled={exporting}
                >
                  {exporting ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t("reports.generating" as any)}</>
                  ) : exported ? (
                    <><CheckCircle className="mr-2 h-4 w-4" />{t("reports.exported" as any)}</>
                  ) : (
                    <><Download className="mr-2 h-4 w-4" />{t("reports.exportPDF")}</>
                  )}
                </Button>
              </motion.div>
            </div>
          </div>
        </FadeIn>

        <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Shield, label: t("reports.avgRiskScore" as any), value: dashData.avgRiskScore + "%", bg: "bg-rht-orange/10", text: "text-rht-orange" },
            { icon: Users, label: t("reports.completionRate" as any), value: dashData.trainingRate + "%", bg: "bg-cyber-green/10", text: "text-cyber-green" },
            { icon: AlertTriangle, label: t("reports.phishingClickRate" as any), value: clickRate + "%", bg: "bg-cyber-red/10", text: "text-cyber-red" },
            { icon: FileBarChart, label: t("reports.totalEmployees" as any), value: String(dashData.totalEmployees), bg: "bg-rht-violet/10", text: "text-rht-violet" },
          ].map((s) => (
            <StaggerItem key={s.label}>
              <GlowCard>
                <Card className="transition-all duration-300 hover:border-rht-violet/20">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.bg}`}>
                        <s.icon className={`h-5 w-5 ${s.text}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">{s.label}</p>
                        <p className="text-2xl font-bold">{s.value}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </GlowCard>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">{t("reports.overview" as any)}</TabsTrigger>
            <TabsTrigger value="departments">{t("reports.departments" as any)}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <FadeIn>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold">{t("reports.statusDistribution" as any)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[220px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                            {statusData.map((entry) => (
                              <Cell key={entry.name} fill={entry.color} />
                            ))}
                          </Pie>
                          <Legend formatter={(value) => <span style={{ color: "var(--foreground)", fontSize: "12px" }}>{value}</span>} />
                          <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", fontSize: "12px", color: "var(--foreground)" }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>

              <FadeIn delay={0.1} className="lg:col-span-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold">{t("reports.topModules" as any)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {modules.length === 0 ? (
                      <p className="py-8 text-center text-sm text-muted-foreground">{t("training.noModules" as any)}</p>
                    ) : (
                      <div className="space-y-4">
                        {[...modules]
                          .sort((a, b) => b.progress.progressPercent - a.progress.progressPercent)
                          .map((m, i) => (
                            <motion.div
                              key={m.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                              className="flex items-center gap-3"
                            >
                              <div className="flex-1">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="font-medium">{m.title}</span>
                                  <span className="text-muted-foreground">{m.progress.progressPercent}%</span>
                                </div>
                                <Progress value={m.progress.progressPercent} className="mt-1 h-2" />
                              </div>
                            </motion.div>
                          ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </FadeIn>
            </div>
          </TabsContent>

          <TabsContent value="departments" className="space-y-6">
            {dashData.deptRisk.length === 0 ? (
              <Card><CardContent className="py-12 text-center text-sm text-muted-foreground">{t("reports.noDeptData" as any)}</CardContent></Card>
            ) : (
              <>
                <FadeIn>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-semibold">{t("reports.riskByDept" as any)}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={dashData.deptRisk} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                            <XAxis type="number" domain={[0, 100]} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                            <YAxis dataKey="department" type="category" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} width={100} />
                            <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", fontSize: "12px", color: "var(--foreground)" }} />
                            <Bar dataKey="avgRisk" name="Risque %" fill="#ef4444" radius={[0, 4, 4, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </FadeIn>

                <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {dashData.deptRisk.map((dept) => (
                    <StaggerItem key={dept.department}>
                      <Card className="transition-all hover:border-rht-violet/20">
                        <CardContent className="p-5">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{dept.department || "—"}</h3>
                            <Badge className={`border-0 ${dept.avgRisk < 35 ? "bg-cyber-green/10 text-cyber-green" : dept.avgRisk < 60 ? "bg-rht-orange/10 text-rht-orange" : "bg-cyber-red/10 text-cyber-red"}`}>
                              {dept.avgRisk}%
                            </Badge>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">{dept.count} {t("common.employees" as any)}</p>
                          <Progress value={100 - dept.avgRisk} className="mt-3 h-2" />
                        </CardContent>
                      </Card>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
