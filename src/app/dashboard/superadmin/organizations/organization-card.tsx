// components/organizations/OrganizationCard.tsx
'use client';

import { Building2, MapPin, Users, TrendingUp, Edit, Trash2, MoreVertical, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Organization } from '@/store/organization.store';
import { useNavigate } from '@tanstack/react-router';

interface OrganizationCardProps {
  organization: Organization;
  onEdit: (org: Organization) => void;
  onDelete: (id: string) => void;
}

export const OrganizationCard = ({ organization, onEdit, onDelete }: OrganizationCardProps) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate({ 
      to: '/dashboard/organizations/$organizationId', 
      params: { organizationId: organization.id } 
    });
  };

  const getRiskScoreColor = (score: number) => {
    if (score < 30) return 'text-green-400';
    if (score < 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <Card 
      className="bg-linear-to-br from-gray-900/50 to-gray-800/30 border-gray-700/50 hover:border-blue-500/30 transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={handleViewDetails}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Building2 className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">{organization.name}</h3>
              {organization.sector && (
                <p className="text-xs text-gray-400">{organization.sector}</p>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
              <DropdownMenuItem onClick={handleViewDetails}>
                <Eye className="w-4 h-4 mr-2" />
                Voir les détails
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(organization);
                }}
              >
                <Edit className="w-4 h-4 mr-2" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(organization.id);
                }}
                className="text-red-400"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Plan & Statut */}
        <div className="flex items-center gap-2 mb-3">
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
            {organization.plan?.label || 'N/A'}
          </Badge>
          <Badge className={organization.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
            {organization.isActive ? 'Actif' : 'Inactif'}
          </Badge>
        </div>

        {/* Location */}
        {(organization.city || organization.country) && (
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
            <MapPin className="w-4 h-4" />
            <span>{[organization.city, organization.country].filter(Boolean).join(', ')}</span>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-gray-700/50">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-400">Employés</p>
              <p className="text-sm font-semibold text-white">{organization.currentEmployees}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className={`w-4 h-4 ${getRiskScoreColor(organization.riskScore)}`} />
            <div>
              <p className="text-xs text-gray-400">Score risque</p>
              <p className={`text-sm font-semibold ${getRiskScoreColor(organization.riskScore)}`}>
                {organization.riskScore}%
              </p>
            </div>
          </div>
        </div>

        {/* Additional stats */}
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div className="text-center p-2 rounded bg-gray-800/30">
            <p className="text-xs text-gray-400">Formations</p>
            <p className="text-sm font-semibold text-white">{organization.totalFormations}</p>
          </div>
          <div className="text-center p-2 rounded bg-gray-800/30">
            <p className="text-xs text-gray-400">Campagnes</p>
            <p className="text-sm font-semibold text-white">{organization.totalCampaigns}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};