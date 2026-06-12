import Templates from '@/app/dashboard/superadmin/templates/page';
import { DashboardTopbar } from '@/components/layout/topbar';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard/templates')({
  component: TemplatesPage
})


function TemplatesPage() {
  return (
    <>
      <DashboardTopbar
        title="Templates"
        description="Gérez les templates de votre organisation pour une configuration rapide et cohérente."
      />
      <Templates />
    </>
  );
}
