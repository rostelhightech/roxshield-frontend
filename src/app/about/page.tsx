"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { Footer } from "@/components/footer";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion";
import { motion } from "framer-motion";
import {
  Shield,
  ArrowLeft,
  Globe,
  Lightbulb,
  Heart,
  MapPin,
  Mail,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";

const valuesMeta = [
  {
    icon: Shield,
    titleKey: "about.value1Title" as const,
    descKey: "about.value1Desc" as const,
    color: "text-rht-violet-light",
    bg: "bg-rht-violet/10",
  },
  {
    icon: Globe,
    titleKey: "about.value2Title" as const,
    descKey: "about.value2Desc" as const,
    color: "text-rht-orange",
    bg: "bg-rht-orange/10",
  },
  {
    icon: Lightbulb,
    titleKey: "about.value3Title" as const,
    descKey: "about.value3Desc" as const,
    color: "text-cyber-green",
    bg: "bg-cyber-green/10",
  },
  {
    icon: Heart,
    titleKey: "about.value4Title" as const,
    descKey: "about.value4Desc" as const,
    color: "text-cyber-red",
    bg: "bg-cyber-red/10",
  },
];

const teamMeta = [
  {
    name: "Herdy Rostel Youlou",
    roleKey: "about.role.ceo" as const,
    initials: "HY",
    bioKey: "about.bio.herdy" as const,
    gradient: "from-rht-orange to-rht-orange-light",
  },
  {
    name: "Aminata Diallo",
    roleKey: "about.role.product" as const,
    initials: "AD",
    bioKey: "about.bio.aminata" as const,
    gradient: "from-rht-violet to-rht-violet-light",
  },
  {
    name: "Kouame Assi",
    roleKey: "about.role.engineer" as const,
    initials: "KA",
    bioKey: "about.bio.kouame" as const,
    gradient: "from-cyber-green/80 to-cyber-green",
  },
  {
    name: "Fatou Sow",
    roleKey: "about.role.security" as const,
    initials: "FS",
    bioKey: "about.bio.fatou" as const,
    gradient: "from-rht-violet-light to-rht-orange",
  },
];

const milestonesMeta = [
  { year: "2021", textKey: "about.milestone1" as const },
  { year: "2024", textKey: "about.milestone2" as const },
  { year: "2025", textKey: "about.milestone3" as const },
  { year: "2026", textKey: "about.milestone4" as const },
];

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-rht-violet to-rht-violet-light">
              <Shield className="h-4 w-4 text-gray-900 dark:text-white" />
            </div>
            <span className="font-bold"><span className="font-normal opacity-60">Rox</span>Shield</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("about.home")}
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
              {t("about.badge")}
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight">
              {t("about.heroTitle1")}<br />
              <span className="bg-linear-to-r from-rht-violet to-rht-orange bg-clip-text text-transparent">
                {t("about.heroTitle2")}
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              {t("about.heroDesc")}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Mission */}
      <section className="border-y bg-secondary/30 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <FadeIn className="mb-10 text-center">
            <h2 className="text-2xl font-bold">{t("about.missionTitle")}</h2>
            <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
              {t("about.missionDesc")}
            </p>
          </FadeIn>
          <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {valuesMeta.map((v) => (
              <StaggerItem key={v.titleKey}>
                <Card className="h-full transition-all duration-300 hover:border-rht-violet/20">
                  <CardContent className="p-6 text-center">
                    <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${v.bg}`}>
                      <v.icon className={`h-6 w-6 ${v.color}`} />
                    </div>
                    <h3 className="font-semibold">{t(v.titleKey)}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{t(v.descKey)}</p>
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
              {t("about.teamBadge")}
            </Badge>
            <h2 className="text-2xl font-bold">{t("about.teamTitle")}</h2>
            <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
              {t("about.teamDesc")}
            </p>
          </FadeIn>
          <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {teamMeta.map((member) => (
              <StaggerItem key={member.name}>
                <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                  <Card className="h-full transition-all duration-300 hover:border-rht-violet/20">
                    <CardContent className="p-6 text-center">
                      <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${member.gradient} text-lg font-bold text-gray-900 dark:text-white`}>
                        {member.initials}
                      </div>
                      <h3 className="font-semibold">{member.name}</h3>
                      <p className="text-xs text-rht-violet-light">{t(member.roleKey)}</p>
                      <p className="mt-2 text-sm text-muted-foreground">{t(member.bioKey)}</p>
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
            <h2 className="text-2xl font-bold">{t("about.timelineTitle")}</h2>
          </FadeIn>
          <div className="space-y-6">
            {milestonesMeta.map((m, i) => (
              <FadeIn key={m.year} delay={i * 0.1}>
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-rht-violet to-rht-violet-light text-xs font-bold text-gray-900 dark:text-white">
                      {m.year}
                    </div>
                    {i < milestonesMeta.length - 1 && (
                      <div className="mt-2 h-full w-px bg-border" />
                    )}
                  </div>
                  <div className="flex-1 rounded-xl border p-4">
                    <p className="text-sm">{t(m.textKey)}</p>
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
              <Mail className="h-8 w-8 text-gray-900 dark:text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold">{t("about.contactTitle")}</h2>
            <p className="mt-2 text-muted-foreground">
              {t("about.contactDesc")}
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                contact@rostelhightech.com
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                Dakar, Senegal
              </div>
            </div>
            <div className="mt-6">
              <Link href="/">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="inline-block">
                  <Button size="lg" className="rounded-full bg-linear-to-r from-rht-orange to-rht-orange-light px-8 text-gray-900 dark:text-white hover:opacity-90">
                    {t("about.backHome")}
                  </Button>
                </motion.div>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  );
}
