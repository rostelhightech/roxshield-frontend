"use client";

import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Clock, BookOpen, ArrowRight } from "lucide-react";
import { trainingModules } from "@/lib/mock-data";
import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem, GlowCard } from "@/components/motion";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";

function difficultyColor(d: string) {
  switch (d) {
    case "Débutant": return "border-0 bg-cyber-green/10 text-cyber-green";
    case "Intermédiaire": return "border-0 bg-rht-orange/10 text-rht-orange";
    case "Avancé": return "border-0 bg-cyber-red/10 text-cyber-red";
    default: return "";
  }
}

export default function TrainingPage() {
  const { t } = useTranslation();
  return (
    <div>
      <Header title={t("training.title")} />
      <div className="space-y-6 p-6">
        <StaggerContainer className="grid gap-3 sm:grid-cols-3">
          {[
            { value: trainingModules.length, label: "Modules disponibles" },
            { value: Math.round(trainingModules.reduce((a, m) => a + m.completionRate, 0) / trainingModules.length) + "%", label: "Taux de complétion moyen", highlight: true },
            { value: trainingModules.reduce((a, m) => a + m.lessons, 0), label: "Leçons au total" },
          ].map((s) => (
            <StaggerItem key={s.label}>
              <Card>
                <CardContent className="p-4">
                  <p className={`text-2xl font-bold ${s.highlight ? "text-rht-violet-light" : ""}`}>{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trainingModules.map((module) => (
            <StaggerItem key={module.id}>
              <GlowCard className="h-full">
                <Card className="group h-full transition-all duration-300 hover:border-rht-violet/20">
                  <CardContent className="p-5">
                    <div className="mb-4 flex items-start justify-between">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="flex h-12 w-12 items-center justify-center rounded-xl bg-rht-violet/10 text-2xl"
                      >
                        {module.icon}
                      </motion.div>
                      <Badge className={difficultyColor(module.difficulty)}>{module.difficulty}</Badge>
                    </div>
                    <h3 className="mb-1 text-base font-semibold">{module.title}</h3>
                    <p className="mb-4 text-xs leading-relaxed text-muted-foreground">{module.description}</p>
                    <div className="mb-4 flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{module.duration}</span>
                      <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" />{module.lessons} leçons</span>
                    </div>
                    <div className="mb-4 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Complétion</span>
                        <span className="font-medium">{module.completionRate}%</span>
                      </div>
                      <Progress value={module.completionRate} className="h-2" />
                    </div>
                    <Link href={`/dashboard/training/${module.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-rht-violet group-hover:to-rht-violet-light group-hover:border-transparent group-hover:text-white"
                      >
                        {t("training.start")}
                        <ArrowRight className="ml-2 h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </GlowCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </div>
  );
}
