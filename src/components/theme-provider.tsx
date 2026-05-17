"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { I18nProvider } from "@/lib/i18n";
import { CommandPalette } from "@/components/command-palette";
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts";
import { BackToTop } from "@/components/back-to-top";
import { ScrollProgress } from "@/components/scroll-progress";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <I18nProvider>
        {children}
        <CommandPalette />
        <KeyboardShortcuts />
        <BackToTop />
        <ScrollProgress />
      </I18nProvider>
    </NextThemesProvider>
  );
}
