import { createFileRoute } from '@tanstack/react-router';
import { DashboardTopbar } from '@/components/layout/topbar';
import { AmbassadorsPage } from '@/app/dashboard/superadmin/ambassadors/ambassadors';

export const Route = createFileRoute('/_authenticated/dashboard/ambassadors')({
  component: AmbassadorsRoute,
});

function AmbassadorsRoute() {
  return (
    <>
      <DashboardTopbar
        title="Ambassadeurs"
        description="Gérez vos ambassadeurs et suivez leurs parrainages"
      />
      <AmbassadorsPage />
    </>
  );
}
