"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Combobox } from "@/components/ui/combobox";
import { PhoneInput } from "@/components/ui/phone-input";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { Footer } from "@/components/footer";
import { COUNTRIES, SECTORS } from "@/lib/constants";
import {
  Shield,
  Send,
  CheckCircle,
  ArrowLeft,
  Play,
  Clock,
  Users,
  BarChart3,
  Crosshair,
  Sparkles,
  GraduationCap,
} from "lucide-react";

const demoFeatures = [
  { icon: Crosshair, title: "Simulations de phishing", desc: "Campagnes personnalisées avec templates africains" },
  { icon: GraduationCap, title: "Modules de formation", desc: "Cours interactifs gamifiés avec quiz" },
  { icon: BarChart3, title: "Dashboard analytics", desc: "Score de risque, tendances, comparaison" },
  { icon: Users, title: "Gestion d'équipe", desc: "Multi-départements, import bulk, rôles" },
];

const countryOptions = COUNTRIES.map((c) => ({
  value: c.name,
  label: c.name,
  icon: c.flag,
  sub: c.dial,
}));

const sectorOptions = SECTORS.map((s) => ({
  value: s,
  label: s,
}));

export default function DemoPage() {
  const { locale } = useTranslation();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formCompany, setFormCompany] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formSize, setFormSize] = useState("");
  const [formCountry, setFormCountry] = useState("");
  const [formSector, setFormSector] = useState("");
  const [formNeeds, setFormNeeds] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail || !formCompany || !formPhone || !formSize || !formCountry) return;

    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName,
          email: formEmail,
          organization: formCompany,
          phone: formPhone,
          teamSize: formSize,
          country: formCountry,
          sector: formSector,
          message: formNeeds,
        }),
      });
      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      setError(locale === "en" ? "Failed to send. Please try again." : "Erreur d'envoi. Veuillez réessayer.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-rht-violet to-cyber-green">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-bold">
              <span className="font-normal opacity-60">Rox</span>Shield
            </span>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              {locale === "en" ? "Back to site" : "Retour au site"}
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          {/* Left: Value proposition */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div>
              <Badge className="mb-4 border-0 bg-rht-violet/10 text-rht-violet">
                <Play className="mr-1 h-3 w-3" />
                {locale === "en" ? "Live Demo" : "Démo en direct"}
              </Badge>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {locale === "en"
                  ? "See RoxShield in action"
                  : "Voyez RoxShield en action"}
              </h1>
              <p className="mt-3 text-lg text-muted-foreground">
                {locale === "en"
                  ? "Book a personalized 30-minute demo with our team. We'll show you how to reduce your human risk."
                  : "Réservez une démo personnalisée de 30 minutes avec notre équipe. Nous vous montrerons comment réduire votre risque humain."}
              </p>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-rht-violet" />
                <span>30 min</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-rht-orange" />
                <span>{locale === "en" ? "No commitment" : "Sans engagement"}</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {locale === "en" ? "What you'll see" : "Ce que vous verrez"}
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {demoFeatures.map((feat) => (
                  <div key={feat.title} className="flex items-start gap-3 rounded-xl border p-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rht-violet/10">
                      <feat.icon className="h-4 w-4 text-rht-violet" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{feat.title}</p>
                      <p className="text-[11px] text-muted-foreground">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border bg-accent/30 p-4">
              <p className="text-sm italic text-muted-foreground">
                &ldquo;{locale === "en"
                  ? "After the demo, we set up a full pilot in under 48 hours. No engineering work required on your side."
                  : "Après la démo, nous mettons en place un pilote complet en moins de 48h. Aucun travail technique requis de votre côté."}&rdquo;
              </p>
              <p className="mt-2 text-xs font-medium">— Herdy Rostel Youlou, CEO Rostel High-Tech</p>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card className="border-rht-violet/20">
              <CardContent className="p-6">
                {sent ? (
                  <div className="py-12 text-center">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                      <CheckCircle className="mx-auto mb-4 h-14 w-14 text-cyber-green" />
                    </motion.div>
                    <h3 className="text-xl font-semibold">
                      {locale === "en" ? "Demo booked!" : "Démo réservée !"}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {locale === "en"
                        ? "Our team will contact you within 24 hours to confirm the slot."
                        : "Notre équipe vous contacte sous 24h pour confirmer le créneau."}
                    </p>
                    <Link href="/login">
                      <Button className="mt-6" variant="outline">
                        {locale === "en" ? "Try the platform now" : "Essayer la plateforme maintenant"} →
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <h3 className="text-lg font-semibold">
                      {locale === "en" ? "Book your demo" : "Réservez votre démo"}
                    </h3>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>{locale === "en" ? "Full name" : "Nom complet"} *</Label>
                        <Input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Fatou Sow" required />
                      </div>
                      <div className="space-y-2">
                        <Label>Email *</Label>
                        <Input value={formEmail} onChange={(e) => setFormEmail(e.target.value)} type="email" placeholder="fatou@entreprise.com" required />
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>{locale === "en" ? "Company" : "Entreprise"} *</Label>
                        <Input value={formCompany} onChange={(e) => setFormCompany(e.target.value)} placeholder="Safi Sénégal SARL" required />
                      </div>
                      <div className="space-y-2">
                        <Label>{locale === "en" ? "Phone / WhatsApp" : "Tél / WhatsApp"} *</Label>
                        <PhoneInput value={formPhone} onChange={setFormPhone} placeholder="77 000 00 00" />
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>{locale === "en" ? "Team size" : "Taille d'équipe"} *</Label>
                        <select
                          value={formSize}
                          onChange={(e) => setFormSize(e.target.value)}
                          required
                          className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs"
                        >
                          <option value="">—</option>
                          <option value="1-20">1 – 20</option>
                          <option value="21-50">21 – 50</option>
                          <option value="51-200">51 – 200</option>
                          <option value="201-500">201 – 500</option>
                          <option value="500+">500+</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label>{locale === "en" ? "Country" : "Pays"} *</Label>
                        <Combobox
                          options={countryOptions}
                          value={formCountry}
                          onChange={setFormCountry}
                          placeholder={locale === "en" ? "Select..." : "Sélectionner..."}
                          searchPlaceholder={locale === "en" ? "Search country..." : "Rechercher un pays..."}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>{locale === "en" ? "Sector" : "Secteur d'activité"}</Label>
                      <Combobox
                        options={sectorOptions}
                        value={formSector}
                        onChange={setFormSector}
                        placeholder={locale === "en" ? "Select a sector..." : "Sélectionner un secteur..."}
                        searchPlaceholder={locale === "en" ? "Search..." : "Rechercher..."}
                        allowCustom
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{locale === "en" ? "Main challenge" : "Défi principal"}</Label>
                      <textarea
                        value={formNeeds}
                        onChange={(e) => setFormNeeds(e.target.value)}
                        rows={3}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder={locale === "en"
                          ? "What's your biggest security awareness challenge?"
                          : "Quel est votre plus grand défi en sensibilisation sécurité ?"}
                      />
                    </div>

                    {error && (
                      <p className="text-sm text-red-500">{error}</p>
                    )}
                    <Button
                      type="submit"
                      disabled={sending}
                      className="w-full bg-gradient-to-r from-rht-violet to-rht-violet-light text-white hover:opacity-90 disabled:opacity-50"
                      size="lg"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      {sending
                        ? (locale === "en" ? "Sending..." : "Envoi en cours...")
                        : (locale === "en" ? "Request my demo" : "Demander ma démo")}
                    </Button>

                    <p className="text-center text-[11px] text-muted-foreground">
                      {locale === "en"
                        ? "Free, no commitment. Our team will confirm within 24h."
                        : "Gratuit, sans engagement. Confirmation sous 24h."}
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
