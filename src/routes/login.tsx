// src/routes/login.tsx
import LoginPage from "@/app/login/page";
import { SplashScreenComponent } from "@/components/layout/splash-screen";
import { useAuthStore } from "@/store/auth.store";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute('/login')({
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
  component: LoginPage,
});
