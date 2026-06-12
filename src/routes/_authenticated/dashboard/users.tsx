import { createFileRoute } from "@tanstack/react-router";
import { DashboardTopbar } from "@/components/layout/topbar";
import { Users } from "@/app/dashboard/superadmin/users/users";

export const Route = createFileRoute("/_authenticated/dashboard/users")({
  component: UsersPage,
});

function UsersPage() {
  return (
    <>
      <DashboardTopbar
        title="Utilisateurs"
        description="Gérez les utilisateurs, leurs rôles et leurs groupes"
      />
      <Users />
    </>
  );
}
