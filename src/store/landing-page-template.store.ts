'use client';

import { create } from 'zustand';
import { apiService } from '@/app/services/api.service';

export interface LandingPageTemplateOrganization {
  id: string;
  name?: string | null;
}

export interface LandingPageTemplate {
  id: string;
  name: string;
  category: string | null;
  title: string | null;
  html: string;
  isDefault: boolean;
  organizationId: string;
  organization?: LandingPageTemplateOrganization | null;
  createdAt: string;
  updatedAt: string;
}

export interface LandingPageTemplateFilters {
  search: string;
  sortBy: 'createdAt' | 'name' | 'organization';
  sortOrder: 'asc' | 'desc';
}

interface LandingPageTemplateState {
  landingPageTemplates: LandingPageTemplate[];
  filteredLandingPageTemplates: LandingPageTemplate[];
  currentLandingPageTemplate: LandingPageTemplate | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  filters: LandingPageTemplateFilters;
  fetchAll: () => Promise<void>;
  fetchById: (id: string) => Promise<void>;
  createLandingPageTemplate: (data: Omit<LandingPageTemplate, 'id' | 'createdAt' | 'updatedAt'>, isDefault?: boolean) => Promise<void>;
  updateLandingPageTemplate: (id: string, data: Partial<LandingPageTemplate>, isDefault?: boolean) => Promise<void>;
  deleteLandingPageTemplate: (id: string, isDefault?: boolean) => Promise<void>;
  setFilters: (filters: Partial<LandingPageTemplateFilters>) => void;
  resetFilters: () => void;
  applyFilters: () => void;
  setCurrentLandingPageTemplate: (template: LandingPageTemplate | null) => void;
  clearError: () => void;
}

const defaultFilters: LandingPageTemplateFilters = {
  search: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

export const useLandingPageTemplateStore = create<LandingPageTemplateState>((set, get) => ({
  landingPageTemplates: [],
  filteredLandingPageTemplates: [],
  currentLandingPageTemplate: null,
  isLoading: false,
  isSaving: false,
  error: null,
  filters: defaultFilters,

  fetchAll: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.get('/landing-page-templates');
      const landingPageTemplates = response?.data ?? [];
      set({ landingPageTemplates, isLoading: false });
      get().applyFilters();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      set({ error: message, isLoading: false });
    }
  },

  fetchById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.get(`/landing-page-templates/${id}`);
      const template = response?.data ?? null;
      if (!template) {
        throw new Error('Template de landing page introuvable');
      }
      set({ currentLandingPageTemplate: template, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      set({ error: message, isLoading: false });
    }
  },

  createLandingPageTemplate: async (data, isDefault) => {
    set({ isSaving: true, error: null });
    try {
      const response = await apiService.post(isDefault ? '/landing-page-templates/superadmin' : '/landing-page-templates', data);
      const newTemplate = response?.data as LandingPageTemplate;
      set((state) => ({
        landingPageTemplates: [...state.landingPageTemplates, newTemplate],
        isSaving: false,
      }));
      get().applyFilters();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      set({ error: message, isSaving: false });
    }
  },

  updateLandingPageTemplate: async (id, data, isDefault) => {
    set({ isSaving: true, error: null });
    try {
      const response = await apiService.put(isDefault ? `/landing-page-templates/superadmin/${id}` : `/landing-page-templates/${id}`, data);
      const updatedTemplate = response?.data as LandingPageTemplate;
      set((state) => ({
        landingPageTemplates: state.landingPageTemplates.map((template) =>
          template.id === id ? updatedTemplate : template
        ),
        currentLandingPageTemplate: state.currentLandingPageTemplate?.id === id ? updatedTemplate : state.currentLandingPageTemplate,
        isSaving: false,
      }));
      get().applyFilters();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      set({ error: message, isSaving: false });
    }
  },

  deleteLandingPageTemplate: async (id, isDefault) => {
    set({ isLoading: true, error: null });
    try {
      await apiService.delete(isDefault ? `/landing-page-templates/superadmin/${id}` : `/landing-page-templates/${id}`);
      set((state) => ({
        landingPageTemplates: state.landingPageTemplates.filter((template) => template.id !== id),
        currentLandingPageTemplate: state.currentLandingPageTemplate?.id === id ? null : state.currentLandingPageTemplate,
        isLoading: false,
      }));
      get().applyFilters();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      set({ error: message, isLoading: false });
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
    const { landingPageTemplates, filters } = get();
    let filtered = [...landingPageTemplates];

    if (filters.search) {
      const search = filters.search.toLowerCase().trim();
      filtered = filtered.filter((template) =>
        [template.name, template.title ?? '', template.organization?.name ?? '', template.id]
          .some((value) => value?.toLowerCase().includes(search))
      );
    }

    filtered.sort((a, b) => {
      const getValue = (item: LandingPageTemplate) => {
        if (filters.sortBy === 'organization') {
          return item.organization?.name ?? '';
        }
        return (item as Record<string, unknown>)[filters.sortBy] ?? '';
      };

      const valueA = String(getValue(a)).toLowerCase();
      const valueB = String(getValue(b)).toLowerCase();

      if (valueA < valueB) return filters.sortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return filters.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    set({ filteredLandingPageTemplates: filtered });
  },

  setCurrentLandingPageTemplate: (template) => {
    set({ currentLandingPageTemplate: template });
  },

  clearError: () => {
    set({ error: null });
  },
}));
