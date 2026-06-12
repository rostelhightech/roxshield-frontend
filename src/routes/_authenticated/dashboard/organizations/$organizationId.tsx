import { createFileRoute } from '@tanstack/react-router';
import { OrganizationDetailPage } from '@/app/dashboard/superadmin/organizations/organization-detail';

export const Route = createFileRoute('/_authenticated/dashboard/organizations/$organizationId')({
  component: OrganizationDetailPage,
});