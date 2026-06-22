import { create } from 'zustand';
import { apiService } from '@/app/services/api.service';

// Types pour les métadonnées
export interface ChapterMetadata {
  videoUrl?: string;
  documentUrl?: string;
  resources?: Array<{
    name: string;
    url: string;
    type: string;
  }>;
}

export interface VideoProgress {
  watchedDuration: number;
  totalDuration: number;
  lastPosition: number;
}

export interface EvaluationQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  options?: string[];
  correctAnswer: number | string;
  points: number;
  explanation?: string;
}

export interface EvaluationAnswer {
  questionId: string;
  selectedAnswer: number | string;
  isCorrect: boolean;
  pointsEarned: number;
  timeSpent?: number;
}

export interface SubmitEvaluationData {
  answers: EvaluationAnswer[];
  attemptId: string;
}

export interface SaveChapterProgressData {
  isCompleted: boolean;
  videoProgress?: VideoProgress;
}

// Interfaces existantes avec corrections
export interface Formation {
  id: string;
  title: string;
  description: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  estimatedDuration: number;
  isRequired: boolean;
  passingScore: number;
  type: string;
  hasFinalEvaluation: boolean;
  allowRetries: boolean;
  maxAttempts: number;
  targetAudience: {
    allUsers: boolean;
    specificGroups: string[];
    specificUsers: string[];
  };
  organizationId: string;
  createdBy?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  enrolledCount: number;
  completedCount: number;
  modules?: Array<{
    id: string;
    title: string;
    description?: string;
    order: number;
    estimatedDuration: number;
    chapters?: Array<{
      id: string;
      title: string;
      description?: string;
      content: string;
      order: number;
      type: 'VIDEO' | 'DOCUMENT' | 'INTERACTIVE' | 'QUIZ' | 'WEBINAR';
      estimatedDuration: number;
      metadata?: ChapterMetadata;
      pdfUrl?: string | null;
      pdfPublicId?: string | null;
    }>;
  }>;
  finalEvaluation?: {
    id: string;
    title: string;
    description?: string;
    questions: EvaluationQuestion[];
    passingScore: number;
    timeLimit?: number;
    allowRetries: boolean;
    maxAttempts: number;
    showCorrectAnswers: boolean;
  };
  stats?: {
    totalUsers: number;
    completedUsers: number;
    inProgressUsers: number;
    averageScore: number;
    averageTimeSpent: number;
  };
}

export interface FormationProgress {
  progressId: string;
  userId: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  progressPercentage: number;
  timeSpent: number;
  finalScore: number;
  startedAt?: string;
  completedAt?: string;
  lastAccessedAt: string;
  userFirstName: string;
  userLastName: string;
  userEmail: string;
  userPosition?: string;
  organizationName: string;
}

export interface FormationStats {
  formations: {
    totalFormations: number;
    publishedFormations: number;
    draftFormations: number;
    requiredFormations: number;
  };
  typeDistribution: Array<{
    type: string;
    count: number;
  }>;
  progress: {
    totalEnrollments: number;
    completedEnrollments: number;
    averageCompletionRate: number;
    averageScore: number;
  };
}

export interface FormationFilters {
  status?: string;
  organizationId?: string;
  search?: string;
  sortBy: keyof Formation | 'status';
  sortOrder: 'asc' | 'desc';
}

export interface CreateFormationPayload {
  title: string;
  description: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  estimatedDuration: number;
  isRequired: boolean;
  passingScore: number;
  allowRetries: boolean;
  maxAttempts: number;
  targetAudience: Formation['targetAudience'];
  organizationId: string;
  modules: Array<{
    title: string;
    description?: string;
    order: number;
    estimatedDuration: number;
    chapters: Array<{
      title: string;
      description?: string;
      content: string;
      order: number;
      type: 'VIDEO' | 'DOCUMENT' | 'INTERACTIVE' | 'QUIZ' | 'WEBINAR';
      estimatedDuration: number;
      metadata?: ChapterMetadata;
      pdfUrl?: string | null;
      pdfPublicId?: string | null;
    }>;
  }>;
}

export interface FormationAnalytics {
  weeklyProgress: Array<{
    week: string;
    completed: number;
    started: number;
  }>;
  departmentStats: Array<{
    name: string;
    total: number;
    completed: number;
    rate: number;
    avgScore: number;
  }>;
  timeDistribution: Array<{
    range: string;
    count: number;
    percentage: number;
  }>;
  trend: {
    value: number;
    isPositive: boolean;
    percentage: number;
  };
}

export interface AssignFormationPayload {
  userIds?: string[];
  groupIds?: string[];
  allUsers?: boolean;
  organizationId?: string;
}

