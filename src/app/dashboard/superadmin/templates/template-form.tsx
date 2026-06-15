'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { EmailEditorWrapper, EmailEditorHandle } from './email-editor-wrapper';
import { useTemplateStore, Template } from '@/store/template.store';

const templateSchema = z.object({
  name: z.string().min(2),
  category: z.string().optional(),
  subject: z.string().min(1),
  organizationId: z.string().min(1),
});

type TemplateFormData = z.infer<typeof templateSchema>;

interface TemplateFormProps {
  organizations: { id: string; name?: string }[];
  template?: Template | null;
  onCancel?: () => void;
}

export const TemplateForm = ({ organizations, template, onCancel }: TemplateFormProps) => {
  const editorRef = useRef<EmailEditorHandle | null>(null);
  const { createTemplate, updateTemplate, isSaving } = useTemplateStore();

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: '',
      category: '',
      subject: '',
      organizationId: organizations?.[0]?.id || '',
    }
  });

  const organizationId = watch('organizationId');
  const selectedOrganization = useMemo(
    () => organizations.find(org => org.id === organizationId),
    [organizationId, organizations],
  );

  useEffect(() => {
    if (template) {
      reset({
        name: template.name,
        category: template.category ?? '',
        subject: template.subject,
        organizationId: template.organizationId,
      });
    } else {
      reset({
        name: '',
        category: '',
        subject: '',
        organizationId: organizations?.[0]?.id || '',
      });
    }
  }, [template, organizations, reset]);

  const onSubmit = async (data: TemplateFormData) => {
    const htmlResult = await editorRef.current?.exportHtml();
    const payload = {
      organizationId: data.organizationId,
      name: data.name,
      category: data.category || null,
      subject: data.subject,
      html: htmlResult?.html || '<p></p>',
      text: htmlResult?.text ?? '',
    };

    if (template?.id) {
      await updateTemplate(template.id, payload);
    } else {
      await createTemplate(payload);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Nom</Label>
          <Input id="name" {...register('name')} className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white mt-1" />
          {errors.name && <p className="text-red-600 dark:text-red-400 text-sm">{errors.name.message}</p>}
        </div>

        <div>
          <Label htmlFor="organizationId" className="text-gray-700 dark:text-gray-300">Organisation</Label>
          <Select
            value={watch('organizationId') || ''}
            onValueChange={(value) => value && setValue('organizationId', value)}
          >
            <SelectTrigger className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white mt-1">
              {selectedOrganization ? (
                <span className="truncate">{selectedOrganization.name}</span>
              ) : (
                <span className="text-gray-500 dark:text-gray-400">Sélectionner une organisation</span>
              )}
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              {organizations?.map(org => (
                <SelectItem key={org.id} value={org.id}>{org.name || org.id}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="subject" className="text-gray-700 dark:text-gray-300">Sujet</Label>
          <Input id="subject" {...register('subject')} className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white mt-1" />
          {errors.subject && <p className="text-red-600 dark:text-red-400 text-sm">{errors.subject.message}</p>}
        </div>

        <div>
          <Label htmlFor="category" className="text-gray-700 dark:text-gray-300">Catégorie</Label>
          <Input id="category" {...register('category')} className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white mt-1" />
        </div>
      </div>

      <div>
        <Label className="text-gray-700 dark:text-gray-300">Éditeur</Label>
        <div className="h-[600px] bg-gray-50 dark:bg-white/5 mt-2 rounded-sm overflow-hidden">
          <EmailEditorWrapper
            ref={editorRef}
            defaultHtml={template?.html}
            defaultText={template?.text ?? ''}
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
            } else {
              window.location.reload();
            }
          }}
        >
          Annuler
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Enregistrement...' : template ? 'Mettre à jour le template' : 'Enregistrer le template'}
        </Button>
      </div>
    </form>
  );
};