import { create } from 'zustand';
import { apiService } from '@/app/services/api.service';

export interface OrganizationReference {
  id: string;
  name?: string | null;
}

export type SmtpProvider = 'smtp' | 'resend';

export interface SmtpProfile {
  id: string;
  organizationId: string;
  organization?: OrganizationReference | null;
  name: string;
  provider: SmtpProvider;
  fromName: string;
  fromAddress: string;
  isDefault: boolean;
  // SMTP only
  interfaceType?: string | null;
  host?: string | null;
  port?: number | null;
  username?: string | null;
  ignoreCertificateErrors: boolean;
  emailHeaders: Record<string, string> | null;
  gophishServerId?: number | null;
  // Resend only (jamais exposé en clair)
  hasResendApiKey?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSmtpProfileData {
  organizationId: string;
  name: string;
  provider: SmtpProvider;
  fromName: string;
  fromAddress: string;
  emailHeaders?: Record<string, string> | null;
  // SMTP
  interfaceType?: string;
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  ignoreCertificateErrors?: boolean;
  // Resend
  resendApiKey?: string;
}

export type UpdateSmtpProfileData = Partial<CreateSmtpProfileData>;

export interface SmtpProfileFilters {
  search: string;
  organizationId: string;
  provider: SmtpProvider | '';
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
  createSmtpProfile: (data: CreateSmtpProfileData, isDefault?: boolean) => Promise<void>;
  updateSmtpProfile: (id: string, data: UpdateSmtpProfileData, isDefault?: boolean) => Promise<void>;
  deleteSmtpProfile: (id: string, isDefault?: boolean) => Promise<void>;
  sendTestEmail: (id: string, data: { to: string; subject?: string; text?: string, isDefault?: boolean }) => Promise<void>;
  setFilters: (filters: Partial<SmtpProfileFilters>) => void;
  resetFilters: () => void;
  applyFilters: () => void;
  setCurrentSmtpProfile: (profile: SmtpProfile | null) => void;
  clearError: () => void;
}

const defaultFilters: SmtpProfileFilters = {
  search: '',
  organizationId: '',
  provider: '',
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
      if (!smtpProfile) throw new Error('Profil SMTP introuvable');
      set({ currentSmtpProfile: smtpProfile, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      set({ error: message, isLoading: false });
    }
  },

  createSmtpProfile: async (data, isDefault) => {
    set({ isSaving: true, error: null });
    try {
      const response = await apiService.post(isDefault ? '/smtp-profiles/superadmin' : '/smtp-profiles', data);
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

  updateSmtpProfile: async (id, data, isDefault) => {
    set({ isSaving: true, error: null });
    try {
      const response = await apiService.put(isDefault ? `/smtp-profiles/superadmin/${id}` : `/smtp-profiles/${id}`, data);
      const updatedProfile = response?.data ?? response;
      set((state) => ({
        smtpProfiles: state.smtpProfiles.map((p) => p.id === id ? updatedProfile : p),
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

  deleteSmtpProfile: async (id, isDefault) => {
    set({ isLoading: true, error: null });
    try {
      await apiService.delete(isDefault ? `/smtp-profiles/superadmin/${id}` : `/smtp-profiles/${id}`);
      set((state) => ({
        smtpProfiles: state.smtpProfiles.filter((p) => p.id !== id),
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
      filtered = filtered.filter((p) =>
        [p.name, p.host, p.fromName, p.fromAddress, p.organization?.name ?? '', p.id]
          .some((v) => v?.toLowerCase().includes(search))
      );
    }

    if (filters.organizationId) {
      filtered = filtered.filter((p) => p.organizationId === filters.organizationId);
    }

    if (filters.provider) {
      filtered = filtered.filter((p) => p.provider === filters.provider);
    }

    filtered.sort((a, b) => {
      const getValue = (item: SmtpProfile) => {
        if (filters.sortBy === 'organization') return item.organization?.name ?? '';
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

  setCurrentSmtpProfile: (profile) => set({ currentSmtpProfile: profile }),
  clearError: () => set({ error: null }),
}));