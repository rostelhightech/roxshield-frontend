import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

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

export const useDemoStore = create<DemoStore>((set, get) => ({
  demoRequests: [],
  isLoading: false,
  error: null,

  fetchAll: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`${API_URL}/organizations/demos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ demoRequests: response.data.data, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Erreur lors du chargement des demandes de démo',
        isLoading: false 
      });
      toast.error('❌ Erreur lors du chargement des demandes de démo');
    }
  },

  createDemoRequest: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/organizations/demo`, data);
      
      if (response.data.success) {
        // Pas besoin de fetch car c'est une création publique
        set({ isLoading: false });
        toast.success('✅ Demande de démo envoyée avec succès!');
        return true;
      }
      return false;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erreur lors de l\'envoi de la demande';
      set({ error: message, isLoading: false });
      toast.error(`❌ ${message}`);
      return false;
    }
  },

  updateDemoStatus: async (id, status) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem('accessToken');
      await axios.patch(
        `${API_URL}/organizations/${id}/demo-status`,
        { demoStatus: status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Mettre à jour localement
      set(state => ({
        demoRequests: state.demoRequests.map(req =>
          req.id === id ? { ...req, demoStatus: status } : req
        ),
        isLoading: false,
      }));
      
      toast.success('✅ Statut mis à jour');
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Erreur lors de la mise à jour',
        isLoading: false 
      });
      toast.error('❌ Erreur lors de la mise à jour du statut');
    }
  },

  deleteDemoRequest: async (id) => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`${API_URL}/organizations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      set(state => ({
        demoRequests: state.demoRequests.filter(req => req.id !== id),
      }));
      
      toast.success('✅ Demande supprimée');
    } catch (error: any) {
      toast.error('❌ Erreur lors de la suppression');
    }
  },
}));
