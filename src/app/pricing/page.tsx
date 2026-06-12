"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/footer";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion";
import { useTranslation } from "@/lib/i18n";
import { motion } from "framer-motion";
import {
  Shield,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  GraduationCap,
  Building2,
  Users,
  Zap,
  HelpCircle,
} from "lucide-react";

const plans = [
  {
    id: "starter",
    name: "Starter",
    target: "PME 10-50 employes",
    targetEn: "SMB 10-50 employees",
    minUsers: 10,
    price_monthly_fcfa: 7500,
    price_yearly_fcfa: 75000,
    price_monthly_usd: 12.50,
    price_yearly_usd: 125,
    icon: Users,
    color: "from-rht-violet to-rht-violet-light",
    features: [
      { fr: "Simulations phishing illimitees", en: "Unlimited phishing simulations" },
      { fr: "Formations de base (phishing, mots de passe, ingenierie sociale)", en: "Basic training (phishing, passwords, social engineering)" },
      { fr: "Dashboard admin avec score de risque", en: "Admin dashboard with risk score" },
      { fr: "Audit hygiene mots de passe + MFA", en: "Password hygiene + MFA audit" },
      { fr: "Score de maturite chiffrement", en: "Encryption maturity score" },
      { fr: "Rapport mensuel automatique", en: "Automatic monthly report" },
      { fr: "Support email", en: "Email support" },
    ],
    highlighted: false,
    cta: { fr: "Essayer 7 jours gratuits", en: "Try 7 days free" },
    trial: 7,
    href: "/demo",
  },
  {
    id: "business",
    name: "Business",
    target: "Entreprises 51-200 employes",
    targetEn: "Companies 51-200 employees",
    minUsers: 20,
    price_monthly_fcfa: 12000,
    price_yearly_fcfa: 120000,
    price_monthly_usd: 20,
    price_yearly_usd: 200,
    icon: Building2,
    color: "from-rht-orange to-rht-orange-light",
    features: [
      { fr: "Tout le plan Starter +", en: "Everything in Starter +" },
      { fr: "IA de detection des profils a risque", en: "AI risk profile detection" },
      { fr: "Securite email avancee (BEC, spear phishing, spoofing)", en: "Advanced email security (BEC, spear phishing, spoofing)" },
      { fr: "Detection Shadow IT (WhatsApp, Telegram, Drive perso)", en: "Shadow IT detection (WhatsApp, Telegram, personal Drive)" },
      { fr: "GRC & Conformite (RGPD, ISO 27001, loi locale)", en: "GRC & Compliance (GDPR, ISO 27001, local law)" },
      { fr: "Simulations avancees (spear phishing, vishing)", en: "Advanced simulations (spear phishing, vishing)" },
      { fr: "Rapports hebdomadaires + analytics avance", en: "Weekly reports + advanced analytics" },
      { fr: "Support prioritaire (24h)", en: "Priority support (24h)" },
    ],
    highlighted: true,
    cta: { fr: "Essayer 14 jours gratuits", en: "Try 14 days free" },
    trial: 14,
    href: "/demo",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    target: "Grandes structures 200+ employes",
    targetEn: "Large organizations 200+ employees",
    minUsers: null,
    price_monthly_fcfa: null,
    price_yearly_fcfa: null,
    price_monthly_usd: null,
    price_yearly_usd: null,
    icon: Zap,
    color: "from-cyber-green to-cyber-green",
    features: [
      { fr: "Tout le plan Business +", en: "Everything in Business +" },
      { fr: "Multi-organisations (holding, filiales)", en: "Multi-org (holding, subsidiaries)" },
      { fr: "Audit chiffrement complet (5 zones)", en: "Full encryption audit (5 zones)" },
      { fr: "Registre des risques + rapports d'audit PDF", en: "Risk register + PDF audit reports" },
      { fr: "API & integrations personnalisees", en: "Custom API & integrations" },
      { fr: "Formations sur mesure", en: "Custom training programs" },
      { fr: "Account manager dedie", en: "Dedicated account manager" },
      { fr: "SLA garanti + onboarding assiste", en: "Guaranteed SLA + assisted onboarding" },
    ],
    highlighted: false,
    cta: { fr: "Nous contacter", en: "Contact us" },
    trial: null,
    href: "/contact",
  },
  {
    id: "campus",
    name: "Campus",
    target: "Ecoles & Universites",
    targetEn: "Schools & Universities",
    minUsers: 50,
    price_monthly_fcfa: 2500,
    price_yearly_fcfa: 25000,
    price_monthly_usd: 4,
    price_yearly_usd: 40,
    icon: GraduationCap,
    color: "from-rht-violet-light to-rht-orange",
    features: [
      {
        fr: "Modules pedagogiques adaptes",
        en: "Adapted educational modules",
      },
      {
        fr: "Certificats etudiants RoxShield",
        en: "RoxShield student certificates",
      },
      { fr: "Tableau de bord enseignant", en: "Teacher dashboard" },
      {
        fr: "Simulations phishing contextualisees",
        en: "Contextual phishing simulations",
      },
      {
        fr: "Rapport de progression par promotion",
        en: "Progress report by class",
      },
      { fr: "Licence enseignant offerte", en: "Free teacher license" },
    ],
    highlighted: false,
    cta: { fr: "Demander un acces Campus", en: "Request Campus access" },
    trial: null,
    href: "/demo",
  },
];

