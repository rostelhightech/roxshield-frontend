import { create } from 'zustand';
import { apiService } from '@/app/services/api.service';

export interface TemplateOrganization {
  id: string;
  name: string | null;
}

export interface Template {
  id: string;
  name: string;
  category: string | null;
  subject: string;
  html: string;
  text: string;
  organizationId: string;
  organization?: TemplateOrganization | null;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateFilters {
  search: string;
  category: string;
  organizationId: string;
  sortBy: keyof Template;
  sortOrder: 'asc' | 'desc';
}

interface TemplateState {
  templates: Template[];
  templateList: Template[];
  filteredTemplates: Template[];
  currentTemplate: Template | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  filters: TemplateFilters;
  
  fetchAll: () => Promise<void>;
  fetchTemplateList: () => Promise<void>;
  fetchById: (id: string) => Promise<void>;
  createTemplate: (data: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTemplate: (id: string, data: Partial<Template>) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  setFilters: (filters: Partial<TemplateFilters>) => void;
  resetFilters: () => void;
  applyFilters: () => void;
  setCurrentTemplate: (template: Template | null) => void;
  clearError: () => void;
  reset: () => void;
}

const defaultFilters: TemplateFilters = {
  search: '',
  category: '',
  organizationId: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

export const useTemplateStore = create<TemplateState>((set, get) => ({
  templates: [],
  templateList: [],
  filteredTemplates: [],
  currentTemplate: null,
  isLoading: false,
  isSaving: false,
  error: null,
  filters: defaultFilters,

  fetchAll: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.get('/templates');
      const templates = response?.data ?? [];
      set({ templates, isLoading: false });
      get().applyFilters();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      set({ error: message, isLoading: false });
    }
  },

  fetchTemplateList: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.get('/templates');
      const templates = response?.data ?? [];
      set({ templateList: templates, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      set({ error: message, isLoading: false });
    }
  },

  fetchById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.get(`/templates/${id}`);
      const template = response?.data ?? null;
      if (!template) {
        throw new Error('Template introuvable');
      }
      set({ currentTemplate: template, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      set({ error: message, isLoading: false });
    }
  },

  createTemplate: async (data) => {
    set({ isSaving: true, error: null });
    try {
      const response = await apiService.post('/templates', data);
      const newTemplate = response?.data as Template;
      set(state => ({ 
        templates: [...state.templates, newTemplate],
        templateList: [...state.templateList, newTemplate],
        isSaving: false 
      }));
      get().applyFilters();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      set({ error: message, isSaving: false });
    }
  },

  updateTemplate: async (id, data) => {
    set({ isSaving: true, error: null });
    try {
      const response = await apiService.put(`/templates/${id}`, data);
      const updatedTemplate = response?.data as Template;
      set(state => ({
        templates: state.templates.map(t => t.id === id ? updatedTemplate : t),
        templateList: state.templateList.map(t => t.id === id ? updatedTemplate : t),
        currentTemplate: state.currentTemplate?.id === id ? updatedTemplate : state.currentTemplate,
        isSaving: false
      }));
      get().applyFilters();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      set({ error: message, isSaving: false });
    }
  },

  deleteTemplate: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await apiService.delete(`/templates/${id}`);
      set(state => ({
        templates: state.templates.filter(t => t.id !== id),
        templateList: state.templateList.filter(t => t.id !== id),
        currentTemplate: state.currentTemplate?.id === id ? null : state.currentTemplate,
        isLoading: false
      }));
      get().applyFilters();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      set({ error: message, isLoading: false });
    }
  },

  setFilters: (filters) => {
    set(state => ({ filters: { ...state.filters, ...filters } }));
  },

  resetFilters: () => {
    set({ filters: defaultFilters });
    get().applyFilters();
  },

  applyFilters: () => {
    const { templates, filters } = get();
    let filtered = [...templates];

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(search) ||
        t.subject.toLowerCase().includes(search)
      );
    }

    if (filters.category) {
      filtered = filtered.filter(t => t.category === filters.category);
    }

    if (filters.organizationId) {
      filtered = filtered.filter(t => t.organizationId === filters.organizationId);
    }

    filtered.sort((a, b) => {
      const aValue = a[filters.sortBy];
      const bValue = b[filters.sortBy];

      if (aValue < bValue) return filters.sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return filters.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    set({ filteredTemplates: filtered });
  },

  setCurrentTemplate: (template) => {
    set({ currentTemplate: template });
  },

  clearError: () => {
    set({ error: null });
  },

  reset: () => {
    set({
      templates: [],
      templateList: [],
      filteredTemplates: [],
      currentTemplate: null,
      isLoading: false,
      isSaving: false,
      error: null,
      filters: defaultFilters,
    });
  },
}));
