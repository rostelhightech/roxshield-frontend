import { create } from 'zustand';
import { apiService } from '@/app/services/api.service';
import type { User } from './user.store';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  language: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProfileInput {
  name: string;
  email: string;
  language: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface UpdatePasswordInput {
  current: string;
  new: string;
  confirm: string;
}

interface SettingsStore {
  user: User | null;
  isLoading: boolean;
  isUploadingAvatar: boolean;
  error: string | null;

  fetchProfile: () => Promise<void>;
  updateProfile: (data: UpdateProfileInput) => Promise<boolean>;
  updatePassword: (data: UpdatePasswordInput) => Promise<boolean>;
  updateLanguage: (lang: string) => Promise<boolean>;
  uploadAvatar: (file: File) => Promise<boolean>;
  deleteAvatar: () => Promise<boolean>;
}

export const useSettingsStore = create<SettingsStore>((set, _get) => ({
  user: null,
  isLoading: false,
  isUploadingAvatar: false,
  error: null,

  // 1. Charger le profil utilisateur
  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.get('/settings/profile');
      set({ user: response.data, isLoading: false });
    } catch (error: unknown) {
      const message = (error as Error).message || 'Erreur lors du chargement du profil';
      set({ error: message, isLoading: false });
    }
  },

  // 2. Mettre à jour le nom et l'email
  updateProfile: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.put('/settings/profile', data);
      
      set({ 
        user: response.data, 
        isLoading: false 
      });
      return true;
    } catch (error: unknown) {
      const message = (error as Error).message || 'Erreur lors de la mise à jour du profil';
      set({ error: message, isLoading: false });
      return false;
    }
  },

  // 3. Modifier le mot de passe
  updatePassword: async (data) => {
    if (data.new !== data.confirm) {
      set({ error: 'Les mots de passe ne correspondent pas' });
      return false;
    }

    set({ isLoading: true, error: null });
    try {
      await apiService.patch('/settings/password', {
        currentPassword: data.current,
        newPassword: data.new
      });
      
      set({ isLoading: false });
      return true;
    } catch (error: unknown) {
      const message = (error as Error).message || 'Erreur lors de la modification du mot de passe';
      set({ error: message, isLoading: false });
      return false;
    }
  },

  // 4. Upload photo de profil
  uploadAvatar: async (file: File) => {
    set({ isUploadingAvatar: true, error: null });
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const response = await apiService.post('/settings/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const avatarUrl = response.data?.avatarUrl ?? null;
      set(state => ({
        user: state.user ? { ...state.user, avatarUrl } : null,
        isUploadingAvatar: false,
      }));
      return true;
    } catch (error: unknown) {
      set({ error: (error as Error).message ?? "Erreur lors de l'upload", isUploadingAvatar: false });
      return false;
    }
  },

  // 5. Supprimer la photo de profil
  deleteAvatar: async () => {
    set({ isUploadingAvatar: true, error: null });
    try {
      await apiService.delete('/settings/avatar');
      set(state => ({
        user: state.user ? { ...state.user, avatarUrl: null } : null,
        isUploadingAvatar: false,
      }));
      return true;
    } catch (error: unknown) {
      set({ error: (error as Error).message ?? 'Erreur lors de la suppression', isUploadingAvatar: false });
      return false;
    }
  },

  // 6. Mettre à jour la langue
  updateLanguage: async (lang) => {
    set({ isLoading: true, error: null });
    try {
      await apiService.patch('/settings/language', { language: lang });
      
      set(state => ({
        user: state.user ? { ...state.user, language: lang } : null,
        isLoading: false
      }));
      
      return true;
    } catch (error: unknown) {
      const message = ( error as Error).message || 'Erreur lors du changement de langue';
      set({ error: message, isLoading: false });
      return false;
    }
  },
}));