const faqItems = [
  {
    q: {
      fr: "Y a-t-il un engagement minimum ?",
      en: "Is there a minimum commitment?",
    },
    a: {
      fr: "Non, tous nos plans sont sans engagement. Vous pouvez annuler a tout moment. La facturation annuelle offre simplement 2 mois gratuits.",
      en: "No, all our plans are commitment-free. You can cancel anytime. Annual billing simply offers 2 free months.",
    },
  },
  {
    q: {
      fr: "Combien de temps dure le deploiement ?",
      en: "How long does deployment take?",
    },
    a: {
      fr: "RoxShield peut etre operationnel en 48 heures. Nous gerons tout — aucun travail technique n'est requis de votre cote.",
      en: "RoxShield can be operational within 48 hours. We handle everything — no technical work required on your end.",
    },
  },
  {
    q: {
      fr: "Les prix sont-ils par utilisateur ?",
      en: "Are prices per user?",
    },
    a: {
      fr: "Oui, tous les prix sont par utilisateur/etudiant par mois. Le plan Starter demarre a 10 utilisateurs minimum, Business a 20, et Campus a 50 etudiants.",
      en: "Yes, all prices are per user/student per month. Starter starts at 10 users minimum, Business at 20, and Campus at 50 students.",
    },
  },
  {
    q: {
      fr: "Peut-on changer de plan en cours de route ?",
      en: "Can we switch plans later?",
    },
    a: {
      fr: "Absolument. Vous pouvez upgrader a tout moment et la difference sera calculee au prorata. Le downgrade prend effet au prochain cycle de facturation.",
      en: "Absolutely. You can upgrade anytime and the difference is prorated. Downgrade takes effect at the next billing cycle.",
    },
  },
  {
    q: {
      fr: "Acceptez-vous le paiement Mobile Money ?",
      en: "Do you accept Mobile Money payments?",
    },
    a: {
      fr: "Oui ! Nous acceptons Orange Money, Wave, MTN Mobile Money, ainsi que les virements bancaires et cartes Visa/Mastercard.",
      en: "Yes! We accept Orange Money, Wave, MTN Mobile Money, as well as bank transfers and Visa/Mastercard.",
    },
  },
  {
    q: {
      fr: "Le plan Campus inclut-il les enseignants ?",
      en: "Does the Campus plan include teachers?",
    },
    a: {
      fr: "Oui, chaque licence Campus inclut une licence enseignant gratuite pour le superviseur du programme.",
      en: "Yes, each Campus license includes a free teacher license for the program supervisor.",
    },
  },
];

function formatPrice(amount: number) {
  return new Intl.NumberFormat("fr-FR").format(amount);
}

