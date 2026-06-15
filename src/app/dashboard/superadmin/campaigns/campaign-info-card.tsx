'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface CampaignInfoCardProps {
  campaign: any;
}

export function CampaignInfoCard({ campaign }: CampaignInfoCardProps) {
  return (
    <Card className="rounded-sm   dark:border-white/10 bg-white   dark:bg-[#0c1023]/90 shadow-sm dark:shadow-xl">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-gray-900 dark:text-white">Informations générales</CardTitle>
        <CardDescription className="text-gray-500 dark:text-gray-400">
          Résumé complet de la configuration de la campagne.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Nom</p>
            <p className="text-gray-900 dark:text-gray-900 dark:text-white">{campaign.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Statut</p>
            <p className="text-gray-900 dark:text-gray-900 dark:text-white">{campaign.status}</p>
          </div>
        </div>
        
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Planifiée le</p>
            <p className="text-gray-900 dark:text-gray-900 dark:text-white">
              {campaign.scheduledAt
                ? new Date(campaign.scheduledAt).toLocaleString('fr-FR')
                : 'Non planifiée'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Fin prévue</p>
            <p className="text-gray-900 dark:text-gray-900 dark:text-white">
              {campaign.endAt
                ? new Date(campaign.endAt).toLocaleString('fr-FR')
                : 'Aucun'}
            </p>
          </div>
        </div>
        
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
          <p className="text-gray-900 dark:text-gray-900 dark:text-white">{campaign.description ?? 'Aucune description fournie.'}</p>
        </div>
        
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Email template</p>
            <p className="text-gray-900 dark:text-gray-900 dark:text-white">{campaign.emailTemplate?.name ?? 'Aucun'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Landing page</p>
            <p className="text-gray-900 dark:text-gray-900 dark:text-white">{campaign.landingPageTemplate?.name ?? 'Aucune'}</p>
          </div>
        </div>
        
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">SMTP</p>
            <p className="text-gray-900 dark:text-gray-900 dark:text-white">{campaign.smtpProfile?.fromName ?? campaign.smtpProfile?.fromAddress ?? 'Aucun'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Créée le</p>
            <p className="text-gray-900 dark:text-gray-900 dark:text-white">{new Date(campaign.createdAt).toLocaleString('fr-FR')}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}