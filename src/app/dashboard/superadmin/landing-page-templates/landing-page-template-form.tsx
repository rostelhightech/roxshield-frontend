'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useLandingPageTemplateStore, LandingPageTemplate } from '@/store/landing-page-template.store';
import { EmailEditorWrapper, EmailEditorHandle } from '@/app/dashboard/superadmin/templates/email-editor-wrapper';

const landingPageTemplateSchema = z.object({
  organizationId: z.string().min(1, 'L’organisation est requise'),
  name: z.string().min(2, 'Le nom est requis'),
  category: z.string().optional(),
  title: z.string().min(1, 'Le titre est requis'),
});

type LandingPageTemplateFormData = z.infer<typeof landingPageTemplateSchema>;

interface LandingPageTemplateFormProps {
  organizations: { id: string; name?: string | null }[];
  template?: LandingPageTemplate | null;
  onCancel?: () => void;
}

export const LandingPageTemplateForm = ({ organizations, template, onCancel }: LandingPageTemplateFormProps) => {
  const editorRef = useRef<EmailEditorHandle | null>(null);
  const { createLandingPageTemplate, updateLandingPageTemplate, isSaving } = useLandingPageTemplateStore();
  const [importError, setImportError] = useState('');
  const [importStatus, setImportStatus] = useState('');
  const [editorHtml, setEditorHtml] = useState<string | undefined>(template?.html ?? '');

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<LandingPageTemplateFormData>({
    resolver: zodResolver(landingPageTemplateSchema),
    defaultValues: {
      organizationId: organizations?.[0]?.id || '',
      name: '',
      category: '',
      title: '',
    },
  });

  const selectedOrganization = useMemo(
    () => organizations.find((org) => org.id === watch('organizationId')),
    [organizations, watch('organizationId')],
  );

  useEffect(() => {
    reset({
      organizationId: (template?.organizationId ?? organizations?.[0]?.id) || '',
      name: template?.name ?? '',
      category: template?.category ?? '',
      title: template?.title ?? '',
    });
    setEditorHtml(template?.html ?? '');
    setImportError('');
    setImportStatus('');
  }, [template, organizations, reset]);

  const onSubmit = async (data: LandingPageTemplateFormData) => {
    const htmlResult = await editorRef.current?.exportHtml();

    const payload = {
      organizationId: data.organizationId,
      name: data.name,
      category: data.category || null,
      title: data.title,
      html: htmlResult?.html ?? editorHtml ?? '<div></div>',
    };

    if (template?.id) {
      await updateLandingPageTemplate(template.id, payload);
    } else {
      await createLandingPageTemplate(payload);
    }
  };

  const handleFileUpload = async (file: File | null) => {
    if (!file) return;
    const text = await file.text();
    setEditorHtml(text);
    setImportStatus(`Fichier "${file.name}" chargé`);
    setImportError('');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Nom</Label>
          <Input id="name" {...register('name')} className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white mt-1" />
          {errors.name && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <Label htmlFor="organizationId" className="text-gray-700 dark:text-gray-300">Organisation</Label>
          <Select
            value={watch('organizationId') || ''}
            onValueChange={(value) => setValue('organizationId', value)}
          >
            <SelectTrigger className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white mt-1">
              {selectedOrganization ? (
                <span className="truncate">{selectedOrganization.name || selectedOrganization.id}</span>
              ) : (
                <SelectValue placeholder="Choisir une organisation" />
              )}
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              {organizations.map((org) => (
                <SelectItem key={org.id} value={org.id}>{org.name || org.id}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.organizationId && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.organizationId.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title" className="text-gray-700 dark:text-gray-300">Titre</Label>
          <Input id="title" {...register('title')} className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white mt-1" />
          {errors.title && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <Label htmlFor="category" className="text-gray-700 dark:text-gray-300">Catégorie</Label>
          <Input id="category" {...register('category')} className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white mt-1" />
        </div>
      </div>

      <div className="space-y-3 rounded-sm border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-4">
        <p className="text-sm font-medium text-gray-900 dark:text-white">Importer du HTML</p>
        <div className="space-y-2">
          <Label htmlFor="importFile" className="text-gray-700 dark:text-gray-300">Fichier HTML</Label>
          <input
            id="importFile"
            type="file"
            accept="text/html"
            onChange={(event) => handleFileUpload(event.target.files?.[0] ?? null)}
            className="w-full text-sm text-gray-600 dark:text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-gray-200 dark:file:bg-slate-700 file:text-gray-700 dark:file:text-white file:cursor-pointer"
          />
        </div>
        {importStatus && <p className="text-xs text-sky-600 dark:text-sky-300">{importStatus}</p>}
        {importError && <p className="text-xs text-red-600 dark:text-red-400">{importError}</p>}
      </div>

      <div>
        <Label className="text-gray-700 dark:text-gray-300">Éditeur HTML</Label>
        <div className="h-[620px] bg-gray-50 dark:bg-white/5 mt-2 rounded-sm overflow-hidden">
          <EmailEditorWrapper
            ref={editorRef}
            defaultHtml={editorHtml}
            showVariables={false}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (onCancel) {
              onCancel();
            }
          }}
        >
          Annuler
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Enregistrement...' : template ? 'Mettre à jour le template' : 'Créer le template'}
        </Button>
      </div>
    </form>
  );
};