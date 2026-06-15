'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAmbassadorStore } from '@/store/ambassador.store';

export const AmbassadorFilters = () => {
  const { filters, setFilters, resetFilters } = useAmbassadorStore();

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Recherche */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Rechercher par nom, email ou téléphone..."
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value })}
          className="pl-10 bg-white dark:bg-gray-800/30 border-gray-300 dark:border-gray-700/50 text-gray-900 dark:text-white"
        />
        {filters.search && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilters({ search: '' })}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </Button>
        )}
      </div>

      {/* Statut */}
      <Select
        value={filters.isActive === undefined ? 'all' : filters.isActive ? 'active' : 'inactive'}
        onValueChange={(value) =>
          setFilters({
            isActive: value === 'all' ? undefined : value === 'active',
          })
        }
      >
        <SelectTrigger className="w-full sm:w-[200px] bg-white dark:bg-gray-800/30 border-gray-300 dark:border-gray-700/50 text-gray-900 dark:text-white">
          <SelectValue placeholder="Statut" />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <SelectItem value="all">Tous les statuts</SelectItem>
          <SelectItem value="active">Actifs</SelectItem>
          <SelectItem value="inactive">Inactifs</SelectItem>
        </SelectContent>
      </Select>

      {/* Bouton de réinitialisation */}
      {(filters.search || filters.isActive !== undefined) && (
        <Button
          variant="outline"
          onClick={resetFilters}
          className="w-full sm:w-auto border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <X className="h-4 w-4 mr-2" />
          Réinitialiser
        </Button>
      )}
    </div>
  );
};