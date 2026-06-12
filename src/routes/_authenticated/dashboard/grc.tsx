import { createFileRoute } from "@tanstack/react-router";
import GrcPage from '@/app/dashboard/superadmin/grc/page';

export const Route = createFileRoute("/_authenticated/dashboard/grc")({
  component: GrcPage,
});
