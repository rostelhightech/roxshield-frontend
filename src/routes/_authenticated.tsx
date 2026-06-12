// src/routes/_authenticated.tsx
import { apiService } from '@/app/services/api.service';
import { SplashScreenComponent } from '@/components/layout/splash-screen';
import { useAuthStore } from '@/store/auth.store';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context, location }) => {
    const store = useAuthStore.getState();

    if (store.isLoading) {
      store.hydrate();
    }

    if (store.accessToken && !store.user) {
      try {
        store.setLoading(true);
        await apiService.get('/auth/me');
        store.setIsAuthenticated(true);
        store.clearAuth();
      } catch (error) {
        store.clearAuth();
      } finally {
        store.setLoading(false);
      }
    }

    if (!useAuthStore.getState().isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      });
    }
  },
  pendingComponent: () => <SplashScreenComponent />,
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading) {
    return <SplashScreenComponent />;
  }

  return <Outlet />;
}
