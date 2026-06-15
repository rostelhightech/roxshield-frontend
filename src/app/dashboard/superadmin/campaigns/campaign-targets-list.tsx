'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface CampaignTargetsListProps {
  campaign: any;
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'SENT': return 'default';
    case 'FAILED': return 'destructive';
    case 'PENDING': return 'secondary';
    default: return 'secondary';
  }
};

export function CampaignTargetsList({ campaign }: CampaignTargetsListProps) {
  return (
    <Card className="rounded-md border border-white/10 bg-white  dark:bg-[#0c1023]/90   mt-6">
      <CardHeader>
        <CardTitle>Liste des destinataires</CardTitle>
        <CardDescription>Visualisez chaque cible associée à la campagne.</CardDescription>
      </CardHeader>
      <CardContent>
        {campaign.targets.length === 0 ? (
          <p className="text-sm text-gray-400">Aucune cible ajoutée pour cette campagne.</p>
        ) : (
          <Table className="min-w-full text-gray-900 dark:text-white border-separate border-spacing-0">
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-900 dark:text-white">Email</TableHead>
                <TableHead className="text-gray-900 dark:text-white">Nom</TableHead>
                <TableHead className="text-gray-900 dark:text-white">Groupes / Utilisateur</TableHead>
                <TableHead className="text-gray-900 dark:text-white">Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaign.targets?.flatMap((target: any) => {
                if (target.groupId && target.members?.length) {
                  return target.members.map((member: any) => (
                    <TableRow key={`${target.id}-${member.id}`}>
                      <TableCell className="text-gray-900 dark:text-white">{member.email}</TableCell>
                      <TableCell className="text-gray-900 dark:text-white">{`${member.firstName} ${member.lastName}`.trim()}</TableCell>
                      <TableCell className="text-gray-900 dark:text-white">
                        <span className="text-gray-400 text-xs">Groupe :</span> {target.group?.name ?? '—'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(target.status)}>{target.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ));
                }

                return [
                  <TableRow key={target.id}>
                    <TableCell className="text-gray-900 dark:text-white">{target.email}</TableCell>
                    <TableCell className="text-gray-900 dark:text-white">
                      {`${target.firstName ?? ''} ${target.lastName ?? ''}`.trim() || '—'}
                    </TableCell>
                    <TableCell className="text-gray-900 dark:text-white">
                      {target.user
                        ? `${target.user.firstName} ${target.user.lastName}`
                        : target.group?.name ?? '—'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(target.status)}>{target.status}</Badge>
                    </TableCell>
                  </TableRow>,
                ];
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}