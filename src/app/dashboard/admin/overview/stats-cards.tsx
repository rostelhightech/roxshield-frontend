import {
  Shield,
  Users,
  GraduationCap,
  TrendingUp,
} from "lucide-react";

import { StatCard } from "./stat-card";
import { useEffect, useState } from "react";
import { useDashboardStore } from "@/store/dashboard.store";

export function StatsCards() {
  const { adminStats, fetchAdminStats, isLoading } = useDashboardStore();
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      await fetchAdminStats();
      setIsLoadingStats(false);
    };

    loadStats();
  }, [fetchAdminStats]);

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        icon={Shield}
        title="Score de risque moyen"
        value={adminStats ? `${adminStats.averageRiskScore}%` : "0%"}
        subtitle="ce mois"
        iconColor="#ea580c"
        isLoading={isLoadingStats || isLoading}
      />

      <StatCard
        icon={Users}
        title="Employés à risque"
        value={adminStats ? adminStats.employeesAtRisk.toString() : "0"}
        subtitle={`sur ${adminStats?.totalEmployees || 0} employés`}
        iconColor="#dc2626"
        isLoading={isLoadingStats || isLoading}
      />

      <StatCard
        icon={GraduationCap}
        title="Formations complétées"
        value={adminStats ? `${adminStats.formationsCompletionRate}%` : "0%"}
        subtitle={`${adminStats?.completedFormations || 0}/${adminStats?.totalFormations || 0} formations`}
        iconColor="#a855f7"
        isLoading={isLoadingStats || isLoading}
      />

      <StatCard
        icon={TrendingUp}
        title="Total employés"
        value={adminStats ? adminStats.totalEmployees.toString() : "0"}
        subtitle={adminStats ? `${adminStats.totalEmployees - adminStats.employeesAtRisk} en zone sûre` : ""}
        iconColor="#10b981"
        isLoading={isLoadingStats || isLoading}
      />
    </div>
  );
}