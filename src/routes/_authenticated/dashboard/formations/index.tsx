import { createFileRoute } from "@tanstack/react-router";
import { DashboardTopbar } from "@/components/layout/topbar";
import { Formations } from "@/app/dashboard/superadmin/formations/formations";

export const Route = createFileRoute(
  "/_authenticated/dashboard/formations/"
)({
  component: FormationsPage,
});

function FormationsPage() {
  return (
    <>
      <DashboardTopbar
        title="Formations"
        description="Créez et gérez les formations de sensibilisation à la cybersécurité"
      />
      <Formations />
    </>
  );
}