export default function PricingPage() {
  const { locale } = useTranslation();
  const [annual, setAnnual] = useState(true);
  const isFr = locale === "fr";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-rht-violet to-rht-violet-light">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold">
              <span className="font-normal opacity-60">Rox</span>Shield
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/demo">
              <Button size="sm" className="rounded-full bg-gradient-to-r from-rht-orange to-rht-orange-light text-white hover:opacity-90">
                {isFr ? "Demander une demo" : "Request a demo"}
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {isFr ? "Accueil" : "Home"}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(156,30,153,0.08),transparent_60%)]" />
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <FadeIn>
            <Badge variant="outline" className="mb-4 border-rht-orange/30 text-rht-orange">
              {isFr ? "Tarification" : "Pricing"}
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {isFr ? "Protegez vos equipes." : "Protect your teams."}{" "}
              <span className="bg-gradient-to-r from-rht-violet-light to-rht-orange bg-clip-text text-transparent">
                {isFr ? "Choisissez votre plan." : "Choose your plan."}
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              {isFr
                ? "Des tarifs adaptes au marche africain. Sans engagement, avec essai gratuit."
                : "Pricing adapted to the African market. No commitment, with free trial."}
            </p>
          </FadeIn>

          {/* Toggle mensuel / annuel */}
          <FadeIn delay={0.15}>
            <div className="mt-8 flex items-center justify-center gap-3">
              <span
                className={`text-sm font-medium ${!annual ? "text-foreground" : "text-muted-foreground"}`}
              >
                {isFr ? "Mensuel" : "Monthly"}
              </span>
              <button
                onClick={() => setAnnual(!annual)}
                className={`relative h-7 w-12 rounded-full transition-colors ${
                  annual ? "bg-rht-violet" : "bg-muted-foreground/30"
                }`}
              >
                <motion.div
                  animate={{ x: annual ? 22 : 2 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm"
                />
              </button>
              <span
                className={`text-sm font-medium ${annual ? "text-foreground" : "text-muted-foreground"}`}
              >
                {isFr ? "Annuel" : "Annual"}
              </span>
              {annual && (
                <Badge className="border-0 bg-cyber-green/10 text-cyber-green text-[11px]">
                  -17% (2 {isFr ? "mois offerts" : "months free"})
                </Badge>
              )}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Plans */}
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4">
          <StaggerContainer className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const isCustom = plan.price_monthly_fcfa === null;
              const priceFcfa = annual
                ? plan.price_yearly_fcfa
                : plan.price_monthly_fcfa;
              const priceUsd = annual
                ? plan.price_yearly_usd
                : plan.price_monthly_usd;

              return (
                <StaggerItem key={plan.id}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                  >
                    <Card
                      className={`relative h-full overflow-visible transition-all duration-300 ${
                        plan.highlighted
                          ? "border-rht-orange/40 shadow-lg shadow-rht-orange/10"
                          : "hover:border-rht-violet/20"
                      }`}
                    >
                      {plan.highlighted && (
                        <div className="absolute -top-3.5 left-1/2 z-10 -translate-x-1/2">
                          <Badge className="bg-gradient-to-r from-rht-orange to-rht-orange-light px-3 py-1 text-white">
                            {isFr ? "Recommande" : "Recommended"}
                          </Badge>
                        </div>
                      )}
                      <CardContent
                        className={`flex h-full flex-col p-6 ${plan.highlighted ? "pt-8" : ""}`}
                      >
                        {/* Plan header */}
                        <div className="mb-5">
                          <div
                            className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${plan.color}`}
                          >
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <h3 className="text-lg font-bold">{plan.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            {isFr ? plan.target : plan.targetEn}
                          </p>
                        </div>

                        {/* Price */}
                        <div className="mb-5">
                          {isCustom ? (
                            <div>
                              <p className="text-2xl font-bold">
                                {isFr ? "Sur devis" : "Custom"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {isFr
                                  ? "Tarification personnalisee"
                                  : "Custom pricing"}
                              </p>
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-bold">
                                  {formatPrice(priceFcfa!)}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  FCFA
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {annual
                                  ? isFr
                                    ? `par ${plan.id === "campus" ? "etudiant" : "utilisateur"} / an`
                                    : `per ${plan.id === "campus" ? "student" : "user"} / year`
                                  : isFr
                                    ? `par ${plan.id === "campus" ? "etudiant" : "utilisateur"} / mois`
                                    : `per ${plan.id === "campus" ? "student" : "user"} / month`}
                                {" "}
                                <span className="text-muted-foreground/60">
                                  (~${priceUsd}
                                  {annual
                                    ? isFr ? "/an" : "/yr"
                                    : isFr ? "/mois" : "/mo"}
                                  )
                                </span>
                              </p>
                              {plan.minUsers && (
                                <p className="mt-1 text-[11px] text-rht-violet-light">
                                  {isFr ? "Min." : "Min."} {plan.minUsers}{" "}
                                  {plan.id === "campus"
                                    ? isFr ? "etudiants" : "students"
                                    : isFr ? "utilisateurs" : "users"}
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Features */}
                        <ul className="mb-6 flex-1 space-y-2.5">
                          {plan.features.map((f, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-sm"
                            >
                              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-cyber-green" />
                              <span>{isFr ? f.fr : f.en}</span>
                            </li>
                          ))}
                        </ul>

                        {/* CTA */}
                        <Link href={plan.href}>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              className={`w-full rounded-full ${
                                plan.highlighted
                                  ? "bg-gradient-to-r from-rht-orange to-rht-orange-light text-white hover:opacity-90"
                                  : ""
                              }`}
                              variant={plan.highlighted ? "default" : "outline"}
                            >
                              {isFr ? plan.cta.fr : plan.cta.en}
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </motion.div>
                        </Link>

                        {plan.trial && (
                          <p className="mt-2 text-center text-[11px] text-muted-foreground">
                            {plan.trial} {isFr ? "jours gratuits" : "days free"}{" "}
                            {isFr ? "sans engagement" : "no commitment"}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Comparison summary */}
      <section className="border-y bg-secondary/30 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <FadeIn>
            <h2 className="text-2xl font-bold tracking-tight">
              {isFr
                ? "Tous les plans incluent"
                : "All plans include"}
            </h2>
            <div className="mt-8 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
              {[
                { fr: "Chiffrement AES-256", en: "AES-256 encryption" },
                { fr: "SSL / TLS 1.3", en: "SSL / TLS 1.3" },
                { fr: "Conforme RGPD", en: "GDPR compliant" },
                { fr: "Deploiement en 48h", en: "48h deployment" },
                { fr: "9 modules de securite", en: "9 security modules" },
                { fr: "Multi-langue (FR/EN)", en: "Multi-language (FR/EN)" },
                { fr: "Export CSV/PDF", en: "CSV/PDF export" },
                { fr: "Pas d'engagement", en: "No commitment" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-lg border bg-card p-3"
                >
                  <CheckCircle className="h-4 w-4 shrink-0 text-cyber-green" />
                  <span>{isFr ? item.fr : item.en}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4">
          <FadeIn>
            <div className="mb-10 text-center">
              <HelpCircle className="mx-auto mb-3 h-8 w-8 text-muted-foreground/40" />
              <h2 className="text-2xl font-bold tracking-tight">
                {isFr ? "Questions frequentes" : "Frequently Asked Questions"}
              </h2>
            </div>
          </FadeIn>
          <div className="space-y-3">
            {faqItems.map((faq, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <details className="group rounded-xl border p-4 transition-colors hover:bg-accent/30 [&[open]]:bg-accent/30">
                  <summary className="flex cursor-pointer items-center justify-between text-sm font-medium">
                    {isFr ? faq.q.fr : faq.q.en}
                    <span className="ml-4 text-muted-foreground transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {isFr ? faq.a.fr : faq.a.en}
                  </p>
                </details>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="border-t bg-secondary/30 py-16">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <FadeIn>
            <h2 className="text-2xl font-bold">
              {isFr
                ? "Pret a securiser votre equipe ?"
                : "Ready to secure your team?"}
            </h2>
            <p className="mt-3 text-muted-foreground">
              {isFr
                ? "Demandez une demo personnalisee ou contactez-nous pour un devis sur mesure."
                : "Request a personalized demo or contact us for a custom quote."}
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href="/demo">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    size="lg"
                    className="rounded-full bg-gradient-to-r from-rht-orange to-rht-orange-light px-8 text-white hover:opacity-90"
                  >
                    {isFr ? "Demander une demo" : "Request a demo"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="rounded-full px-8">
                  {isFr ? "Nous contacter" : "Contact us"}
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  );
}
