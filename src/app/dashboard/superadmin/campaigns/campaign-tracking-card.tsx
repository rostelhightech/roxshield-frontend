'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

interface CampaignTrackingCardProps {
  trackingEvents: any[];
}

export function CampaignTrackingCard({ trackingEvents }: CampaignTrackingCardProps) {
  return (
    <Card className="rounded-md border border-white/10 bg-[#0c1023]/90 shadow-xl">
      <CardHeader>
        <CardTitle>Événements de tracking</CardTitle>
        <CardDescription>Liste des clics, ouvertures et formulaires soumis.</CardDescription>
      </CardHeader>
      <div className='overflow-y-auto max-h-[300px]'>
        <CardContent>
          {trackingEvents.length === 0 ? (
            <p className="text-sm text-gray-400">Aucun événement enregistré pour cette campagne.</p>
          ) : (
            <Table className="min-w-full text-white border-separate border-spacing-0">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white">Type</TableHead>
                  <TableHead className="text-white">Cible</TableHead>
                  <TableHead className="text-white">Date</TableHead>
                  <TableHead className="text-white">IP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trackingEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="text-white">{event.type}</TableCell>
                    <TableCell className="text-white">{event.target?.email ?? '—'}</TableCell>
                    <TableCell className="text-white">{new Date(event.createdAt).toLocaleString('fr-FR')}</TableCell>
                    <TableCell className="text-white">{event.ip ?? '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </div>
    </Card>
  );
}