"use client";

import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Clock,
  Lock,
  PlayCircle,
  GraduationCap,
} from "lucide-react";
import { trainingModules } from "@/lib/mock-data";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion";
import { motion } from "framer-motion";

const userCompleted = 6;

const difficultyStyle = {
  "Débutant": "bg-cyber-green/10 text-cyber-green",
  "Intermédiaire": "bg-rht-orange/10 text-rht-orange",
  "Avancé": "bg-cyber-red/10 text-cyber-red",
} as const;

export default function EmployeeTrainingPage() {
  const completionPct = (userCompleted / trainingModules.length) * 100;

  return (
    <div>
      <Header title="Mes formations" />
      <div className="space-y-6 p-6">
        <FadeIn>
          <Card>
            <CardContent className="p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyber-green/10">
                    <GraduationCap className="h-6 w-6 text-cyber-green" />
                  </div>
                  <div>
                    <p className="text-lg font-bold">{userCompleted}/{trainingModules.length} modules complétés</p>
                    <p className="text-sm text-muted-foreground">Continuez pour obtenir votre certificat !</p>
                  </div>
                </div>
                <div className="w-full sm:w-48">
                  <Progress value={completionPct} className="h-3" />
                  <p className="mt-1 text-right text-xs text-muted-foreground">{Math.round(completionPct)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        <StaggerContainer className="space-y-3">
          {trainingModules.map((module, i) => {
            const completed = i < userCompleted;
            const current = i === userCompleted;
            const locked = i > userCompleted;

            return (
              <StaggerItem key={module.id}>
                <motion.div whileHover={!locked ? { scale: 1.005 } : {}}>
                  <Card className={`transition-all duration-300 ${
                    current ? "border-cyber-green/30 shadow-[0_0_15px_rgba(37,211,102,0.08)]" : ""
                  } ${locked ? "opacity-50" : "hover:border-cyber-green/20"}`}>
                    <CardContent className="p-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${
                            completed ? "bg-cyber-green/10" : current ? "bg-cyber-green/10" : "bg-muted"
                          }`}>
                            {module.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className={`font-semibold ${completed ? "text-muted-foreground line-through" : ""}`}>
                                {module.title}
                              </h3>
                              <Badge className={`border-0 text-[10px] ${difficultyStyle[module.difficulty]}`}>
                                {module.difficulty}
                              </Badge>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">{module.description}</p>
                            <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                              <span>{module.duration}</span>
                              <span>·</span>
                              <span>{module.lessons} leçons</span>
                              <span>·</span>
                              <span>{module.category}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 sm:shrink-0">
                          {completed ? (
                            <div className="flex items-center gap-2 text-cyber-green">
                              <CheckCircle className="h-5 w-5" />
                              <span className="text-sm font-medium">Terminé</span>
                            </div>
                          ) : current ? (
                            <Button className="bg-gradient-to-r from-cyber-green/90 to-cyber-green text-white hover:opacity-90">
                              <PlayCircle className="mr-2 h-4 w-4" />
                              Continuer
                            </Button>
                          ) : (
                            <div className="flex items-center gap-2 text-muted-foreground/40">
                              <Lock className="h-4 w-4" />
                              <span className="text-sm">Verrouillé</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {current && (
                        <div className="mt-4">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Progression du module</span>
                            <span>2/{module.lessons} leçons</span>
                          </div>
                          <Progress value={(2 / module.lessons) * 100} className="mt-1 h-2" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </div>
  );
}
