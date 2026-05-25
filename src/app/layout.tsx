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
    default: "RoxShield — Human Security Training Platform",
    template: "%s | RoxShield",
  },
  description:
    "Human cybersecurity awareness, training & phishing simulation platform for African businesses. By Rostel High-Tech.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.svg",
    apple: "/icons/icon-192.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "RoxShield",
  },
  keywords: [
    "cybersecurity",
    "phishing",
    "training",
    "simulation",
    "human security",
    "Africa",
    "SaaS",
    "Rostel High-Tech",
  ],
  authors: [{ name: "Rostel High-Tech", url: "https://www.rostelhightech.com" }],
  creator: "Rostel High-Tech",
  metadataBase: new URL(process.env.NEXTAUTH_URL || "https://roxshield.vercel.app"),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "RoxShield",
    title: "RoxShield — Human Security Training Platform",
    description:
      "Train your teams, simulate phishing attacks & track your organization's human risk score.",
  },
  twitter: {
    card: "summary_large_image",
    title: "RoxShield",
    description:
      "Human cybersecurity platform for African businesses.",
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
    <html lang="en" className={`${montserrat.variable} h-full antialiased`} suppressHydrationWarning>
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
