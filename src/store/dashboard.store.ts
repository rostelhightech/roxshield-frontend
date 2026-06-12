import { create } from 'zustand';
import { apiService } from '@/app/services/api.service';

interface DashboardStats {
  totalOrganizations: number;
  activeOrganizations: number;
  totalEmployees: number;
  totalCampaigns: number;
  averageCampaignScore: number;
  mrr: number;
}

interface RecentOrganization {
  id: string;
  name: string;
  city: string;
  country: string;
  planName: string;
  currentEmployees: number;
  riskScore: number;
  createdAt: Date;
}

interface PlanDistribution {
  name: string;
  label: string;
  count: number;
  percentage: number;
}

interface KeyMetrics {
  churnRate: number;
  formationsCompleted: number;
  averageRiskScore: number;
}

interface DashboardState {
  stats: DashboardStats | null;
  recentOrganizations: RecentOrganization[];
  planDistribution: PlanDistribution[];
  keyMetrics: KeyMetrics | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadStats: () => Promise<void>;
  loadRecentOrganizations: (limit?: number) => Promise<void>;
  loadPlanDistribution: () => Promise<void>;
  loadKeyMetrics: () => Promise<void>;
  loadAll: () => Promise<void>;
  reset: () => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  stats: null,
  recentOrganizations: [],
  planDistribution: [],
  keyMetrics: null,
  isLoading: false,
  error: null,

  loadStats: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiService.get<{ success: boolean; data: DashboardStats }>('/dashboard/stats');
      if ('success' in response && response.success) {
        set({ stats: response.data });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
      set({ error: 'Erreur lors du chargement des statistiques' });
    } finally {
      set({ isLoading: false });
    }
  },

  loadRecentOrganizations: async (limit = 5) => {
    try {
      const response = await apiService.get<{ success: boolean; data: RecentOrganization[] }>(`/dashboard/recent-organizations?limit=${limit}`);
      if ('success' in response && response.success) {
        set({ recentOrganizations: response.data });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des organisations récentes:', error);
      set({ error: 'Erreur lors du chargement des organisations récentes' });
    }
  },

  loadPlanDistribution: async () => {
    try {
      const response = await apiService.get<{ success: boolean; data: PlanDistribution[] }>('/dashboard/plans-distribution');
      if ('success' in response && response.success) {
        set({ planDistribution: response.data });
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la répartition des plans:', error);
      set({ error: 'Erreur lors du chargement de la répartition des plans' });
    }
  },

  loadKeyMetrics: async () => {
    try {
      const response = await apiService.get<{ success: boolean; data: KeyMetrics }>('/dashboard/key-metrics');
      if ('success' in response && response.success) {
        set({ keyMetrics: response.data });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des métriques clés:', error);
      set({ error: 'Erreur lors du chargement des métriques clés' });
    }
  },

  loadAll: async () => {
    set({ isLoading: true, error: null });
    try {
      await Promise.all([
        get().loadStats(),
        get().loadRecentOrganizations(),
        get().loadPlanDistribution(),
        get().loadKeyMetrics(),
      ]);
    } catch (error) {
      console.error('Erreur lors du chargement des données du dashboard:', error);
      set({ error: 'Erreur lors du chargement des données' });
    } finally {
      set({ isLoading: false });
    }
  },

  reset: () => {
    set({
      stats: null,
      recentOrganizations: [],
      planDistribution: [],
      keyMetrics: null,
      isLoading: false,
      error: null,
    });
  },
}));