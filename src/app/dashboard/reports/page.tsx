"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileBarChart,
  Download,
  TrendingDown,
  TrendingUp,
  Calendar,
  Shield,
  Users,
  AlertTriangle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import {
  AreaChart,
  Area,
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
import { employees, monthlyStats, departmentStats, simulationResults, trainingModules } from "@/lib/mock-data";
import { FadeIn, StaggerContainer, StaggerItem, GlowCard } from "@/components/motion";
import { motion } from "framer-motion";
import { toast } from "sonner";

const riskEvolution = monthlyStats.map((m) => ({
  month: m.month,
  "Score de risque": m.riskScore,
  "Formations complétées": m.trainingsCompleted,
}));

const phishingTrend = monthlyStats.map((m) => ({
  month: m.month,
  "Clics phishing": m.phishingClicked,
}));

const statusData = [
  { name: "Sûr", value: employees.filter((e) => e.status === "safe").length, color: "#25d366" },
  { name: "Modéré", value: employees.filter((e) => e.status === "moderate").length, color: "#fa990e" },
  { name: "À risque", value: employees.filter((e) => e.status === "at-risk").length, color: "#ef4444" },
];

const deptCompletion = departmentStats.map((d) => {
  const deptEmployees = employees.filter((e) => e.department === d.name);
  const avgCompletion = deptEmployees.length
    ? Math.round(deptEmployees.reduce((a, e) => a + (e.trainingsCompleted / e.totalTrainings) * 100, 0) / deptEmployees.length)
    : 0;
  return { name: d.name, completion: avgCompletion, risk: d.riskScore };
});

const reports = [
  { id: 1, name: "Rapport mensuel — Mai 2026", date: "2026-05-12", type: "Mensuel", status: "Généré" },
  { id: 2, name: "Rapport mensuel — Avril 2026", date: "2026-04-30", type: "Mensuel", status: "Généré" },
  { id: 3, name: "Bilan campagne — Virement urgent", date: "2026-04-16", type: "Campagne", status: "Généré" },
  { id: 4, name: "Rapport mensuel — Mars 2026", date: "2026-03-31", type: "Mensuel", status: "Généré" },
  { id: 5, name: "Bilan campagne — Bulletin de paie", date: "2026-05-02", type: "Campagne", status: "Généré" },
];

export default function ReportsPage() {
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);

  const avgRisk = Math.round(employees.reduce((a, e) => a + e.riskScore, 0) / employees.length);
  const avgCompletion = Math.round(
    employees.reduce((a, e) => a + (e.trainingsCompleted / e.totalTrainings) * 100, 0) / employees.length
  );
  const totalSimClicks = simulationResults.reduce((a, s) => a + s.clicked, 0);
  const totalSimTargets = simulationResults.reduce((a, s) => a + s.totalTargets, 0);
  const clickRate = Math.round((totalSimClicks / totalSimTargets) * 100);

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      setExported(true);
      window.print();
      setTimeout(() => setExported(false), 2000);
    }, 1000);
  };

  const handleCSV = () => {
    const headers = ["Nom", "Email", "Département", "Rôle", "Score de risque", "Formations complétées", "Total formations", "Statut"];
    const rows = employees.map((e) => [
      e.name,
      e.email,
      e.department,
      e.role,
      e.riskScore,
      e.trainingsCompleted,
      e.totalTrainings,
      e.status,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cybersense-rapport-employes-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Export CSV employés téléchargé");
  };

  const handleDeptCSV = () => {
    const headers = ["Département", "Employés", "Score de risque", "Complétion (%)"];
    const rows = deptCompletion.map((d) => [d.name, departmentStats.find((ds) => ds.name === d.name)?.employees ?? 0, d.risk, d.completion]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cybersense-rapport-departements-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Export CSV départements téléchargé");
  };

  return (
    <div>
      <Header title="Rapports & Analytics" />
      <div className="space-y-6 p-6">
        <FadeIn>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Suivez l&apos;évolution de la posture de sécurité de votre organisation
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleCSV}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Button
                  className="bg-gradient-to-r from-rht-violet to-rht-violet-light text-white hover:opacity-90"
                  onClick={handleExport}
                  disabled={exporting}
                >
                  {exporting ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Génération...</>
                  ) : exported ? (
                    <><CheckCircle className="mr-2 h-4 w-4" />Exporté !</>
                  ) : (
                    <><Download className="mr-2 h-4 w-4" />Exporter PDF</>
                  )}
                </Button>
              </motion.div>
            </div>
          </div>
        </FadeIn>

        <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Shield,
              label: "Score de risque moyen",
              value: avgRisk + "%",
              trend: "-26% depuis Jan",
              trendDown: true,
              bg: "bg-rht-orange/10",
              text: "text-rht-orange",
            },
            {
              icon: Users,
              label: "Taux de complétion",
              value: avgCompletion + "%",
              trend: "+35% depuis Jan",
              trendDown: false,
              bg: "bg-cyber-green/10",
              text: "text-cyber-green",
            },
            {
              icon: AlertTriangle,
              label: "Taux de clic phishing",
              value: clickRate + "%",
              trend: "-62% depuis Jan",
              trendDown: true,
              bg: "bg-cyber-red/10",
              text: "text-cyber-red",
            },
            {
              icon: FileBarChart,
              label: "Rapports générés",
              value: reports.length.toString(),
              trend: "Ce mois-ci : 2",
              trendDown: false,
              bg: "bg-rht-violet/10",
              text: "text-rht-violet",
            },
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
                    <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                      {s.trendDown ? (
                        <TrendingDown className="h-3 w-3 text-cyber-green" />
                      ) : (
                        <TrendingUp className="h-3 w-3 text-cyber-green" />
                      )}
                      <span>{s.trend}</span>
                    </div>
                  </CardContent>
                </Card>
              </GlowCard>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Vue d&apos;ensemble</TabsTrigger>
            <TabsTrigger value="departments">Départements</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <FadeIn>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold">Évolution du risque</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[280px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={riskEvolution}>
                          <defs>
                            <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#9c1e99" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#9c1e99" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                          <XAxis dataKey="month" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                          <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "var(--card)",
                              border: "1px solid var(--border)",
                              borderRadius: "12px",
                              fontSize: "12px",
                              color: "var(--foreground)",
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="Score de risque"
                            stroke="#9c1e99"
                            fill="url(#riskGrad)"
                            strokeWidth={2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>

              <FadeIn delay={0.1}>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold">Clics phishing par mois</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[280px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={phishingTrend}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                          <XAxis dataKey="month" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                          <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "var(--card)",
                              border: "1px solid var(--border)",
                              borderRadius: "12px",
                              fontSize: "12px",
                              color: "var(--foreground)",
                            }}
                          />
                          <Bar dataKey="Clics phishing" fill="#ef4444" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <FadeIn delay={0.15}>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold">Répartition des statuts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[220px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={statusData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {statusData.map((entry) => (
                              <Cell key={entry.name} fill={entry.color} />
                            ))}
                          </Pie>
                          <Legend
                            formatter={(value) => (
                              <span style={{ color: "var(--foreground)", fontSize: "12px" }}>{value}</span>
                            )}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "var(--card)",
                              border: "1px solid var(--border)",
                              borderRadius: "12px",
                              fontSize: "12px",
                              color: "var(--foreground)",
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>

              <FadeIn delay={0.2} className="lg:col-span-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold">Top modules par complétion</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[...trainingModules]
                        .sort((a, b) => b.completionRate - a.completionRate)
                        .map((m, i) => (
                          <motion.div
                            key={m.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-center gap-3"
                          >
                            <span className="text-lg">{m.icon}</span>
                            <div className="flex-1">
                              <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">{m.title}</span>
                                <span className="text-muted-foreground">{m.completionRate}%</span>
                              </div>
                              <Progress value={m.completionRate} className="mt-1 h-2" />
                            </div>
                          </motion.div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            </div>
          </TabsContent>

          <TabsContent value="departments" className="space-y-6">
            <FadeIn>
              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={handleDeptCSV}>
                  <Download className="mr-2 h-3 w-3" />
                  CSV départements
                </Button>
              </div>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">Risque vs Complétion par département</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={deptCompletion} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis type="number" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                        <YAxis dataKey="name" type="category" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} width={100} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "var(--card)",
                            border: "1px solid var(--border)",
                            borderRadius: "12px",
                            fontSize: "12px",
                            color: "var(--foreground)",
                          }}
                        />
                        <Legend />
                        <Bar dataKey="completion" name="Complétion %" fill="#25d366" radius={[0, 4, 4, 0]} />
                        <Bar dataKey="risk" name="Risque %" fill="#ef4444" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {departmentStats.map((dept) => (
                <StaggerItem key={dept.name}>
                  <Card className="transition-all hover:border-rht-violet/20">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{dept.name}</h3>
                        <Badge
                          className={`border-0 ${
                            dept.riskScore < 35
                              ? "bg-cyber-green/10 text-cyber-green"
                              : dept.riskScore < 60
                              ? "bg-rht-orange/10 text-rht-orange"
                              : "bg-cyber-red/10 text-cyber-red"
                          }`}
                        >
                          {dept.riskScore}%
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{dept.employees} employé(s)</p>
                      <Progress
                        value={100 - dept.riskScore}
                        className="mt-3 h-2"
                      />
                      <p className="mt-1 text-[10px] text-muted-foreground">Niveau de sécurité</p>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <FadeIn>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold">Rapports générés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {reports.map((report, i) => (
                      <motion.div
                        key={report.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="flex items-center justify-between rounded-xl border p-4 transition-colors hover:bg-accent"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rht-violet/10">
                            <FileBarChart className="h-5 w-5 text-rht-violet-light" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{report.name}</p>
                            <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>{report.date}</span>
                              <Badge variant="outline" className="text-[10px]">
                                {report.type}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
