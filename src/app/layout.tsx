import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Rostel CyberSense — Human Security Training Platform",
    template: "%s | Rostel CyberSense",
  },
  description:
    "Plateforme SaaS de sensibilisation, d'entraînement et de simulation en cybersécurité humaine pour les entreprises africaines. Par Rostel High-Tech.",
  keywords: [
    "cybersécurité",
    "phishing",
    "formation",
    "simulation",
    "sécurité humaine",
    "Afrique",
    "SaaS",
    "Rostel High-Tech",
  ],
  authors: [{ name: "Rostel High-Tech", url: "https://www.rostelhightech.com" }],
  creator: "Rostel High-Tech",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Rostel CyberSense",
    title: "Rostel CyberSense — Human Security Training Platform",
    description:
      "Formez vos équipes, simulez des attaques de phishing et suivez le score de risque humain de votre organisation.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rostel CyberSense",
    description:
      "Plateforme de cybersécurité humaine pour les entreprises africaines.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${montserrat.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full">
        <ThemeProvider>
          {children}
          <Toaster richColors position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
