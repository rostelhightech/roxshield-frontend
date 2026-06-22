import { createFileRoute } from "@tanstack/react-router";
import { DashboardTopbar } from "@/components/layout/topbar";
import { useTranslation } from 'react-i18next';
import { Formations } from "@/app/dashboard/superadmin/formations/formations";

export const Route = createFileRoute(
  "/_authenticated/dashboard/formations/"
)({
  component: FormationsPage,
});

function FormationsPage() {
  const { t } = useTranslation('common');
  return (
    <>
      <DashboardTopbar
        title={t('nav.topbar.formations_title')}
        description={t('nav.topbar.formations_desc')}
      />
      <Formations />
    </>
  );
}