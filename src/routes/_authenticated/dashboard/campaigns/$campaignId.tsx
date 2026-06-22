import { createFileRoute } from '@tanstack/react-router';
import CampaignDetailPage from '@/app/dashboard/superadmin/campaigns/campaign-detail';

export const Route = createFileRoute('/_authenticated/dashboard/campaigns/$campaignId')({
  component: CampaignDetailPage,
});
