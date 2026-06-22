import {
  Shield,
  Users,
  GraduationCap,
  TrendingUp,
} from "lucide-react";

import { StatCard } from "./stat-card";
import { useEffect, useState } from "react";
import { useDashboardStore } from "@/store/dashboard.store";
import { useTranslation } from "react-i18next";

export function StatsCards() {
  const { adminStats, fetchAdminStats, isLoading } = useDashboardStore();
  const [isLoadingStats, setIsLoadingStats] = useState(true);
const { t: tCommon } = useTranslation('common');
  useEffect(() => {
    const loadStats = async () => {
      await fetchAdminStats();
      setIsLoadingStats(false);
    };

    loadStats();
  }, [ ]);

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        icon={Shield}
        title={tCommon('admin.page_overview.stats_avg_risk')}
        value={adminStats ? `${adminStats.averageRiskScore}%` : "0%"}
        subtitle={tCommon('admin.page_overview.this_month')}
        iconColor="#ea580c"
        isLoading={isLoadingStats || isLoading}
      />

      <StatCard
        icon={Users}
        title={tCommon('admin.page_overview.stats_at_risk')}
        value={adminStats ? adminStats.employeesAtRisk.toString() : "0"}
        subtitle={tCommon('admin.page_overview.at_risk_subtitle', { count: adminStats?.totalEmployees || 0 })}
        iconColor="#dc2626"
        isLoading={isLoadingStats || isLoading}
      />

      <StatCard
        icon={GraduationCap}
        title={tCommon('admin.page_overview.stats_trainings')}
        value={adminStats ? `${adminStats.formationsCompletionRate}%` : "0%"}
        subtitle={tCommon('admin.page_overview.formations_progress', { done: adminStats?.completedFormations || 0, total: adminStats?.totalFormations || 0 })}
        iconColor="#a855f7"
        isLoading={isLoadingStats || isLoading}
      />

      <StatCard
        icon={TrendingUp}
        title={tCommon('admin.page_overview.stats_total_employees')}
        value={adminStats ? adminStats.totalEmployees.toString() : "0"}
        subtitle={adminStats ? tCommon('admin.page_overview.safe_zone', { count: adminStats.totalEmployees - adminStats.employeesAtRisk }) : ""}
        iconColor="#10b981"
        isLoading={isLoadingStats || isLoading}
      />
    </div>
  );
}