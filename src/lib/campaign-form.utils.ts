import { CampaignFormData } from "@/app/dashboard/superadmin/campaigns/campaign-form";

export const buildFormDefaults = (campaign: any): CampaignFormData => ({
  name: campaign.name,
  description: campaign.description ?? '',
  organizationId: campaign.organizationId,
  smtpProfileId: campaign.smtpProfileId,
  emailTemplateId: campaign.emailTemplateId,
  landingPageTemplateId: campaign.landingPageTemplateId,
  scheduledAt: campaign.scheduledAt ?? '',
  endAt: campaign.endAt ?? '',
  targetGroupId: campaign.targets.find((target: any) => target.groupId)?.groupId ?? '',
  targetEmails: campaign.targets
    .filter((target: any) => !target.groupId)
    .map((target: any) => target.email)
    .join('\n'),
});