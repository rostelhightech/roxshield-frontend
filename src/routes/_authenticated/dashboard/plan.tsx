import { createFileRoute } from "@tanstack/react-router";
import { DashboardTopbar } from "@/components/layout/topbar";
import { Plans } from "@/app/dashboard/superadmin/plan/plans";
import { AdminPlans } from "@/app/dashboard/admin/plan/admin-plans";
import { useAuthStore } from "@/store/auth.store";

export const Route = createFileRoute("/_authenticated/dashboard/plan")({
  component: PlanPage,
});

function PlanPage() {
  const { user } = useAuthStore();
  const isSuperAdmin = user?.role === 'superadmin';

  return (
    <>
      <DashboardTopbar
        title="Plans d'abonnement"
        description={
          isSuperAdmin
            ? "Gérez les plans d'abonnement et leurs tarifs"
            : "Consultez les plans disponibles et votre plan actuel"
        }
      />
      {isSuperAdmin ? <Plans /> : <AdminPlans />}
    </>
  );
}
