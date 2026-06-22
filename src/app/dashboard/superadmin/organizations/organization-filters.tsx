// components/organizations/OrganizationFilters.tsx
'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useOrganizationStore } from '@/store/organization.store';
import { Plan } from '@/store/plan.store';
import { Combobox } from '@/components/ui/combobox';
import { useTranslation } from 'react-i18next';

interface OrganizationFiltersProps {
  plans: Plan[];
}

export const OrganizationFilters = ({ plans }: OrganizationFiltersProps) => {
  const { t: tCommon } = useTranslation('common');
  const { filters, setFilters } = useOrganizationStore();

  return (
<Card className="bg-white dark:bg-gray-800/30 border-gray-200 dark:border-gray-700/50 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Recherche */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-400" />
          <Input
            placeholder={tCommon('admin.organizations.search_placeholder')}
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            className="pl-9 bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white outline-none focus:border-none focus:ring-none"
          />
          {filters.search && (
            <button
              onClick={() => setFilters({ search: '' })}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <X className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-white" />
            </button>
          )}
        </div>

       {/* Type */}
<Combobox
  options={[
    { value: '', label: tCommon('admin.organizations.all_types') },
    { value: 'enterprise', label: 'Entreprise' },
    { value: 'campus', label: 'Campus' },
  ]}
  value={filters.type}
  onChange={(value) => setFilters({ type: value })}
  placeholder={tCommon('admin.organizations.all_types')}
  searchPlaceholder="Rechercher un type..."
  className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
/>

{/* Plan */}
<Combobox
  options={[
    { value: '', label: tCommon('admin.organizations.all_plans') },
    ...plans.map((plan) => ({
      value: plan.id,
      label: plan.label,
    })),
  ]}
  value={filters.planId}
  onChange={(value) => setFilters({ planId: value })}
  placeholder={tCommon('admin.organizations.all_plans')}
  searchPlaceholder="Rechercher un plan..."
  className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
/>

{/* Statut */}
<Combobox
  options={[
    { value: '', label: tCommon('admin.users.all_status')},
    { value: 'active', label: tCommon('common.active') },
    { value: 'inactive', label: tCommon('common.inactive') },
  ]}
  value={filters.status}
  onChange={(value) => setFilters({ status: value })}
  placeholder={tCommon('admin.users.all_status')}
  searchPlaceholder="Rechercher un statut..."
  className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
/>
      </div>
    </Card>
  );
};