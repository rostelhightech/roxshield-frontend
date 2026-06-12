"use client";

import { useRouter } from "@/next/navigation";
import { useAuthStore } from "@/types/store/auth.store";
import { useEffect } from "react";
import { SplashScreenComponent } from "./layout/splash-screen";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, hydrate, isLoading } = useAuthStore();
  const router = useRouter();

  // Hydrate store from storage on mount
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Redirect only after hydration completed
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !user) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, user]);

  return (
    <SplashScreenComponent>
      {children}
    </SplashScreenComponent>
  );
}
