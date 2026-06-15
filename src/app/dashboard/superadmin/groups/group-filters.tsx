'use client';

import { useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Organization } from '@/store/organization.store';
import { useGroupStore } from '@/store/group.store';
import { useAuthStore } from '@/store/auth.store';
import { roleEnum } from '@/constants/roleEnum';

interface GroupFiltersProps {
  organizations: Organization[];
}

export const GroupFilters = ({ organizations }: GroupFiltersProps) => {
  const { filters, setFilters } = useGroupStore();
  const { user: currentUser } = useAuthStore();
  const isNotSuperAdmin = currentUser?.role !== roleEnum.SUPERADMIN;

  // Forcer le filtre organisation si l'utilisateur n'est pas superadmin
  useEffect(() => {
    if (isNotSuperAdmin && currentUser?.organizationId) {
      if (filters.organizationId !== currentUser.organizationId) {
        setFilters({ organizationId: currentUser.organizationId });
      }
    }
  }, [isNotSuperAdmin, currentUser, filters.organizationId, setFilters]);

  const selectedOrganization = organizations.find(organization => organization.id === filters.organizationId);

  // Grille : 2 colonnes si superadmin, 1 colonne sinon (seulement la recherche)
  const gridCols = isNotSuperAdmin ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2';

  return (
    <Card className="bg-white dark:bg-gray-800/30 border-gray-200 dark:border-gray-700/50 p-4">
      <div className={`grid ${gridCols} gap-4`}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Rechercher par nom, description, organisation..."
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

        {/* Filtre organisation : visible uniquement pour superadmin */}
        {!isNotSuperAdmin && (
          <Select
            value={filters.organizationId || ''}
            onValueChange={(value) => setFilters({ organizationId: value })}
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
      </div>
    </Card>
  );
};