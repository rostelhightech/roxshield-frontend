"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { I18nProvider } from "@/lib/i18n";
import { BackToTop } from "@/components/back-to-top";
import { ScrollProgress } from "@/components/scroll-progress";
import { SkipToContent } from "@/components/skip-to-content";
import { NetworkStatus } from "@/components/network-status";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <I18nProvider>
        <SkipToContent />
        {children}
        <BackToTop />
        <ScrollProgress />
        <NetworkStatus />
      </I18nProvider>
    </NextThemesProvider>
  );
}
