import { createFileRoute } from "@tanstack/react-router";
import { DashboardTopbar } from "@/components/layout/topbar";
import { Organizations } from "@/app/dashboard/superadmin/organizations/organizations";

export const Route = createFileRoute(
  "/_authenticated/dashboard/organizations/"
)({
  component: OrganizationsPage,
});

function OrganizationsPage() {
  return (
    <>
      <DashboardTopbar
        title="Organisations"
        description="Gérez toutes les organisations et leurs abonnements"
      />
      <Organizations />
    </>
  );
}