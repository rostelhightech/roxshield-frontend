'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOrganizationStore } from '@/store/organization.store';
import { useLandingPageTemplateStore } from '@/store/landing-page-template.store';
import { LandingPageTemplateForm } from './landing-page-template-form';

export default function LandingPageTemplates() {
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

  useEffect(() => {
    fetchAll();
    fetchLandingPageTemplates();
  }, [fetchAll, fetchLandingPageTemplates]);

  useEffect(() => {
    setFilters({ search, sortBy, sortOrder });
  }, [search, sortBy, sortOrder, setFilters]);

  const displayedTemplates = filteredLandingPageTemplates;

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Supprimer ce template de landing page ?');
    if (!confirmed) return;

    await deleteLandingPageTemplate(id);
    if (currentLandingPageTemplate?.id === id) {
      setCurrentLandingPageTemplate(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#050816]">
      <div className="mx-auto">
        <div className="space-y-4">
       <section className="rounded-xl border border-slate-800 bg-slate-950 p-6">


  <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
    <div className="relative flex-1">
      <input
        type="text"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Rechercher un template..."
        className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-slate-700 focus:outline-none"
      />
    </div>

    <div className="flex gap-2">
      <Select
        value={sortBy}
        onValueChange={(value) =>
          setSortBy(value as typeof sortBy)
        }
      >
        <SelectTrigger className="w-[180px] border-slate-800 bg-slate-900 text-white">
          <SelectValue placeholder="Trier par" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="createdAt">Date</SelectItem>
          <SelectItem value="name">Nom</SelectItem>
          <SelectItem value="organization">Organisation</SelectItem>
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        className="border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800"
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
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
      <p className="text-sm text-slate-400">
        Chargement des landing page templates...
      </p>
    </div>
  ) : displayedTemplates.length === 0 ? (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
      <p className="text-sm text-slate-400">
        Aucun landing page template trouvé.
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
              group rounded-xl border p-5 transition-all
              ${
                isSelected
                  ? "border-cyan-500/40 bg-cyan-500/5"
                  : "border-slate-800 bg-slate-900 hover:border-slate-700"
              }
            `}
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="min-w-0">
                <h3 className="truncate font-medium text-white">
                  {template.name}
                </h3>

                <p className="mt-1 truncate text-sm text-slate-400">
                  {template.title ?? "Sans titre"}
                </p>
              </div>

              {isSelected && (
                <span className="rounded-full bg-cyan-500/10 px-2 py-1 text-xs font-medium text-cyan-400">
                  Actif
                </span>
              )}
            </div>

            <div className="mb-4">
              <span className="inline-flex rounded-full border border-slate-700 px-2.5 py-1 text-xs text-slate-300">
                {template.organization?.name ??
                  "Organisation inconnue"}
              </span>
            </div>

            <div className="mb-5">
              <p className="truncate text-xs text-slate-500">
                {template.id}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                className="flex-1 text-gray-700"
                variant={
                  isSelected ? "secondary" : "outline"
                }
                onClick={() => fetchById(template.id)}
              >
                {isSelected ? "Ouvert" : "Ouvrir"}
              </Button>

              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(template.id)}
              >
                Supprimer
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  )}
</section>
          <section className="bg-[#0c1023] rounded-md p-6 border border-white/5 shadow-lg">
            <LandingPageTemplateForm
              organizations={organizations}
              template={currentLandingPageTemplate}
              onCancel={() => setCurrentLandingPageTemplate(null)}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
