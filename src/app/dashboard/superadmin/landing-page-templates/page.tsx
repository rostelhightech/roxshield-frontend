'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useOrganizationStore } from '@/store/organization.store';
import { useLandingPageTemplateStore } from '@/store/landing-page-template.store';
import { LandingPageTemplateForm } from './landing-page-template-form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Combobox } from '@/components/ui/combobox';
import { roleEnum } from '@/constants/roleEnum';
import { useAuthStore } from '@/store/auth.store';
import { useTranslation } from 'react-i18next';

export default function LandingPageTemplates() {
  const { t: tCommon } = useTranslation('common');
  const { organizations, fetchAll } = useOrganizationStore();
  const {
    landingPageTemplates,
    filteredLandingPageTemplates,
    currentLandingPageTemplate,
    fetchAll: fetchLandingPageTemplates,
    fetchById,
    deleteLandingPageTemplate,
    setCurrentLandingPageTemplate,
    setFilters,
    isLoading,
  } = useLandingPageTemplateStore();

  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'name' | 'organization'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  // ✅ Ajout de isDefault dans le type
  const [templateToDelete, setTemplateToDelete] = useState<{ id: string; name: string; isDefault: boolean } | null>(null);

  useEffect(() => {
    fetchAll();
    fetchLandingPageTemplates();
  }, []);

  useEffect(() => {
    setFilters({ search, sortBy, sortOrder });
  }, [search]);

  const {user} = useAuthStore()

  const displayedTemplates = filteredLandingPageTemplates;

  // ✅ Mise à jour de handleDelete pour inclure isDefault
  const handleDelete = (id: string, name: string, isDefault: boolean) => {
    setTemplateToDelete({ id, name, isDefault });
    setDeleteDialogOpen(true);
  };

  // ✅ Mise à jour de confirmDelete pour utiliser isDefault
  const confirmDelete = async () => {
    if (!templateToDelete) return;

    await deleteLandingPageTemplate(templateToDelete.id, templateToDelete.isDefault);
    if (currentLandingPageTemplate?.id === templateToDelete.id) {
      setCurrentLandingPageTemplate(null);
    }
    setDeleteDialogOpen(false);
    setTemplateToDelete(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050816]">
      <div className="mx-auto">
        <div className="space-y-4">
          <section className="rounded-sm border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-sm dark:shadow-none">

            <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={tCommon('admin.landing_templates.search_placeholder')}
                  className="w-full rounded-sm border border-gray-300 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:border-gray-400 dark:focus:border-slate-700 focus:outline-none"
                />
              </div>

              <div className="flex gap-2">
               <Combobox
                  options={[
                    { value: 'createdAt', label: tCommon('admin.campaigns.tracking_date')},
                    { value: 'name', label: tCommon('user.profile.last_name')},
                    { value: 'organization', label: tCommon('admin.grc.org_name')},
                  ]}
                  value={sortBy}
                  onChange={(value) => setSortBy(value as typeof sortBy)}
                  placeholder={tCommon('admin.campaigns.page_sort_by')}
                  searchPlaceholder={tCommon('admin.templates.search_criteria')}
                  className="w-[180px] border-gray-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                />

                <Button
                  variant="outline"
                  className="border-gray-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                  onClick={() =>
                    setSortOrder((order) =>
                      order === "asc" ? "desc" : "asc"
                    )
                  }
                >
                  {sortOrder === "asc" ? "↑" : "↓"}
                </Button>
              </div>
            </div>

            {isLoading && landingPageTemplates.length === 0 ? (
              <div className="rounded-sm border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center">
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  {tCommon('admin.landing_templates.loading')}
                </p>
              </div>
            ) : displayedTemplates.length === 0 ? (
              <div className="rounded-sm border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center">
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  {tCommon('admin.landing_templates.no_templates')}
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {displayedTemplates.map((template) => {
                  const isSelected =
                    template.id === currentLandingPageTemplate?.id;

                  return (
                    <div
                      key={template.id}
                      className={`
                        group rounded-sm border p-5 transition-all
                        ${
                          isSelected
                            ? "border-cyan-500/40 bg-cyan-500/5"
                            : "border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-gray-300 dark:hover:border-slate-700"
                        }
                      `}
                    >
                      <div className="mb-4 flex items-start justify-between">
                        <div className="min-w-0">
                          <h3 className="truncate font-medium text-gray-900 dark:text-white">
                            {template.name}
                          </h3>

                          <p className="mt-1 truncate text-sm text-gray-500 dark:text-slate-400">
                            {template.title ?? tCommon('admin.landing_templates.no_title')}
                          </p>
                        </div>

                        {isSelected && (
                          <span className="rounded-full bg-cyan-500/10 px-2 py-1 text-xs font-medium text-cyan-400">
                            {tCommon('common.active')}
                          </span>
                        )}
                      </div>

                      <div className="mb-4">
                        <span className="inline-flex rounded-full border border-gray-300 dark:border-slate-700 px-2.5 py-1 text-xs text-gray-600 dark:text-slate-300">
                          {template.organization?.name ??
                            "Roxshield Default"}
                        </span>
                      </div>

                      <div className="mb-5">
                        <p className="truncate text-xs text-gray-500 dark:text-slate-500">
                          {template.id}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={isSelected ? "secondary" : "outline"}
                          onClick={() => fetchById(template.id)}
                        >
                          {isSelected ? tCommon('admin.landing_templates.opened') : tCommon('admin.landing_templates.open')}
                        </Button>

                        {/* ✅ Logique isDefault appliquée ici */}
                        {(user?.role === roleEnum.SUPERADMIN || !template?.isDefault) && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(template.id, template.name, template.isDefault)}
                          >
                            {tCommon('admin.ambassadors.delete')}
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section className="bg-white dark:bg-[#0c1023] rounded-sm p-6 border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none">
            <LandingPageTemplateForm
              organizations={organizations}
              template={currentLandingPageTemplate}
              onCancel={() => setCurrentLandingPageTemplate(null)}
            />
          </section>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-white">{tCommon('admin.landing_templates.delete_confirm_title')}</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
              {tCommon('admin.templates.delete_confirm_desc')} <span className="font-semibold text-gray-900 dark:text-white">"{templateToDelete?.name}"</span> {tCommon('admin.campaigns.page_delete_confirm_desc2')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className='bg-white dark:bg-gray-900'>
            <AlertDialogCancel className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-white">
              {tCommon('user.formations.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {tCommon('admin.ambassadors.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}