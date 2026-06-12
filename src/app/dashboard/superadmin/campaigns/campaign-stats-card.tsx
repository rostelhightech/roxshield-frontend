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
    <Card className="rounded-md border border-white/10 bg-[#0c1023]/90 shadow-xl">
      <CardHeader>
        <CardTitle>Statistiques de campagne</CardTitle>
        <CardDescription>Mesurez les ouvertures, clics et résultats par cible.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-md border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-gray-400">Cibles totales</p>
            <p className="text-2xl font-semibold text-white">{totalTargets}</p>
          </div>
          <div className="rounded-md border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-gray-400">Envoyés</p>
            <p className="text-2xl font-semibold text-white">{sentTargets}</p>
          </div>
          <div className="rounded-md border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-gray-400">Ouvertures</p>
            <p className="text-2xl font-semibold text-white">{openedCount}</p>
          </div>
          <div className="rounded-md border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-gray-400">Clics</p>
            <p className="text-2xl font-semibold text-white">{clickedCount}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}