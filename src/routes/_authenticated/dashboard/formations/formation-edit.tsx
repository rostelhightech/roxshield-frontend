import { createFileRoute } from '@tanstack/react-router';
import { EditFormationPage } from '@/app/dashboard/superadmin/formations/edit-formation';

export const Route = createFileRoute('/_authenticated/dashboard/formations/formation-edit')({
  component: EditFormationPage,
  validateSearch: (search: Record<string, unknown>): { id?: string } => {
    return {
      id: (search.id as string) || undefined,
    };
  },
});
