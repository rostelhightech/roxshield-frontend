import { createFileRoute } from "@tanstack/react-router";
import { DashboardTopbar } from "@/components/layout/topbar";
import { Plans } from "@/app/dashboard/superadmin/plan/plans";

export const Route = createFileRoute("/_authenticated/dashboard/plan")({
  component: PlanPage,
});

function PlanPage() {
  return (
    <>
      <DashboardTopbar
        title="Plans d'abonnement"
        description="Gérez les plans d'abonnement et leurs tarifs"
      />
      <Plans />
    </>
  );
}
