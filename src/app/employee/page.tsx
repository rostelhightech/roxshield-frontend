"use client";

import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Target,
  BookOpen,
  Award,
  TrendingUp,
  CheckCircle,
  Clock,
  Lock,
  ArrowRight,
  AlertTriangle,
  GraduationCap,
  Flame,
} from "lucide-react";
import { currentUser, trainingModules, badges } from "@/lib/mock-data";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FadeIn, StaggerContainer, StaggerItem, GlowCard } from "@/components/motion";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";

const progressHistory = [
  { month: "Jan", score: 72 },
  { month: "Fév", score: 65 },
  { month: "Mar", score: 58 },
  { month: "Avr", score: 50 },
  { month: "Mai", score: 45 },
];

const activityLog = [
  { text: "Module « Sécurité des mots de passe » complété", date: "Aujourd'hui", icon: GraduationCap, color: "text-cyber-green", bg: "bg-cyber-green/10" },
  { text: "Email de phishing signalé correctement", date: "Hier", icon: CheckCircle, color: "text-cyber-green", bg: "bg-cyber-green/10" },
  { text: "Clic sur simulation « Virement urgent »", date: "Il y a 3j", icon: AlertTriangle, color: "text-cyber-red", bg: "bg-cyber-red/10" },
  { text: "Badge « Vigilant » obtenu", date: "Il y a 5j", icon: Award, color: "text-rht-orange", bg: "bg-rht-orange/10" },
  { text: "Module « Phishing 101 » complété", date: "Il y a 1sem", icon: GraduationCap, color: "text-cyber-green", bg: "bg-cyber-green/10" },
];

const userProgress = {
  riskScore: 45,
  rank: 3,
  totalEmployees: 10,
  trainingsCompleted: 6,
  totalTrainings: 10,
  quizAvgScore: 78,
  streak: 4,
  simulationsDetected: 2,
  simulationsTotal: 3,
};

