import LandingPageTemplates from '@/app/dashboard/superadmin/landing-page-templates/page';
import { DashboardTopbar } from "@/components/layout/topbar";
import { useTranslation } from 'react-i18next';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/dashboard/landing-page-templates')({
  component: LandingPageTemplatesPage,
});

function LandingPageTemplatesPage() {
  const { t } = useTranslation('common');
  return (
    <>
      <DashboardTopbar
        title={t('nav.topbar.landing_templates_title')}
        description={t('nav.topbar.landing_templates_desc')}
      />
      <LandingPageTemplates />
    </>
  );
}
