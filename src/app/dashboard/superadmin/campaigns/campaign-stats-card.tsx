'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface CampaignStatsCardProps {
  totalTargets: number;
  sentTargets: number;
  openedCount: number;
  clickedCount: number;
}

export function CampaignStatsCard({ totalTargets, sentTargets, openedCount, clickedCount }: CampaignStatsCardProps) {
  return (
    <Card className="rounded-sm   border-gray-200 dark:border-white/10 bg-white dark:bg-white dark:bg-white dark:bg-[#0c1023]/90 shadow-sm dark:shadow-xl">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">Statistiques de campagne</CardTitle>
        <CardDescription className="text-gray-500 dark:text-gray-400">
          Mesurez les ouvertures, clics et résultats par cible.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-md border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Cibles totales</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{totalTargets}</p>
          </div>
          <div className="rounded-md border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Envoyés</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{sentTargets}</p>
          </div>
          <div className="rounded-md border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Ouvertures</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{openedCount}</p>
          </div>
          <div className="rounded-md border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Clics</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{clickedCount}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}