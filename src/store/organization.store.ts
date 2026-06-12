// store/organization.store.ts (mis à jour)
import { create } from 'zustand';
import { apiService } from '@/app/services/api.service';
import { Plan } from './plan.store';

export interface Organization {
  id: string;
  name: string;
  sector: string | null;
  city: string | null;
  country: string | null;
  type: 'enterprise' | 'campus';
  planId: string;
  plan?: Plan;
  isActive: boolean;
  currentEmployees: number;
  totalFormations: number;
  totalCampaigns: number;
  riskScore: number;
  adminName: string | null;
  adminEmail: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationFilters {
  search: string;
  type: string;
  planId: string;
  status: string;
  sortBy: keyof Organization | 'planName';
  sortOrder: 'asc' | 'desc';
}

interface OrganizationState {
  organizations: Organization[];
  filteredOrganizations: Organization[];
  currentOrganization: Organization | null;
  isLoading: boolean;
  error: string | null;
  filters: OrganizationFilters;
  
  fetchAll: () => Promise<void>;
  fetchById: (id: string) => Promise<void>;
  createOrganization: (data: any) => Promise<void>;
  updateOrganization: (id: string, data: Partial<Organization>) => Promise<void>;
  deleteOrganization: (id: string) => Promise<void>;
  setFilters: (filters: Partial<OrganizationFilters>) => void;
  resetFilters: () => void;
  applyFilters: () => void;
}

const defaultFilters: OrganizationFilters = {
  search: '',
  type: '',
  planId: '',
  status: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

export const useOrganizationStore = create<OrganizationState>((set, get) => ({
  organizations: [],
  filteredOrganizations: [],
  currentOrganization: null,
  isLoading: false,
  error: null,
  filters: defaultFilters,

  fetchAll: async () => {
    set({ isLoading: true });
    try {
      const response = await apiService.get('/organizations');
      const organizations = response.data as Organization[];
      set({ organizations, isLoading: false });
      get().applyFilters();
    } catch (error) {
      set({ error: 'Erreur lors du chargement', isLoading: false });
    }
  },

  fetchById: async (id: string) => {
    set({ isLoading: true });
    try {
      const response = await apiService.get(`/organizations/${id}`);
      set({ currentOrganization: response.data as Organization, isLoading: false });
    } catch (error) {
      set({ error: 'Erreur lors du chargement', isLoading: false });
    }
  },

  createOrganization: async (data) => {
    set({ isLoading: true });
    try {
      const response = await apiService.post('/organizations', data);
      const newOrg = response.data as Organization;
      set(state => ({ 
        organizations: [...state.organizations, newOrg],
        isLoading: false 
      }));
      await get().fetchAll();
    } catch (error) {
      set({ error: 'Erreur lors de la création', isLoading: false });
      throw error;
    }
  },

  updateOrganization: async (id, data) => {
    set({ isLoading: true });
    try {
      const response = await apiService.put(`/organizations/${id}`, data);
      const updatedOrg = response.data as Organization;
      set(state => ({
        organizations: state.organizations.map(org => org.id === id ? updatedOrg : org),
        isLoading: false
      }));
      await get().fetchAll();
    } catch (error) {
      set({ error: 'Erreur lors de la mise à jour', isLoading: false });
      throw error;
    }
  },

  deleteOrganization: async (id) => {
    set({ isLoading: true });
    try {
      await apiService.delete(`/organizations/${id}`);
      set(state => ({
        organizations: state.organizations.filter(org => org.id !== id),
        isLoading: false
      }));
      await get().fetchAll();
    } catch (error) {
      set({ error: 'Erreur lors de la suppression', isLoading: false });
    }
  },

  setFilters: (filters) => {
    set(state => ({
      filters: { ...state.filters, ...filters }
    }));
    get().applyFilters();
  },

  resetFilters: () => {
    set({ filters: defaultFilters });
    get().applyFilters();
  },

  applyFilters: () => {
    const { organizations, filters } = get();
    let filtered = [...organizations];

    // Filtre recherche
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(org => 
        org.name.toLowerCase().includes(searchLower) ||
        (org.city?.toLowerCase().includes(searchLower)) ||
        (org.country?.toLowerCase().includes(searchLower)) ||
        (org.adminEmail?.toLowerCase().includes(searchLower))
      );
    }

    // Filtre type
    if (filters.type) {
      filtered = filtered.filter(org => org.type === filters.type);
    }

    // Filtre plan
    if (filters.planId) {
      filtered = filtered.filter(org => org.planId === filters.planId);
    }

    // Filtre statut
    if (filters.status) {
      const isActive = filters.status === 'active';
      filtered = filtered.filter(org => org.isActive === isActive);
    }

    // Tri
    filtered.sort((a, b) => {
      let aVal: any = a[filters.sortBy as keyof Organization];
      let bVal: any = b[filters.sortBy as keyof Organization];
      
      if (filters.sortBy === 'planName' && a.plan && b.plan) {
        aVal = a.plan.label;
        bVal = b.plan.label;
      }
      
      if (aVal < bVal) return filters.sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return filters.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    set({ filteredOrganizations: filtered });
  },
}));