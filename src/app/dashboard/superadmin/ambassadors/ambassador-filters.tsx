'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { useAmbassadorStore } from '@/store/ambassador.store';
import { Combobox } from '@/components/ui/combobox';
import { useTranslation } from 'react-i18next';

export const AmbassadorFilters = () => {
  const { filters, setFilters, resetFilters } = useAmbassadorStore();
const { t: tCommon } = useTranslation('common');
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Recherche */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder={tCommon('admin.ambassadors.search_placeholder')}
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
   <Combobox
  options={[
    { value: 'all', label: tCommon('admin.users.all_status') },
    { value: 'active', label: 'Actifs' },
    { value: 'inactive', label: 'Inactifs' },
  ]}
  value={filters.isActive === undefined ? 'all' : filters.isActive ? 'active' : 'inactive'}
  onChange={(value) =>
    setFilters({
      isActive: value === 'all' ? undefined : value === 'active',
    })
  }
  placeholder={tCommon('admin.ambassadors.status_placeholder')}
  searchPlaceholder="Rechercher un statut..."
  className="w-full sm:w-[200px] bg-white dark:bg-gray-800/30 border-gray-300 dark:border-gray-700/50 text-gray-900 dark:text-white"
/>

      {/* Bouton de réinitialisation */}
      {(filters.search || filters.isActive !== undefined) && (
        <Button
          variant="outline"
          onClick={resetFilters}
          className="w-full sm:w-auto border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <X className="h-4 w-4 mr-2" />
          {tCommon('admin.campaigns.form_reset')}
        </Button>
      )}
    </div>
  );
};