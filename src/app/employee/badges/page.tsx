"use client";

import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Award,
  Shield,
  Target,
  Flame,
  BookOpen,
  Eye,
  Zap,
  Lock,
  Trophy,
} from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion";
import { motion } from "framer-motion";

const badges = [
  {
    id: 1,
    name: "Premiers pas",
    description: "Complétez votre première formation",
    icon: BookOpen,
    earned: true,
    date: "2026-03-10",
    color: "from-cyber-green/80 to-cyber-green",
  },
  {
    id: 2,
    name: "Œil de lynx",
    description: "Détectez 3 tentatives de phishing consécutives",
    icon: Eye,
    earned: true,
    date: "2026-04-02",
    color: "from-rht-violet to-rht-violet-light",
  },
  {
    id: 3,
    name: "Bouclier bronze",
    description: "Maintenez un score de risque < 60 pendant 2 semaines",
    icon: Shield,
    earned: true,
    date: "2026-04-15",
    color: "from-rht-orange to-rht-orange-light",
  },
  {
    id: 4,
    name: "Série en feu",
    description: "7 jours consécutifs sans clic sur un lien suspect",
    icon: Flame,
    earned: true,
    date: "2026-05-01",
    color: "from-red-500 to-orange-400",
  },
  {
    id: 5,
    name: "Expert MDP",
    description: "Complétez le module sur les mots de passe",
    icon: Lock,
    earned: false,
    progress: 60,
    color: "from-gray-400 to-gray-500",
  },
  {
    id: 6,
    name: "Réflexe éclair",
    description: "Signalez un email de phishing en moins de 30 secondes",
    icon: Zap,
    earned: false,
    progress: 0,
    color: "from-gray-400 to-gray-500",
  },
  {
    id: 7,
    name: "Chasseur de menaces",
    description: "Détectez 10 tentatives de phishing au total",
    icon: Target,
    earned: false,
    progress: 70,
    color: "from-gray-400 to-gray-500",
  },
  {
    id: 8,
    name: "Champion cyber",
    description: "Obtenez tous les badges et un score de risque < 30",
    icon: Trophy,
    earned: false,
    progress: 40,
    color: "from-gray-400 to-gray-500",
  },
];

const earnedCount = badges.filter((b) => b.earned).length;

export default function BadgesPage() {
  return (
    <div>
      <Header title="Badges & Récompenses" />
      <div className="space-y-6 p-6">
        <FadeIn>
          <Card>
            <CardContent className="flex items-center gap-6 p-6">
              <motion.div
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rht-orange to-rht-orange-light"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Award className="h-8 w-8 text-white" />
              </motion.div>
              <div className="flex-1">
                <h2 className="text-lg font-bold">{earnedCount} / {badges.length} badges obtenus</h2>
                <p className="text-sm text-muted-foreground">
                  Continuez vos formations et détectez les menaces pour débloquer de nouveaux badges
                </p>
                <Progress value={(earnedCount / badges.length) * 100} className="mt-3 h-2" />
              </div>
              <div className="hidden text-right sm:block">
                <p className="text-3xl font-bold text-rht-orange">{Math.round((earnedCount / badges.length) * 100)}%</p>
                <p className="text-xs text-muted-foreground">Complétion</p>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Badges débloqués
          </h3>
        </FadeIn>
        <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {badges
            .filter((b) => b.earned)
            .map((badge) => (
              <StaggerItem key={badge.id}>
                <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <Card className="h-full border-rht-violet/20 transition-all hover:shadow-md">
                    <CardContent className="flex flex-col items-center p-6 text-center">
                      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${badge.color} shadow-lg`}>
                        <badge.icon className="h-7 w-7 text-white" />
                      </div>
                      <h4 className="mt-3 font-semibold text-sm">{badge.name}</h4>
                      <p className="mt-1 text-xs text-muted-foreground">{badge.description}</p>
                      <Badge className="mt-3 border-0 bg-cyber-green/10 text-cyber-green text-[10px]">
                        Obtenu le {new Date(badge.date!).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              </StaggerItem>
            ))}
        </StaggerContainer>

        <FadeIn delay={0.2}>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            En cours de progression
          </h3>
        </FadeIn>
        <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {badges
            .filter((b) => !b.earned)
            .map((badge) => (
              <StaggerItem key={badge.id}>
                <Card className="h-full opacity-75 transition-all hover:opacity-100">
                  <CardContent className="flex flex-col items-center p-6 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                      <badge.icon className="h-7 w-7 text-muted-foreground" />
                    </div>
                    <h4 className="mt-3 font-semibold text-sm">{badge.name}</h4>
                    <p className="mt-1 text-xs text-muted-foreground">{badge.description}</p>
                    <div className="mt-3 w-full">
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                        <span>Progression</span>
                        <span>{badge.progress}%</span>
                      </div>
                      <Progress value={badge.progress ?? 0} className="mt-1 h-1.5" />
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
        </StaggerContainer>
      </div>
    </div>
  );
}
