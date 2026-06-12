import { createFileRoute } from "@tanstack/react-router";
import { DashboardTopbar } from "@/components/layout/topbar";
import { StatsCards } from "@/app/dashboard/superadmin/overview/stats-cards";
import { OrganizationsList } from "@/app/dashboard/superadmin/overview/organizations-list";
import { PlansChart } from "@/app/dashboard/superadmin/overview/plans-chart";
import { MetricsSection } from "@/app/dashboard/superadmin/overview/metric-section";
import { AlertsSection } from "@/app/dashboard/superadmin/overview/alerts-section";

export const Route = createFileRoute("/_authenticated/dashboard/overview")({
  component: OverviewPage,
});

function OverviewPage() {
  return (
    <>
      <DashboardTopbar
        title="Tableau de bord"
        description="Vue globale de la plateforme"
      />
      <div className="space-y-6 w-full">
        {/* Alertes critiques en haut */}
        <AlertsSection />
        
        {/* Cartes de statistiques */}
        <StatsCards />
        
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
