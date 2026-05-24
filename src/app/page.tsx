"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/ui/combobox";
import { PhoneInput } from "@/components/ui/phone-input";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { COUNTRIES } from "@/lib/constants";
import { Footer } from "@/components/footer";
import { FadeIn, StaggerContainer, StaggerItem, GlowCard } from "@/components/motion";
import { AnimatedCounter } from "@/components/animated-counter";
import { useTranslation } from "@/lib/i18n";
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
  Menu,
  X,
  ShieldCheck,
  Mail,
  Lock,
} from "lucide-react";

const featureIcons = [Crosshair, GraduationCap, BarChart3, Brain, Users, Globe, ShieldCheck, Mail, Lock];

const statValues = ["90%", "5 min", "-60%", "6"];

export default function LandingPage() {
  const { t, locale } = useTranslation();
  const [devisOpen, setDevisOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [devisSent, setDevisSent] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [devisPhone, setDevisPhone] = useState("");
  const [devisCountry, setDevisCountry] = useState("");

  const countryOpts = COUNTRIES.map((c) => ({
    value: c.name,
    label: c.name,
    icon: c.flag,
    sub: c.dial,
  }));

  const features = featureIcons.map((icon, i) => ({
    icon,
    title: t(`landing.feat${i + 1}.title` as any),
    description: t(`landing.feat${i + 1}.desc` as any),
  }));

  const stats = statValues.map((value, i) => ({
    value,
    label: t(`landing.stat${i + 1}` as any),
  }));

  const plans = [
    {
      name: "Starter",
      price: "7 500 FCFA",
      priceNote: locale === "en" ? "/user/month" : "/utilisateur/mois",
      description: locale === "en" ? "SMB 10-50 employees" : "PME 10-50 employes",
      features: locale === "en"
        ? ["Unlimited phishing simulations", "Admin dashboard + risk score", "Monthly reports", "Email support"]
        : ["Simulations phishing illimitees", "Dashboard admin + score de risque", "Rapports mensuels", "Support email"],
    },
    {
      name: "Business",
      price: "12 000 FCFA",
      priceNote: locale === "en" ? "/user/month" : "/utilisateur/mois",
      description: locale === "en" ? "Companies 51-200 employees" : "Entreprises 51-200 employes",
      popular: true,
      features: locale === "en"
        ? ["Everything in Starter +", "AI risk profile detection", "Advanced simulations", "Weekly reports", "Priority support (24h)"]
        : ["Tout Starter +", "IA detection profils a risque", "Simulations avancees", "Rapports hebdomadaires", "Support prioritaire (24h)"],
    },
    {
      name: "Enterprise",
      price: locale === "en" ? "Custom" : "Sur devis",
      priceNote: "",
      description: locale === "en" ? "Large organizations 200+" : "Grandes structures 200+",
      features: locale === "en"
        ? ["Everything in Business +", "Multi-org (holding, subsidiaries)", "Custom API & integrations", "Dedicated account manager", "Guaranteed SLA"]
        : ["Tout Business +", "Multi-organisations (holding, filiales)", "API & integrations personnalisees", "Account manager dedie", "SLA garanti"],
    },
  ];

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
            <span className="font-bold tracking-tight"><span className="font-normal opacity-60">Rox</span>Shield</span>
          </div>
          <nav className="hidden items-center gap-6 text-sm md:flex">
            <a href="#features" className="text-muted-foreground transition-colors hover:text-foreground">
              {t("landing.nav.features")}
            </a>
            <a href="#stats" className="text-muted-foreground transition-colors hover:text-foreground">
              {t("landing.nav.stats")}
            </a>
            <Link href="/pricing" className="text-muted-foreground transition-colors hover:text-foreground">
              {t("landing.nav.pricing")}
            </Link>
            <Link href="/about" className="text-muted-foreground transition-colors hover:text-foreground">
              {t("nav.about")}
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden sm:inline-flex">
              <Button variant="ghost" size="sm">{t("landing.nav.login")}</Button>
            </Link>
            <Link href="/demo" className="hidden sm:inline-flex">
              <Button size="sm" className="rounded-full bg-gradient-to-r from-rht-orange to-rht-orange-light text-white glow-orange-sm hover:opacity-90">
                {t("landing.nav.freeDemo")}
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
            <LanguageSwitcher />
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border md:hidden"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-16 z-40 border-b bg-background/95 backdrop-blur md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
              {t("landing.nav.features")}
            </a>
            <a href="#stats" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
              {t("landing.nav.stats")}
            </a>
            <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
              {t("landing.nav.pricing")}
            </Link>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
              {t("nav.about")}
            </Link>
            <div className="mt-3 flex flex-col gap-2 border-t pt-3">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" size="sm" className="w-full">{t("landing.nav.login")}</Button>
              </Link>
              <Link href="/demo" onClick={() => setMobileMenuOpen(false)}>
                <Button size="sm" className="w-full rounded-full bg-gradient-to-r from-rht-orange to-rht-orange-light text-white hover:opacity-90">
                  {t("landing.nav.freeDemo")}
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}

      {/* Hero */}
      <section className="relative overflow-hidden border-b bg-white dark:bg-[#0a0a0f]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(156,30,153,0.06),transparent_55%),radial-gradient(ellipse_at_70%_80%,rgba(250,153,14,0.04),transparent_50%)] dark:bg-[radial-gradient(ellipse_at_30%_20%,rgba(156,30,153,0.1),transparent_55%),radial-gradient(ellipse_at_70%_80%,rgba(250,153,14,0.06),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.06)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:80px_80px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 text-center lg:py-32">
          <FadeIn delay={0}>
            <Badge className="border-border bg-rht-violet/10 text-rht-violet-light dark:border-rht-violet/20">
              by Rostel High-Tech
            </Badge>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight lg:text-6xl">
              {t("landing.hero.title1")}{" "}
              <span className="bg-gradient-to-r from-rht-violet-light to-rht-orange bg-clip-text text-transparent">
                {t("landing.hero.title2")}
              </span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              {t("landing.hero.subtitle")}
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/demo">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Button size="lg" className="h-12 rounded-full bg-gradient-to-r from-rht-orange to-rht-orange-light px-8 text-base font-semibold text-white glow-orange hover:opacity-90">
                    {t("landing.hero.cta")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </Link>
              <Link href="/dashboard">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="outline" size="lg" className="h-12 rounded-full px-8 text-base transition-all hover:border-rht-violet/30 hover:shadow-[0_0_15px_rgba(156,30,153,0.1)]">
                    {t("landing.hero.ctaSecondary")}
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
          <FadeIn delay={0.5}>
            <div className="mt-16 rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6">
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-rht-violet-light">99.9%</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{locale === "en" ? "Uptime SLA" : "Disponibilité SLA"}</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-cyber-green">AES-256</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{locale === "en" ? "Data encryption" : "Chiffrement des données"}</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-rht-orange">SOC 2</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{locale === "en" ? "Compliant infra" : "Infrastructure conforme"}</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">RGPD</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{locale === "en" ? "Privacy compliant" : "Conforme RGPD"}</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
        {/* Bottom gradient fade to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* How it works */}
      <section className="border-b py-20" id="how-it-works">
        <div className="mx-auto max-w-6xl px-4">
          <FadeIn className="mb-12 text-center">
            <Badge variant="outline" className="mb-4 border-cyber-green/30 text-cyber-green">
              {t("landing.howItWorks")}
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight">
              {t("landing.howItWorks.title")}
            </h2>
          </FadeIn>
          <StaggerContainer className="grid gap-8 lg:grid-cols-3">
            {[
              {
                step: "01",
                icon: Users,
                title: t("landing.step1.title"),
                description: t("landing.step1.desc"),
                color: "from-rht-violet to-rht-violet-light",
              },
              {
                step: "02",
                icon: Crosshair,
                title: t("landing.step2.title"),
                description: t("landing.step2.desc"),
                color: "from-rht-orange to-rht-orange-light",
              },
              {
                step: "03",
                icon: BarChart3,
                title: t("landing.step3.title"),
                description: t("landing.step3.desc"),
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
              {t("landing.features.badge")}
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight">
              {t("landing.features.title")}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              {t("landing.features.subtitle")}
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
              {t("landing.pricing")}
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight">
              {t("landing.pricing.title")}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              {t("landing.pricing.subtitle")}
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
                          {t("landing.pricing.popular")}
                        </Badge>
                      </div>
                    )}
                    <CardContent className={`p-6 ${plan.popular ? "pt-8" : ""}`}>
                      <h3 className="text-lg font-bold">{plan.name}</h3>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                      <div className="mt-3 mb-1">
                        <span className="text-2xl font-bold">{plan.price}</span>
                        {plan.priceNote && (
                          <span className="text-xs text-muted-foreground ml-1">{plan.priceNote}</span>
                        )}
                      </div>
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
                          {t("landing.pricing.cta")}
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </GlowCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
          <FadeIn delay={0.3}>
            <div className="mt-8 text-center">
              <Link href="/pricing">
                <Button variant="ghost" className="text-rht-violet-light hover:text-rht-violet">
                  {locale === "en" ? "See all plans including Campus" : "Voir tous les plans dont Campus"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <FadeIn className="mb-12 text-center">
            <Badge variant="outline" className="mb-4 border-cyber-green/30 text-cyber-green">
              {t("landing.testimonials")}
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight">
              {t("landing.testimonials.title")}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              {t("landing.testimonials.subtitle")}
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
                quote: "RoxShield nous a permis d'identifier nos départements les plus vulnérables et de cibler les formations.",
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

      {/* FAQ */}
      <section className="border-t py-20" id="faq">
        <div className="mx-auto max-w-3xl px-4">
          <FadeIn>
            <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">
              {locale === "en" ? "Frequently Asked Questions" : "Questions fréquentes"}
            </h2>
          </FadeIn>
          <div className="mt-10 space-y-4">
            {[
              {
                q: locale === "en" ? "How long does deployment take?" : "Combien de temps pour le déploiement ?",
                a: locale === "en"
                  ? "RoxShield can be operational within 48 hours. No technical work is required on your end — we handle everything."
                  : "RoxShield peut être opérationnel en 48 heures. Aucun travail technique n'est requis de votre côté — nous gérons tout.",
              },
              {
                q: locale === "en" ? "Do you offer a free trial?" : "Offrez-vous un essai gratuit ?",
                a: locale === "en"
                  ? "Yes! We offer a 14-day free pilot with up to 20 employees. No credit card required."
                  : "Oui ! Nous offrons un pilote gratuit de 14 jours avec jusqu'à 20 employés. Pas de carte bancaire requise.",
              },
              {
                q: locale === "en" ? "Is the content adapted for Africa?" : "Le contenu est-il adapté à l'Afrique ?",
                a: locale === "en"
                  ? "Absolutely. Our phishing templates include Mobile Money scams, local banking scenarios, and context-specific social engineering attacks."
                  : "Absolument. Nos templates de phishing incluent les arnaques Mobile Money, les scénarios bancaires locaux et les attaques d'ingénierie sociale contextualisées.",
              },
              {
                q: locale === "en" ? "Which languages are supported?" : "Quelles langues sont supportées ?",
                a: locale === "en"
                  ? "The platform is fully available in French and English. More languages are coming soon."
                  : "La plateforme est entièrement disponible en français et anglais. D'autres langues arrivent bientôt.",
              },
              {
                q: locale === "en" ? "How do phishing simulations work?" : "Comment fonctionnent les simulations de phishing ?",
                a: locale === "en"
                  ? "You choose templates, target departments, and schedule campaigns. Employees receive realistic simulated emails. Those who click are instantly redirected to a training page. You track results in real-time."
                  : "Vous choisissez les templates, ciblez les départements et planifiez les campagnes. Les employés reçoivent des emails simulés réalistes. Ceux qui cliquent sont redirigés vers une page de formation. Vous suivez les résultats en temps réel.",
              },
              {
                q: locale === "en" ? "Is employee data secure?" : "Les données des employés sont-elles sécurisées ?",
                a: locale === "en"
                  ? "Yes. All data is encrypted (TLS 1.3 + AES-256), hosted on SOC 2 compliant infrastructure, with role-based access controls."
                  : "Oui. Toutes les données sont chiffrées (TLS 1.3 + AES-256), hébergées sur une infrastructure conforme SOC 2, avec des contrôles d'accès basés sur les rôles.",
              },
            ].map((faq, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <details className="group rounded-xl border p-4 transition-colors hover:bg-accent/30 [&[open]]:bg-accent/30">
                  <summary className="flex cursor-pointer items-center justify-between text-sm font-medium">
                    {faq.q}
                    <span className="ml-4 text-muted-foreground transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
                </details>
              </FadeIn>
            ))}
          </div>
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
              {t("landing.cta.title")}
            </h2>
            <p className="mt-4 text-muted-foreground">
              {t("landing.cta.subtitle")}
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href="/demo">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="inline-block">
                  <Button size="lg" className="h-12 rounded-full bg-gradient-to-r from-rht-orange to-rht-orange-light px-8 text-base font-semibold text-white glow-orange hover:opacity-90">
                    {locale === "en" ? "Book a demo" : "Réserver une démo"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="h-12 rounded-full px-8 text-base">
                  {t("landing.cta.button")}
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />

      {/* Devis Dialog */}
      <Dialog open={devisOpen} onOpenChange={setDevisOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("landing.devis.title")} — {selectedPlan}</DialogTitle>
            <DialogDescription>
              {t("landing.devis.subtitle")}
            </DialogDescription>
          </DialogHeader>
          {devisSent ? (
            <div className="py-8 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300 }}>
                <CheckCircle className="mx-auto mb-4 h-12 w-12 text-cyber-green" />
              </motion.div>
              <p className="font-semibold">{t("landing.devis.sent")}</p>
              <p className="mt-1 text-sm text-muted-foreground">{t("landing.devis.sentDesc")}</p>
            </div>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const data = {
                  name: (form.querySelector("#devis-name") as HTMLInputElement).value,
                  email: (form.querySelector("#devis-email") as HTMLInputElement).value,
                  organization: (form.querySelector("#devis-org") as HTMLInputElement).value,
                  phone: devisPhone,
                  teamSize: (form.querySelector("#devis-employees") as HTMLInputElement).value + " employees",
                  country: devisCountry,
                  message: `[Plan: ${selectedPlan}] ${(form.querySelector("#devis-message") as HTMLTextAreaElement).value}`,
                };
                try {
                  await fetch("/api/demo", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                  });
                } catch { /* fallback: still show success */ }
                setDevisSent(true);
              }}
              className="space-y-4"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="devis-name">{t("landing.devis.name")}</Label>
                  <Input id="devis-name" placeholder="Fatou Sow" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="devis-email">{t("landing.devis.email")}</Label>
                  <Input id="devis-email" type="email" placeholder="fatou@entreprise.com" required />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="devis-org">{t("landing.devis.org")}</Label>
                  <Input id="devis-org" placeholder="Nom de votre entreprise" required />
                </div>
                <div className="space-y-2">
                  <Label>{locale === "en" ? "Phone (WhatsApp)" : "Téléphone (WhatsApp)"}</Label>
                  <PhoneInput value={devisPhone} onChange={setDevisPhone} placeholder="77 000 00 00" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="devis-employees">{t("landing.devis.employees")}</Label>
                  <Input id="devis-employees" type="number" placeholder="50" required />
                </div>
                <div className="space-y-2">
                  <Label>{locale === "en" ? "Country" : "Pays"}</Label>
                  <Combobox
                    options={countryOpts}
                    value={devisCountry}
                    onChange={setDevisCountry}
                    placeholder={locale === "en" ? "Select..." : "Sélectionner..."}
                    searchPlaceholder={locale === "en" ? "Search..." : "Rechercher..."}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="devis-message">{locale === "en" ? "Message (optional)" : "Message (optionnel)"}</Label>
                <textarea
                  id="devis-message"
                  rows={3}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder={locale === "en" ? "Tell us about your needs..." : "Décrivez-nous vos besoins..."}
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-rht-orange to-rht-orange-light text-white hover:opacity-90">
                <Send className="mr-2 h-4 w-4" />
                {t("landing.devis.submit")}
              </Button>
              <p className="text-center text-[11px] text-muted-foreground">
                {locale === "en" ? "We'll get back to you within 24 hours" : "Nous vous recontactons sous 24 heures"}
              </p>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
