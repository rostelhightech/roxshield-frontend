"use client";

import { useTranslation, type Locale } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();

  const toggle = () => {
    const next: Locale = locale === "fr" ? "en" : "fr";
    setLocale(next);
    // Persister la préférence de langue côté serveur
    fetch("/api/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale: next }),
    }).catch(() => {});
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      className="h-9 w-9 relative"
      title={locale === "fr" ? "Switch to English" : "Passer en français"}
    >
      <Globe className="h-4 w-4" />
      <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rht-violet text-[8px] font-bold text-white uppercase">
        {locale}
      </span>
    </Button>
  );
}
