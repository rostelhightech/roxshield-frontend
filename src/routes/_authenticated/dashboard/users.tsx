import { createFileRoute } from "@tanstack/react-router";
import { DashboardTopbar } from "@/components/layout/topbar";
import { useTranslation } from 'react-i18next';
import { Users } from "@/app/dashboard/superadmin/users/users";

export const Route = createFileRoute("/_authenticated/dashboard/users")({
  component: UsersPage,
});

function UsersPage() {
  const { t } = useTranslation();
  return (
    <>
      <DashboardTopbar
        title={t('nav.topbar.users_title')}
        description={t('nav.topbar.users_desc')}
      />
      <Users />
    </>
  );
}
