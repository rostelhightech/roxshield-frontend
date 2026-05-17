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
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.svg",
    apple: "/icons/icon-192.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CyberSense",
  },
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
  metadataBase: new URL("https://rostel-cybersense.vercel.app"),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Rostel CyberSense",
    title: "Rostel CyberSense — Human Security Training Platform",
    description:
      "Formez vos équipes, simulez des attaques de phishing et suivez le score de risque humain de votre organisation.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Rostel CyberSense — Human Security Training Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rostel CyberSense",
    description:
      "Plateforme de cybersécurité humaine pour les entreprises africaines.",
    images: ["/og-image.svg"],
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
      <head>
        <meta name="theme-color" content="#9c1e99" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-full">
        <ThemeProvider>
          {children}
          <Toaster richColors position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
