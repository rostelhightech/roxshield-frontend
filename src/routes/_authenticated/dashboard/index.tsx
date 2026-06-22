import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/store/auth.store";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  beforeLoad: () => {
    // Get user from auth store
    const user = useAuthStore.getState().user;
    
    // Redirect based on role
    if (user?.role === 'user') {
      throw redirect({ to: "/dashboard/user/formations" });
    }
    
    // Admins and superadmins go to overview
    throw redirect({ to: "/dashboard/overview" });
  },
});
