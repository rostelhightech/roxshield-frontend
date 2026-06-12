import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useEffect } from "react";
import { SuperAdminSidebar } from "@/app/dashboard/superadmin-sidebar";
import { UserSidebar } from "@/app/dashboard/user-sidebar";
import { useAuthStore } from "@/store/auth.store";
import { useSidebarStore } from "@/store/sidebar.store";
import { useOrganizationStore } from "@/store/organization.store";
import { useCheckAuth } from "@/hooks/use-check-auth";
import { LoadingComponent } from "@/components/layout/loading-skeleton";
import { roleEnum } from "@/constants/roleEnum";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardLayout,
});

function DashboardLayout() {
  const { user, isAuthenticated } = useAuthStore();
  const { collapsed } = useSidebarStore();
  const { fetchAll: fetchAllOrganizations } = useOrganizationStore();

  useCheckAuth();

  // Fetch shared data once at layout level
  useEffect(() => {
    const loadData = async () => {
      if (!isAuthenticated || !user) return;
      try {
        await Promise.all([fetchAllOrganizations()]);
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      }
    };
    loadData();
  }, [isAuthenticated, user]);

  if (!user) return <LoadingComponent />;

  // SuperAdmin layout with sidebar
  if (user.role === roleEnum.SUPERADMIN) {
    return (
      <div className="min-h-screen bg-[#050816] text-white">
        <div className="flex min-h-screen">
          {/* Spacer for fixed sidebar */}
          <div
            className={`shrink-0 transition-all duration-300 ${
              collapsed ? "w-[72px]" : "w-[260px]"
            }`}
          />
          <SuperAdminSidebar />
          <div className="overflow-hidden flex-1 space-y-6 p-6">
            <Outlet />
          </div>
        </div>
      </div>
    );
  }

  // Other roles (future)
  if (user.role === roleEnum.ADMIN) {
    return <div>Admin Dashboard</div>;
  }

  // User layout with sidebar
  if (user.role === roleEnum.USER) {
    return (
      <div className="min-h-screen bg-[#050816] text-white">
        <div className="flex min-h-screen">
          {/* Spacer for fixed sidebar */}
          <div
            className={`shrink-0 transition-all duration-300 ${
              collapsed ? "w-[72px]" : "w-[260px]"
            }`}
          />
          <UserSidebar />
          <div className="overflow-hidden flex-1 space-y-6 p-6">
            <Outlet />
          </div>
        </div>
      </div>
    );
  }

  return <div>Unknown Role</div>;
}
