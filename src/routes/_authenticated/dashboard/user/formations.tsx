import { createFileRoute } from '@tanstack/react-router';
import UserFormationsPage from '@/app/dashboard/user/formations/page';

export const Route = createFileRoute('/_authenticated/dashboard/user/formations')({
  component: UserFormationsPage,
});
