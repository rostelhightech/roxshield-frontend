// hooks/useLogin.ts
import { useState } from 'react';
import { useTranslation } from "@/lib/i18n";
import { apiService } from '@/app/services/api.service';
import { useAuthStore } from '@/store/auth.store';
import toast from 'react-hot-toast';
import { useRouter } from '@tanstack/react-router';



interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
    tokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: string;
    };
  };
}

export const useLogin = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const setAuth = useAuthStore((state) => state.setAuth);

  const login = async (email: string, password: string): Promise<LoginResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.post<LoginResponse>("/auth/login", { email, password });
      
      
      if (response.success && response.data) {
        setAuth(
          response.data.user,
          response.data.tokens.accessToken,
          response.data.tokens.refreshToken
        );

        router.navigate({ to: "/dashboard" });
        toast.success("Connexion réussie");
        
        return response;
      }

      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    isLoading,
    error,
  };
};