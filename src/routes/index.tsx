import LoginPage from '@/app/login/page';
import { useAuthStore } from '@/store/auth.store';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    let store = useAuthStore.getState();

    // Attendre que le chargement initial soit terminé
    if (store.isLoading) {
      await new Promise<void>((resolve) => {
        const unsubscribe = useAuthStore.subscribe((state) => {
          if (!state.isLoading) {
            unsubscribe();
            resolve();
          }
        });
      });

      store = useAuthStore.getState();
    }

    // Si l'utilisateur n'est pas authentifié, rediriger vers login
    if (!store.isAuthenticated) {
      throw redirect({
        to: '/login',
      });
    }

    // Si l'utilisateur est authentifié, rediriger vers dashboard
    throw redirect({
      to: '/dashboard',
    });
  },
  component: LoginPage,
});