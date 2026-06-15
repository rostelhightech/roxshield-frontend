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

// Admin-specific interfaces
interface AdminStats {
  averageRiskScore: number;
  employeesAtRisk: number;
  totalEmployees: number;
  activeEmployees: number;
  formationsCompletionRate: number;
  completedFormations: number;
  totalFormations: number;
}

interface AdminRiskEvolution {
  department: string;
  riskScore: number;
}

interface AdminRiskByDepartment {
  name: string;
  riskScore: number;
}

interface AdminRecentActivity {
  type: string;
  userName: string;
  description: string;
  timestamp: string;
}

interface AdminHighRiskEmployee {
  initials: string;
  name: string;
  department: string;
  position: string;
  riskScore: number;
  formationsCompleted: number;
}

interface AdminPhishingSimulation {
  name: string;
  category: string;
  duration: string;
  totalTargets: number;
  clicked: number;
  signaled: number;
}

interface DashboardState {
  stats: DashboardStats | null;
  recentOrganizations: RecentOrganization[];
  planDistribution: PlanDistribution[];
  keyMetrics: KeyMetrics | null;
  
  // Admin-specific state
  adminStats: AdminStats | null;
  adminRiskEvolution: AdminRiskEvolution[];
  adminRiskByDepartment: AdminRiskByDepartment[];
  adminRecentActivity: AdminRecentActivity[];
  adminHighRiskEmployees: AdminHighRiskEmployee[];
  adminPhishingSimulations: AdminPhishingSimulation[];
  
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadStats: () => Promise<void>;
  loadRecentOrganizations: (limit?: number) => Promise<void>;
  loadPlanDistribution: () => Promise<void>;
  loadKeyMetrics: () => Promise<void>;
  loadAll: () => Promise<void>;
  
  // Admin actions
  fetchAdminStats: () => Promise<void>;
  fetchAdminRiskEvolution: () => Promise<void>;
  fetchAdminRiskByDepartment: () => Promise<void>;
  fetchAdminRecentActivity: () => Promise<void>;
  fetchAdminHighRiskEmployees: () => Promise<void>;
  fetchAdminPhishingSimulations: () => Promise<void>;
  
  reset: () => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  stats: null,
  recentOrganizations: [],
  planDistribution: [],
  keyMetrics: null,
  adminStats: null,
  adminRiskEvolution: [],
  adminRiskByDepartment: [],
  adminRecentActivity: [],
  adminHighRiskEmployees: [],
  adminPhishingSimulations: [],
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

  // Admin methods
  fetchAdminStats: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiService.get<{ success: boolean; data: AdminStats }>('/dashboard/admin/stats');
      if ('success' in response && response.success) {
        set({ adminStats: response.data });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques admin:', error);
      set({ error: 'Erreur lors du chargement des statistiques' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAdminRiskEvolution: async () => {
    try {
      const response = await apiService.get<{ success: boolean; data: AdminRiskEvolution[] }>('/dashboard/admin/risk-evolution');
      if ('success' in response && response.success) {
        set({ adminRiskEvolution: response.data });
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'évolution du risque:', error);
      set({ error: 'Erreur lors du chargement de l\'évolution du risque' });
    }
  },

  fetchAdminRiskByDepartment: async () => {
    try {
      const response = await apiService.get<{ success: boolean; data: AdminRiskByDepartment[] }>('/dashboard/admin/risk-by-department');
      if ('success' in response && response.success) {
        set({ adminRiskByDepartment: response.data });
      }
    } catch (error) {
      console.error('Erreur lors du chargement du risque par département:', error);
      set({ error: 'Erreur lors du chargement du risque par département' });
    }
  },

  fetchAdminRecentActivity: async () => {
    try {
      const response = await apiService.get<{ success: boolean; data: AdminRecentActivity[] }>('/dashboard/admin/recent-activity');
      if ('success' in response && response.success) {
        set({ adminRecentActivity: response.data });
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'activité récente:', error);
      set({ error: 'Erreur lors du chargement de l\'activité récente' });
    }
  },

  fetchAdminHighRiskEmployees: async () => {
    try {
      const response = await apiService.get<{ success: boolean; data: AdminHighRiskEmployee[] }>('/dashboard/admin/high-risk-employees');
      if ('success' in response && response.success) {
        set({ adminHighRiskEmployees: response.data });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des employés à risque:', error);
      set({ error: 'Erreur lors du chargement des employés à risque' });
    }
  },

  fetchAdminPhishingSimulations: async () => {
    try {
      const response = await apiService.get<{ success: boolean; data: AdminPhishingSimulation[] }>('/dashboard/admin/phishing-simulations');
      if ('success' in response && response.success) {
        set({ adminPhishingSimulations: response.data });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des simulations de phishing:', error);
      set({ error: 'Erreur lors du chargement des simulations de phishing' });
    }
  },

  reset: () => {
    set({
      stats: null,
      recentOrganizations: [],
      planDistribution: [],
      keyMetrics: null,
      adminStats: null,
      adminRiskEvolution: [],
      adminRiskByDepartment: [],
      adminRecentActivity: [],
      adminHighRiskEmployees: [],
      adminPhishingSimulations: [],
      isLoading: false,
      error: null,
    });
  },
}));
