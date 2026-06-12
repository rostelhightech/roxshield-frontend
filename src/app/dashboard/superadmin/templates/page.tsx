'use client';

import { useEffect, useMemo, useState } from 'react';
import { TemplateForm } from './template-form';
import { useOrganizationStore } from '@/store/organization.store';
import { useTemplateStore } from '@/store/template.store';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Templates() {
  const { organizations, fetchAll } = useOrganizationStore();
  const {
    templateList,
    currentTemplate,
    fetchTemplateList,
    fetchById,
    deleteTemplate,
    setCurrentTemplate,
    isLoading,
  } = useTemplateStore();

  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'organization' | 'createdAt'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchAll();
    fetchTemplateList();
  }, []);

  const filteredTemplates = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();

    const filtered = templateList.filter((template) => {
      if (!normalizedSearch) return true;
      return [
        template.name,
        template.id,
        template.subject,
        template.organization?.name ?? '',
      ]
        .some((value) => value?.toLowerCase().includes(normalizedSearch));
    });

    return filtered.sort((a, b) => {
      const getValue = (item: typeof templateList[number]) => {
        if (sortBy === 'organization') {
          return item.organization?.name ?? '';
        }
        return (item as any)[sortBy] ?? '';
      };

      const valueA = String(getValue(a)).toLowerCase();
      const valueB = String(getValue(b)).toLowerCase();

      if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [templateList, search, sortBy, sortOrder]);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Supprimer ce template ?');
    if (!confirmed) return;

    await deleteTemplate(id);
    if (currentTemplate?.id === id) {
      setCurrentTemplate(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#050816]">
      <div className="mx-auto   py-6">
        <div className=" gap-6 space-y-4 ">
          <section className="rounded-xl border border-slate-800 bg-slate-950 p-6">
 
  <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
    <div className="relative flex-1">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Rechercher un template..."
        className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-slate-700 focus:outline-none"
      />
    </div>

    <div className="flex gap-2">
      <Select
        value={sortBy}
        onValueChange={(value) => setSortBy(value as typeof sortBy)}
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

  {filteredTemplates.length > 0 && (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {filteredTemplates.map((template) => {
        const isSelected =
          template.id === currentTemplate?.id;

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
              <div>
                <h3 className="font-medium text-white">
                  {template.name}
                </h3>

                <div className="mt-2 inline-flex rounded-full border border-slate-700 px-2.5 py-1 text-xs text-slate-300">
                  {template.organization?.name ??
                    "Organisation inconnue"}
                </div>
              </div>

              {isSelected && (
                <span className="rounded-full bg-cyan-500/10 px-2 py-1 text-xs text-cyan-400">
                  Actif
                </span>
              )}
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
                Voir
              </Button>

              <Button
                size="sm"
                variant="destructive"
                onClick={() =>
                  handleDelete(template.id)
                }
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
            <TemplateForm
              organizations={organizations}
              template={currentTemplate}
              onCancel={() => setCurrentTemplate(null)}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
