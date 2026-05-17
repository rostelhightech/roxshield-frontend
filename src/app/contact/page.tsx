"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import {
  Shield,
  Send,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  ArrowLeft,
  MessageCircle,
  Building2,
  Clock,
} from "lucide-react";

export default function ContactPage() {
  const { locale } = useTranslation();
  const [sent, setSent] = useState(false);

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "contact@rostelhightech.com",
      href: "mailto:contact@rostelhightech.com",
    },
    {
      icon: Phone,
      label: locale === "en" ? "Phone / WhatsApp" : "Téléphone / WhatsApp",
      value: "+221 78 123 45 67",
      href: "https://wa.me/22178123456",
    },
    {
      icon: MapPin,
      label: locale === "en" ? "Location" : "Localisation",
      value: "Dakar, Sénégal",
      href: null,
    },
    {
      icon: Clock,
      label: locale === "en" ? "Availability" : "Disponibilité",
      value: locale === "en" ? "Mon-Fri, 9AM-6PM GMT" : "Lun-Ven, 9h-18h GMT",
      href: null,
    },
  ];

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
              <span className="font-normal opacity-60">Rostel</span> CyberSense
            </span>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              {locale === "en" ? "Back" : "Retour"}
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {locale === "en" ? "Get in Touch" : "Contactez-nous"}
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            {locale === "en"
              ? "Ready to secure your team? Let's talk about your needs."
              : "Prêt à sécuriser votre équipe ? Parlons de vos besoins."}
          </p>
        </motion.div>

        <div className="mt-12 grid gap-8 lg:grid-cols-5">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6 lg:col-span-2"
          >
            <div className="space-y-4">
              {contactInfo.map((info) => (
                <div key={info.label} className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rht-violet/10">
                    <info.icon className="h-5 w-5 text-rht-violet" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {info.label}
                    </p>
                    {info.href ? (
                      <a href={info.href} className="text-sm font-medium hover:text-primary transition-colors">
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-sm font-medium">{info.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Card className="border-cyber-green/20 bg-cyber-green/5">
              <CardContent className="flex items-start gap-3 p-4">
                <MessageCircle className="h-5 w-5 shrink-0 text-cyber-green mt-0.5" />
                <div>
                  <p className="text-sm font-medium">
                    {locale === "en" ? "Prefer WhatsApp?" : "Vous préférez WhatsApp ?"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {locale === "en"
                      ? "Send us a message and we'll respond within the hour."
                      : "Envoyez-nous un message et nous vous répondons dans l'heure."}
                  </p>
                  <a
                    href="https://wa.me/22178123456?text=Bonjour, je souhaite en savoir plus sur CyberSense"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-cyber-green hover:underline"
                  >
                    {locale === "en" ? "Open WhatsApp" : "Ouvrir WhatsApp"} →
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <Card>
              <CardContent className="p-6">
                {sent ? (
                  <div className="py-12 text-center">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                      <CheckCircle className="mx-auto mb-4 h-14 w-14 text-cyber-green" />
                    </motion.div>
                    <h3 className="text-lg font-semibold">
                      {locale === "en" ? "Message sent!" : "Message envoyé !"}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {locale === "en"
                        ? "Our team will get back to you within 24 hours."
                        : "Notre équipe vous recontacte sous 24 heures."}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="contact-name">
                          {locale === "en" ? "Full name" : "Nom complet"} *
                        </Label>
                        <Input id="contact-name" placeholder="Herdy Rostel Youlou" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact-email">Email *</Label>
                        <Input id="contact-email" type="email" placeholder="vous@entreprise.com" required />
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="contact-company">
                          <Building2 className="mr-1 inline h-3 w-3" />
                          {locale === "en" ? "Company" : "Entreprise"} *
                        </Label>
                        <Input id="contact-company" placeholder="Nom de votre entreprise" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact-phone">
                          <Phone className="mr-1 inline h-3 w-3" />
                          {locale === "en" ? "Phone / WhatsApp" : "Téléphone / WhatsApp"}
                        </Label>
                        <Input id="contact-phone" type="tel" placeholder="+221 77 000 00 00" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-subject">
                        {locale === "en" ? "Subject" : "Objet"} *
                      </Label>
                      <select
                        id="contact-subject"
                        required
                        className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
                      >
                        <option value="">{locale === "en" ? "Select a subject..." : "Sélectionnez un sujet..."}</option>
                        <option value="demo">{locale === "en" ? "Request a demo" : "Demander une démo"}</option>
                        <option value="pricing">{locale === "en" ? "Pricing inquiry" : "Demande de tarifs"}</option>
                        <option value="partnership">{locale === "en" ? "Partnership" : "Partenariat"}</option>
                        <option value="support">{locale === "en" ? "Technical support" : "Support technique"}</option>
                        <option value="other">{locale === "en" ? "Other" : "Autre"}</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-message">Message *</Label>
                      <textarea
                        id="contact-message"
                        rows={5}
                        required
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder={locale === "en"
                          ? "How can we help you? Tell us about your team size, challenges, and goals..."
                          : "Comment pouvons-nous vous aider ? Parlez-nous de la taille de votre équipe, vos défis et objectifs..."}
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-rht-violet to-rht-violet-light text-white hover:opacity-90"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      {locale === "en" ? "Send message" : "Envoyer le message"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
