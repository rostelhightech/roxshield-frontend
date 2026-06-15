// components/plans/Plans.tsx
'use client';

import { useEffect, useState } from 'react';
import { Plus, CreditCard, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { usePlanStore } from '@/store/plan.store';

import { Skeleton } from '@/components/ui/skeleton';
import { PlanFilters } from './plan-filter';
import { PlanCard } from './plan-card';
import { PlanDialog } from './plan-dialog';

export const Plans = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  
  const { filteredPlans, isLoading, filters, fetchAll, resetFilters } = usePlanStore();

  useEffect(() => {
    fetchAll();
  }, []);

  const handleEdit = (plan: any) => {
    setEditingPlan(plan);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingPlan(null);
  };

  const hasFilters = filters.search;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050816]">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0f1e] sticky top-0 z-10">
        <div className="mx-auto py-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Button
              onClick={() => setDialogOpen(true)}
              className="bg-gray-200 hover:bg-gray-300 dark:bg-slate-600 dark:hover:bg-slate-700 text-gray-900 dark:text-white ml-2 cursor-pointer transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouveau plan
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto py-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 rounded-sm">
            <div className="p-4">
              <p className="text-gray-500 dark:text-gray-400 text-sm">Total plans</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{filteredPlans.length}</p>
            </div>
          </Card>
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 rounded-sm">
            <div className="p-4">
              <p className="text-gray-500 dark:text-gray-400 text-sm">Plans populaires</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {filteredPlans.filter(p => p.isPopular).length}
              </p>
            </div>
          </Card>
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 rounded-sm">
            <div className="p-4">
              <p className="text-gray-500 dark:text-gray-400 text-sm">Prix moyen</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round(filteredPlans.reduce((acc, p) => acc + p.pricePerUser, 0) / (filteredPlans.length || 1))} F
              </p>
            </div>
          </Card>
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 rounded-sm">
            <div className="p-4">
              <p className="text-gray-500 dark:text-gray-400 text-sm">Entreprise max</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {filteredPlans.reduce(
                  (max, plan) => Math.max(max, plan.maxEmployees || 0),
                  0
                )}
              </p>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <PlanFilters />
        </div>

        {/* Header with filter info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <Filter className="w-4 h-4 mr-2" />
                Réinitialiser les filtres
              </Button>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {filteredPlans.length} plan(s) trouvé(s)
            </p>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-96 bg-gray-200 dark:bg-gray-800" />
            ))}
          </div>
        ) : filteredPlans.length === 0 ? (
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 rounded-sm">
            <div className="p-12 text-center">
              <CreditCard className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Aucun plan</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {hasFilters ? "Aucun plan ne correspond aux filtres" : "Commencez par créer votre premier plan"}
              </p>
              {!hasFilters && (
                <Button
                  onClick={() => setDialogOpen(true)}
                  variant="outline"
                  className="mt-4"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Créer un plan
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onEdit={handleEdit}
                onDelete={usePlanStore.getState().deletePlan}
              />
            ))}
          </div>
        )}
      </div>

      <PlanDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        editingPlan={editingPlan}
      />
    </div>
  );
};