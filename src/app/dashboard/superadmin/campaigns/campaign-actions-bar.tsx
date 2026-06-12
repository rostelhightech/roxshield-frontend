'use client';

import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';

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
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="grid gap-2">
        <p className="text-sm text-gray-400">ID : {campaign.id}</p>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{campaign.status}</Badge>
          <Badge variant="outline" className="border-white/10 bg-white/5 text-white">
            {campaign.organization?.name ?? 'Organisation inconnue'}
          </Badge>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" className="text-gray-500" variant="outline" onClick={onEdit}>
          Modifier
        </Button>
        <Button size="sm" className="text-gray-500" variant="outline" onClick={onRemix}>
          Remixer
        </Button>
        <Button size="sm" className="text-gray-500" variant="outline" onClick={onDuplicate}>
          Dupliquer
        </Button>
        
        {campaign.status === 'ARCHIVED' ? (
          <Button size="sm" variant="secondary" onClick={onRestore}>
            Désarchiver
          </Button>
        ) : (
          <Button size="sm" className="text-gray-500" variant="outline" onClick={onArchive}>
            Archiver
          </Button>
        )}
        
        <Button size="sm" variant="ghost" className="border border-white/10 bg-white/5 text-white" onClick={onRelaunch}>
          Relancer
        </Button>
        
        <Link
          className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition hover:bg-white/10"
          to="/dashboard/campaigns"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Link>
      </div>
    </div>
  );
}