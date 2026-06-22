import { useTranslation } from 'react-i18next';
"use client";

export function SkipToContent() {
  const { t: tCommon } = useTranslation('common');
  return (
    <a
      href="#main-content"
      className="fixed left-4 top-4 z-[200] -translate-y-16 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg transition-transform focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-ring"
    >
      {tCommon('common.skip_to_content.skip')}
    </a>
  );
}
