import { create } from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

export interface DemoRequest {
  id: string;
  name: string;
  sector?: string;
  city?: string;
  country?: string;
  type: 'enterprise' | 'campus';
  adminName?: string;
  adminEmail?: string;
  adminPhone?: string;
  companySize?: string;
  message?: string;
  preferredDemoDate?: string;
  demoStatus: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  isActive: boolean;
  referredByAmbassadorId?: string;
  referredByAmbassador?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface DemoStore {
  demoRequests: DemoRequest[];
  isLoading: boolean;
  error: string | null;

  fetchAll: () => Promise<void>;
  createDemoRequest: (data: Partial<DemoRequest>) => Promise<boolean>;
  updateDemoStatus: (id: string, status: DemoRequest['demoStatus']) => Promise<void>;
  deleteDemoRequest: (id: string) => Promise<void>;
}

// 🔍 Extraction robuste du message d'erreur
const getErrorMessage = (error: unknown): string => {
  if ((error as { response: { status: number; data: unknown } }).response) {
    const { status, data } = (error as { response: { status: number; data: { message: string , error: string, errors: Record<string, string[]>} } }).response;

    // Si la réponse contient un message bien structuré
    if (data) {
      if (typeof data === 'string') return data;
      if (data.message) return data.message;
      if (data.error) return data.error;
      if (data.errors) {
        // Pour les erreurs de validation (ex: email déjà pris)
        const messages = Object.values(data.errors).flat().join(' ');
        if (messages) return messages;
      }
    }

    // Message générique basé sur le code HTTP
    const statusMessages: Record<number, string> = {
      400: 'Requête invalide',
      401: 'Non authentifié',
      403: 'Accès refusé',
      404: 'Ressource non trouvée',
      409: 'Conflit : cet élément existe déjà',
      500: 'Erreur interne du serveur',
    };
    if (statusMessages[status]) return statusMessages[status];

    return `Erreur ${status} - ${data?.message || 'Problème inconnu'}`;
  }

  if ((error as Error).message) return (error as Error).message;
  return 'Une erreur inattendue est survenue.';
};

export const useDemoStore = create<DemoStore>((set, get) => ({
  demoRequests: [],
  isLoading: false,
  error: null,

  fetchAll: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`${API_URL}/api/v1/organizations/demos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ demoRequests: response.data.data, isLoading: false });
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      set({ error: message, isLoading: false });
      toast.error(`❌ ${message}`);
      console.error('Fetch all demos error:', error);
    }
  },

  createDemoRequest: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/api/v1/organizations/demo`, data);
      if (response.data.success) {
        set({ isLoading: false });
        toast.success('Demande de démo envoyée avec succès !');
        return true;
      }
      return false;
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      set({ error: message, isLoading: false });
      toast.error(`❌ ${message}`);
      console.error('Create demo error:', error);
      return false;
    }
  },

  updateDemoStatus: async (id, status) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem('accessToken');
      await axios.patch(
        `${API_URL}/api/v1/organizations/${id}/demo-status`,
        { demoStatus: status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      set(state => ({
        demoRequests: state.demoRequests.map(req =>
          req.id === id ? { ...req, demoStatus: status } : req
        ),
        isLoading: false,
      }));
      get().fetchAll();
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      set({ error: message, isLoading: false });
      toast.error(`❌ ${message}`);
      console.error('Update demo status error:', error);
    }
  },

  deleteDemoRequest: async (id) => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`${API_URL}/api/v1/organizations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      set(state => ({
        demoRequests: state.demoRequests.filter(req => req.id !== id),
      }));
      
      toast.success('✅ Demande supprimée');
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      toast.error(`❌ ${message}`);
      console.error('Delete demo error:', error);
    }
  },
}));