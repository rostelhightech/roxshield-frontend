import { create } from 'zustand';
import { apiService } from '@/app/services/api.service';
import type { Organization } from './organization.store';
import type { User } from './user.store';

export interface Group {
  id: string;
  name: string;
  description: string | null;
  organizationId: string;
  organization?: Organization;
  users?: User[];
  createdAt: string;
  updatedAt: string;
}

export interface GroupFilters {
  search: string;
  organizationId: string;
  sortBy: keyof Group | 'organizationName' | 'usersCount';
  sortOrder: 'asc' | 'desc';
}

export interface CreateGroupPayload {
  name: string;
  description?: string | null;
  organizationId: string;
}

interface GroupState {
  groups: Group[];
  filteredGroups: Group[];
  currentGroup: Group | null;
  isLoading: boolean;
  error: string | null;
  filters: GroupFilters;

  fetchAll: () => Promise<void>;
  fetchById: (id: string) => Promise<void>;
  createGroup: (data: CreateGroupPayload) => Promise<void>;
  updateGroup: (id: string, data: Partial<CreateGroupPayload>) => Promise<void>;
  deleteGroup: (id: string) => Promise<void>;
  setFilters: (filters: Partial<GroupFilters>) => void;
  resetFilters: () => void;
  applyFilters: () => void;
}

const defaultFilters: GroupFilters = {
  search: '',
  organizationId: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

export const useGroupStore = create<GroupState>((set, get) => ({
  groups: [],
  filteredGroups: [],
  currentGroup: null,
  isLoading: false,
  error: null,
  filters: defaultFilters,

  fetchAll: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.get('/groups');
      set({ groups: response.data as Group[], isLoading: false });
      get().applyFilters();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      set({ error: message, isLoading: false });
    }
  },

  fetchById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.get(`/groups/${id}`);
      set({ currentGroup: response.data as Group, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      set({ error: message, isLoading: false });
    }
  },

  createGroup: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.post('/groups', data);
      const newGroup = response.data as Group;
      set(state => ({
        groups: [...state.groups, newGroup],
        isLoading: false,
      }));
      get().applyFilters();
      get().fetchById(newGroup.id);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  updateGroup: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.put(`/groups/${id}`, data);
      const updatedGroup = response.data as Group;
      set(state => ({
        groups: state.groups.map(group => group.id === id ? updatedGroup : group),
        currentGroup: state.currentGroup?.id === id ? updatedGroup : state.currentGroup,
        isLoading: false,
      }));
      get().applyFilters();
      get().fetchById(id);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  deleteGroup: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await apiService.delete(`/groups/${id}`);
      set(state => ({
        groups: state.groups.filter(group => group.id !== id),
        currentGroup: state.currentGroup?.id === id ? null : state.currentGroup,
        isLoading: false,
      }));
      get().applyFilters();
      get().fetchAll();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      set({ error: message, isLoading: false });
    }
  },

  setFilters: (filters) => {
    set(state => ({
      filters: { ...state.filters, ...filters },
    }));
    get().applyFilters();
  },

  resetFilters: () => {
    set({ filters: defaultFilters });
    get().applyFilters();
  },

  applyFilters: () => {
    const { groups, filters } = get();
    let filtered = [...groups];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(group =>
        group.name.toLowerCase().includes(searchLower) ||
        (group.description?.toLowerCase().includes(searchLower)) ||
        (group.organization?.name.toLowerCase().includes(searchLower))
      );
    }

    if (filters.organizationId) {
      filtered = filtered.filter(group => group.organizationId === filters.organizationId);
    }

    filtered.sort((a, b) => {
      let aVal: unknown = a[filters.sortBy as keyof Group];
      let bVal: unknown = b[filters.sortBy as keyof Group];

      if (filters.sortBy === 'organizationName') {
        aVal = a.organization?.name ?? '';
        bVal = b.organization?.name ?? '';
      }

      if (filters.sortBy === 'usersCount') {
        aVal = a.users?.length ?? 0;
        bVal = b.users?.length ?? 0;
      }

      if (aVal < bVal) return filters.sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return filters.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    set({ filteredGroups: filtered });
  },
}));
