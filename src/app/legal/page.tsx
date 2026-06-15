"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer";
import { Shield, ArrowLeft } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LegalPage() {
  const { locale } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-rht-violet to-cyber-green">
              <Shield className="h-4 w-4 text-gray-900 dark:text-white" />
            </div>
            <span className="text-sm font-bold">
              <span className="font-normal opacity-60">Rox</span>Shield
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

      <main className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-2xl font-bold tracking-tight">
          {locale === "en" ? "Legal" : "Informations légales"}
        </h1>

        <Tabs defaultValue="privacy" className="mt-8">
          <TabsList>
            <TabsTrigger value="privacy">
              {locale === "en" ? "Privacy Policy" : "Politique de confidentialité"}
            </TabsTrigger>
            <TabsTrigger value="terms">
              {locale === "en" ? "Terms of Service" : "Conditions d'utilisation"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="privacy" className="mt-6 space-y-6 text-sm leading-relaxed text-muted-foreground">
            <div>
              <h2 className="mb-2 text-base font-semibold text-foreground">
                {locale === "en" ? "Privacy Policy" : "Politique de confidentialité"}
              </h2>
              <p className="text-xs text-muted-foreground/60">
                {locale === "en" ? "Last updated: May 2026" : "Dernière mise à jour : Mai 2026"}
              </p>
            </div>

            <section className="space-y-2">
              <h3 className="font-semibold text-foreground">1. {locale === "en" ? "Data Collection" : "Collecte des données"}</h3>
              <p>
                {locale === "en"
                  ? "RoxShield collects data necessary for the operation of the platform: name, email, professional role, training results, and phishing simulation responses. All data is collected with the explicit consent of the client organization."
                  : "RoxShield collecte les données nécessaires au fonctionnement de la plateforme : nom, email, rôle professionnel, résultats de formation et réponses aux simulations de phishing. Toutes les données sont collectées avec le consentement explicite de l'organisation cliente."}
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-semibold text-foreground">2. {locale === "en" ? "Data Usage" : "Utilisation des données"}</h3>
              <p>
                {locale === "en"
                  ? "Collected data is used exclusively to provide cybersecurity training, generate risk reports, and improve the platform's effectiveness. We never sell personal data to third parties."
                  : "Les données collectées sont utilisées exclusivement pour fournir les formations en cybersécurité, générer les rapports de risque et améliorer l'efficacité de la plateforme. Nous ne vendons jamais de données personnelles à des tiers."}
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-semibold text-foreground">3. {locale === "en" ? "Data Security" : "Sécurité des données"}</h3>
              <p>
                {locale === "en"
                  ? "All data is encrypted in transit (TLS 1.3) and at rest (AES-256). Access is controlled through role-based permissions. Regular security audits are conducted."
                  : "Toutes les données sont chiffrées en transit (TLS 1.3) et au repos (AES-256). L'accès est contrôlé par des permissions basées sur les rôles. Des audits de sécurité réguliers sont effectués."}
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-semibold text-foreground">4. {locale === "en" ? "Data Retention" : "Conservation des données"}</h3>
              <p>
                {locale === "en"
                  ? "Training data is retained for the duration of the client contract plus 12 months. Upon request, all data can be exported or permanently deleted."
                  : "Les données de formation sont conservées pendant la durée du contrat client plus 12 mois. Sur demande, toutes les données peuvent être exportées ou définitivement supprimées."}
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-semibold text-foreground">5. Contact</h3>
              <p>
                {locale === "en"
                  ? "For any privacy-related inquiry: privacy@rostelhightech.com"
                  : "Pour toute question liée à la confidentialité : privacy@rostelhightech.com"}
              </p>
            </section>
          </TabsContent>

          <TabsContent value="terms" className="mt-6 space-y-6 text-sm leading-relaxed text-muted-foreground">
            <div>
              <h2 className="mb-2 text-base font-semibold text-foreground">
                {locale === "en" ? "Terms of Service" : "Conditions générales d'utilisation"}
              </h2>
              <p className="text-xs text-muted-foreground/60">
                {locale === "en" ? "Last updated: May 2026" : "Dernière mise à jour : Mai 2026"}
              </p>
            </div>

            <section className="space-y-2">
              <h3 className="font-semibold text-foreground">1. {locale === "en" ? "Service Description" : "Description du service"}</h3>
              <p>
                {locale === "en"
                  ? "RoxShield is a SaaS platform for human cybersecurity training, phishing simulation, and risk scoring. The platform is operated by Rostel High-Tech."
                  : "RoxShield est une plateforme SaaS de formation en cybersécurité humaine, simulation de phishing et scoring de risque. La plateforme est opérée par Rostel High-Tech."}
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-semibold text-foreground">2. {locale === "en" ? "Acceptable Use" : "Utilisation acceptable"}</h3>
              <p>
                {locale === "en"
                  ? "The platform must be used solely for legitimate cybersecurity training purposes within your organization. Simulated phishing must only target employees who have been informed of the program."
                  : "La plateforme doit être utilisée uniquement à des fins légitimes de formation en cybersécurité au sein de votre organisation. Le phishing simulé ne doit cibler que les employés informés du programme."}
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-semibold text-foreground">3. {locale === "en" ? "Availability" : "Disponibilité"}</h3>
              <p>
                {locale === "en"
                  ? "We target 99.9% uptime. Planned maintenance windows are communicated 48 hours in advance. We are not liable for downtime caused by third-party infrastructure."
                  : "Nous visons 99,9% de disponibilité. Les fenêtres de maintenance planifiées sont communiquées 48h à l'avance. Nous ne sommes pas responsables des indisponibilités causées par l'infrastructure tierce."}
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-semibold text-foreground">4. {locale === "en" ? "Intellectual Property" : "Propriété intellectuelle"}</h3>
              <p>
                {locale === "en"
                  ? "All content, designs, and algorithms within RoxShield are the property of Rostel High-Tech. Client data remains the property of the client organization."
                  : "Tout le contenu, designs et algorithmes au sein de RoxShield sont la propriété de Rostel High-Tech. Les données client restent la propriété de l'organisation cliente."}
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-semibold text-foreground">5. {locale === "en" ? "Applicable Law" : "Droit applicable"}</h3>
              <p>
                {locale === "en"
                  ? "These terms are governed by Senegalese law. Any disputes will be resolved by the competent courts of Dakar, Senegal."
                  : "Les présentes conditions sont régies par le droit sénégalais. Tout litige sera soumis aux tribunaux compétents de Dakar, Sénégal."}
              </p>
            </section>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
