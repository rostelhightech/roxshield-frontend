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
} from "lucide-react";
import { currentUser, trainingModules, badges } from "@/lib/mock-data";
import { FadeIn, StaggerContainer, StaggerItem, GlowCard } from "@/components/motion";
import { motion } from "framer-motion";
import Link from "next/link";

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
  const completionPct = (userProgress.trainingsCompleted / userProgress.totalTrainings) * 100;

  return (
    <div>
      <Header title="Mon espace" />
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
            { icon: Shield, label: "Mon score de risque", value: userProgress.riskScore + "%", color: "rht-orange", textColor: "text-rht-orange" },
            { icon: TrendingUp, label: "Classement", value: `#${userProgress.rank}`, suffix: `/${userProgress.totalEmployees}`, color: "cyber-green", textColor: "" },
            { icon: Target, label: "Phishing détectés", value: `${userProgress.simulationsDetected}/${userProgress.simulationsTotal}`, color: "rht-violet", textColor: "text-rht-violet-light" },
            { icon: BookOpen, label: "Score quiz moyen", value: userProgress.quizAvgScore + "%", color: "rht-violet-light", textColor: "" },
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
                        <p className={`text-2xl font-bold ${s.textColor}`}>
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
                  <CardTitle className="text-sm font-semibold">Mes formations</CardTitle>
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
                  <CardTitle className="text-sm font-semibold">Mes badges</CardTitle>
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
                      Complétez tous les modules pour obtenir votre certificat CyberSense
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
      </div>
    </div>
  );
}
