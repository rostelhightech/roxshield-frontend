"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Combobox } from "@/components/ui/combobox";
import { PhoneInput } from "@/components/ui/phone-input";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { COUNTRIES, SECTORS } from "@/lib/constants";
import { useDemoStore } from "@/store/demo.store";
import { HexagonIcon } from "../ui/HexagonIcon";
import {
  Shield,
  Send,
  CheckCircle,
  Clock,
  Sparkles,
  Users,
  Target,
  BarChart3,
} from "lucide-react";
import { Link, useSearch } from "@tanstack/react-router";

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

const features = [
  {
    icon: Target,
    label: "Campagnes de phishing simulées",
    sub: "Testez vos équipes en conditions réelles",
  },
  {
    icon: Users,
    label: "Gestion des utilisateurs",
    sub: "Organisez et segmentez vos cibles",
  },
  {
    icon: BarChart3,
    label: "Rapports détaillés",
    sub: "Suivez les taux de clics et de sensibilisation",
  },
];

export default function RegisterPage() {
  const { locale } = useTranslation();
  const { createDemoRequest, isLoading } = useDemoStore();
  const [sent, setSent] = useState(false);
  const search = useSearch({ from: "/register" }) as { ref?: string };

  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formCompany, setFormCompany] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formSize, setFormSize] = useState("");
  const [formCountry, setFormCountry] = useState("");
  const [formSector, setFormSector] = useState("");
  const [formNeeds, setFormNeeds] = useState("");

  useEffect(() => {
    if (search?.ref) {
      localStorage.setItem("ambassadorRef", search.ref);
    }
  }, [search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail || !formCompany || !formPhone || !formSize || !formCountry) return;

    const ambassadorRef = localStorage.getItem("ambassadorRef");

    const success = await createDemoRequest({
      name: formCompany,
      adminName: formName,
      adminEmail: formEmail,
      adminPhone: formPhone,
      companySize: formSize,
      country: formCountry,
      sector: formSector || undefined,
      message: formNeeds || undefined,
      type: "enterprise",
      referredByAmbassadorId: ambassadorRef || undefined,
    });

    if (success) {
      setSent(true);
      localStorage.removeItem("ambassadorRef");
    }
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-[#070b18]">
      {/* ── Colonne gauche : image + overlay ── */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative hidden lg:flex lg:w-1/2 flex-col justify-between overflow-hidden p-12"
      >
        {/* Image de fond */}
        <img
          src="https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg?auto=compress&cs=tinysrgb&w=1280"
          alt="Cybersecurity"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Overlay sombre */}
        <div className="absolute inset-0 bg-[#070b18]/70" />

        {/* Tint violet en bas */}
        <div className="absolute inset-0 bg-gradient-to-t from-rht-violet/20 via-transparent to-transparent" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-rht-violet to-cyber-green">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-bold text-white">
            <span className="font-normal opacity-60">Rox</span>Shield
          </span>
        </div>

        {/* Contenu central */}
        <div className="relative z-10 max-w-sm">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold text-white mb-3"
            style={{ textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}
          >
            {locale === "en"
              ? "Try RoxShield for free"
              : "Essayez RoxShield gratuitement"}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="text-gray-300 text-base mb-8"
          >
            {locale === "en"
              ? "Start your 30-day free trial. No credit card required."
              : "30 jours gratuits, sans carte bancaire. Accès immédiat à toutes les fonctionnalités."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="space-y-4"
          >
            {features.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rht-violet/30 border border-rht-violet/40">
                  <Icon className="h-4 w-4 text-rht-violet-light" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
                    {label}
                  </p>
                  <p className="text-xs text-gray-400">{sub}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Citation bas de page */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="relative z-10 rounded-lg border border-white/10 bg-black/30 backdrop-blur-sm p-4"
        >
          <p className="text-sm italic text-gray-300">
            &ldquo;{locale === "en"
              ? "After sign-up, your trial account is activated immediately."
              : "Après inscription, votre compte d'essai est activé immédiatement."}&rdquo;
          </p>
          <p className="mt-2 text-xs font-medium text-white">
            — Herdy Rostel Youlou, CEO Rostel High-Tech
          </p>
        </motion.div>
      </motion.div>

      {/* ── Colonne droite : formulaire ── */}
      <div className=" relative flex w-full flex-col justify-center   lg:w-1/2   overflow-y-auto py-6">
        {/* Lien retour site */}
        <motion.a
          href="https://roxshield.com"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute right-6 top-6 z-20 flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-white"
        >
          <Shield className="h-4 w-4" />
          <span>
            <span className="font-normal opacity-60">Rox</span>Shield
          </span>
        </motion.a>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto w-full max-w-xl"
        >
          {sent ? (
            /* ── État succès ── */
            <div className="py-16 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring" }}
              >
                <CheckCircle className="mx-auto mb-4 h-14 w-14 text-cyber-green" />
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {locale === "en" ? "Trial activated!" : "Essai activé !"}
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {locale === "en"
                  ? "Our team will contact you within 24 hours."
                  : "Notre équipe vous contacte sous 24h pour activer votre compte."}
              </p>
              <Link to="/login">
                <Button className="mt-6" variant="outline">
                  {locale === "en" ? "Sign in to the platform" : "Se connecter à la plateforme"} →
                </Button>
              </Link>
            </div>
          ) : (
            /* ── Formulaire ── */
            <>
              <div className="mb-8">
                <motion.div className="relative mb-6 inline-flex h-14 w-14">
                  <HexagonIcon />
                  <Shield className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-rht-violet-light" />
                </motion.div>

                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {locale === "en" ? "Start your free trial" : "Commencez gratuitement"}
                </h1>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  {locale === "en"
                    ? "30 days free, no credit card required."
                    : "30 jours gratuits, aucune carte bancaire requise."}
                </p>

                <div className="mt-3 flex items-center gap-5 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-rht-violet" />
                    <span>{locale === "en" ? "30 days free" : "30 jours offerts"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-rht-orange" />
                    <span>{locale === "en" ? "No commitment" : "Sans engagement"}</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 w-full">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {locale === "en" ? "Full name" : "Nom complet"} *
                    </Label>
                    <Input
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Fatou Sow"
                      required
                      className="h-12 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email *
                    </Label>
                    <Input
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      type="email"
                      placeholder="fatou@entreprise.com"
                      required
                      className="h-12 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {locale === "en" ? "Company" : "Entreprise"} *
                    </Label>
                    <Input
                      value={formCompany}
                      onChange={(e) => setFormCompany(e.target.value)}
                      placeholder="Safi Sénégal SARL"
                      required
                      className="h-12 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {locale === "en" ? "Phone / WhatsApp" : "Tél / WhatsApp"} *
                    </Label>
                    <PhoneInput
                      value={formPhone}
                      onChange={setFormPhone}
                      placeholder="77 000 00 00"
                      className="h-12 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {locale === "en" ? "Team size" : "Taille d'équipe"} *
                    </Label>
                    <select
                      value={formSize}
                      onChange={(e) => setFormSize(e.target.value)}
                      required
                      className="h-12 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/50 px-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rht-violet/20 focus:border-rht-violet"
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
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {locale === "en" ? "Country" : "Pays"} *
                    </Label>
                    <Combobox
                      options={countryOptions}
                      value={formCountry}
                      onChange={setFormCountry}
                      placeholder={locale === "en" ? "Select..." : "Sélectionner..."}
                      searchPlaceholder={locale === "en" ? "Search country..." : "Rechercher un pays..."}
                      className="h-12 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {locale === "en" ? "Sector" : "Secteur d'activité"}
                  </Label>
                  <Combobox
                    options={sectorOptions}
                    value={formSector}
                    onChange={setFormSector}
                    placeholder={locale === "en" ? "Select a sector..." : "Sélectionner un secteur..."}
                    searchPlaceholder={locale === "en" ? "Search..." : "Rechercher..."}
                    allowCustom
                    className="border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {locale === "en" ? "Main challenge" : "Défi principal"}{" "}
                    <span className="text-gray-400">(optionnel)</span>
                  </Label>
                  <textarea
                    value={formNeeds}
                    onChange={(e) => setFormNeeds(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/50 px-3 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-rht-violet/20 focus:border-rht-violet"
                    placeholder={
                      locale === "en"
                        ? "What's your biggest security awareness challenge?"
                        : "Quel est votre plus grand défi en sensibilisation sécurité ?"
                    }
                  />
                </div>

                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="pt-2">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="relative h-12 w-full overflow-hidden rounded-lg  font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        {locale === "en" ? "Sending..." : "Envoi en cours..."}
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Send className="h-4 w-4" />
                        {locale === "en" ? "Start free trial" : "Commencer l'essai gratuit"}
                      </span>
                    )}
                  </Button>
                </motion.div>

                <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                  {locale === "en"
                    ? "30 days free · No credit card · Account activation within 24h"
                    : "30 jours gratuits · Sans carte bancaire · Activation sous 24h"}
                </p>

                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                  {locale === "en" ? "Already have an account?" : "Vous avez déjà un compte ?"}{" "}
                   <Link
  to="/login"
  className="font-medium text-[#6366f1] hover:text-[#818cf8] transition-colors"
>
  {locale === "en" ? "Sign in" : "Se connecter"}
</Link>
                
                </p>
              </form>
            </>
          )}
        </motion.div>

    
      </div>
    </div>
  );
}