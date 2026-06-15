// api.service.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';

class ApiService {
  private api: AxiosInstance;
  private static instance: ApiService;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;
    config: InternalAxiosRequestConfig;
  }> = [];

  constructor() {
    this.api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('accessToken');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        // Afficher un message de succès si présent dans la réponse
        if (response.data?.message && response.config.method !== 'get') {
          toast.success(response.data.message);
        }
        return response;
      },
      async (error) => {
        const originalRequest = error.config;
        const isAuthRoute = originalRequest.url?.includes('/auth/');

        // Gestion des erreurs avec affichage du message du backend
      if (error.response) {
  const { status, data } = error.response;

  if (status !== 401) {
    if (data?.message) {
      toast.error(data.message);
    } else if (data?.error) {
      toast.error(data.error);
    } else if (typeof data === 'string') {
      toast.error(data);
    } else if (status === 500) {
      toast.error('Une erreur serveur est survenue');
    } else if (status === 404) {
      toast.error('Ressource non trouvée');
    } else if (status === 403) {
      toast.error('Accès non autorisé');
    } else {
      toast.error('Une erreur est survenue');
    }
  }
}

        // Gestion du refresh token (401)
        if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject, config: originalRequest });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = localStorage.getItem('refreshToken');

            if (!refreshToken) throw new Error('No refresh token');

            const response = await axios.post('http://localhost:3000/api/v1/auth/refresh-token', { refreshToken });

            if (response.data.success) {
              const newAccessToken = response.data.data.accessToken;
              localStorage.setItem('accessToken', newAccessToken);
              
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              
              this.processQueue(null, newAccessToken);
              
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            this.processQueue(refreshError, null);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            toast.error('Session expirée, veuillez vous reconnecter');
            setTimeout(() => {
              window.location.href = '/login';
            }, 1500);
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private processQueue(error: any, token: string | null) {
    this.failedQueue.forEach(promise => {
      if (error) {
        promise.reject(error);
      } else {
        promise.config.headers.Authorization = `Bearer ${token}`;
        promise.resolve(this.api(promise.config));
      }
    });
    this.failedQueue = [];
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  async get<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.get<T>(url, { ...config, params });
    return response.data;
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.post<T>(url, data, config);
    return response.data;
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.put<T>(url, data, config);
    return response.data;
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.delete<T>(url, config);
    return response.data;
  }

  async upload<T = any>(url: string, file: File, fieldName: string = 'file'): Promise<T> {
    const formData = new FormData();
    formData.append(fieldName, file);
    return this.post<T>(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  }

  async download(url: string, filename: string): Promise<void> {
    const response = await this.api.get(url, { responseType: 'blob' });
    const blob = new Blob([response.data]);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  }
}

export const apiService = ApiService.getInstance();