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
import { useTranslation } from 'react-i18next';

interface GroupCardProps {
  group: Group;
  onEdit: (group: Group) => void;
  onDelete: (id: string, name: string) => void;
}

export const GroupCard = ({ group, onEdit, onDelete }: GroupCardProps) => {
  const { t: tCommon } = useTranslation('common');
  return (
    <Card
      className="bg-gradient-to-br from-white to-gray-100 dark:from-gray-900/50 dark:to-gray-800/30 border-gray-200 dark:border-gray-700/50 hover:border-blue-500/30 transition-all duration-300 overflow-hidden cursor-pointer"
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-500/10">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-white truncate">{group.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{group.organization?.name || tCommon('admin.groups.unknown_org')}</p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-700 dark:text-gray-300">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <DropdownMenuItem
                onClick={(event) => {
                  event.stopPropagation();
                  onEdit(group);
                }}
                className="text-gray-700 dark:text-gray-300"
              >
                <Edit className="w-4 h-4 mr-2" />
                {tCommon('admin.ambassadors.edit')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(event) => {
                  event.stopPropagation();
                  onDelete(group.id, group.name);
                }}
                className="text-red-600 dark:text-red-400"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {tCommon('admin.ambassadors.delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Badge className="bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-500/30">
            <Building2 className="w-3 h-3 mr-1" />
            {group.organization?.type === 'campus' ? tCommon('admin.organizations.org_type_campus') : tCommon('admin.organizations.org_type_enterprise')}
          </Badge>
          <Badge className="bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-500/30">
            {tCommon('admin.groups.group_members_count', { count: group.users?.length ?? 0 })}
          </Badge>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 min-h-10">
          {group.description || tCommon('admin.groups.no_description')}
        </p>
      </div>
    </Card>
  );
};