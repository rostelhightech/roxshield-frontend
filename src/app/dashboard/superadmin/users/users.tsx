'use client';

import { useEffect, useState } from 'react';
import { Filter, LayoutGrid, List, Plus, UserCheck, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserStore, User } from '@/store/user.store';
import { useOrganizationStore } from '@/store/organization.store';
import { useGroupStore } from '@/store/group.store';
import { UserFilters } from './user-filters';
import { UserTable } from './user-table';
import { UserCard } from './user-card';
import { UserDialog } from './user-dialog';
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

export const Users = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ id: string; name: string } | null>(null);

  const {
    users,
    filteredUsers,
    isLoading,
    filters,
    fetchAll,
    deleteUser,
    toggleActive,
    resetFilters,
  } = useUserStore();
  const { organizations } = useOrganizationStore();
  const { groups, fetchAll: fetchGroups } = useGroupStore();

  useEffect(() => {
    fetchAll();
    fetchGroups();
  }, []);

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingUser(null);
  };

  const handleDeleteUser = (id: string, firstName: string, lastName: string) => {
    setUserToDelete({ id, name: `${firstName} ${lastName}` });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    await deleteUser(userToDelete.id);
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const hasFilters = filters.search || filters.role || filters.organizationId || filters.groupId || filters.status;
  const activeUsers = users.filter(user => user.isActive).length;
  const adminUsers = users.filter(user => user.role === 'admin' || user.role === 'superadmin').length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050816]">
      <div className="border-b border-gray-200 dark:border-gray-800/50 bg-white dark:bg-[#0a0f1e]/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto py-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Button
              onClick={() => setDialogOpen(true)}
              className="bg-gray-200 hover:bg-gray-300 dark:bg-slate-600 dark:hover:bg-slate-700 ml-2 text-gray-900 dark:text-white   cursor-pointer transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvel utilisateur
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="rounded-sm hover:bg-gray-100 dark:hover:bg-[#1a1f36] cursor-pointer transition-colors duration-200 border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0c1023] p-4">
            <div className="p-4">
              <p className="text-gray-500 dark:text-gray-400 text-sm">Total utilisateurs</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{users.length}</p>
            </div>
          </Card>
          <Card className="rounded-sm hover:bg-gray-100 dark:hover:bg-[#1a1f36] cursor-pointer transition-colors duration-200 border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0c1023] p-4">
            <div className="p-4">
              <p className="text-gray-500 dark:text-gray-400 text-sm">Actifs</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeUsers}</p>
            </div>
          </Card>
          <Card className="rounded-sm hover:bg-gray-100 dark:hover:bg-[#1a1f36] cursor-pointer transition-colors duration-200 border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0c1023] p-4">
            <div className="p-4">
              <p className="text-gray-500 dark:text-gray-400 text-sm">Administrateurs</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{adminUsers}</p>
            </div>
          </Card>
          <Card className="rounded-sm hover:bg-gray-100 dark:hover:bg-[#1a1f36] cursor-pointer transition-colors duration-200 border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0c1023] p-4">
            <div className="p-4">
              <p className="text-gray-500 dark:text-gray-400 text-sm">Inactifs</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{users.length - activeUsers}</p>
            </div>
          </Card>
        </div>

        <div className="mb-6">
          <UserFilters organizations={organizations} groups={groups} />
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
              {filteredUsers.length} utilisateur(s) trouvé(s)
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
        ) : filteredUsers.length === 0 ? (
          <Card className="bg-white dark:bg-gray-800/30 border-gray-200 dark:border-gray-700/50">
            <div className="p-12 text-center">
              {hasFilters ? (
                <UserX className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              ) : (
                <UserCheck className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              )}
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Aucun utilisateur</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {hasFilters ? "Aucun utilisateur ne correspond aux filtres" : "Commencez par créer votre premier utilisateur"}
              </p>
              {!hasFilters && (
                <Button
                  onClick={() => setDialogOpen(true)}
                  variant="outline"
                  className="mt-4"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Créer un utilisateur
                </Button>
              )}
            </div>
          </Card>
        ) : viewMode === 'table' ? (
          <UserTable
            users={filteredUsers}
            onEdit={handleEdit}
            onDelete={handleDeleteUser}
            onToggleActive={toggleActive}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onEdit={handleEdit}
                onDelete={handleDeleteUser}
                onToggleActive={toggleActive}
              />
            ))}
          </div>
        )}
      </div>

      <UserDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        editingUser={editingUser}
        organizations={organizations}
        groups={groups}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-white">Supprimer l'utilisateur?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
              Êtes-vous sûr de vouloir supprimer l'utilisateur <span className="font-semibold text-gray-900 dark:text-white">"{userToDelete?.name}"</span> ? Cette action est irréversible.
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
