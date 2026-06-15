'use client';

import { useEffect, useState } from 'react';
import { Filter, LayoutGrid, List, Plus, Users as UsersIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Group, useGroupStore } from '@/store/group.store';
import { useOrganizationStore } from '@/store/organization.store';
import { GroupFilters } from './group-filters';
import { GroupTable } from './group-table';
import { GroupCard } from './group-card';
import { GroupDialog } from './group-dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export const Groups = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<{ id: string; name: string } | null>(null);

  const {
    groups,
    filteredGroups,
    isLoading,
    filters,
    fetchAll,
    deleteGroup,
    resetFilters,
  } = useGroupStore();
  const { organizations } = useOrganizationStore();

  useEffect(() => {
    fetchAll();
   }, []);

  const handleEdit = (group: Group) => {
    setEditingGroup(group);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingGroup(null);
  };

  const handleDeleteGroup = (id: string, name: string) => {
    setGroupToDelete({ id, name });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!groupToDelete) return;

    await deleteGroup(groupToDelete.id);
    setDeleteDialogOpen(false);
    setGroupToDelete(null);
  };

  const hasFilters = filters.search || filters.organizationId;
  const groupsWithUsers = groups.filter(group => (group.users?.length ?? 0) > 0).length;
  const totalMembers = groups.reduce((total, group) => total + (group.users?.length ?? 0), 0);

  return (
  <div className="min-h-screen bg-gray-50 dark:bg-[#050816]">
      <div className="border-b border-gray-200 dark:border-gray-800/50 bg-white dark:bg-[#0a0f1e]/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto py-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Button
              onClick={() => setDialogOpen(true)}
              className="bg-gray-200 hover:bg-gray-300 dark:bg-slate-600 dark:hover:bg-slate-700 ml-2 text-gray-900 dark:text-white  cursor-pointer transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouveau groupe
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="rounded-sm hover:bg-gray-100 dark:hover:bg-[#1a1f36] cursor-pointer transition-colors duration-200 border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0c1023] p-4">
            <div className="p-4">
              <p className="text-gray-500 dark:text-gray-400 text-sm">Total groupes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{groups.length}</p>
            </div>
          </Card>
          <Card className="rounded-sm hover:bg-gray-100 dark:hover:bg-[#1a1f36] cursor-pointer transition-colors duration-200 border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0c1023] p-4">
            <div className="p-4">
              <p className="text-gray-500 dark:text-gray-400 text-sm">Groupes actifs</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{groupsWithUsers}</p>
            </div>
          </Card>
          <Card className="rounded-sm hover:bg-gray-100 dark:hover:bg-[#1a1f36] cursor-pointer transition-colors duration-200 border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0c1023] p-4">
            <div className="p-4">
              <p className="text-gray-500 dark:text-gray-400 text-sm">Membres liés</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalMembers}</p>
            </div>
          </Card>
          <Card className="rounded-sm hover:bg-gray-100 dark:hover:bg-[#1a1f36] cursor-pointer transition-colors duration-200 border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0c1023] p-4">
            <div className="p-4">
              <p className="text-gray-500 dark:text-gray-400 text-sm">Organisations</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {new Set(groups.map(group => group.organizationId)).size}
              </p>
            </div>
          </Card>
        </div>

        <div className="mb-6">
          <GroupFilters organizations={organizations} />
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <Filter className="w-4 h-4 mr-2" />
                Réinitialiser les filtres
              </Button>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {filteredGroups.length} groupe(s) trouvé(s)
            </p>
          </div>
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800/30 rounded-lg p-1">
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
              className={viewMode === 'table' ? 'bg-gray-300 dark:bg-gray-700' : 'text-gray-700 dark:text-gray-300'}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'cards' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('cards')}
              className={viewMode === 'cards' ? 'bg-gray-300 dark:bg-gray-700' : 'text-gray-700 dark:text-gray-300'}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 bg-gray-200 dark:bg-gray-800/50" />
            ))}
          </div>
        ) : filteredGroups.length === 0 ? (
          <Card className="bg-white dark:bg-gray-800/30 border-gray-200 dark:border-gray-700/50">
            <div className="p-12 text-center">
              <UsersIcon className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Aucun groupe</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {hasFilters ? "Aucun groupe ne correspond aux filtres" : "Commencez par créer votre premier groupe"}
              </p>
              {!hasFilters && (
                <Button
                  onClick={() => setDialogOpen(true)}
                  variant="outline"
                  className="mt-4"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Créer un groupe
                </Button>
              )}
            </div>
          </Card>
        ) : viewMode === 'table' ? (
          <GroupTable
            groups={filteredGroups}
            onEdit={handleEdit}
            onDelete={handleDeleteGroup}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGroups.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                onEdit={handleEdit}
                onDelete={handleDeleteGroup}
              />
            ))}
          </div>
        )}
      </div>

      <GroupDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        editingGroup={editingGroup}
        organizations={organizations}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-white">Supprimer le groupe?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
              Êtes-vous sûr de vouloir supprimer le groupe <span className="font-semibold text-gray-900 dark:text-white">"{groupToDelete?.name}"</span> ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className='bg-white dark:bg-gray-900'>
            <AlertDialogCancel className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-white">
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
