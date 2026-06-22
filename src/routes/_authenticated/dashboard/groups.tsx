import { createFileRoute } from "@tanstack/react-router";
import { DashboardTopbar } from "@/components/layout/topbar";
import { useTranslation } from 'react-i18next';
import { Groups } from "@/app/dashboard/superadmin/groups/groups";

export const Route = createFileRoute("/_authenticated/dashboard/groups")({
  component: GroupsPage,
});

function GroupsPage() {
  const { t } = useTranslation();
  return (
    <>
      <DashboardTopbar
        title={t('nav.topbar.groups_title')}
        description={t('nav.topbar.groups_desc')}
      />
      <Groups />
    </>
  );
}
