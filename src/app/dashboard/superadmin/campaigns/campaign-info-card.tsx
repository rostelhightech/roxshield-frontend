'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

interface CampaignInfoCardProps {
  campaign: any;
}

export function CampaignInfoCard({ campaign }: CampaignInfoCardProps) {
  const { t: tCommon } = useTranslation('common');
  return (
    <Card className="rounded-sm   dark:border-white/10 bg-white   dark:bg-[#0c1023]/90 shadow-sm dark:shadow-xl">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-gray-900 dark:text-white">{tCommon('admin.campaigns.form_general_title')}</CardTitle>
        <CardDescription className="text-gray-500 dark:text-gray-400">
          {tCommon('admin.campaigns.info_desc')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{tCommon('user.profile.last_name')}</p>
            <p className="text-gray-900 dark:text-gray-900 dark:text-white">{campaign.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{tCommon('admin.ambassadors.status_placeholder')}</p>
            <p className="text-gray-900 dark:text-gray-900 dark:text-white">{campaign.status}</p>
          </div>
        </div>
        
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{tCommon('admin.campaigns.info_scheduled')}</p>
            <p className="text-gray-900 dark:text-gray-900 dark:text-white">
              {campaign.scheduledAt
                ? new Date(campaign.scheduledAt).toLocaleString('fr-FR')
                : tCommon('admin.campaigns.info_not_scheduled')}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{tCommon('admin.campaigns.info_end')}</p>
            <p className="text-gray-900 dark:text-gray-900 dark:text-white">
              {campaign.endAt
                ? new Date(campaign.endAt).toLocaleString('fr-FR')
                : tCommon('admin.campaigns.info_none')}
            </p>
          </div>
        </div>
        
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{tCommon('admin.campaigns.form_description')}</p>
          <p className="text-gray-900 dark:text-gray-900 dark:text-white">{campaign.description ?? 'Aucune description fournie.'}</p>
        </div>
        
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Email template</p>
            <p className="text-gray-900 dark:text-gray-900 dark:text-white">{campaign.emailTemplate?.name ?? tCommon('admin.campaigns.info_none')}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Landing page</p>
            <p className="text-gray-900 dark:text-gray-900 dark:text-white">{campaign.landingPageTemplate?.name ?? 'Aucune'}</p>
          </div>
        </div>
        
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">SMTP</p>
            <p className="text-gray-900 dark:text-gray-900 dark:text-white">{campaign.smtpProfile?.fromName ?? campaign.smtpProfile?.fromAddress ?? tCommon('admin.campaigns.info_none')}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{tCommon('admin.campaigns.info_created')}</p>
            <p className="text-gray-900 dark:text-gray-900 dark:text-white">{new Date(campaign.createdAt).toLocaleString('fr-FR')}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}