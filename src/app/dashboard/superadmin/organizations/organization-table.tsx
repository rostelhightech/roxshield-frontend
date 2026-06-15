// components/organizations/OrganizationTable.tsx
'use client';

import { MoreHorizontal, Edit, Trash2, Eye, Check, X } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Organization } from '@/store/organization.store';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNavigate } from '@tanstack/react-router';

interface OrganizationTableProps {
  organizations: Organization[];
  onEdit: (org: Organization) => void;
  onDelete: (id: string) => void;
}

export const OrganizationTable = ({ organizations, onEdit, onDelete }: OrganizationTableProps) => {
  const navigate = useNavigate();

  const handleViewDetails = (organizationId: string) => {
    navigate({ 
      to: '/dashboard/organizations/$organizationId', 
      params: { organizationId } 
    });
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'enterprise':
        return <Badge className="bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-500/30">Entreprise</Badge>;
      case 'campus':
        return <Badge className="bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-500/30">Campus</Badge>;
      default:
        return <Badge variant="secondary">Inconnu</Badge>;
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score < 30) return 'text-green-600 dark:text-green-400';
    if (score < 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="rounded-sm border border-gray-200 dark:border-gray-800/50 bg-white dark:bg-gray-900/30 backdrop-blur-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-100 dark:bg-gray-800/50">
          <TableRow className="border-gray-200 dark:border-gray-800 hover:bg-transparent">
            <TableHead className="text-gray-700 dark:text-gray-300">Nom</TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300">Type</TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300">Plan</TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300">Localisation</TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300">Employés</TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300">Score risque</TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300">Statut</TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300">Créé le</TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {organizations.map((org) => (
            <TableRow 
              key={org.id} 
              className="border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 cursor-pointer"
              onClick={() => handleViewDetails(org.id)}
            >
              <TableCell className="font-medium text-gray-900 dark:text-white">
                <div>
                  <p>{org.name}</p>
                  {org.sector && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">{org.sector}</p>
                  )}
                </div>
              </TableCell>
              <TableCell>{getTypeBadge(org.type)}</TableCell>
              <TableCell>
                <div>
                  <p className="text-gray-900 dark:text-white">{org.plan?.label || 'N/A'}</p>
                  {org.plan && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {org.plan.pricePerUser.toLocaleString()} F/user
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-gray-700 dark:text-gray-300">
                {[org.city, org.country].filter(Boolean).join(', ') || '-'}
              </TableCell>
              <TableCell className="text-gray-700 dark:text-gray-300">{org.currentEmployees}</TableCell>
              <TableCell>
                <span className={`font-semibold ${getRiskScoreColor(org.riskScore)}`}>
                  {org.riskScore}%
                </span>
              </TableCell>
              <TableCell>
                {org.isActive ? (
                  <Badge className="bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border-green-300 dark:border-green-500/30">
                    <Check className="w-3 h-3 mr-1" /> Actif
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border-red-300 dark:border-red-500/30">
                    <X className="w-3 h-3 mr-1" /> Inactif
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-gray-700 dark:text-gray-300">
                {format(new Date(org.createdAt), 'dd MMM yyyy', { locale: fr })}
              </TableCell>
              <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 w-auto">
                    <DropdownMenuItem
                      onClick={() => handleViewDetails(org.id)}
                      className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Voir les détails
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(org);
                      }}
                      className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(org.id);
                      }}
                      className="text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-red-700 dark:hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};