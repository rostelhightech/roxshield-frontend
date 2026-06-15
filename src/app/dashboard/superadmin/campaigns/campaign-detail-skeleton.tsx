'use client';

import { DashboardTopbar } from '@/components/layout/topbar';

export function CampaignDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050816] text-gray-900 dark:text-white">
      <DashboardTopbar
        title="Chargement de la campagne"
        description="Veuillez patienter pendant que nous récupérons les informations de la campagne."
      />
      <div className="mx-auto max-w-6xl px-4 py-10 text-center text-gray-400">
        Chargement...
      </div>
    </div>
  );
}