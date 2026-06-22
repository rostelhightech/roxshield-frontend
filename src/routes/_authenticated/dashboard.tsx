import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SuperAdminSidebar } from "@/app/dashboard/superadmin-sidebar";
import { UserSidebar } from "@/app/dashboard/user-sidebar";
import { useAuthStore } from "@/store/auth.store";
import { useSidebarStore } from "@/store/sidebar.store";
import { useOrganizationStore } from "@/store/organization.store";
import { useCheckAuth } from "@/hooks/use-check-auth";
import { roleEnum } from "@/constants/roleEnum";
import { AdminSidebar } from "@/app/dashboard/admin-sidebar";
import { SplashScreenComponent } from "@/components/layout/splash-screen";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardLayout,
});

function DashboardLayout() {
  const { user, isAuthenticated } = useAuthStore();
  const { collapsed } = useSidebarStore();
  const { fetchAll: fetchAllOrganizations } = useOrganizationStore();
  const [isLoading, setIsLoading] = useState(true);

  useCheckAuth();

  useEffect(() => {
    const loadData = async () => {
      if (!isAuthenticated || !user) return;

      try {
        if (user.role === roleEnum.SUPERADMIN) {
          await Promise.all([fetchAllOrganizations()]);
          
        } else if (user.role === roleEnum.ADMIN) {
          await Promise.all([fetchAllOrganizations()]);
        } else if (user.role === roleEnum.USER) {
          await Promise.all([fetchAllOrganizations()]);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user]);

  if (!user || isLoading) return <SplashScreenComponent />;

  if (user.role === roleEnum.SUPERADMIN) {
    return (
      <div className="min-h-screen bg-gray-50  dark:bg-[#050816] text-gray-900 dark:text-white">
        <div className="flex min-h-screen">
          <div className={`hidden md:block shrink-0 transition-all duration-300 ${collapsed ? "w-[72px]" : "w-[260px]"}`} />
          <SuperAdminSidebar />
          <div className="overflow-hidden flex-1 space-y-6 p-6 pt-20 md:pt-6">
  <Outlet />
</div>
        </div>
      </div>
    );
  }

  if (user.role === roleEnum.ADMIN) {
    return (
      <div className="min-h-screen bg-gray-50  dark:bg-[#050816] text-gray-900 dark:text-white">
        <div className="flex min-h-screen">
          <div className={`hidden md:block shrink-0 transition-all duration-300 ${collapsed ? "w-[72px]" : "w-[260px]"}`} />
          <AdminSidebar />
          <div className="overflow-hidden flex-1 space-y-6 p-6 pt-20 md:pt-6">
            <Outlet />
          </div>
        </div>
      </div>
    );
  }

  if (user.role === roleEnum.USER) {
    return (
      <div className="min-h-screen bg-gray-50  dark:bg-[#050816] text-gray-900 dark:text-white">
        <div className="flex min-h-screen">
          <div className={`hidden md:block shrink-0 transition-all duration-300 ${collapsed ? "w-[72px]" : "w-[260px]"}`} />
          <UserSidebar />
          <div className="overflow-hidden flex-1 space-y-6 p-2 md:p-6 pt-20 md:pt-6">
            <Outlet />
          </div>
        </div>
      </div>
    );
  }

  return <div>Unknown Role</div>;
}