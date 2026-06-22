import { FormationDetailPage } from '@/app/dashboard/superadmin/formations/formation-detail';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/dashboard/formations/$formationId')({
  component: FormationDetailPage,
});