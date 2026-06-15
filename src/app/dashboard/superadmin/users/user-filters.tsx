'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { useUserStore } from '@/store/user.store';
import { Organization } from '@/store/organization.store';
import { Group } from '@/store/group.store';
import { useAuthStore } from '@/store/auth.store';
import { roleEnum } from '@/constants/roleEnum';
import { useEffect } from 'react';

interface UserFiltersProps {
  organizations: Organization[];
  groups: Group[];
}

export const UserFilters = ({ organizations, groups }: UserFiltersProps) => {
  const { filters, setFilters } = useUserStore();
  const { user: currentUser } = useAuthStore();
  const isNotSuperAdmin = currentUser?.role !== roleEnum.SUPERADMIN;

  // Forcer l'organisation de l'utilisateur si non superadmin
  useEffect(() => {
    if (isNotSuperAdmin && currentUser?.organizationId && filters.organizationId !== currentUser.organizationId) {
      setFilters({ organizationId: currentUser.organizationId, groupId: '' });
    }
  }, [isNotSuperAdmin, currentUser, filters.organizationId, setFilters]);

  // Les groupes disponibles : si une organisation est sélectionnée (via filtre ou forcée)
  const effectiveOrgId = filters.organizationId;
  const availableGroups = effectiveOrgId
    ? groups.filter(group => group.organizationId === effectiveOrgId)
    : groups;

  const selectedOrganization = organizations.find(org => org.id === effectiveOrgId);
  const selectedGroup = availableGroups.find(group => group.id === filters.groupId);

  // Options des rôles (sans superadmin si non superadmin)
  const roleOptions = isNotSuperAdmin
    ? [
        { value: '', label: 'Tous les rôles' },
        { value: 'user', label: 'Utilisateur' },
        { value: 'admin', label: 'Admin' },
      ]
    : [
        { value: '', label: 'Tous les rôles' },
        { value: 'user', label: 'Utilisateur' },
        { value: 'admin', label: 'Admin' },
        { value: 'superadmin', label: 'Superadmin' },
      ];

  return (
    <Card className="bg-white dark:bg-gray-800/30 border-gray-200 dark:border-gray-700/50 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Recherche */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Rechercher nom, email, téléphone..."
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            className="pl-9 bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white outline-none"
          />
          {filters.search && (
            <button
              onClick={() => setFilters({ search: '' })}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              type="button"
            >
              <X className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-white" />
            </button>
          )}
        </div>

        {/* Filtre rôle */}
        <Select value={filters.role || ''} onValueChange={(value) => setFilters({ role: value || undefined })}>
          <SelectTrigger className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white">
            <SelectValue placeholder="Tous les rôles" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            {roleOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filtre organisation : masqué si non superadmin */}
        {!isNotSuperAdmin && (
          <Select
            value={filters.organizationId || ''}
            onValueChange={(value) => setFilters({ organizationId: value, groupId: '' })}
          >
            <SelectTrigger className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white">
              {selectedOrganization ? (
                <span className="truncate">{selectedOrganization.name}</span>
              ) : (
                <span className="text-gray-500 dark:text-gray-400">Toutes les organisations</span>
              )}
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <SelectItem value="">Toutes les organisations</SelectItem>
              {organizations.map((organization) => (
                <SelectItem key={organization.id} value={organization.id}>
                  {organization.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Filtre groupe */}
        <Select value={filters.groupId || ''} onValueChange={(value) => setFilters({ groupId: value || undefined })}>
          <SelectTrigger className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white">
            {selectedGroup ? (
              <span className="truncate">{selectedGroup.name}</span>
            ) : (
              <span className="text-gray-500 dark:text-gray-400">Tous les groupes</span>
            )}
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <SelectItem value="">Tous les groupes</SelectItem>
            {availableGroups.map((group) => (
              <SelectItem key={group.id} value={group.id}>
                {group.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filtre statut */}
        <Select value={filters.status || ''} onValueChange={(value) => setFilters({ status: value || undefined })}>
          <SelectTrigger className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white">
            <SelectValue placeholder="Tous les statuts" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <SelectItem value="">Tous les statuts</SelectItem>
            <SelectItem value="active">Actif</SelectItem>
            <SelectItem value="inactive">Inactif</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
};