"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { I18nProvider } from "@/lib/i18n";
import { CommandPalette } from "@/components/command-palette";
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <I18nProvider>
        {children}
        <CommandPalette />
        <KeyboardShortcuts />
      </I18nProvider>
    </NextThemesProvider>
  );
}
