'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { EmailEditorWrapper, EmailEditorHandle } from './email-editor-wrapper';
import { useTemplateStore, Template } from '@/store/template.store';
import { Combobox } from '@/components/ui/combobox';
import { roleEnum } from '@/constants/roleEnum';
import { useAuthStore } from '@/store/auth.store';
import { Checkbox } from '@/components/ui/checkbox';
import { useTranslation } from 'react-i18next';

const templateSchema = z.object({
  name: z.string().min(2),
  category: z.string().optional(),
  subject: z.string().min(1),
  organizationId: z.string().optional(),
});

type TemplateFormData = z.infer<typeof templateSchema>;

interface TemplateFormProps {
  organizations: { id: string; name?: string }[];
  template?: Template | null;
  onCancel?: () => void;
}

export const TemplateForm = ({ organizations, template, onCancel }: TemplateFormProps) => {
  const { t: tCommon } = useTranslation('common');
  const editorRef = useRef<EmailEditorHandle | null>(null);
  const { createTemplate, updateTemplate, isSaving } = useTemplateStore();

  const { user } = useAuthStore();
  const isSuperAdmin = user?.role === roleEnum.SUPERADMIN;

  const [isDefault, setIsDefault] = useState(template?.isDefault ?? false);

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
        organizationId: template.organizationId ?? '',
      });
      setIsDefault(template.isDefault ?? false);
    } else {
      reset({
        name: '',
        category: '',
        subject: '',
        organizationId: organizations?.[0]?.id || '',
      });
      setIsDefault(false);
    }
  }, [template, organizations, reset]);

const onSubmit = async (data: TemplateFormData) => {
  
  if (!isDefault && !data.organizationId) {
    return;
  }

  const htmlResult = await editorRef.current?.exportHtml();
  const payload = {
    organizationId: isDefault ? null : data.organizationId,
    name: data.name,
    isDefault,
    category: data.category || null,
    subject: data.subject,
    html: htmlResult?.html || '<p></p>',
    text: htmlResult?.text ?? '',
  };

  if (template?.id) {
    await updateTemplate(template.id, payload, isDefault);
  } else {
    //@ts-expect-error 
    await createTemplate(payload, isDefault);
  }
};

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {isSuperAdmin && (
        <div className="flex items-center gap-2">
          <Checkbox
            id="isDefault"
            checked={isDefault}
            onCheckedChange={(checked) => setIsDefault(checked === true)}
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
          {errors.name && <p className="text-red-600 dark:text-red-400 text-sm">{errors.name.message}</p>}
        </div>

        {!isDefault && (
  <div>
    <Label htmlFor="organizationId" className="text-gray-700 dark:text-gray-300">{tCommon('admin.grc.org_name')}</Label>
    <Combobox
      options={organizations?.map((org) => ({
        value: org.id,
        label: org.name || org.id,
      })) || []}
      value={watch('organizationId') || ''}
      onChange={(value) => value && setValue('organizationId', value)}
      placeholder={tCommon('admin.campaigns.form_org_placeholder')}
      searchPlaceholder={tCommon('admin.formations.create_search_org')}
      className="mt-1 bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white w-full [&_.placeholder]:text-gray-500 dark:[&_.placeholder]:text-gray-400"
    />
    {errors.organizationId && <p className="text-red-600 dark:text-red-400 text-sm">{errors.organizationId.message}</p>}
  </div>
)}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="subject" className="text-gray-700 dark:text-gray-300">{tCommon('admin.templates.subject')}</Label>
          <Input id="subject" {...register('subject')} className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white mt-1" />
          {errors.subject && <p className="text-red-600 dark:text-red-400 text-sm">{errors.subject.message}</p>}
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
  {errors.category && <p className="text-red-600 dark:text-red-400 text-sm">{errors.category.message}</p>}
</div>
      </div>

      <div>
        <Label className="text-gray-700 dark:text-gray-300">{tCommon('admin.formations.create_editor')}</Label>
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
          {tCommon('user.formations.cancel')}
        </Button>
        {(isSuperAdmin || !template?.isDefault) && (
          <Button type="submit" disabled={isSaving}>
            {isSaving ? tCommon('admin.templates.saving') : template ? tCommon('admin.templates.update_template') : tCommon('admin.templates.save_template')}
          </Button>
        )}
      </div>
    </form>
  );
};