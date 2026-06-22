'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

interface CampaignTargetsCardProps {
  pendingTargets: number;
  failedTargets: number;
  eventCounts: {
    EMAIL_SENT: number;
    EMAIL_OPENED: number;
    LINK_CLICKED: number;
    // FORM_SUBMITTED: number;
  };
}

export function CampaignTargetsCard({ pendingTargets, failedTargets, eventCounts }: CampaignTargetsCardProps) {
  const { t: tCommon } = useTranslation('common');
  return (
    <Card className="rounded-sm border-gray-200 dark:border-white/10 bg-white dark:bg-white dark:bg-white dark:bg-[#0c1023]/90 shadow-sm dark:shadow-xl">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">{tCommon('admin.campaigns.targets_title')}</CardTitle>
        <CardDescription className="text-gray-500 dark:text-gray-400">
          Suivez l’état des destinataires.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-md border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">{tCommon('admin.campaigns.targets_pending')}</p>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">{pendingTargets}</p>
          </div>
          <div className="rounded-md border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">{tCommon('admin.campaigns.targets_failed')}</p>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">{failedTargets}</p>
          </div>
        </div>
        
        <div className="rounded-md border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">{tCommon('admin.campaigns.tracking_events')}</p>
          <div className="mt-3 grid gap-2">
            {Object?.entries(eventCounts).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between text-sm text-gray-700 dark:text-white/80">
                <span>{type.replace('_', ' ').toLowerCase()}</span>
                <span className="font-medium text-gray-900 dark:text-white">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}