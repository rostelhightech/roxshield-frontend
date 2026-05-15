"use client";

import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Shield,
  Target,
  TrendingDown,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BarChart3,
} from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem, GlowCard } from "@/components/motion";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const riskHistory = [
  { month: "Jan", score: 72 },
  { month: "Fév", score: 65 },
  { month: "Mar", score: 58 },
  { month: "Avr", score: 50 },
  { month: "Mai", score: 45 },
];

const simulations = [
  {
    id: 1,
    name: "Faux email RH — Bulletin de paie",
    date: "2026-05-01",
    type: "Email phishing",
    result: "detected",
    detail: "Signalé en 12 secondes",
  },
  {
    id: 2,
    name: "Faux message PDG — Virement urgent",
    date: "2026-04-15",
    type: "Spear-phishing",
    result: "clicked",
    detail: "Lien cliqué après 45 secondes",
  },
  {
    id: 3,
    name: "Faux fournisseur — Facture à régler",
    date: "2026-03-28",
    type: "Email phishing",
    result: "detected",
    detail: "Signalé en 8 secondes",
  },
];

const quizResults = [
  { module: "Phishing & Spear-phishing", score: 90, total: 100, date: "2026-04-20" },
  { module: "Ingénierie sociale", score: 75, total: 100, date: "2026-04-25" },
  { module: "Mots de passe & MFA", score: 85, total: 100, date: "2026-04-28" },
  { module: "Faux emails professionnels", score: 70, total: 100, date: "2026-05-02" },
  { module: "Sécurité des appareils", score: 80, total: 100, date: "2026-05-06" },
  { module: "Réseaux sociaux & Fraude", score: 68, total: 100, date: "2026-05-10" },
];

const resultStyle = {
  detected: { label: "Détecté", style: "bg-cyber-green/10 text-cyber-green", icon: CheckCircle },
  clicked: { label: "Cliqué", style: "bg-cyber-red/10 text-cyber-red", icon: XCircle },
  ignored: { label: "Ignoré", style: "bg-rht-orange/10 text-rht-orange", icon: AlertTriangle },
} as const;

export default function EmployeeResultsPage() {
  const avgQuiz = Math.round(quizResults.reduce((a, q) => a + q.score, 0) / quizResults.length);
  const detected = simulations.filter((s) => s.result === "detected").length;

  return (
    <div>
      <Header title="Mes résultats" />
      <div className="space-y-6 p-6">
        <StaggerContainer className="grid gap-4 sm:grid-cols-3">
          {[
            { icon: Shield, label: "Score de risque actuel", value: "45%", sub: "-27 pts depuis janvier", color: "rht-orange" },
            { icon: Target, label: "Simulations détectées", value: `${detected}/${simulations.length}`, sub: `${Math.round((detected / simulations.length) * 100)}% de réussite`, color: "cyber-green" },
            { icon: BarChart3, label: "Score quiz moyen", value: `${avgQuiz}%`, sub: "Sur 6 modules", color: "rht-violet-light" },
          ].map((s) => (
            <StaggerItem key={s.label}>
              <GlowCard>
                <Card className="transition-all duration-300 hover:border-cyber-green/20">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-${s.color}/10`}>
                        <s.icon className={`h-5 w-5 text-${s.color}`} />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{s.label}</p>
                        <p className="text-2xl font-bold">{s.value}</p>
                        <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <TrendingDown className="h-3 w-3 text-cyber-green" />
                          {s.sub}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </GlowCard>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeIn>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Évolution de mon score de risque</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={riskHistory}>
                    <defs>
                      <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#25d366" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#25d366" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                    <YAxis domain={[0, 100]} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "12px",
                        fontSize: "12px",
                        color: "var(--foreground)",
                      }}
                      formatter={(value) => [`${value}%`, "Score de risque"]}
                    />
                    <Area type="monotone" dataKey="score" stroke="#25d366" fill="url(#riskGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        <div className="grid gap-6 lg:grid-cols-2">
          <FadeIn delay={0.1}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Historique des simulations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {simulations.map((sim, i) => {
                    const res = resultStyle[sim.result as keyof typeof resultStyle];
                    const ResIcon = res.icon;
                    return (
                      <motion.div
                        key={sim.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="rounded-xl border p-4 transition-colors hover:bg-accent"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${res.style}`}>
                              <ResIcon className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{sim.name}</p>
                              <p className="text-xs text-muted-foreground">{sim.type} — {sim.date}</p>
                              <p className="mt-1 text-xs text-muted-foreground">{sim.detail}</p>
                            </div>
                          </div>
                          <Badge className={`shrink-0 border-0 text-[10px] ${res.style}`}>{res.label}</Badge>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn delay={0.15}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Scores des quiz</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {quizResults.map((quiz, i) => (
                    <motion.div
                      key={quiz.module}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="rounded-xl border p-3"
                    >
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{quiz.module}</span>
                        <span className={`font-bold ${
                          quiz.score >= 80 ? "text-cyber-green" : quiz.score >= 60 ? "text-rht-orange" : "text-cyber-red"
                        }`}>{quiz.score}%</span>
                      </div>
                      <Progress value={quiz.score} className="mt-2 h-2" />
                      <p className="mt-1 text-[10px] text-muted-foreground">{quiz.date}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
