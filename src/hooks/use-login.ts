// hooks/use-login.ts
import { useState } from 'react';
import { apiService } from '@/app/services/api.service';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from '@tanstack/react-router';
import { User } from '@/store/user.store';

interface TwoFaRequired {
  requires2FA: true;
  data: { tempToken: string; methods: string[]; email: string };
}

interface LoginSuccess {
  requires2FA?: false;
  data: {
    user: User;
    tokens: { accessToken: string; refreshToken: string; expiresIn: string };
  };
}

export type LoginResult = TwoFaRequired | LoginSuccess | null;

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const login = async (email: string, password: string): Promise<LoginResult> => {
    setIsLoading(true);
    try {
      const response = await apiService.post('/auth/login', { email, password });

      // Cas 2FA requise
      if (response.requires2FA) {
        return { requires2FA: true, data: response.data };
      }

      // Connexion directe
      if (response.success && response.data) {
        setAuth(response.data.user, response.data.tokens.accessToken, response.data.tokens.refreshToken);
        router.navigate({ to: '/dashboard' });
        return { data: response.data };
      }
      return null;
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /** Appelé après vérification 2FA réussie */
  const finalizeLogin = (userData: User, accessToken: string, refreshToken: string) => {
    setAuth(userData , accessToken, refreshToken);
    router.navigate({ to: '/dashboard' });
  };

  return { login, finalizeLogin, isLoading };
};
