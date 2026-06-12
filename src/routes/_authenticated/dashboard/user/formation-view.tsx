import { createFileRoute } from '@tanstack/react-router';
import ViewFormationPage from '@/app/dashboard/user/formations/view-formation';

export const Route = createFileRoute('/_authenticated/dashboard/user/formation-view')({
  component: ViewFormationPage,
  validateSearch: (search: Record<string, unknown>): { id?: string } => {
    return {
      id: (search.id as string) || undefined,
    };
  },
});
