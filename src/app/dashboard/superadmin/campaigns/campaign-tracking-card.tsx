'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { useTranslation } from 'react-i18next';

interface CampaignTrackingCardProps {
  trackingEvents: any[];
}

export function CampaignTrackingCard({ trackingEvents }: CampaignTrackingCardProps) {
  const { t: tCommon } = useTranslation('common');
  return (
    <Card className="rounded-sm border-gray-200 dark:border-white/10 bg-white   dark:bg-[#0c1023]/90 shadow-sm dark:shadow-xl">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-gray-900 dark:text-white">{tCommon('admin.campaigns.tracking_events')}</CardTitle>
        <CardDescription className="text-gray-500 dark:text-gray-400">
          {tCommon('admin.campaigns.tracking_desc')}
        </CardDescription>
      </CardHeader>
      <div className='overflow-y-auto max-h-[300px]'>
        <CardContent>
          {trackingEvents.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">{tCommon('admin.campaigns.tracking_empty')}</p>
          ) : (
            <Table className="min-w-full text-gray-900 dark:text-gray-900 dark:text-white border-separate border-spacing-0">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-600 dark:text-gray-900 dark:text-white">{tCommon('admin.campaigns.tracking_type')}</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-900 dark:text-white">Cible</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-900 dark:text-white">{tCommon('admin.campaigns.tracking_date')}</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-900 dark:text-white">IP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trackingEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="text-gray-700 dark:text-gray-900 dark:text-white">{event.type}</TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-900 dark:text-white">{event.target?.email ?? '—'}</TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-900 dark:text-white">{new Date(event.createdAt).toLocaleString('fr-FR')}</TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-900 dark:text-white">{event.ip ?? '—'}</TableCell>
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