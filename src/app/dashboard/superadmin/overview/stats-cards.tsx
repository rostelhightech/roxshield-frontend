import {
  BarChart3,
  Building2,
  Users,
  Target,
} from "lucide-react";

import { StatCard } from "./stat-card";
import { useEffect, useState } from "react";
import { apiService } from "@/app/services/api.service";
import { useTranslation } from 'react-i18next';

interface DashboardStats {
  totalOrganizations: number;
  activeOrganizations: number;
  totalEmployees: number;
  totalCampaigns: number;
  averageCampaignScore: number;
  mrr: number;
}

export function StatsCards() {
  const { t: tCommon } = useTranslation('common');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await apiService.get<{ success: boolean; data: DashboardStats }>('/dashboard/stats');
        if ('success' in response && response.success) {
          setStats(response.data);
        }
      } catch (error) {
        console.error(tCommon('admin.ambassadors.stats_error'), error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  // Formater le MRR en FCFA
  const formatMRR = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount).replace('XOF', 'F');
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        icon={BarChart3}
        title="MRR"
        value={stats ? formatMRR(stats.mrr) : "0 F"}
        subtitle=""
        iconColor="#5d2595"
        isLoading={isLoading}
      />

      <StatCard
        icon={Building2}
        title={tCommon('nav.topbar.organizations_title')}
        value={stats ? stats.totalOrganizations.toString() : "0"}
        subtitle={tCommon('admin.page_overview.active_orgs_count', { count: stats?.activeOrganizations || 0 })}
        iconColor="#0e7490"
        isLoading={isLoading}
      />

      <StatCard
        icon={Users}
        title={tCommon('admin.grc.org_employees')}
        value={stats ? stats.totalEmployees.toString() : "0"}
        subtitle={tCommon('admin.groups.all_orgs')}
        iconColor="#0f766e"
        isLoading={isLoading}
      />

      <StatCard
        icon={Target}
        title={tCommon('nav.topbar.campaigns_title')}
        value={stats ? stats.totalCampaigns.toString() : "0"}
        subtitle={tCommon('admin.page_overview.avg_score', { score: stats?.averageCampaignScore || 0 })}
        iconColor="#b45309"
        isLoading={isLoading}
      />
    </div>
  );
}