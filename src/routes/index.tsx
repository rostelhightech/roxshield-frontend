import LandingPage from '@/app/page';
import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/')({
  component: LandingPage,
});