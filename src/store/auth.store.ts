// stores/auth.store.ts
import { tokenStorage } from '@/app/services/token.service';
import { apiService } from '@/app/services/api.service';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  firstName?: string;
  lastName?: string;
  position?: string;
  department?: string;
  createdAt?: string;
}

interface AuthState {
  // State
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  setAccessToken: (token: string) => void;
  clearAuth: () => void;
  hydrate: () => void;
  setLoading: (loading: boolean) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: true,

      // Hydrater le store depuis le storage
      hydrate: () => {
        const accessToken = tokenStorage.getAccessToken();
        const user = tokenStorage.getUser();
        
        set({
          accessToken,
          user,
          isAuthenticated: !!accessToken,
          isLoading: false,
        });
      },

      // Set toutes les infos d'auth
      setAuth: (user, accessToken, refreshToken) => {
        tokenStorage.setAuthData({ accessToken, refreshToken, expiresIn: '15m' }, user);
        set({
          user,
          accessToken,
          isAuthenticated: true,
        });
      },

      // Mettre à jour seulement l'access token
      setAccessToken: (token) => {
        tokenStorage.setAccessToken(token);
        set({ accessToken: token });
      },

      // Clear tout
      clearAuth: () => {
        tokenStorage.clearAll();
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        });
        window.location.href = '/login';
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setIsAuthenticated: (isAuthenticated: boolean) => {
        set({ isAuthenticated });
      },

      changePassword: async (currentPassword: string, newPassword: string) => {
        try {
          await apiService.post('/auth/change-password', {
            currentPassword,
            newPassword
          });
        } catch (error) {
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage', // nom dans localStorage
      partialize: (state) => ({ user: state.user, accessToken: state.accessToken }), // ce qu'on persiste
    }
  )
);