export interface MyFormation extends Omit<Formation, 'status'> {
  progressId: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  progressPercentage: number;
  timeSpent: number;
  currentScore: number;
  hasFinalEvaluation: boolean;
  bestScore: number;
  attemptCount: number;
  startedAt?: string;
  completedAt?: string;
  lastAccessedAt: string;
}

interface FormationState {
  formations: Formation[];
  filteredFormations: Formation[];
  selectedFormation: Formation | null;
  formationProgress: FormationProgress[];
  myFormations: MyFormation[];
  analytics: FormationAnalytics | null;
  stats: FormationStats | null;
  isLoading: boolean;
  error: string | null;
  filters: FormationFilters;

  fetchAll: (organizationId?: string) => Promise<void>;
  fetchById: (id: string) => Promise<void>;
  fetchMyFormations: () => Promise<void>;
  createFormation: (data: CreateFormationPayload) => Promise<Formation>;
  updateFormation: (id: string, data: Partial<CreateFormationPayload>) => Promise<void>;
  deleteFormation: (id: string) => Promise<void>;
  fetchFormationProgress: (formationId: string, filters?: { status?: string; organizationId?: string }) => Promise<void>;
  fetchFormationAnalytics: (formationId: string) => Promise<void>;
  assignFormation: (formationId: string, assignment: AssignFormationPayload) => Promise<void>;
  fetchFormationStats: (organizationId?: string) => Promise<void>;
  setFilters: (filters: Partial<FormationFilters>) => void;
  resetFilters: () => void;
  applyFilters: () => void;

  uploadChapterPdf: (file: File, organizationId: string) => Promise<{ pdfUrl: string; pdfPublicId: string }>;
  deleteChapterPdf: (chapterId: string) => Promise<void>;

  startFormation: (formationId: string) => Promise<unknown>;
  addTime: (chapterId: string, data: { timeSpent: number }) => Promise<unknown>;
  completeFormation: (formationId: string, data: { finalScore?: number }) => Promise<unknown>;
  saveChapterProgress: (formationId: string, chapterId: string, data: SaveChapterProgressData) => Promise<void>;
  getChaptersProgress: (formationId: string) => Promise<unknown[]>;
  submitEvaluation: (formationId: string, evaluationId: string, data: SubmitEvaluationData) => Promise<unknown>;
  startEvaluation: (formationId: string, evaluationId: string) => Promise<unknown>;
  getEvaluationAttempts: (formationId: string, evaluationId: string) => Promise<unknown[]>;
}

