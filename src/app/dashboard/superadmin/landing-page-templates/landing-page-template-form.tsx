'use client';

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useLandingPageTemplateStore, LandingPageTemplate } from '@/store/landing-page-template.store';
import { EmailEditorWrapper, EmailEditorHandle } from '@/app/dashboard/superadmin/templates/email-editor-wrapper';
import { Combobox } from '@/components/ui/combobox';
import { roleEnum } from '@/constants/roleEnum';
import { useAuthStore } from '@/store/auth.store';
import { Checkbox } from '@/components/ui/checkbox'; // ✅ Import du Checkbox
import { useTranslation } from 'react-i18next';

type LandingPageTemplateFormData = {
  organizationId?: string;
  name: string;
  category?: string;
  title: string;
};

interface LandingPageTemplateFormProps {
  organizations: { id: string; name?: string | null }[];
  template?: LandingPageTemplate | null;
  onCancel?: () => void;
}

export const LandingPageTemplateForm = ({ organizations, template, onCancel }: LandingPageTemplateFormProps) => {
  const { t: tCommon } = useTranslation('common');
  const editorRef = useRef<EmailEditorHandle | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { createLandingPageTemplate, updateLandingPageTemplate, isSaving } = useLandingPageTemplateStore();

  const landingPageTemplateSchema = useMemo(() => z.object({
    organizationId: z.string().optional(),
    name: z.string().min(2, tCommon('admin.landing_templates.error_name')),
    category: z.string().optional(),
    title: z.string().min(1, tCommon('admin.landing_templates.error_title')),
  }), [tCommon]);
  const [importError, setImportError] = useState('');
  const [importStatus, setImportStatus] = useState('');
  const [editorHtml, setEditorHtml] = useState<string | undefined>(template?.html ?? '');
  
  // ✅ State pour isDefault
  const [isDefault, setIsDefault] = useState(template?.isDefault ?? false);

  const { user } = useAuthStore();
  const isSuperAdmin = user?.role === roleEnum.SUPERADMIN;

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
    setIsDefault(template?.isDefault ?? false); // ✅ Reset isDefault
    setEditorHtml(template?.html ?? '');
    setImportError('');
    setImportStatus('');
  }, [template, organizations, reset]);

  const onSubmit = async (data: LandingPageTemplateFormData) => {
    // ✅ Validation : si pas default, organisation requise
    if (!isDefault && !data.organizationId) {
      return;
    }

    const htmlResult = await editorRef.current?.exportHtml();

    const payload = {
      organizationId: isDefault ? null : data.organizationId, // ✅ null pour les templates par défaut
      name: data.name,
      category: data.category || null,
      title: data.title,
      html: htmlResult?.html ?? editorHtml ?? '<div></div>',
    };

    if (template?.id) {
      //@ts-expect-error 
      await updateLandingPageTemplate(template.id, payload, isDefault);
    } else {
      //@ts-expect-error  
      await createLandingPageTemplate(payload, isDefault); // ✅ Passage de isDefault
    }
  };

  const handleFileUpload = async (file: File | null) => {
    if (!file) return;
    const text = await file.text();
    setEditorHtml(text);
    setImportStatus(tCommon('admin.landing_templates.file_loaded', { name: file.name }));
    setImportError('');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* ✅ Checkbox pour template par défaut (visible uniquement pour SUPERADMIN) */}
      {isSuperAdmin && (
        <div className="flex items-center gap-2">
          <Checkbox
            id="isDefault"
            checked={isDefault}
            onCheckedChange={(checked) => {
              setIsDefault(checked === true);
              // Si on coche "par défaut", on vide l'organisation
              if (checked === true) {
                setValue('organizationId', '');
              }
            }}
          />
          <Label htmlFor="isDefault" className="text-gray-700 dark:text-gray-300 cursor-pointer">
            {tCommon('admin.landing_templates.default_template')}
          </Label>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">{tCommon('user.profile.last_name')}</Label>
          <Input id="name" {...register('name')} className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white mt-1" />
          {errors.name && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.name.message}</p>}
        </div>

        {/* ✅ Organisation cachée si template par défaut */}
        {!isDefault && (
          <div>
            <Label htmlFor="organizationId" className="text-gray-700 dark:text-gray-300">{tCommon('admin.grc.org_name')}</Label>
            <Combobox
              options={organizations.map((org) => ({
                value: org.id,
                label: org.name || org.id,
              }))}
              value={watch('organizationId') || ''}
              onChange={(value) => setValue('organizationId', value)}
              placeholder={tCommon('admin.landing_templates.org_placeholder')}
              searchPlaceholder={tCommon('admin.formations.create_search_org')}
              className="mt-1 bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white w-full"
            />
            {errors.organizationId && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.organizationId.message}</p>}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title" className="text-gray-700 dark:text-gray-300">{tCommon('admin.campaigns.template_subject')}</Label>
          <Input id="title" {...register('title')} className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white mt-1" />
          {errors.title && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.title.message}</p>}
        </div>

        <div>
  <Label htmlFor="category" className="text-gray-700 dark:text-gray-300">{tCommon('admin.landing_templates.category')}</Label>
  <Combobox
    options={[
      { value: 'security', label: tCommon('admin.organizations.security') },
      { value: 'awareness', label: tCommon('admin.templates.cat_awareness') },
      { value: 'it', label: tCommon('admin.templates.cat_it') },
      { value: 'hr', label: tCommon('admin.templates.cat_hr') },
      { value: 'finance', label: tCommon('admin.templates.cat_finance') },
      { value: 'marketing', label: tCommon('admin.templates.cat_marketing') },
      { value: 'sales', label: tCommon('admin.templates.cat_sales') },
      { value: 'legal', label: tCommon('admin.templates.cat_legal') },
      { value: 'operations', label: tCommon('admin.templates.cat_operations') },
      { value: 'onboarding', label: tCommon('admin.templates.cat_onboarding') },
      { value: 'custom', label: tCommon('admin.templates.cat_custom') },
    ]}
    value={watch('category') || ''}
    onChange={(value) => value && setValue('category', value)}
    placeholder={tCommon('admin.landing_templates.category_placeholder')}
    searchPlaceholder={tCommon('admin.templates.search_criteria')}
    className="mt-1 bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white w-full [&_.placeholder]:text-gray-500 dark:[&_.placeholder]:text-gray-400"
  />
  {errors.category && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.category.message}</p>}
