import { create } from 'zustand';
import { apiService } from '@/app/services/api.service';
import { type Organization } from './organization.store';

export interface Ambassador {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  totalReferrals: number;
  successfulReferrals: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AmbassadorStats {
  ambassador: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  stats: {
    totalReferrals: number;
    activeReferrals: number;
    successRate: number;
    totalRevenue: number;
  };
  referredOrganizations: Organization[];
}

export interface QRCodeData {
  ambassadorId: string;
  ambassadorName: string;
  referralUrl: string;
  qrCode: string;
}

interface AmbassadorFilters {
  search: string;
  isActive?: boolean;
}

interface AmbassadorState {
  ambassadors: Ambassador[];
  filteredAmbassadors: Ambassador[];
  selectedAmbassador: Ambassador | null;
  ambassadorStats: AmbassadorStats | null;
  qrCodeData: QRCodeData | null;
  isLoading: boolean;
  error: string | null;
  filters: AmbassadorFilters;

  // Actions
  fetchAmbassadors: () => Promise<void>;
  fetchAmbassadorById: (id: string) => Promise<void>;
  createAmbassador: (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  }) => Promise<void>;
  updateAmbassador: (
    id: string,
    data: Partial<{
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      isActive: boolean;
    }>
  ) => Promise<void>;
  deleteAmbassador: (id: string) => Promise<void>;
  generateQRCode: (id: string) => Promise<void>;
  fetchAmbassadorStats: (id: string) => Promise<void>;
  clearQRCode: () => void;
  setFilters: (filters: Partial<AmbassadorFilters>) => void;
  resetFilters: () => void;
  applyFilters: () => void;
  reset: () => void;
}

export const useAmbassadorStore = create<AmbassadorState>((set, get) => ({
  ambassadors: [],
  filteredAmbassadors: [],
  selectedAmbassador: null,
  ambassadorStats: null,
  qrCodeData: null,
  isLoading: false,
  error: null,
  filters: {
    search: '',
    isActive: undefined,
  },

  fetchAmbassadors: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiService.get<{ success: boolean; data: Ambassador[] }>(
        '/ambassadors'
      );
      if ('success' in response && response.success) {
        set({ ambassadors: response.data });
        get().applyFilters();
      }
    } catch (error: unknown) {
      console.error('Erreur lors du chargement des ambassadeurs:', error);
      set({ error: (  error as Error).message || 'Erreur lors du chargement des ambassadeurs' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAmbassadorById: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiService.get<{ success: boolean; data: Ambassador }>(
        `/ambassadors/${id}`
      );
      if ('success' in response && response.success) {
        set({ selectedAmbassador: response.data });
      }
    } catch (error: unknown) {
      console.error('Erreur lors du chargement de l\'ambassadeur:', error);
      set({ error: (  error as Error).message || 'Erreur lors du chargement de l\'ambassadeur' });
    } finally {
      set({ isLoading: false });
    }
  },

  createAmbassador: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiService.post<{ success: boolean; data: Ambassador }>(
        '/ambassadors',
        data
      );
      if ('success' in response && response.success) {
        set((state) => ({
          ambassadors: [response.data, ...state.ambassadors],
        }));
        get().fetchAmbassadors();
        get().applyFilters();
      }
    } catch (error: unknown) {
      console.error('Erreur lors de la création de l\'ambassadeur:', error);
      set({ error: (  error as Error).message || 'Erreur lors de la création de l\'ambassadeur' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateAmbassador: async (id, data) => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiService.put<{ success: boolean; data: Ambassador }>(
        `/ambassadors/${id}`,
        data
      );
      if ('success' in response && response.success) {
        set((state) => ({
          ambassadors: state.ambassadors.map((a) =>
            a.id === id ? response.data : a
          ),
          selectedAmbassador:
            state.selectedAmbassador?.id === id
              ? response.data
              : state.selectedAmbassador,
        }));
        get().fetchAmbassadors();
        get().applyFilters();
      }
    } catch (error: unknown) {
      console.error('Erreur lors de la mise à jour de l\'ambassadeur:', error);
      set({ error: (  error as Error).message || 'Erreur lors de la mise à jour de l\'ambassadeur' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteAmbassador: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await apiService.delete(`/ambassadors/${id}`);
      set((state) => ({
        ambassadors: state.ambassadors.filter((a) => a.id !== id),
      }));
      get().fetchAmbassadors();
      get().applyFilters();
    } catch (error: unknown) {
      console.error('Erreur lors de la suppression de l\'ambassadeur:', error);
      set({ error: (  error as Error).message || 'Erreur lors de la suppression de l\'ambassadeur' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

generateQRCode: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiService.get<{ success: boolean; data: QRCodeData }>(
        `/ambassadors/${id}/qrcode`
      );
      if ('success' in response && response.success) {
        set({ qrCodeData: response.data });
      }
    } catch (error: unknown) {
      console.error('Erreur lors de la génération du QR code:', error);
      set({ error: (  error as Error).message || 'Erreur lors de la génération du QR code' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAmbassadorStats: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiService.get<{ success: boolean; data: AmbassadorStats }>(
        `/ambassadors/${id}/stats`
      );
      if ('success' in response && response.success) {
        set({ ambassadorStats: response.data });
      }
    } catch (error: unknown) {
      console.error('Erreur lors du chargement des statistiques:', error);
      set({ error: (  error as Error).message || 'Erreur lors du chargement des statistiques' });
    } finally {
      set({ isLoading: false });
    }
  },

  clearQRCode: () => {
    set({ qrCodeData: null });
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
    get().applyFilters();
  },

  resetFilters: () => {
    set({
      filters: {
        search: '',
        isActive: undefined,
      },
    });
    get().applyFilters();
  },

  applyFilters: () => {
    const { ambassadors, filters } = get();
    let filtered = [...ambassadors];

    // Filtre par recherche
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (amb) =>
          amb.firstName.toLowerCase().includes(searchLower) ||
          amb.lastName.toLowerCase().includes(searchLower) ||
          amb.email.toLowerCase().includes(searchLower) ||
          (amb.phone && amb.phone.toLowerCase().includes(searchLower))
      );
    }

    // Filtre par statut
    if (filters.isActive !== undefined) {
      filtered = filtered.filter((amb) => amb.isActive === filters.isActive);
    }

    set({ filteredAmbassadors: filtered });
  },

  reset: () => {
    set({
      ambassadors: [],
      filteredAmbassadors: [],
      selectedAmbassador: null,
      ambassadorStats: null,
      qrCodeData: null,
      isLoading: false,
      error: null,
      filters: {
        search: '',
        isActive: undefined,
      },
    });
  },
}));
