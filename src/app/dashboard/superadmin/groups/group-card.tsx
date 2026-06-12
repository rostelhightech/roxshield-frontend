'use client';

import { Building2, Edit, MoreVertical, Trash2, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Group } from '@/store/group.store';

interface GroupCardProps {
  group: Group;
  onEdit: (group: Group) => void;
  onDelete: (id: string) => void;
  onSelect: (group: Group) => void;
}

export const GroupCard = ({ group, onEdit, onDelete, onSelect }: GroupCardProps) => {
  return (
    <Card
      onClick={() => onSelect(group)}
      className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-700/50 hover:border-blue-500/30 transition-all duration-300 overflow-hidden cursor-pointer"
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-white truncate">{group.name}</h3>
              <p className="text-xs text-gray-400 truncate">{group.organization?.name || 'Organisation inconnue'}</p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
              <DropdownMenuItem
                onClick={(event) => {
                  event.stopPropagation();
                  onEdit(group);
                }}
              >
                <Edit className="w-4 h-4 mr-2" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(event) => {
                  event.stopPropagation();
                  onDelete(group.id);
                }}
                className="text-red-400"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
            <Building2 className="w-3 h-3 mr-1" />
            {group.organization?.type === 'campus' ? 'Campus' : 'Entreprise'}
          </Badge>
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            {group.users?.length ?? 0} membre(s)
          </Badge>
        </div>

        <p className="text-sm text-gray-400 min-h-10">
          {group.description || 'Aucune description renseignée'}
        </p>
      </div>
    </Card>
  );
};
