import { createFileRoute } from "@tanstack/react-router";
import { DashboardTopbar } from "@/components/layout/topbar";
import { useAuthStore } from "@/store/auth.store";
import { useTranslation } from "react-i18next";

// Superadmin components
import { StatsCards as SuperAdminStatsCards } from "@/app/dashboard/superadmin/overview/stats-cards";
import { OrganizationsList } from "@/app/dashboard/superadmin/overview/organizations-list";
import { PlansChart } from "@/app/dashboard/superadmin/overview/plans-chart";
import { MetricsSection } from "@/app/dashboard/superadmin/overview/metric-section";
import { AlertsSection } from "@/app/dashboard/superadmin/overview/alerts-section";

// Admin components
import { StatsCards as AdminStatsCards } from "@/app/dashboard/admin/overview/stats-cards";
import { RiskChart } from "@/app/dashboard/admin/overview/risk-chart";
import { RiskByDepartment } from "@/app/dashboard/admin/overview/risk-by-department";
import { RecentActivity } from "@/app/dashboard/admin/overview/recent-activity";
import { HighRiskEmployees } from "@/app/dashboard/admin/overview/high-risk-employees";
import { RecentPhishingSimulations } from "@/app/dashboard/admin/overview/recent-phishing-simulations";

export const Route = createFileRoute("/_authenticated/dashboard/overview")({
  component: OverviewPage,
});

function OverviewPage() {
  const { user } = useAuthStore();
  const { t } = useTranslation('common');
  const isSuperAdmin = user?.role === 'superadmin';

  if (isSuperAdmin) {
    return (
      <>
        <DashboardTopbar
          title={t('admin.dashboard.title')}
          description={t('admin.dashboard.desc_superadmin')}
        />
        <div className="space-y-6 w-full">
          {/* Alertes critiques en haut */}
          <AlertsSection />
          
          {/* Cartes de statistiques */}
          <SuperAdminStatsCards />
          
          {/* Grid principal */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <OrganizationsList />
            </div>
            <PlansChart />
          </div>
          
          {/* Métriques clés */}
          <MetricsSection />
        </div>
      </>
    );
  }

  // Admin view
  return (
    <>
      <DashboardTopbar
        title={t('admin.dashboard.title')}
        description={t('admin.dashboard.desc_admin')}
      />
      <div className="space-y-6 w-full">
        {/* Cartes de statistiques */}
        <AdminStatsCards />
        
        {/* Graphiques principaux */}
        <div className="grid gap-6 lg:grid-cols-2">
          <RiskChart />
          <RiskByDepartment />
        </div>
        
        {/* Employés à risque et Simulations de phishing */}
        <div className="grid gap-6 lg:grid-cols-2">
          <HighRiskEmployees />
          <RecentPhishingSimulations />
        </div>
        
        {/* Activité récente */}
        <RecentActivity />
      </div>
    </>
  );
}
