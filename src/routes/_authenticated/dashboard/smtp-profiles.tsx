import SmtpProfiles from '@/app/dashboard/superadmin/smtp-profiles/smtp-profiles';
import { DashboardTopbar } from "@/components/layout/topbar";
import { useTranslation } from 'react-i18next';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/dashboard/smtp-profiles')({
  component: SmtpProfilesPage,
});

function SmtpProfilesPage() {
  const { t } = useTranslation('common');
  return (
    <>
      <DashboardTopbar
        title={t('nav.topbar.smtp_title')}
        description={t('nav.topbar.smtp_desc')}
      />
      <SmtpProfiles />
    </>
  );
}
