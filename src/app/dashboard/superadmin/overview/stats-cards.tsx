import {
  BarChart3,
  Building2,
  Users,
  Target,
} from "lucide-react";

import { StatCard } from "./stat-card";
import { useEffect, useState } from "react";
import { apiService } from "@/app/services/api.service";

interface DashboardStats {
  totalOrganizations: number;
  activeOrganizations: number;
  totalEmployees: number;
  totalCampaigns: number;
  averageCampaignScore: number;
  mrr: number;
}

export function StatsCards() {
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
        console.error('Erreur lors du chargement des statistiques', error);
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
        subtitle="0% vs mois dernier"
        iconColor="#5d2595"
        isLoading={isLoading}
      />

      <StatCard
        icon={Building2}
        title="Organisations"
        value={stats ? stats.totalOrganizations.toString() : "0"}
        subtitle={`${stats?.activeOrganizations || 0} actives`}
        iconColor="#0e7490"
        isLoading={isLoading}
      />

      <StatCard
        icon={Users}
        title="Employés"
        value={stats ? stats.totalEmployees.toString() : "0"}
        subtitle="Toutes organisations"
        iconColor="#0f766e"
        isLoading={isLoading}
      />

      <StatCard
        icon={Target}
        title="Campagnes"
        value={stats ? stats.totalCampaigns.toString() : "0"}
        subtitle={`Score moyen ${stats?.averageCampaignScore || 0}%`}
        iconColor="#b45309"
        isLoading={isLoading}
      />
    </div>
  );
}