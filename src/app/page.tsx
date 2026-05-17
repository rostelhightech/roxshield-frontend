"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/theme-toggle";
import { FadeIn, StaggerContainer, StaggerItem, GlowCard } from "@/components/motion";
import { AnimatedCounter } from "@/components/animated-counter";
import { motion } from "framer-motion";
import {
  Shield,
  Crosshair,
  GraduationCap,
  BarChart3,
  Brain,
  Globe,
  ArrowRight,
  CheckCircle,
  Users,
  Building2,
  Send,
} from "lucide-react";

const features = [
  {
    icon: Crosshair,
    title: "Simulations de phishing",
    description:
      "Faux emails RH, PDG, fournisseurs, WhatsApp — testez la vigilance de vos équipes avec des scénarios réalistes adaptés au contexte africain.",
  },
  {
    icon: GraduationCap,
    title: "Micro-formations gamifiées",
    description:
      "Modules de 5 à 10 minutes avec quiz interactifs, vidéos et cas pratiques. Vos employés apprennent en s'entraînant.",
  },
  {
    icon: BarChart3,
    title: "Dashboard de risque humain",
    description:
      "Visualisez le score de risque par employé, département et organisation. Identifiez les profils vulnérables en un coup d'œil.",
  },
  {
    icon: Brain,
    title: "IA de détection",
    description:
      "Notre intelligence artificielle identifie les profils à risque et personnalise automatiquement les parcours de formation.",
  },
  {
    icon: Users,
    title: "Gamification & Badges",
    description:
      "Classements internes, badges Cyber Defender et Phishing Hunter, certificats de sensibilisation pour motiver vos équipes.",
  },
  {
    icon: Globe,
    title: "Conçu pour l'Afrique",
    description:
      "Cas pratiques locaux, arnaques Mobile Money, fraude WhatsApp, tarifs adaptés et interface en français.",
  },
];

const plans = [
  {
    name: "Starter",
    description: "Pour les petites équipes",
    employees: "Jusqu'à 25 employés",
    features: ["6 modules de formation", "Quiz interactifs", "Dashboard basique", "Rapports mensuels"],
  },
  {
    name: "Business",
    description: "Pour les entreprises en croissance",
    employees: "Jusqu'à 100 employés",
    popular: true,
    features: ["Tout Starter +", "Simulations de phishing", "Gamification complète", "Rapports avancés", "Support prioritaire"],
  },
  {
    name: "Enterprise",
    description: "Pour les grandes organisations",
    employees: "Employés illimités",
    features: ["Tout Business +", "IA de personnalisation", "Scénarios sur mesure", "API & intégrations", "Account manager dédié"],
  },
];

const stats = [
  { value: "90%", label: "des cyberattaques commencent par une erreur humaine" },
  { value: "5 min", label: "de micro-formation par jour suffisent" },
  { value: "-60%", label: "de clics sur le phishing après 3 mois" },
  { value: "6", label: "modules de formation disponibles" },
];

