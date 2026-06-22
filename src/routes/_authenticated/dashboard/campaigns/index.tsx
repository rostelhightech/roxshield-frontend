import Campaigns from '@/app/dashboard/superadmin/campaigns/page';
import { DashboardTopbar } from '@/components/layout/topbar';
import { useTranslation } from 'react-i18next';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/dashboard/campaigns/')({
  component: CampaignsPage,
});


function CampaignsPage() {
  const { t } = useTranslation('common');
  return (
    <>
      <DashboardTopbar
        title={t('nav.topbar.campaigns_title')}
        description={t('nav.topbar.campaigns_desc')}
      />
      <Campaigns />
    </>
  );
}
