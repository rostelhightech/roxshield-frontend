import { create } from 'zustand';
import { apiService } from '@/app/services/api.service';
import type { Organization } from './organization.store';
import type { Group } from './group.store';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  position: string | null;
  role: 'user' | 'admin' | 'superadmin';
  isActive: boolean;
  organizationId: string | null;
  organization?: Organization | null;
  groupId: string | null;
  group?: Group | null;
  lastLogin: string | null;
  lastLoginIp: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserFilters {
  search: string;
  role: string;
  organizationId: string;
  groupId: string;
  position: string;
  status: string;
  sortBy: keyof User | 'organizationName' | 'groupName';
  sortOrder: 'asc' | 'desc';
}

export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string | null;
  position?: string | null;
  role?: User['role'];
  organizationId?: string | null;
  groupId?: string | null;
  isActive?: boolean;
}

interface UserState {
  users: User[];
  filteredUsers: User[];
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  filters: UserFilters;

  fetchAll: () => Promise<void>;
  fetchById: (id: string) => Promise<void>;
  createUser: (data: CreateUserPayload) => Promise<void>;
  updateUser: (id: string, data: Partial<CreateUserPayload>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  toggleActive: (id: string) => Promise<void>;
  setFilters: (filters: Partial<UserFilters>) => void;
  resetFilters: () => void;
  applyFilters: () => void;
}

const defaultFilters: UserFilters = {
  search: '',
  role: '',
  organizationId: '',
  groupId: '',
  position: '',
  status: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  filteredUsers: [],
  currentUser: null,
  isLoading: false,
  error: null,
  filters: defaultFilters,

  fetchAll: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.get('/users');
      const users = response.data as User[];
      set({ users, isLoading: false });
      get().applyFilters();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      set({ error: message, isLoading: false });
    }
  },

  fetchById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.get(`/users/${id}`);
      set({ currentUser: response.data as User, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      set({ error: message, isLoading: false });
    }
  },

  createUser: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.post('/users', data);
      const newUser = response.data as User;
      set(state => ({
        users: [...state.users, newUser],
        isLoading: false,
      }));
      get().applyFilters();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  updateUser: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.put(`/users/${id}`, data);
      const updatedUser = response.data as User;
      set(state => ({
        users: state.users.map(user => user.id === id ? updatedUser : user),
        currentUser: state.currentUser?.id === id ? updatedUser : state.currentUser,
        isLoading: false,
      }));
      get().applyFilters();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  deleteUser: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await apiService.delete(`/users/${id}`);
      set(state => ({
        users: state.users.filter(user => user.id !== id),
        currentUser: state.currentUser?.id === id ? null : state.currentUser,
        isLoading: false,
      }));
      get().applyFilters();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      set({ error: message, isLoading: false });
    }
  },

  toggleActive: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.patch(`/users/${id}/toggle-active`);
      const updatedUser = response.data as User;
      set(state => ({
        users: state.users.map(user => user.id === id ? updatedUser : user),
        currentUser: state.currentUser?.id === id ? updatedUser : state.currentUser,
        isLoading: false,
      }));
      get().applyFilters();
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
    const { users, filters } = get();
    let filtered = [...users];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(user =>
        user.firstName.toLowerCase().includes(searchLower) ||
        user.lastName.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        (user.phone?.toLowerCase().includes(searchLower)) ||
        (user.position?.toLowerCase().includes(searchLower)) ||
        (user.organization?.name.toLowerCase().includes(searchLower)) ||
        (user.group?.name.toLowerCase().includes(searchLower))
      );
    }

    if (filters.role) {
      filtered = filtered.filter(user => user.role === filters.role);
    }

    if (filters.organizationId) {
      filtered = filtered.filter(user => user.organizationId === filters.organizationId);
    }

    if (filters.groupId) {
      filtered = filtered.filter(user => user.groupId === filters.groupId);
    }

    if (filters.position) {
      filtered = filtered.filter(user => user.position === filters.position);
    }

    if (filters.status) {
      const isActive = filters.status === 'active';
      filtered = filtered.filter(user => user.isActive === isActive);
    }

    filtered.sort((a, b) => {
      let aVal: any = a[filters.sortBy as keyof User];
      let bVal: any = b[filters.sortBy as keyof User];

      if (filters.sortBy === 'organizationName') {
        aVal = a.organization?.name ?? '';
        bVal = b.organization?.name ?? '';
      }

      if (filters.sortBy === 'groupName') {
        aVal = a.group?.name ?? '';
        bVal = b.group?.name ?? '';
      }

      if (aVal < bVal) return filters.sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return filters.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    set({ filteredUsers: filtered });
  },
}));
