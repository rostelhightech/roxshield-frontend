'use client';

import { DashboardTopbar } from '@/components/layout/topbar';
import { useTranslation } from 'react-i18next';

export function CampaignDetailSkeleton() {
  const { t: tCommon } = useTranslation('common');
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050816] text-gray-900 dark:text-white">
      <DashboardTopbar
        title={tCommon('admin.campaigns.loading_title')}
        description={tCommon('admin.campaigns.loading_description')}
      />
      <div className="mx-auto max-w-6xl px-4 py-10 text-center text-gray-400">
        {tCommon('admin.page_overview.risk_by_dept_loading')}
      </div>
    </div>
  );
}