</div>
      </div>

      <div className="space-y-3 rounded-sm border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-4">
        <p className="text-sm font-medium text-gray-900 dark:text-white">{tCommon('admin.landing_templates.import_html')}</p>
        <div className="space-y-2">
          <Label className="text-gray-700 dark:text-gray-300">{tCommon('admin.landing_templates.html_file')}</Label>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
            >
              {tCommon('admin.landing_templates.choose_file')}
            </Button>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {importStatus || tCommon('admin.landing_templates.no_file_chosen')}
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept="text/html"
              onChange={(event) => handleFileUpload(event.target.files?.[0] ?? null)}
              className="hidden"
            />
          </div>
        </div>
        {importError && <p className="text-xs text-red-600 dark:text-red-400">{importError}</p>}
      </div>

      <div>
        <Label className="text-gray-700 dark:text-gray-300">{tCommon('admin.landing_templates.html_editor')}</Label>
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
          {tCommon('user.formations.cancel')}
        </Button>
        
        {/* ✅ Condition pour afficher le bouton de soumission */}
        {(isSuperAdmin || !template?.isDefault) && (
          <Button type="submit" disabled={isSaving}>
            {isSaving ? tCommon('admin.templates.saving') : template ? tCommon('admin.templates.update_template') : tCommon('admin.landing_templates.create_template')}
          </Button>
        )}
      </div>
    </form>
  );
};