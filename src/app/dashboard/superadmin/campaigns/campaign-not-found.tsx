'use client';

import { Link } from '@tanstack/react-router';
import { DashboardTopbar } from '@/components/layout/topbar';
import { useTranslation } from 'react-i18next';

export function CampaignNotFound() {
  const { t: tCommon } = useTranslation('common');
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050816] text-gray-900 dark:text-white">
      <DashboardTopbar
        title={tCommon('admin.campaigns.not_found_title')}
        description={tCommon('admin.campaigns.not_found_desc')}
      />
      <div className="mx-auto max-w-6xl px-4 py-10 text-center text-gray-400">
        <p>{tCommon('admin.campaigns.not_found')}</p>
        <Link
          className="mt-4 inline-flex rounded-md border border-white/10 bg-gray-50 dark:bg-white/5 px-4 py-2 text-sm text-gray-900 dark:text-white transition hover:bg-gray-100 dark:bg-white/10"
          to="/dashboard/campaigns"
        >
          {tCommon('admin.campaigns.back_to_campaigns')}
        </Link>
      </div>
    </div>
  );
}