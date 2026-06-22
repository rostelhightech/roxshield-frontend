import ResetPasswordPage from "@/app/reset-password/page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute('/reset-password')({
  validateSearch: (search: Record<string, unknown>) => ({
    token: (search.token as string) ?? '',
  }),
  component: ResetPasswordPage,
});
