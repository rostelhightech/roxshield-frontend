'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { useUserStore } from '@/store/user.store';
import { Organization } from '@/store/organization.store';
import { Group } from '@/store/group.store';

interface UserFiltersProps {
  organizations: Organization[];
  groups: Group[];
}

export const UserFilters = ({ organizations, groups }: UserFiltersProps) => {
  const { filters, setFilters } = useUserStore();
  const availableGroups = filters.organizationId
    ? groups.filter(group => group.organizationId === filters.organizationId)
    : groups;
  const selectedOrganization = organizations.find(organization => organization.id === filters.organizationId);
  const selectedGroup = availableGroups.find(group => group.id === filters.groupId);

  return (
    <Card className="bg-gray-800/30 border-gray-700/50 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Rechercher nom, email, téléphone..."
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            className="pl-9 bg-gray-800/50 border-gray-700 text-white outline-none"
          />
          {filters.search && (
            <button
              onClick={() => setFilters({ search: '' })}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              type="button"
            >
              <X className="w-4 h-4 text-gray-400 hover:text-white" />
            </button>
          )}
        </div>

        <Select value={filters.role} onValueChange={(value) => setFilters({ role: value })}>
          <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
            <SelectValue placeholder="Tous les rôles" />
          </SelectTrigger>
          <SelectContent className="bg-slate-200 border-gray-700">
            <SelectItem value="">Tous les rôles</SelectItem>
            <SelectItem value="user">Utilisateur</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="superadmin">Superadmin</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.organizationId}
          onValueChange={(value) => setFilters({ organizationId: value, groupId: '' })}
        >
          <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
            {selectedOrganization ? (
              <span className="truncate">{selectedOrganization.name}</span>
            ) : (
              <span className="text-gray-400">Toutes les organisations</span>
            )}
          </SelectTrigger>
          <SelectContent className="bg-slate-200 border-gray-700">
            <SelectItem value="">Toutes les organisations</SelectItem>
            {organizations.map((organization) => (
              <SelectItem key={organization.id} value={organization.id}>
                {organization.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.groupId} onValueChange={(value) => setFilters({ groupId: value })}>
          <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
            {selectedGroup ? (
              <span className="truncate">{selectedGroup.name}</span>
            ) : (
              <span className="text-gray-400">Tous les groupes</span>
            )}
          </SelectTrigger>
          <SelectContent className="bg-slate-200 border-gray-700">
            <SelectItem value="">Tous les groupes</SelectItem>
            {availableGroups.map((group) => (
              <SelectItem key={group.id} value={group.id}>
                {group.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.status} onValueChange={(value) => setFilters({ status: value })}>
          <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
            <SelectValue placeholder="Tous les statuts" />
          </SelectTrigger>
          <SelectContent className="bg-slate-200 border-gray-700">
            <SelectItem value="">Tous les statuts</SelectItem>
            <SelectItem value="active">Actif</SelectItem>
            <SelectItem value="inactive">Inactif</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
};
