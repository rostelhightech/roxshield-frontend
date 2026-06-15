import { DashboardTopbar } from '@/components/layout/topbar';
import SmtpProfiles from '@/app/dashboard/superadmin/smtp-profiles/page';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/dashboard/smtp-profiles')({
  component: SmtpProfilesPage,
});

function SmtpProfilesPage() {
  return (
    <>
      <DashboardTopbar
        title="SMTP"
        description="Gérez les profils SMTP."
      />
      <SmtpProfiles />
    </>
  );
}
