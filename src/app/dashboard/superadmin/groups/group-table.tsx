'use client';

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Building2, Edit, MoreHorizontal, Trash2, Users, UserPlus } from 'lucide-react';
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Group } from '@/store/group.store';
import { useUserStore } from '@/store/user.store';
import { GroupUsersPanel } from './group-users-panel';
import { useTranslation } from 'react-i18next';

interface GroupTableProps {
  groups: Group[];
  onEdit: (group: Group) => void;
  onDelete: (id: string, name: string) => void;
}

export const GroupTable = ({ groups, onEdit, onDelete }: GroupTableProps) => {
  const { t: tCommon } = useTranslation('common');
  const [selectedGroupForPanel, setSelectedGroupForPanel] = useState<Group | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { users } = useUserStore();

  const handleOpenUsersPanel = (group: Group, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedGroupForPanel(group);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedGroupForPanel(null);
  };

  return (
    <>
      <div className="rounded-sm border border-gray-200 dark:border-gray-800/50 bg-white dark:bg-gray-900/30 backdrop-blur-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-100 dark:bg-gray-800/50">
            <TableRow className="border-gray-200 dark:border-gray-800 hover:bg-transparent">
              <TableHead className="text-gray-700 dark:text-gray-300">{tCommon('admin.groups.table_group')}</TableHead>
              <TableHead className="text-gray-700 dark:text-gray-300">{tCommon('admin.grc.org_name')}</TableHead>
              <TableHead className="text-gray-700 dark:text-gray-300">{tCommon('admin.groups.table_members')}</TableHead>
              <TableHead className="text-gray-700 dark:text-gray-300">{tCommon('admin.campaigns.form_description')}</TableHead>
              <TableHead className="text-gray-700 dark:text-gray-300">{tCommon('admin.ambassadors.table_created')}</TableHead>
              <TableHead className="text-gray-700 dark:text-gray-300 text-right">{tCommon('admin.ambassadors.table_actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups.map((group) => (
              <TableRow
                key={group.id}
                className="border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 cursor-pointer"
              >
                <TableCell className="font-medium text-gray-900 dark:text-white">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-blue-100 dark:bg-blue-500/10">
                      <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span>{group.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-gray-900 dark:text-white">{group.organization?.name || '-'}</p>
                    {group.organization && (
                      <Badge className="mt-1 bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-500/30">
                        <Building2 className="w-3 h-3 mr-1" />
                        {group.organization.type === 'campus' ? 'Campus' : 'Entreprise'}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-gray-700 dark:text-gray-300">{group.users?.length ?? 0}</TableCell>
                <TableCell className="text-gray-700 dark:text-gray-300 max-w-xs truncate">
                  {group.description || '-'}
                </TableCell>
                <TableCell className="text-gray-700 dark:text-gray-300">
                  {format(new Date(group.createdAt), 'dd MMM yyyy', { locale: fr })}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-700 dark:text-gray-300">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 w-auto">
                      <DropdownMenuItem
                        onClick={(event) => {
                          event.stopPropagation();
                          onEdit(group);
                        }}
                        className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        {tCommon('admin.ambassadors.edit')}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(event) => handleOpenUsersPanel(group, event)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        {tCommon('admin.groups.assign_users')}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(event) => {
                          event.stopPropagation();
                          onDelete(group.id, group.name);
                        }}
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        {tCommon('admin.ambassadors.delete')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Dialog pour l'affectation des utilisateurs */}
     <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
  <DialogContent className="w-[calc(100vw-2rem)] sm:w-full sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
    <DialogHeader>
      <DialogTitle className="text-gray-900 dark:text-white flex items-center gap-2 text-base sm:text-lg">
        <UserPlus className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0" />
        {tCommon('admin.groups.assign_users')}
      </DialogTitle>
    </DialogHeader>
    {selectedGroupForPanel && (
      <GroupUsersPanel
        group={selectedGroupForPanel}
        users={users}
        onClose={handleCloseDialog}
      />
    )}
  </DialogContent>
</Dialog>
    </>
  );
};