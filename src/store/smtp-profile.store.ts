import { create } from 'zustand';
import { apiService } from '@/app/services/api.service';

export interface OrganizationReference {
  id: string;
  name?: string | null;
}

export interface SmtpProfile {
  id: string;
  organizationId: string;
  organization?: OrganizationReference | null;
  name: string;
  interfaceType: string;
  fromName: string;
  fromAddress: string;
  host: string;
  port: number;
  username: string;
  ignoreCertificateErrors: boolean;
  emailHeaders: Record<string, string> | null;
  gophishServerId?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface SmtpProfileFilters {
  search: string;
  organizationId: string;
  sortBy: 'createdAt' | 'name' | 'organization';
  sortOrder: 'asc' | 'desc';
}

interface SmtpProfileState {
  smtpProfiles: SmtpProfile[];
  filteredProfiles: SmtpProfile[];
  currentSmtpProfile: SmtpProfile | null;
  isLoading: boolean;
  isSaving: boolean;
  isSendingTestEmail: boolean;
  error: string | null;
  filters: SmtpProfileFilters;
  fetchAll: () => Promise<void>;
  fetchById: (id: string) => Promise<void>;
  createSmtpProfile: (data: Omit<SmtpProfile, 'id' | 'organization' | 'createdAt' | 'updatedAt' | 'gophishServerId'> & { emailHeaders?: Record<string, string> | null }) => Promise<void>;
  updateSmtpProfile: (id: string, data: Partial<Omit<SmtpProfile, 'id' | 'organization' | 'createdAt' | 'updatedAt' | 'gophishServerId'>>) => Promise<void>;
  deleteSmtpProfile: (id: string) => Promise<void>;
  sendTestEmail: (id: string, data: { to: string; subject?: string; text?: string }) => Promise<void>;
  setFilters: (filters: Partial<SmtpProfileFilters>) => void;
  resetFilters: () => void;
  applyFilters: () => void;
  setCurrentSmtpProfile: (profile: SmtpProfile | null) => void;
  clearError: () => void;
}

const defaultFilters: SmtpProfileFilters = {
  search: '',
  organizationId: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

export const useSmtpProfileStore = create<SmtpProfileState>((set, get) => ({
  smtpProfiles: [],
  filteredProfiles: [],
  currentSmtpProfile: null,
  isLoading: false,
  isSaving: false,
  isSendingTestEmail: false,
  error: null,
  filters: defaultFilters,

  fetchAll: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.get('/smtp-profiles');
      const smtpProfiles = response?.data ?? response ?? [];
      set({ smtpProfiles, isLoading: false });
      get().applyFilters();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      set({ error: message, isLoading: false });
    }
  },

  fetchById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.get(`/smtp-profiles/${id}`);
      const smtpProfile = response?.data ?? response ?? null;
      if (!smtpProfile) {
        throw new Error('Profil SMTP introuvable');
      }
      set({ currentSmtpProfile: smtpProfile, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      set({ error: message, isLoading: false });
    }
  },

  createSmtpProfile: async (data) => {
    set({ isSaving: true, error: null });
    try {
      const response = await apiService.post('/smtp-profiles', data);
      const newProfile = response?.data ?? response;
      set((state) => ({
        smtpProfiles: [...state.smtpProfiles, newProfile],
        isSaving: false,
      }));
      get().applyFilters();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      set({ error: message, isSaving: false });
      throw error;
    }
  },

  updateSmtpProfile: async (id, data) => {
    set({ isSaving: true, error: null });
    try {
      const response = await apiService.put(`/smtp-profiles/${id}`, data);
      const updatedProfile = response?.data ?? response;
      set((state) => ({
        smtpProfiles: state.smtpProfiles.map((profile) => profile.id === id ? updatedProfile : profile),
        currentSmtpProfile: state.currentSmtpProfile?.id === id ? updatedProfile : state.currentSmtpProfile,
        isSaving: false,
      }));
      get().applyFilters();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      set({ error: message, isSaving: false });
      throw error;
    }
  },

  deleteSmtpProfile: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await apiService.delete(`/smtp-profiles/${id}`);
      set((state) => ({
        smtpProfiles: state.smtpProfiles.filter((profile) => profile.id !== id),
        currentSmtpProfile: state.currentSmtpProfile?.id === id ? null : state.currentSmtpProfile,
        isLoading: false,
      }));
      get().applyFilters();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      set({ error: message, isLoading: false });
    }
  },

  sendTestEmail: async (id, data) => {
    set({ isSendingTestEmail: true, error: null });
    try {
      await apiService.post(`/smtp-profiles/${id}/test`, data);
      set({ isSendingTestEmail: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      set({ error: message, isSendingTestEmail: false });
      throw error;
    }
  },

  setFilters: (filters) => {
    set((state) => ({ filters: { ...state.filters, ...filters } }));
    get().applyFilters();
  },

  resetFilters: () => {
    set({ filters: defaultFilters });
    get().applyFilters();
  },

  applyFilters: () => {
    const { smtpProfiles, filters } = get();
    let filtered = [...smtpProfiles];

    if (filters.search) {
      const search = filters.search.toLowerCase().trim();
      filtered = filtered.filter((profile) =>
        [profile.name, profile.host, profile.fromName, profile.fromAddress, profile.organization?.name ?? '', profile.id]
          .some((value) => value?.toLowerCase().includes(search))
      );
    }

    if (filters.organizationId) {
      filtered = filtered.filter((profile) => profile.organizationId === filters.organizationId);
    }

    filtered.sort((a, b) => {
      const getValue = (item: SmtpProfile) => {
        if (filters.sortBy === 'organization') {
          return item.organization?.name ?? '';
        }
        return item[filters.sortBy] ?? '';
      };

      const valueA = String(getValue(a)).toLowerCase();
      const valueB = String(getValue(b)).toLowerCase();

      if (valueA < valueB) return filters.sortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return filters.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    set({ filteredProfiles: filtered });
  },

  setCurrentSmtpProfile: (profile) => {
    set({ currentSmtpProfile: profile });
  },

  clearError: () => {
    set({ error: null });
  },
}));
