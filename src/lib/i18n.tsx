/**
 * Shim de compatibilité — ré-exporte react-i18next avec la même API
 * que l'ancien système custom (t, locale, setLocale).
 * Tous les composants qui importent depuis @/lib/i18n continuent
 * de fonctionner sans modification.
 */
import React from 'react';
import { useTranslation as useReactI18next } from 'react-i18next';

export type Locale = 'fr' | 'en' | 'pt';

export function useTranslation() {
  const { t, i18n } = useReactI18next('common');

  return {
    t,
    locale: i18n.language as Locale,
    setLocale: (lang: Locale) => i18n.changeLanguage(lang),
    i18n,
  };
}

// Compat — l'ancien I18nProvider n'est plus nécessaire
// react-i18next est initialisé dans main.tsx via import './i18n'
export function I18nProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
