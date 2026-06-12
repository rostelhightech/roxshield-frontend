import { createFileRoute } from "@tanstack/react-router";
import { DashboardTopbar } from "@/components/layout/topbar";
import { Groups } from "@/app/dashboard/superadmin/groups/groups";

export const Route = createFileRoute("/_authenticated/dashboard/groups")({
  component: GroupsPage,
});

function GroupsPage() {
  return (
    <>
      <DashboardTopbar
        title="Groupes"
        description="Organisez les utilisateurs par équipe, classe ou service"
      />
      <Groups />
    </>
  );
}
