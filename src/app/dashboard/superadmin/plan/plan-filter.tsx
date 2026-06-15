// components/plans/PlanFilters.tsx
'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { usePlanStore } from '@/store/plan.store';

export const PlanFilters = () => {
  const { filters, setFilters } = usePlanStore();

  return (
    <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 p-4 rounded-sm">
      <div className="grid grid-cols-1 gap-4">
        {/* Recherche */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Rechercher par nom, description..."
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            className="pl-9 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
          />
          {filters.search && (
            <button
              onClick={() => setFilters({ search: '' })}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <X className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-white" />
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};