import { createFileRoute } from '@tanstack/react-router';
import { DashboardTopbar } from '@/components/layout/topbar';
import { useTranslation } from 'react-i18next';
import { AmbassadorsPage } from '@/app/dashboard/superadmin/ambassadors/ambassadors';

export const Route = createFileRoute('/_authenticated/dashboard/ambassadors')({
  component: AmbassadorsRoute,
});

function AmbassadorsRoute() {
  const { t } = useTranslation('common');
  return (
    <>
      <DashboardTopbar
        title={t('nav.topbar.ambassadors_title')}
        description={t('nav.topbar.ambassadors_desc')}
      />
      <AmbassadorsPage />
    </>
  );
}