export default function LandingPage() {
  const [devisOpen, setDevisOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [devisSent, setDevisSent] = useState(false);

  const openDevis = (planName: string) => {
    setSelectedPlan(planName);
    setDevisSent(false);
    setDevisOpen(true);
  };

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-rht-violet to-rht-violet-light glow-violet-sm">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold tracking-tight"><span className="font-normal opacity-60">Rostel</span> CyberSense</span>
          </div>
          <nav className="hidden items-center gap-6 text-sm md:flex">
            <a href="#features" className="text-muted-foreground transition-colors hover:text-foreground">
              Fonctionnalités
            </a>
            <a href="#stats" className="text-muted-foreground transition-colors hover:text-foreground">
              Chiffres
            </a>
            <a href="#pricing" className="text-muted-foreground transition-colors hover:text-foreground">
              Tarifs
            </a>
            <Link href="/about" className="text-muted-foreground transition-colors hover:text-foreground">
              À propos
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Se connecter</Button>
            </Link>
            <Link href="/login">
              <Button size="sm" className="rounded-full bg-gradient-to-r from-rht-orange to-rht-orange-light text-white glow-orange-sm hover:opacity-90">
                Démo gratuite
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(156,30,153,0.08),transparent_55%),radial-gradient(ellipse_at_70%_80%,rgba(250,153,14,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(156,30,153,0.03)_1px,transparent_1px),radial-gradient(circle_at_80%_20%,rgba(250,153,14,0.03)_1px,transparent_1px)] bg-[length:60px_60px]" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 text-center lg:py-32">
          <FadeIn delay={0}>
            <Badge className="mb-6 border-border bg-rht-violet/10 text-rht-violet-light dark:border-rht-violet/20">
              by Rostel High-Tech
            </Badge>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight lg:text-6xl">
              Transformez vos employés en{" "}
              <span className="bg-gradient-to-r from-rht-violet-light to-rht-orange bg-clip-text text-transparent">
                première ligne de défense
              </span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Rostel CyberSense aide les entreprises africaines à réduire le
              risque humain grâce aux simulations de phishing, micro-formations
              gamifiées et tableaux de bord intelligents.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/login">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Button size="lg" className="h-12 rounded-full bg-gradient-to-r from-rht-orange to-rht-orange-light px-8 text-base font-semibold text-white glow-orange hover:opacity-90">
                    Essayer la démo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </Link>
              <Link href="/dashboard">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="outline" size="lg" className="h-12 rounded-full px-8 text-base transition-all hover:border-rht-violet/30 hover:shadow-[0_0_15px_rgba(156,30,153,0.1)]">
                    Voir le dashboard
                  </Button>
                </motion.div>
              </Link>
            </div>
          </FadeIn>
          <FadeIn delay={0.4}>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><Building2 className="h-4 w-4" />Entreprises & Écoles</span>
              <span className="flex items-center gap-2"><Shield className="h-4 w-4" />Cybersécurité humaine</span>
              <span className="flex items-center gap-2"><Globe className="h-4 w-4" />Contexte africain</span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b py-20" id="how-it-works">
        <div className="mx-auto max-w-6xl px-4">
          <FadeIn className="mb-12 text-center">
            <Badge variant="outline" className="mb-4 border-cyber-green/30 text-cyber-green">
              Comment ça marche
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight">
              3 étapes pour sécuriser vos équipes
            </h2>
          </FadeIn>
          <StaggerContainer className="grid gap-8 lg:grid-cols-3">
            {[
              {
                step: "01",
                icon: Users,
                title: "Inscrivez vos employés",
                description: "Importez votre équipe en quelques clics. Chaque employé reçoit un accès personnalisé à son espace de formation.",
                color: "from-rht-violet to-rht-violet-light",
              },
              {
                step: "02",
                icon: Crosshair,
                title: "Lancez des simulations",
                description: "Envoyez des campagnes de phishing réalistes adaptées au contexte africain. Mesurez les réactions de vos équipes.",
                color: "from-rht-orange to-rht-orange-light",
              },
              {
                step: "03",
                icon: BarChart3,
                title: "Suivez les progrès",
                description: "Visualisez l'évolution du risque par employé et département. Les formations se personnalisent automatiquement.",
                color: "from-cyber-green to-cyber-green",
              },
            ].map((item) => (
              <StaggerItem key={item.step}>
                <div className="relative text-center">
                  <motion.div
                    whileHover={{ scale: 1.05, y: -4 }}
                    className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} shadow-lg`}
                  >
                    <item.icon className="h-7 w-7 text-white" />
                  </motion.div>
                  <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground/40">
                    Étape {item.step}
                  </span>
                  <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b bg-secondary/50 py-16" id="stats">
        <div className="mx-auto max-w-6xl px-4">
          <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <StaggerItem key={stat.label}>
                <div className="text-center">
                  <AnimatedCounter
                    value={stat.value}
                    className="text-3xl font-bold bg-gradient-to-r from-rht-violet to-rht-orange bg-clip-text text-transparent"
                  />
                  <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Features */}
      <section className="border-b py-20" id="features">
        <div className="mx-auto max-w-6xl px-4">
          <FadeIn className="mb-12 text-center">
            <Badge variant="outline" className="mb-4 border-rht-violet/30 text-rht-violet-light">
              Fonctionnalités
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight">
              Tout ce qu&apos;il faut pour sécuriser le facteur humain
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Une plateforme complète de sensibilisation, formation et simulation en cybersécurité.
            </p>
          </FadeIn>
          <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <StaggerItem key={feature.title}>
                <GlowCard className="h-full">
                  <Card className="h-full transition-all duration-300 hover:border-rht-violet/20">
                    <CardContent className="flex h-full flex-col p-6">
                      <motion.div
                        whileHover={{ scale: 1.05, rotate: 3 }}
                        transition={{ type: "spring", stiffness: 400 }}
                        className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-rht-violet/10 to-rht-violet-light/10"
                      >
                        <feature.icon className="h-6 w-6 text-rht-violet-light" />
                      </motion.div>
                      <h3 className="mb-2 font-semibold">{feature.title}</h3>
                      <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </GlowCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-b bg-secondary/30 py-20" id="pricing">
        <div className="mx-auto max-w-6xl px-4">
          <FadeIn className="mb-12 text-center">
            <Badge variant="outline" className="mb-4 border-rht-orange/30 text-rht-orange">
              Tarifs
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight">
              Des plans adaptés à chaque organisation
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Abonnement mensuel ou annuel. Tarifs éducatifs disponibles pour les écoles et universités.
            </p>
          </FadeIn>
          <StaggerContainer className="grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <StaggerItem key={plan.name}>
                <GlowCard className="h-full">
                  <Card className={`relative h-full overflow-visible transition-all duration-300 ${
                    plan.popular ? "border-rht-violet/30 glow-violet-sm" : ""
                  }`}>
                    {plan.popular && (
                      <div className="absolute -top-3.5 left-1/2 z-10 -translate-x-1/2">
                        <Badge className="bg-gradient-to-r from-rht-violet to-rht-violet-light px-3 py-1 text-white animate-pulse-glow">
                          Populaire
                        </Badge>
                      </div>
                    )}
                    <CardContent className={`p-6 ${plan.popular ? "pt-8" : ""}`}>
                      <h3 className="text-lg font-bold">{plan.name}</h3>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                      <p className="mt-2 text-xs font-medium text-rht-violet-light">{plan.employees}</p>
                      <ul className="mt-5 space-y-2.5">
                        {plan.features.map((f) => (
                          <li key={f} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 shrink-0 text-cyber-green" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          onClick={() => openDevis(plan.name)}
                          className={`mt-6 w-full rounded-full ${
                            plan.popular
                              ? "bg-gradient-to-r from-rht-orange to-rht-orange-light text-white glow-orange-sm hover:opacity-90"
                              : ""
                          }`}
                          variant={plan.popular ? "default" : "outline"}
                        >
                          Demander un devis
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </GlowCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <FadeIn className="mb-12 text-center">
            <Badge variant="outline" className="mb-4 border-cyber-green/30 text-cyber-green">
              Témoignages
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight">
              Ils nous font confiance
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Des organisations africaines qui renforcent leur sécurité humaine au quotidien.
            </p>
          </FadeIn>
          <StaggerContainer className="grid gap-6 md:grid-cols-3">
            {[
              {
                quote: "En 3 mois, notre taux de clic sur les emails de phishing est passé de 45% à 12%. Impressionnant.",
                name: "Fatou Sow",
                role: "DSI, Banque Atlantique Sénégal",
                initials: "FS",
              },
              {
                quote: "Les modules de formation sont courts et ludiques — nos employés les adorent. Le dashboard nous donne une vue claire.",
                name: "Kouamé Assi",
                role: "RSSI, Moov Africa CI",
                initials: "KA",
              },
              {
                quote: "CyberSense nous a permis d'identifier nos départements les plus vulnérables et de cibler les formations.",
                name: "Amina Diallo",
                role: "DRH, Port Autonome de Dakar",
                initials: "AD",
              },
            ].map((t, i) => (
              <StaggerItem key={i}>
                <Card className="h-full transition-all duration-300 hover:border-rht-violet/20">
                  <CardContent className="flex h-full flex-col p-6">
                    <p className="flex-1 text-sm italic text-muted-foreground">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className="mt-4 flex items-center gap-3 border-t pt-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-rht-violet to-rht-violet-light text-xs font-bold text-white">
                        {t.initials}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(156,30,153,0.06),transparent_60%)]" />
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <FadeIn>
            <motion.div
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rht-violet to-rht-violet-light glow-violet"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Shield className="h-8 w-8 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold tracking-tight">
              Prêt à sécuriser vos équipes ?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Rejoignez les entreprises africaines qui transforment leurs employés
              en première ligne de défense contre les cyberattaques.
            </p>
            <div className="mt-8">
              <Link href="/login">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="inline-block">
                  <Button size="lg" className="h-12 rounded-full bg-gradient-to-r from-rht-orange to-rht-orange-light px-8 text-base font-semibold text-white glow-orange hover:opacity-90">
                    Commencer maintenant
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-secondary/50 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-rht-violet-light" />
            <span className="font-bold"><span className="font-normal opacity-60">Rostel</span> CyberSense</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/about" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              À propos
            </Link>
            <p className="text-xs text-muted-foreground">
              &copy; 2026 Rostel High-Tech. Tous droits réservés.
            </p>
          </div>
          <a
            href="https://www.rostelhightech.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-rht-violet-light hover:underline"
          >
            www.rostelhightech.com
          </a>
        </div>
      </footer>

      {/* Devis Dialog */}
      <Dialog open={devisOpen} onOpenChange={setDevisOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Demander un devis — {selectedPlan}</DialogTitle>
            <DialogDescription>
              Remplissez le formulaire et notre équipe vous contactera sous 24h.
            </DialogDescription>
          </DialogHeader>
          {devisSent ? (
            <div className="py-8 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300 }}>
                <CheckCircle className="mx-auto mb-4 h-12 w-12 text-cyber-green" />
              </motion.div>
              <p className="font-semibold">Demande envoyée !</p>
              <p className="mt-1 text-sm text-muted-foreground">Nous vous répondrons très rapidement.</p>
            </div>
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); setDevisSent(true); }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="devis-name">Nom complet</Label>
                <Input id="devis-name" placeholder="Fatou Sow" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="devis-email">Email professionnel</Label>
                <Input id="devis-email" type="email" placeholder="fatou@entreprise.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="devis-org">Organisation</Label>
                <Input id="devis-org" placeholder="Nom de votre entreprise" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="devis-employees">Nombre d&apos;employés</Label>
                <Input id="devis-employees" type="number" placeholder="50" required />
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-rht-orange to-rht-orange-light text-white hover:opacity-90">
                <Send className="mr-2 h-4 w-4" />
                Envoyer la demande
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
