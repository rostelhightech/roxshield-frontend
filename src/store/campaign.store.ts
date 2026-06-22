'use client';

import { create } from 'zustand';
import { apiService } from '@/app/services/api.service';

export interface CampaignTargetPayload {
  email?: string | null;
  groupId?: string | null;
  userId?: string | null;
  firstName?: string | null;
  lastName?: string | null;
}

export interface CampaignTargetDetail {
  id: string;
  campaignId: string;
  userId?: string | null;
  groupId?: string | null;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  status: string;
  createdAt: string;
   members?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    position: string | null;
    isActive: boolean | null;
  }[];
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  } | null;
  group?: {
    id: string;
    name: string;
  } | null;
}

export interface TrackingEventDetail {
  id: string;
  campaignId: string;
  targetId: string;
  type: string;
  ip?: string | null;
  userAgent?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
  target?: {
    id: string;
    email: string;
    status: string;
    user?: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
    } | null;
    group?: {
      id: string;
      name: string;
    } | null;
  } | null;
}

export interface Campaign {
  id: string;
  organizationId: string;
  name: string;
  description: string | null;
  smtpProfileId: string;
  targetGroupId: string | null;
  targetEmails: string | null;
  startedAt: string | null;
  fromName: string | null;
  emailTemplateId: string;
  landingPageTemplateId: string;
  status: string;
  scheduledAt: string | null;
  endAt: string | null;
  createdAt: string;
  targets: CampaignTargetDetail[];
  updatedAt: string;
  organization?: {
    id: string;
    name: string;
  } | null;
  smtpProfile?: {
    id: string;
    fromAddress: string;
    fromName: string;
  } | null;
  emailTemplate?: {
    id: string;
    name: string;
  } | null;
  landingPageTemplate?: {
    id: string;
    name: string;
  } | null;
}

export interface CampaignDetail extends Campaign {
  targets: CampaignTargetDetail[];
  landingPageUrl: string | null;
  trackingEvents: TrackingEventDetail[];
}

export interface TimelineEvent {
  type: string;
  date: string;
  description: string;
}

export interface HourlyData {
  hour: number;
  opens: number;
  clicks: number;
}

export interface DailyData {
  day: string;
  opens: number;
  clicks: number;
}

export interface TimeAnalysis {
  hourlyAnalysis: HourlyData[];
  dailyAnalysis: DailyData[];
}

export interface DeviceData {
  name: string;
  value: number;
}

export interface UserAgentAnalysis {
  deviceData: DeviceData[];
  browserData: DeviceData[];
  osData: DeviceData[];
}

export interface DetailedTargetAnalysis {
  targetId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  status: string;
  emailSent: boolean;
  emailSentAt: string | null;
  emailOpened: boolean;
  emailOpenedAt: string | null;
  linkClicked: boolean;
  linkClickedAt: string | null;
  formSubmitted: boolean;
  formSubmittedAt: string | null;
  timeToOpenMinutes: number | null;
  timeToClickMinutes: number | null;
  totalEvents: number;
  lastEventAt: string | null;
  device: string | null;
  ip: string | null;
}

export interface CreateCampaignPayload {
  organizationId: string;
  name: string;
  description?: string | null;
  fromName?: string | null;
  smtpProfileId: string;
  emailTemplateId: string;
  landingPageTemplateId: string;
  scheduledAt?: string | null;
  endAt?: string | null;
  targets: CampaignTargetPayload[];
}

