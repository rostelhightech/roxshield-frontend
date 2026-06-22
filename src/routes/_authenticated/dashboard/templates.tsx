import Templates from '@/app/dashboard/superadmin/templates/page';
import { DashboardTopbar } from "@/components/layout/topbar";
import { useTranslation } from 'react-i18next';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard/templates')({
  component: TemplatesPage
})


function TemplatesPage() {
  const { t } = useTranslation();
  return (
    <>
      <DashboardTopbar
        title={t('nav.topbar.templates_title')}
        description={t('nav.topbar.templates_desc')}
      />
      <Templates />
    </>
  );
}
