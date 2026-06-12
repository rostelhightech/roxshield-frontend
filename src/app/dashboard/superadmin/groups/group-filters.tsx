'use client';

import { Search, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Organization } from '@/store/organization.store';
import { useGroupStore } from '@/store/group.store';

interface GroupFiltersProps {
  organizations: Organization[];
}

export const GroupFilters = ({ organizations }: GroupFiltersProps) => {
  const { filters, setFilters } = useGroupStore();
  const selectedOrganization = organizations.find(organization => organization.id === filters.organizationId);

  return (
    <Card className="bg-gray-800/30 border-gray-700/50 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Rechercher par nom, description, organisation..."
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

        <Select
          value={filters.organizationId}
          onValueChange={(value) => setFilters({ organizationId: value })}
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
      </div>
    </Card>
  );
};
