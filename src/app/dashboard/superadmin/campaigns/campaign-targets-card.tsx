'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

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
  return (
    <Card className="rounded-md border border-white/10 bg-[#0c1023]/90 shadow-xl">
      <CardHeader>
        <CardTitle>Cibles et statut</CardTitle>
        <CardDescription>Suivez l’état des destinataires.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-md border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-gray-400">En attente</p>
            <p className="text-xl font-semibold text-white">{pendingTargets}</p>
          </div>
          <div className="rounded-md border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-gray-400">Échecs</p>
            <p className="text-xl font-semibold text-white">{failedTargets}</p>
          </div>
        </div>
        
        <div className="rounded-md border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-gray-400">Événements de tracking</p>
          <div className="mt-3 grid gap-2">
            {Object?.entries(eventCounts).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between text-sm text-white/80">
                <span>{type.replace('_', ' ').toLowerCase()}</span>
                <span>{count}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}