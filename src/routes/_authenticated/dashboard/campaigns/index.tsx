import Campaigns from '@/app/dashboard/superadmin/campaigns/page';
import { DashboardTopbar } from '@/components/layout/topbar';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/dashboard/campaigns/')({
  component: CampaignsPage,
});


function CampaignsPage() {
  return (
    <>
      <DashboardTopbar
        title="Campagnes"
        description="Gérez toutes les campagnes et leurs performances"
      />
      <Campaigns />
    </>
  );
}
