import LandingPageTemplates from '@/app/dashboard/superadmin/landing-page-templates/page';
import { DashboardTopbar } from '@/components/layout/topbar';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/dashboard/landing-page-templates')({
  component: LandingPageTemplatesPage,
});

function LandingPageTemplatesPage() {
  return (
    <>
      <DashboardTopbar
        title="Landing page templates"
        description="Créez, importez et gérez vos pages de destination pour les campagnes de sensibilisation."
      />
      <LandingPageTemplates />
    </>
  );
}