interface CampaignState {
  campaigns: Campaign[];
  currentCampaign: CampaignDetail | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  timeline: TimelineEvent[];
  timeAnalysis: TimeAnalysis | null;
  userAgentAnalysis: UserAgentAnalysis | null;
  targetsWithoutInteraction: CampaignTargetDetail[];
  detailedTargetAnalysis: DetailedTargetAnalysis[];
  fetchAll: () => Promise<void>;
  fetchById: (id: string) => Promise<void>;
  createCampaign: (data: CreateCampaignPayload) => Promise<void>;
  updateCampaign: (id: string, data: Partial<Campaign>) => Promise<void>;
  deleteCampaign: (id: string) => Promise<void>;
  archiveCampaign: (id: string) => Promise<void>;
  restoreCampaign: (id: string) => Promise<void>;
  setCurrentCampaign: (campaign: CampaignDetail | null) => void;
  duplicate:(id: string) => Promise<void>;
  launchCampaign: (id: string) => Promise<void>;
  fetchTimeline: (id: string) => Promise<void>;
  fetchTimeAnalysis: (id: string) => Promise<void>;
  fetchUserAgentAnalysis: (id: string) => Promise<void>;
  fetchTargetsWithoutInteraction: (id: string) => Promise<void>;
  fetchDetailedTargetAnalysis: (id: string) => Promise<void>;
}

