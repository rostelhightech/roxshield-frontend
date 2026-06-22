import { createFileRoute } from '@tanstack/react-router';
import { CreateFormationPage } from '@/app/dashboard/superadmin/formations/create-formation';

export const Route = createFileRoute('/_authenticated/dashboard/formations/create')({
  component: CreateFormationPage,
});