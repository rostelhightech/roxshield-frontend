"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion";
import { motion } from "framer-motion";
import {
  Shield,
  ArrowLeft,
  Globe,
  Target,
  Users,
  Lightbulb,
  Heart,
  Zap,
  Award,
  MapPin,
  Mail,
} from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Sécurité d'abord",
    description: "Nous croyons que la première ligne de défense d'une organisation, ce sont ses collaborateurs.",
    color: "text-rht-violet-light",
    bg: "bg-rht-violet/10",
  },
  {
    icon: Globe,
    title: "Pensé pour l'Afrique",
    description: "Nos scénarios, nos langues et nos cas pratiques sont adaptés aux réalités du continent africain.",
    color: "text-rht-orange",
    bg: "bg-rht-orange/10",
  },
  {
    icon: Lightbulb,
    title: "Innovation continue",
    description: "IA, gamification, micro-learning — nous utilisons les meilleures technologies pour protéger vos équipes.",
    color: "text-cyber-green",
    bg: "bg-cyber-green/10",
  },
  {
    icon: Heart,
    title: "Impact humain",
    description: "Nous mesurons notre succès au nombre d'attaques évitées et de collaborateurs formés.",
    color: "text-cyber-red",
    bg: "bg-cyber-red/10",
  },
];

const team = [
  {
    name: "Herdy Rostel Youlou",
    role: "CEO & Fondateur",
    initials: "HY",
    bio: "Fondateur de Rostel High-Tech, passionné par la tech et la protection des entreprises africaines.",
    gradient: "from-rht-orange to-rht-orange-light",
  },
  {
    name: "Aminata Diallo",
    role: "Head of Product",
    initials: "AD",
    bio: "Experte en UX et produits SaaS, elle conçoit l'expérience CyberSense.",
    gradient: "from-rht-violet to-rht-violet-light",
  },
  {
    name: "Kouamé Assi",
    role: "Lead Engineer",
    initials: "KA",
    bio: "Architecte logiciel full-stack, il construit la plateforme de A à Z.",
    gradient: "from-cyber-green/80 to-cyber-green",
  },
  {
    name: "Fatou Sow",
    role: "Head of Security",
    initials: "FS",
    bio: "Analyste en sécurité, elle conçoit les scénarios de simulation réalistes.",
    gradient: "from-rht-violet-light to-rht-orange",
  },
];

const milestones = [
  { year: "2021", text: "Fondation de Rostel High-Tech à Dakar, Sénégal" },
  { year: "2024", text: "Enregistrement officiel et structuration de l'entreprise" },
  { year: "2025", text: "Lancement de la R&D sur CyberSense" },
  { year: "2026", text: "Lancement commercial — premiers clients en Afrique francophone" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-rht-violet to-rht-violet-light">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold"><span className="font-normal opacity-60">Rostel</span> CyberSense</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Accueil
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(156,30,153,0.08),transparent_60%)]" />
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <FadeIn>
            <Badge variant="outline" className="mb-4 border-rht-violet/30 text-rht-violet-light">
              À propos
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight">
              Protéger les entreprises africaines,<br />
              <span className="bg-gradient-to-r from-rht-violet to-rht-orange bg-clip-text text-transparent">
                une personne à la fois
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Rostel CyberSense est né d&apos;un constat : en Afrique, 95% des cyberattaques réussies
              exploitent le facteur humain. Nous transformons vos employés en bouclier.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Mission */}
      <section className="border-y bg-secondary/30 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <FadeIn className="mb-10 text-center">
            <h2 className="text-2xl font-bold">Notre mission</h2>
            <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
              Rendre la cybersécurité humaine accessible, engageante et mesurable
              pour chaque organisation en Afrique.
            </p>
          </FadeIn>
          <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <StaggerItem key={v.title}>
                <Card className="h-full transition-all duration-300 hover:border-rht-violet/20">
                  <CardContent className="p-6 text-center">
                    <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${v.bg}`}>
                      <v.icon className={`h-6 w-6 ${v.color}`} />
                    </div>
                    <h3 className="font-semibold">{v.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{v.description}</p>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <FadeIn className="mb-10 text-center">
            <Badge variant="outline" className="mb-4 border-rht-orange/30 text-rht-orange">
              Équipe
            </Badge>
            <h2 className="text-2xl font-bold">Les personnes derrière CyberSense</h2>
            <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
              Une équipe passionnée par la cybersécurité et l&apos;impact technologique en Afrique.
            </p>
          </FadeIn>
          <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <StaggerItem key={member.name}>
                <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                  <Card className="h-full transition-all duration-300 hover:border-rht-violet/20">
                    <CardContent className="p-6 text-center">
                      <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${member.gradient} text-lg font-bold text-white`}>
                        {member.initials}
                      </div>
                      <h3 className="font-semibold">{member.name}</h3>
                      <p className="text-xs text-rht-violet-light">{member.role}</p>
                      <p className="mt-2 text-sm text-muted-foreground">{member.bio}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Timeline */}
      <section className="border-y bg-secondary/30 py-16">
        <div className="mx-auto max-w-2xl px-4">
          <FadeIn className="mb-10 text-center">
            <h2 className="text-2xl font-bold">Notre parcours</h2>
          </FadeIn>
          <div className="space-y-6">
            {milestones.map((m, i) => (
              <FadeIn key={m.year} delay={i * 0.1}>
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-rht-violet to-rht-violet-light text-xs font-bold text-white">
                      {m.year}
                    </div>
                    {i < milestones.length - 1 && (
                      <div className="mt-2 h-full w-px bg-border" />
                    )}
                  </div>
                  <div className="flex-1 rounded-xl border p-4">
                    <p className="text-sm">{m.text}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <FadeIn>
            <motion.div
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rht-orange to-rht-orange-light"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Mail className="h-8 w-8 text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold">Contactez-nous</h2>
            <p className="mt-2 text-muted-foreground">
              Une question, un partenariat, ou simplement envie d&apos;en savoir plus ?
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                contact@rostelhightech.com
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                Dakar, Sénégal
              </div>
            </div>
            <div className="mt-6">
              <Link href="/">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="inline-block">
                  <Button size="lg" className="rounded-full bg-gradient-to-r from-rht-orange to-rht-orange-light px-8 text-white hover:opacity-90">
                    Retour à l&apos;accueil
                  </Button>
                </motion.div>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-secondary/50 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-rht-violet-light" />
            <span className="font-bold"><span className="font-normal opacity-60">Rostel</span> CyberSense</span>
          </div>
          <p className="text-xs text-muted-foreground">
            &copy; 2026 Rostel High-Tech. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}