export const useCampaignStore = create<CampaignState>((set, get) => ({
  campaigns: [],
  currentCampaign: null,
  isLoading: false,
  isSaving: false,
  error: null,
  timeline: [],
  timeAnalysis: null,
  userAgentAnalysis: null,
  targetsWithoutInteraction: [],
  detailedTargetAnalysis: [],

  fetchAll: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.get<{ success: boolean; data: Campaign[] }>('/campaigns');
      const campaigns = response.data ?? response;
      set({ campaigns, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      set({ error: message, isLoading: false });
    }
  },

  duplicate: async (id) => {
    set({ isSaving: true, error: null });
    try {
      await apiService.post<{ success: boolean; message: string }>(`/campaigns/${id}/duplicate`);
      set({ isSaving: false });
      get().fetchAll();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      set({ error: message, isSaving: false });
    }
  },

  launchCampaign: async (id) => {
    set({ isSaving: true, error: null });
    try {
      await apiService.post<{ success: boolean; message: string }>(`/campaigns/${id}/launch`);
      set((state) => ({
        campaigns: state.campaigns.map((campaign) =>
          campaign.id === id ? { ...campaign, status: 'IN_PROGRESS' } : campaign
        ),
        currentCampaign:
          state.currentCampaign?.id === id
            ? { ...state.currentCampaign, status: 'IN_PROGRESS' }
            : state.currentCampaign,  
        isSaving: false,
      }));
      get().fetchAll();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      set({ error: message, isSaving: false });
    }
  },
  
  fetchById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      type CampaignByIdResponse = {
        data?: { campaign?: Campaign; targets?: CampaignTargetDetail[]; trackingEvents?: unknown[] };
        campaign?: Campaign;
        targets?: CampaignTargetDetail[];
        trackingEvents?: unknown[];
      };
      const response = await apiService.get<CampaignByIdResponse>(`/campaigns/${id}`);

      const campaign = response.data?.campaign ?? response.campaign ?? null;
      const targets = response.data?.targets ?? response.targets ?? [];
      const trackingEvents = response.data?.trackingEvents ?? response.trackingEvents ?? [];

      const campaignDetail = campaign
        ? {
            ...campaign,
            targets,
            trackingEvents,
          }
        : null;

      set({ currentCampaign: campaignDetail as CampaignDetail, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      set({ error: message, isLoading: false });
    }
  },

  createCampaign: async (data) => {
    set({ isSaving: true, error: null });
    try {
      const response = await apiService.post<{ success: boolean; data: Campaign }>('/campaigns', data);
      const campaign = response.data ?? response;
      set((state) => ({
        campaigns: [campaign, ...state.campaigns],
        isSaving: false,
      }));
      get().fetchById(campaign.id as string);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      set({ error: message, isSaving: false });
      throw error;
    }
  },

  updateCampaign: async (id, data) => {
    set({ isSaving: true, error: null });
    try {
      await apiService.put<{ success: boolean; message: string }>(`/campaigns/${id}`, data);
      set((state) => ({
        campaigns: state.campaigns.map((campaign) =>
          campaign.id === id ? { ...campaign, ...data } : campaign
        ),
        currentCampaign:
          state.currentCampaign?.id === id ? { ...state.currentCampaign, ...data } : state.currentCampaign,
        isSaving: false,
      }));
      get().fetchAll();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      set({ error: message, isSaving: false });
      throw error;
    }
  },

  deleteCampaign: async (id) => {
    set({ isSaving: true, error: null });
    try {
      await apiService.delete<{ success: boolean; message: string }>(`/campaigns/${id}`);
      set((state) => ({
        campaigns: state.campaigns.filter((campaign) => campaign.id !== id),
        currentCampaign: state.currentCampaign?.id === id ? null : state.currentCampaign,
        isSaving: false,
      }));
      get().fetchAll();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      set({ error: message, isSaving: false });
      throw error;
    }
  },

  archiveCampaign: async (id) => {
    set({ isSaving: true, error: null });
    try {
      await apiService.put<{ success: boolean; message: string }>(`/campaigns/${id}`, {
        status: 'ARCHIVED',
      });
      set((state) => ({
        campaigns: state.campaigns.map((campaign) =>
          campaign.id === id ? { ...campaign, status: 'ARCHIVED' } : campaign
        ),
        currentCampaign:
          state.currentCampaign?.id === id
            ? { ...state.currentCampaign, status: 'ARCHIVED' }
            : state.currentCampaign,
        isSaving: false,
      }));
      get().fetchAll();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      set({ error: message, isSaving: false });
      throw error;
    }
  },

  restoreCampaign: async (id) => {
    set({ isSaving: true, error: null });
    try {
      await apiService.put<{ success: boolean; message: string }>(`/campaigns/${id}`, {
        status: 'DRAFT',
      });
      set((state) => ({
        campaigns: state.campaigns.map((campaign) =>
          campaign.id === id ? { ...campaign, status: 'DRAFT' } : campaign
        ),
        currentCampaign:
          state.currentCampaign?.id === id
            ? { ...state.currentCampaign, status: 'DRAFT' }
            : state.currentCampaign,
        isSaving: false,
      }));
      get().fetchAll();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      set({ error: message, isSaving: false });
      throw error;
    }
  },

  setCurrentCampaign: (campaign) => {
    set({ currentCampaign: campaign });
  },

  fetchTimeline: async (id: string) => {
    try {
      const response = await apiService.get<{ success: boolean; data: TimelineEvent[] }>(`/campaigns/${id}/timeline`);
      const timeline = response.data ?? response;
      set({ timeline });
    } catch (error) {
      console.error('Erreur lors du chargement de la timeline', error);
    }
  },

  fetchTimeAnalysis: async (id: string) => {
    try {
      const response = await apiService.get<{ success: boolean; data: TimeAnalysis }>(`/campaigns/${id}/time-analysis`);
      const timeAnalysis = response.data ?? response;
      set({ timeAnalysis });
    } catch (error) {
      console.error('Erreur lors de l\'analyse temporelle', error);
    }
  },

  fetchUserAgentAnalysis: async (id: string) => {
    try {
      const response = await apiService.get<{ success: boolean; data: UserAgentAnalysis }>(`/campaigns/${id}/user-agent-analysis`);
      const userAgentAnalysis = response.data ?? response;
      set({ userAgentAnalysis });
    } catch (error) {
      console.error('Erreur lors de l\'analyse des user agents', error);
    }
  },

  fetchTargetsWithoutInteraction: async (id: string) => {
    try {
      const response = await apiService.get<{ success: boolean; data: CampaignTargetDetail[] }>(`/campaigns/${id}/targets-without-interaction`);
      const targetsWithoutInteraction = response.data ?? response;
      set({ targetsWithoutInteraction });
    } catch (error) {
      console.error('Erreur lors du chargement des cibles sans interaction', error);
    }
  },

  fetchDetailedTargetAnalysis: async (id: string) => {
    try {
      const response = await apiService.get<{ success: boolean; data: DetailedTargetAnalysis[] }>(`/campaigns/${id}/detailed-target-analysis`);
      const detailedTargetAnalysis = response.data ?? response;
      set({ detailedTargetAnalysis });
    } catch (error) {
      console.error('Erreur lors de l\'analyse détaillée des cibles', error);
    }
  },
}));
