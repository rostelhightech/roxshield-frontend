// components/organizations/Organizations.tsx
'use client';

import { useEffect, useState } from 'react';
import { Plus, Building2, Filter, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useOrganizationStore } from '@/store/organization.store';
import { usePlanStore } from '@/store/plan.store';

import { Skeleton } from '@/components/ui/skeleton';
import { OrganizationFilters } from './organization-filters';
import { OrganizationTable } from './organization-table';
import { OrganizationCard } from './organization-card';
import { OrganizationDialog } from './organization-dialog';

export const Organizations = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  
  const { organizations, filteredOrganizations, isLoading, filters, fetchAll, setFilters } = useOrganizationStore();
  const { plans, fetchAll: fetchPlans } = usePlanStore();

  useEffect(() => {
    fetchAll();
    fetchPlans();
  }, []);

  const handleEdit = (org: any) => {
    setEditingOrg(org);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingOrg(null);
  };

  const hasFilters = filters.search || filters.type || filters.planId || filters.status;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050816] -mt-2">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800/50 bg-white dark:bg-[#0a0f1e]/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto py-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        
            <Button
              onClick={() => setDialogOpen(true)}
              className="bg-gray-200 hover:bg-gray-300 dark:bg-slate-600 dark:hover:bg-slate-700 ml-2 text-gray-900 dark:text-white   cursor-pointer transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle organisation
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto py-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="rounded-sm hover:bg-gray-100 dark:hover:bg-[#1a1f36] cursor-pointer transition-colors duration-200 border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0c1023] p-4">
            <div className="p-4">
              <p className="text-gray-500 dark:text-gray-400 text-sm">Total organisations</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{organizations.length}</p>
            </div>
          </Card>
          <Card className="rounded-sm hover:bg-gray-100 dark:hover:bg-[#1a1f36] cursor-pointer transition-colors duration-200 border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0c1023] p-4">
            <div className="p-4">
              <p className="text-gray-500 dark:text-gray-400 text-sm">Actives</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {organizations.filter(o => o.isActive).length}
              </p>
            </div>
          </Card>
          <Card className="rounded-sm hover:bg-gray-100 dark:hover:bg-[#1a1f36] cursor-pointer transition-colors duration-200 border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0c1023] p-4">
            <div className="p-4">
              <p className="text-gray-500 dark:text-gray-400 text-sm">Entreprises</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {organizations.filter(o => o.type === 'enterprise').length}
              </p>
            </div>
          </Card>
          <Card className="rounded-sm hover:bg-gray-100 dark:hover:bg-[#1a1f36] cursor-pointer transition-colors duration-200 border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0c1023] p-4">
            <div className="p-4">
              <p className="text-gray-500 dark:text-gray-400 text-sm">Campus</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {organizations.filter(o => o.type === 'campus').length}
              </p>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <OrganizationFilters plans={plans} />
        </div>

        {/* View Toggle */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => useOrganizationStore.getState().resetFilters()}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <Filter className="w-4 h-4 mr-2" />
                Réinitialiser les filtres
              </Button>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {filteredOrganizations.length} organisation(s) trouvée(s)
            </p>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 bg-gray-200 dark:bg-gray-800/50" />
            ))}
          </div>
        ) : filteredOrganizations.length === 0 ? (
          <Card className="bg-white dark:bg-gray-800/30 border-gray-200 dark:border-gray-700/50">
            <div className="p-12 text-center">
              <Building2 className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Aucune organisation</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {hasFilters ? "Aucune organisation ne correspond aux filtres" : "Commencez par créer votre première organisation"}
              </p>
              {!hasFilters && (
                <Button
                  onClick={() => setDialogOpen(true)}
                  variant="outline"
                  className="mt-4"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Créer une organisation
                </Button>
              )}
            </div>
          </Card>
        ) : viewMode === 'table' ? (
          <OrganizationTable
            organizations={filteredOrganizations}
            onEdit={handleEdit}
            onDelete={useOrganizationStore.getState().deleteOrganization}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOrganizations.map((org) => (
              <OrganizationCard
                key={org.id}
                organization={org}
                onEdit={handleEdit}
                onDelete={useOrganizationStore.getState().deleteOrganization}
              />
            ))}
          </div>
        )}
      </div>

      <OrganizationDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        editingOrg={editingOrg}
        plans={plans}
      />
    </div>
  );
};