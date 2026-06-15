// components/organizations/OrganizationFilters.tsx
'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { useOrganizationStore } from '@/store/organization.store';
import { Plan } from '@/store/plan.store';

interface OrganizationFiltersProps {
  plans: Plan[];
}

export const OrganizationFilters = ({ plans }: OrganizationFiltersProps) => {
  const { filters, setFilters } = useOrganizationStore();

  return (
<Card className="bg-white dark:bg-gray-800/30 border-gray-200 dark:border-gray-700/50 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Recherche */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-400" />
          <Input
            placeholder="Rechercher par nom, ville, email..."
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
        <Select
          value={filters.type}
          onValueChange={(value) => setFilters({ type: value })}
        >
          <SelectTrigger className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white">
            <SelectValue className="text-gray-500 dark:text-gray-400" placeholder="Tous les types" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <SelectItem value="">Tous les types</SelectItem>
            <SelectItem value="enterprise">Entreprise</SelectItem>
            <SelectItem value="campus">Campus</SelectItem>
          </SelectContent>
        </Select>

        {/* Plan */}
        <Select
          value={filters.planId}
          onValueChange={(value) => setFilters({ planId: value })}
        >
          <SelectTrigger className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white">
            <SelectValue className="text-gray-500 dark:text-gray-400" placeholder="Tous les plans" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <SelectItem value="">Tous les plans</SelectItem>
            {plans.map((plan) => (
              <SelectItem key={plan.id} value={plan.id}>
                {plan.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Statut */}
        <Select
          value={filters.status}
          onValueChange={(value) => setFilters({ status: value })}
        >
          <SelectTrigger className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white">
            <SelectValue className="text-gray-500 dark:text-gray-400" placeholder="Tous les statuts" />
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