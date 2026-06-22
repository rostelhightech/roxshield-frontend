'use client';

import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CampaignActionsBarProps {
  campaign: any;
  onEdit: () => void;
  onRemix: () => void;
  onDuplicate: () => void;
  onArchive: () => void;
  onRestore: () => void;
  onRelaunch: () => void;
}

export function CampaignActionsBar({
  campaign,
  onEdit,
  onRemix,
  onDuplicate,
  onArchive,
  onRestore,
  onRelaunch,
}: CampaignActionsBarProps) {


const { t: tCommon } = useTranslation('common');


  return (
    <div className="flex flex-col gap-4 sm:gap-3">
      {/* Première ligne : Bouton retour à gauche + ID et badges à droite */}
      <div className="flex items-center justify-between">
        <Link
          className="inline-flex items-center gap-2 rounded-md border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-sm text-gray-700 dark:text-white transition hover:bg-gray-50 dark:hover:bg-white/10 hover:border-gray-400 dark:hover:border-white/20"
          to="/dashboard/campaigns"
        >
          <ArrowLeft className="h-4 w-4" />
          {tCommon('admin.campaigns.back')}
        </Link>

        <div className="flex items-center gap-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">ID : {campaign.id}</p>
          <Badge variant="secondary">{campaign.status}</Badge>
          <Badge variant="outline" className="border-gray-300 dark:border-white/10 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-white">
            {campaign.organization?.name ?? 'Organisation inconnue'}
          </Badge>
        </div>
      </div>

      {/* Deuxième ligne : Actions à droite */}
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button size="sm" className="text-gray-700 dark:text-gray-500" variant="outline" onClick={onEdit}>
          {tCommon('admin.ambassadors.edit')}
        </Button>
        <Button size="sm" className="text-gray-700 dark:text-gray-500" variant="outline" onClick={onRemix}>
          Remixer
        </Button>
        <Button size="sm" className="text-gray-700 dark:text-gray-500" variant="outline" onClick={onDuplicate}>
          Dupliquer
        </Button>
        
        {campaign.status === 'ARCHIVED' ? (
          <Button size="sm" variant="secondary" onClick={onRestore}>
            {tCommon('admin.campaigns.unarchive')}
          </Button>
        ) : (
          <Button size="sm" className="text-gray-700 dark:text-gray-500" variant="outline" onClick={onArchive}>
            Archiver
          </Button>
        )}
        
        <Button size="sm" variant="ghost" className="border border-gray-300 dark:border-white/10 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-white" onClick={onRelaunch}>
          Relancer
        </Button>
      </div>
    </div>
  );
}