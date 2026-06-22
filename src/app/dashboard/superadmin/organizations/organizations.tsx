// components/organizations/Organizations.tsx
'use client';

import { useEffect, useState } from 'react';
import { Plus, Building2, Filter, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Organization, useOrganizationStore } from '@/store/organization.store';
import { usePlanStore } from '@/store/plan.store';

import { Skeleton } from '@/components/ui/skeleton';
import { OrganizationFilters } from './organization-filters';
import { OrganizationTable } from './organization-table';
import { OrganizationCard } from './organization-card';
import { OrganizationDialog } from './organization-dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useTranslation } from 'react-i18next';

export const Organizations = () => {
  const { t: tCommon } = useTranslation('common');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  
  const { organizations, filteredOrganizations, isLoading, filters, fetchAll, deleteOrganization } = useOrganizationStore();
  const { plans, fetchAll: fetchPlans } = usePlanStore();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orgToDelete, setOrgToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchAll();
    fetchPlans();
  }, []);

  const handleEdit = (org: Organization) => {
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


      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <AlertDialogContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-gray-900 dark:text-white">Supprimer l'organisation ?</AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                    {tCommon('admin.organizations.delete_confirm_desc')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className='bg-white dark:bg-gray-900'>
                  <AlertDialogCancel className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-white">
                    {tCommon('user.formations.cancel')}
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteOrganization(orgToDelete as string)}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    {tCommon('admin.ambassadors.delete')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800/50 bg-white dark:bg-[#0a0f1e]/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto py-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        
            <Button
              onClick={() => setDialogOpen(true)}
              className="bg-gray-200 hover:bg-gray-300 dark:bg-slate-600 dark:hover:bg-slate-700 ml-2 text-gray-900 dark:text-white   cursor-pointer transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              {tCommon('admin.organizations.new_org')}
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto py-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="rounded-sm hover:bg-gray-100 dark:hover:bg-[#1a1f36] cursor-pointer transition-colors duration-200 border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0c1023] p-4">
            <div className="p-4">
              <p className="text-gray-500 dark:text-gray-400 text-sm">{tCommon('admin.organizations.total_orgs')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{organizations.length}</p>
            </div>
          </Card>
          <Card className="rounded-sm hover:bg-gray-100 dark:hover:bg-[#1a1f36] cursor-pointer transition-colors duration-200 border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0c1023] p-4">
            <div className="p-4">
              <p className="text-gray-500 dark:text-gray-400 text-sm">{tCommon('admin.organizations.active_orgs')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {organizations.filter(o => o.isActive).length}
              </p>
            </div>
          </Card>
          <Card className="rounded-sm hover:bg-gray-100 dark:hover:bg-[#1a1f36] cursor-pointer transition-colors duration-200 border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0c1023] p-4">
            <div className="p-4">
              <p className="text-gray-500 dark:text-gray-400 text-sm">{tCommon('admin.organizations.enterprises')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {organizations.filter(o => o.type === 'enterprise').length}
              </p>
            </div>
          </Card>
          <Card className="rounded-sm hover:bg-gray-100 dark:hover:bg-[#1a1f36] cursor-pointer transition-colors duration-200 border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0c1023] p-4">
            <div className="p-4">
              <p className="text-gray-500 dark:text-gray-400 text-sm">{tCommon('admin.organizations.campus')}</p>
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
                {tCommon('admin.ambassadors.reset_filters')}
              </Button>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {tCommon('admin.organizations.orgs_found', { count: filteredOrganizations.length })}
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
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{tCommon('admin.users.org_placeholder')}</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {hasFilters ? tCommon('admin.organizations.no_match_filters') : tCommon('admin.organizations.create_first_org')}
              </p>
              {!hasFilters && (
                <Button
                  onClick={() => setDialogOpen(true)}
                  variant="outline"
                  className="mt-4"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {tCommon('admin.organizations.create_org')}
                </Button>
              )}
            </div>
          </Card>
        ) : viewMode === 'table' ? (
          <OrganizationTable
            organizations={filteredOrganizations}
            onEdit={handleEdit}
            onDelete={(id)=> {
              setOrgToDelete(id);
              setDeleteDialogOpen(true);
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOrganizations.map((org) => (
              <OrganizationCard
                key={org.id}
                organization={org}
                onEdit={handleEdit}
                onDelete={
                  () => {
                    setOrgToDelete(org.id);
                    setDeleteDialogOpen(true);
                  }
                }
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