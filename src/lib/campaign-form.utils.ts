import type { Campaign } from "@/store/campaign.store";

export const buildFormDefaults = (campaign: Campaign): Campaign => ({
  ...campaign,
  description: campaign.description ?? '',
  scheduledAt: campaign.scheduledAt ?? '',
  endAt: campaign.endAt ?? '',
  targetGroupId: campaign.targets.find((target) => target.groupId)?.groupId ?? null,
  targetEmails: campaign.targets
    .filter((target) => !target.groupId)
    .map((target) => target.email)
    .join('\n'),
});