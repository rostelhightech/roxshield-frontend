"use client";

// This file is kept as a fallback but the main dashboard routing
// is now handled by TanStack Router layout route at:
// src/routes/_authenticated/dashboard.tsx

import { LoadingComponent } from "@/components/layout/loading-skeleton";
import { useAuthStore } from "@/store/auth.store";
import { useCheckAuth } from "@/hooks/use-check-auth";

export default function DashboardPage() {
  const { user } = useAuthStore();
  useCheckAuth();

  // This component should not be reached in normal flow.
  // The TanStack Router layout at /_authenticated/dashboard handles everything.
  if (!user) return <LoadingComponent />;

  return <LoadingComponent />;
}
