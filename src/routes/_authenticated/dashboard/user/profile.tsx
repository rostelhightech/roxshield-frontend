import { createFileRoute } from '@tanstack/react-router';
import UserProfilePage from '@/app/dashboard/user/profile/page';

export const Route = createFileRoute('/_authenticated/dashboard/user/profile')({
  component: UserProfilePage,
});