export default function EmployeeDashboardPage() {
  const { t } = useTranslation();
  const completionPct = (userProgress.trainingsCompleted / userProgress.totalTrainings) * 100;

  return (
    <div>
      <Header title={t("nav.mySpace")} />
      <div className="space-y-6 p-6">
        <FadeIn>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-gradient-to-br from-cyber-green/80 to-cyber-green text-lg text-white">
                    {currentUser.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-left">
                  <h2 className="text-xl font-bold">{currentUser.name}</h2>
                  <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                  <Badge className="mt-1 border-0 bg-cyber-green/10 text-cyber-green text-[10px]">
                    {currentUser.org}
                  </Badge>
                </div>
                <div className="flex gap-2 sm:ml-auto">
                  {badges.filter((b) => b.earned).map((badge) => (
                    <motion.div
                      key={badge.id}
                      whileHover={{ scale: 1.15, rotate: 10 }}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-cyber-green/10 text-lg"
                      title={badge.name}
                    >
                      {badge.icon}
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Shield, label: t("employee.yourRiskScore"), value: userProgress.riskScore + "%", bg: "bg-rht-orange/10", text: "text-rht-orange" },
            { icon: TrendingUp, label: t("nav.leaderboard"), value: `#${userProgress.rank}`, suffix: `/${userProgress.totalEmployees}`, bg: "bg-cyber-green/10", text: "text-cyber-green" },
            { icon: Target, label: t("employee.phishingDetected"), value: `${userProgress.simulationsDetected}/${userProgress.simulationsTotal}`, bg: "bg-rht-violet/10", text: "text-rht-violet-light" },
            { icon: BookOpen, label: t("employee.quizAvgScore"), value: userProgress.quizAvgScore + "%", bg: "bg-rht-violet-light/10", text: "text-rht-violet-light" },
          ].map((s) => (
            <StaggerItem key={s.label}>
              <GlowCard>
                <Card className="transition-all duration-300 hover:border-cyber-green/20">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.bg}`}>
                        <s.icon className={`h-5 w-5 ${s.text}`} />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{s.label}</p>
                        <p className={`text-2xl font-bold ${s.text}`}>
                          {s.value}
                          {s.suffix && <span className="text-sm font-normal text-muted-foreground">{s.suffix}</span>}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </GlowCard>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <div className="grid gap-6 lg:grid-cols-2">
          <FadeIn>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">{t("nav.training")}</CardTitle>
                  <Link href="/employee/training">
                    <Button variant="ghost" size="sm" className="text-xs text-cyber-green hover:text-cyber-green">
                      Voir tout <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progression globale</span>
                    <span className="font-semibold">{userProgress.trainingsCompleted}/{userProgress.totalTrainings}</span>
                  </div>
                  <Progress value={completionPct} className="h-3" />
                </div>
                <div className="space-y-2">
                  {trainingModules.slice(0, 5).map((module, i) => {
                    const completed = i < userProgress.trainingsCompleted;
                    return (
                      <motion.div
                        key={module.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center gap-3 rounded-xl border p-3 transition-colors hover:bg-accent"
                      >
                        <span className="text-lg">{module.icon}</span>
                        <div className="flex-1">
                          <p className={`text-sm ${completed ? "text-muted-foreground line-through" : "font-medium"}`}>{module.title}</p>
                          <p className="text-xs text-muted-foreground">{module.duration} — {module.difficulty}</p>
                        </div>
                        {completed ? (
                          <CheckCircle className="h-5 w-5 text-cyber-green" />
                        ) : i === userProgress.trainingsCompleted ? (
                          <Badge className="border-0 bg-cyber-green/10 text-cyber-green text-[10px]">
                            <Clock className="mr-1 h-3 w-3" />En cours
                          </Badge>
                        ) : (
                          <Lock className="h-4 w-4 text-muted-foreground/30" />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          <div className="space-y-6">
            <FadeIn delay={0.1}>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold">{t("nav.badges")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {badges.map((badge) => (
                      <motion.div
                        key={badge.id}
                        whileHover={badge.earned ? { y: -3, scale: 1.02 } : {}}
                        className={`rounded-xl border p-4 text-center transition-all ${
                          badge.earned ? "border-cyber-green/20 bg-cyber-green/5" : "opacity-40"
                        }`}
                      >
                        <div className="mb-2 text-3xl">{badge.icon}</div>
                        <p className="text-sm font-semibold">{badge.name}</p>
                        <p className="text-[10px] text-muted-foreground">{badge.description}</p>
                        {badge.earned && (
                          <Badge className="mt-2 border-0 bg-cyber-green/10 text-cyber-green text-[10px]">Obtenu</Badge>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={0.2}>
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-cyber-green" />
                    <CardTitle className="text-sm font-semibold">Certificat</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-xl border-2 border-dashed border-cyber-green/20 p-6 text-center">
                    <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                      <Award className="mx-auto mb-3 h-10 w-10 text-muted-foreground/20" />
                    </motion.div>
                    <p className="text-sm font-medium">Certificat de sensibilisation</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Complétez tous les modules pour obtenir votre certificat Rostel CyberSense
                    </p>
                    <Progress value={completionPct} className="mx-auto mt-3 h-2 max-w-[200px]" />
                    <p className="mt-2 text-xs text-muted-foreground">
                      {userProgress.totalTrainings - userProgress.trainingsCompleted} modules restants
                    </p>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <FadeIn delay={0.25}>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">{t("employee.riskEvolution")}</CardTitle>
                  <div className="flex items-center gap-1 text-xs text-cyber-green">
                    <Flame className="h-3 w-3" />
                    {userProgress.streak} jours d&apos;affilée
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={progressHistory}>
                      <defs>
                        <linearGradient id="empGrad" x1="0" y1="0" x2="0" y2="1">
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
                      <Area type="monotone" dataKey="score" stroke="#25d366" fill="url(#empGrad)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  {t("employee.riskDecreasing")}
                </p>
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn delay={0.3}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">{t("employee.recentActivity")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activityLog.map((activity, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="flex items-start gap-3"
                    >
                      <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${activity.bg}`}>
                        <activity.icon className={`h-3.5 w-3.5 ${activity.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{activity.text}</p>
                        <p className="text-[10px] text-muted-foreground">{activity.date}</p>
                      </div>
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