const defaultFilters: FormationFilters = {
  status: undefined,
  organizationId: undefined,
  search: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

export const useFormationStore = create<FormationState>((set, get) => ({
  formations: [],
  filteredFormations: [],
  selectedFormation: null,
  formationProgress: [],
  myFormations: [],
  analytics: null,
  stats: null,
  isLoading: false,
  error: null,
  filters: defaultFilters,

  fetchAll: async (organizationId) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (organizationId) params.append('organizationId', organizationId);

      const response = await apiService.get(`/formations?${params}`);

      const formationsData = response.data?.data || response.data || [];

      set({ formations: formationsData as Formation[], isLoading: false });
      get().applyFilters();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      set({ error: message, isLoading: false });
    }
  },

  fetchById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.get(`/formations/${id}`);
      const formationData = response.data?.data || response.data;
      set({ selectedFormation: formationData as Formation, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      set({ error: message, isLoading: false });
    }
  },

  fetchMyFormations: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.get('/formations/my-formations');
      const myFormationsData = response.data?.data || response.data || [];

      const mappedFormations: MyFormation[] = myFormationsData.map((formation: unknown) => {
        const f = formation as {
          id: string;
        progressStatus: string;
        finalScore: number;};
        return {
          ...f,
          status: f.progressStatus || 'NOT_STARTED',
          bestScore: f.finalScore || 0,
          attemptCount: 0,
        };
      });

      set({ myFormations: mappedFormations, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      set({ error: message, isLoading: false });
    }
  },

  addTime: async (chapterId: string, data: { timeSpent: number }) => {
    set({ error: null });
    try {
      const response = await apiService.put(`/formations/${chapterId}/add-time`, data);
      const updatedFormationData = response.data?.data || response.data;
      return updatedFormationData;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  createFormation: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.post('/formations', data);
      const newFormation = response.data as Formation;

      await get().fetchAll(data.organizationId);

      return newFormation;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  updateFormation: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.put(`/formations/${id}`, data);
      const updatedFormationData = response.data?.data || response.data;

      set(state => ({
        formations: state.formations.map(formation => formation.id === id ? updatedFormationData : formation),
        selectedFormation: state.selectedFormation?.id === id ? updatedFormationData : state.selectedFormation,
        isLoading: false,
      }));
      get().applyFilters();

      await get().fetchById(id);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  deleteFormation: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await apiService.delete(`/formations/${id}`);
      set(state => ({
        formations: state.formations.filter(formation => formation.id !== id),
        selectedFormation: state.selectedFormation?.id === id ? null : state.selectedFormation,
        isLoading: false,
      }));
      get().applyFilters();
      get().fetchAll();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      set({ error: message, isLoading: false });
    }
  },

  fetchFormationProgress: async (formationId, filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.organizationId) params.append('organizationId', filters.organizationId);

      const response = await apiService.get(`/formations/${formationId}/progress?${params}`);
      const progressData = response.data?.data || response.data || [];
      set({ formationProgress: progressData as FormationProgress[], isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      set({ error: message, isLoading: false });
    }
  },

  fetchFormationAnalytics: async (formationId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.get(`/formations/${formationId}/analytics`);
      const analyticsData = response.data?.data || response.data;
      set({ analytics: analyticsData as FormationAnalytics, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      set({ error: message, isLoading: false });
    }
  },

  assignFormation: async (formationId, assignment) => {
    set({ isLoading: true, error: null });
    try {
      await apiService.post(`/formations/${formationId}/assign`, assignment);
      set({ isLoading: false });

      if (assignment.organizationId) {
        await get().fetchFormationProgress(formationId, { organizationId: assignment.organizationId });
      }

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  fetchFormationStats: async (organizationId) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (organizationId) params.append('organizationId', organizationId);

      const response = await apiService.get(`/formations/stats?${params}`);
      set({ stats: response as FormationStats, isLoading: false });
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
    const { formations, filters } = get();
    let filtered = [...formations];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(formation =>
        formation.title.toLowerCase().includes(searchLower) ||
        formation.description.toLowerCase().includes(searchLower)
      );
    }

    if (filters.status) {
      filtered = filtered.filter(formation => formation.status === filters.status);
    }

    if (filters.organizationId) {
      filtered = filtered.filter(formation => formation.organizationId === filters.organizationId);
    }

    filtered.sort((a, b) => {
      const aVal = a[filters.sortBy as keyof Formation];
      const bVal = b[filters.sortBy as keyof Formation];

      if (filters.sortBy === 'status') {
        if (a.status < b.status) return filters.sortOrder === 'asc' ? -1 : 1;
        if (a.status > b.status) return filters.sortOrder === 'asc' ? 1 : -1;
        return 0;
      }

   if ((aVal && bVal) && (aVal ) < bVal) return filters.sortOrder === 'asc' ? -1 : 1;
      if ((aVal && bVal) && (aVal) > bVal) return filters.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    set({ filteredFormations: filtered });
  },

  uploadChapterPdf: async (file, organizationId) => {
    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('organizationId', organizationId);
    const response = await apiService.post('/formations/chapters/upload-pdf', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data as { pdfUrl: string; pdfPublicId: string };
  },

  deleteChapterPdf: async (chapterId) => {
    await apiService.delete(`/formations/chapters/${chapterId}/pdf`);
  },

  startFormation: async (formationId) => {
    try {
      const response = await apiService.post(`/formations/${formationId}/start`);
      await get().fetchMyFormations();
      return response.data;
    } catch (error) {
      console.error('Erreur lors du démarrage de la formation:', error);
      throw error;
    }
  },

  completeFormation: async (formationId, data) => {
    try {
      const response = await apiService.post(`/formations/${formationId}/complete`, data);
      await get().fetchMyFormations();
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la complétion de la formation:', error);
      throw error;
    }
  },

  saveChapterProgress: async (formationId, chapterId, data) => {
    try {
      await apiService.post(`/formations/${formationId}/chapters/${chapterId}/progress`, data);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la progression:', error);
      throw error;
    }
  },

  getChaptersProgress: async (formationId: string) => {
    try {
      const response = await apiService.get(`/formations/${formationId}/chapters/progress`);
      return response.data?.data || response.data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération de la progression des chapitres:', error);
      return [];
    }
  },

  submitEvaluation: async (formationId, evaluationId, data) => {
    try {
      const response = await apiService.post(
        `/formations/${formationId}/evaluations/${evaluationId}/attempt`,
        data
      );
      return response;
    } catch (error) {
      console.error('Erreur lors de la soumission de l\'évaluation:', error);
      throw error;
    }
  },

  startEvaluation: async (formationId: string, evaluationId: string) => {
    try {
      const response = await apiService.post(
        `/formations/${formationId}/evaluations/${evaluationId}/start`
      );
      return response;
    } catch (error) {
      console.error('Erreur lors du démarrage de l\'évaluation:', error);
      throw error;
    }
  },

  getEvaluationAttempts: async (formationId, evaluationId) => {
    try {
      const response = await apiService.get(
        `/formations/${formationId}/evaluations/${evaluationId}/attempts`
      );
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des tentatives:', error);
      throw error;
    }
  },
}));