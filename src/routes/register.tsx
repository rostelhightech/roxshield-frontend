// src/routes/register.tsx
import RegisterPage from "@/app/register/page";
import { SplashScreenComponent } from "@/components/layout/splash-screen";
import { useAuthStore } from "@/store/auth.store";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute('/register')({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      ref: search.ref as string | undefined,
    };
  },
  beforeLoad: async () => {
    let store = useAuthStore.getState();

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

    if (store.isAuthenticated) {
      throw redirect({
        to: '/dashboard',
      });
    }
  },
  pendingComponent: () => <SplashScreenComponent />,
  component: RegisterPage,
});
