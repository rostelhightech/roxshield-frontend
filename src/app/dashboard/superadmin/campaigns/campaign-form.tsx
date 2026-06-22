'use client';

import { useEffect, useMemo, useState } from 'react';
import { Resolver, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, FileText, Settings2, CalendarClock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCampaignStore, CampaignTargetPayload, Campaign } from '@/store/campaign.store';
import { Organization } from '@/store/organization.store';
import { Group } from '@/store/group.store';
import { Template } from '@/store/template.store';
import { LandingPageTemplate } from '@/store/landing-page-template.store';
import { SmtpProfile } from '@/store/smtp-profile.store';
import { Link } from '@tanstack/react-router';
import { Combobox } from '@/components/ui/combobox';
import { useTranslation } from 'react-i18next';

 
const defaultFormValues = {
  name: '',
  description: '',
  organizationId: '',
  smtpProfileId: '',
  fromName: '',
  emailTemplateId: '',
  landingPageTemplateId: '',
  scheduledAt: '',
  endAt: '',
  targetGroupId: '',
  targetEmails: '',
};

interface CampaignFormProps {
  organizations: Organization[];
  groups: Group[];
  templates: Template[];
  landingPageTemplates: LandingPageTemplate[];
  smtpProfiles: SmtpProfile[];
  onCreated: () => void;
  onCancel?: () => void;
  onSubmitAction?: (data: Campaign) => Promise<void>;
  initialValues?: Campaign;
  submitLabel?: string;
  defaultOrganizationId?: string;
  hideOrganization?: boolean;
}

// Wrapper de section réutilisable : icône + titre + fond distinct
function FormSection({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {

  return (
    <section className="rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50/60 dark:bg-white/[0.03] p-5 sm:p-6">
      <div className="flex items-start gap-3 mb-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-blue-600/10 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400">
          <Icon className="h-4.5 w-4.5" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}

export function CampaignForm({
  organizations,
  groups,
  templates,
  landingPageTemplates,
  smtpProfiles,
  onCreated,
  onCancel,
  onSubmitAction,
  initialValues,
  submitLabel,
  defaultOrganizationId,
  hideOrganization = false,
}: CampaignFormProps) {
  const { createCampaign, isSaving } = useCampaignStore();
  const { t: tCommon } = useTranslation('common');

  const campaignSchema = useMemo(() => z.object({
    name: z.string().min(3, tCommon('admin.campaigns.error_name')),
    description: z.string().optional().nullable(),
    organizationId: z.string().min(1, tCommon('admin.campaigns.error_org')),
    smtpProfileId: z.string().min(1, tCommon('admin.campaigns.error_smtp')),
    fromName: z.string().optional().nullable(),
    emailTemplateId: z.string().min(1, tCommon('admin.campaigns.error_email_template')),
    landingPageTemplateId: z.string().min(1, tCommon('admin.campaigns.error_landing_template')),
    scheduledAt: z.string().optional().nullable(),
    endAt: z.string().optional().nullable(),
    targetGroupId: z.string().optional().nullable(),
    targetEmails: z.string().optional().nullable(),
  }).superRefine((data, ctx) => {
    const hasEmailTargets = Boolean(data.targetEmails?.trim());
    if (!data.targetGroupId && !hasEmailTargets) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: tCommon('admin.campaigns.error_target'),
        path: ['targetEmails'],
      });
    }
    if (data.scheduledAt && data.endAt && data.endAt <= data.scheduledAt) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: tCommon('admin.campaigns.error_end_date'),
        path: ['endAt'],
      });
    }
  }), [tCommon]) as unknown as z.ZodSchema<Campaign>;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<Campaign>({
    resolver: zodResolver(campaignSchema as z.ZodType<Campaign, Campaign>),
    defaultValues: initialValues ?? defaultFormValues,
  });

  useEffect(() => {
    reset(initialValues ?? defaultFormValues);
  }, [initialValues, reset]);

  const selectedOrganizationId = watch('organizationId');

  const availableGroups = useMemo(
    () => groups.filter((group) => group.organizationId === selectedOrganizationId),
    [groups, selectedOrganizationId],
  );

  const availableSmtpProfiles = useMemo(() => {
    const profiles = smtpProfiles.filter(
      (profile) => profile.organizationId === selectedOrganizationId || profile.isDefault,
    );
    return [...profiles];
  }, [smtpProfiles, selectedOrganizationId]);

  const availableTemplates = useMemo(() => {
    return templates.filter(
      (template) => template.organizationId === selectedOrganizationId || template.isDefault,
    );
  }, [templates, selectedOrganizationId]);

  const availableLandingPages = useMemo(() => {
    return landingPageTemplates.filter(
      (template) => template.organizationId === selectedOrganizationId || template.isDefault,
    );
  }, [landingPageTemplates, selectedOrganizationId]);

  useEffect(() => {
    if (defaultOrganizationId && !initialValues) {
      setValue('organizationId', defaultOrganizationId);
    }
  }, [defaultOrganizationId, initialValues]);

  const handleFormSubmit = async (data: Campaign) => {
    const targets: CampaignTargetPayload[] = [];

    if (data.targetGroupId) {
      targets.push({ groupId: data.targetGroupId });
    }

    if (data.targetEmails?.trim()) {
      const emails = data.targetEmails
        .split(/\r?\n/)
        .map((email) => email.trim())
        .filter(Boolean);

      for (const email of emails) {
        targets.push({ email });
      }
    }

    try {
      if (onSubmitAction) {
        await onSubmitAction(data);
      } else {
        await createCampaign({
          organizationId: data.organizationId,
          name: data.name,
          description: data.description || null,
          smtpProfileId: data.smtpProfileId,
          fromName: data.fromName || null,
          emailTemplateId: data.emailTemplateId,
          landingPageTemplateId: data.landingPageTemplateId,
          scheduledAt: data.scheduledAt || null,
          endAt: data.endAt || null,
          targets,
        });
      }
      onCreated();
      reset(defaultFormValues);
    } catch (error) {
      console.error('Erreur lors de la création ou mise à jour de la campagne', error);
    }
  };

  const organizationOptions = organizations.map((org) => ({
    value: org.id,
    label: org.name ?? org.id,
  }));

  const smtpProfileOptions = availableSmtpProfiles.map((profile) => ({
    value: profile.id,
    label: profile.name,
  }));

  const templateOptions = availableTemplates.map((template) => ({
    value: template.id,
    label: template.name,
  }));

  const landingPageOptions = availableLandingPages.map((template) => ({
    value: template.id,
    label: template.name,
  }));

  const groupOptions = availableGroups.map((group) => ({
    value: group.id,
    label: group.name,
  }));

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <FormSection
        icon={FileText}
        title={tCommon('admin.campaigns.form_general_title')}
        description={tCommon('admin.campaigns.form_general_desc')}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
              {tCommon('admin.campaigns.form_name')} <span className="text-red-600 dark:text-red-400">*</span>
            </Label>
            <Input
              id="name"
              {...register('name')}
              className="bg-white dark:bg-[#071120] border-gray-300 dark:border-white/10 text-gray-900 dark:text-white"
              placeholder={tCommon('admin.campaigns.form_name_placeholder')}
            />
            {errors.name && <p className="text-red-600 dark:text-red-400 text-xs">{errors.name.message}</p>}
          </div>

          {!hideOrganization && (
            <div className="space-y-1.5">
              <Label htmlFor="organizationId" className="text-gray-700 dark:text-gray-300">
                {tCommon('admin.grc.org_name')} <span className="text-red-600 dark:text-red-400">*</span>
              </Label>
              <Combobox
                options={organizationOptions}
                value={watch('organizationId') || ''}
                onChange={(value) => setValue('organizationId', value)}
                placeholder={tCommon('admin.campaigns.form_org_placeholder')}
                searchPlaceholder={tCommon('admin.campaigns.search_org')}
              />
              {errors.organizationId && (
                <p className="text-red-600 dark:text-red-400 text-xs">{errors.organizationId.message}</p>
              )}
            </div>
          )}

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="description" className="text-gray-700 dark:text-gray-300">
              {tCommon('admin.campaigns.form_description')}
            </Label>
            <Textarea
              id="description"
              {...register('description')}
              className="bg-white dark:bg-[#071120] border-gray-300 dark:border-white/10 text-gray-900 dark:text-white"
              placeholder={tCommon('admin.campaigns.form_desc_placeholder')}
              rows={3}
            />
          </div>
        </div>
      </FormSection>

      <FormSection
        icon={Settings2}
        title={tCommon('admin.campaigns.form_configuration')}
        description={tCommon('admin.campaigns.form_smtp_desc')}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="smtpProfileId" className="text-gray-700 dark:text-gray-300">
              {tCommon('admin.campaigns.form_smtp')} <span className="text-red-600 dark:text-red-400">*</span>
            </Label>
            <Combobox
              options={smtpProfileOptions}
              value={watch('smtpProfileId') || ''}
              onChange={(value) => setValue('smtpProfileId', value)}
              placeholder={tCommon('admin.campaigns.form_smtp_placeholder')}
              searchPlaceholder={tCommon('admin.campaigns.search_smtp')}
            />
            {errors.smtpProfileId && (
              <p className="text-red-600 dark:text-red-400 text-xs">{errors.smtpProfileId.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="fromName" className="text-gray-700 dark:text-gray-300">
              {tCommon('admin.campaigns.form_sender_name')}
            </Label>
            <input
              id="fromName"
              {...register('fromName')}
              placeholder={tCommon('admin.campaigns.form_from_placeholder')}
              className="flex h-9 w-full rounded-sm border border-gray-300 dark:border-white/10 bg-white dark:bg-[#071120] px-3 py-1 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-ring"
            />
            {errors.fromName && (
              <p className="text-red-600 dark:text-red-400 text-xs">{errors.fromName.message}</p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {tCommon('admin.campaigns.form_visible')}
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="emailTemplateId" className="text-gray-700 dark:text-gray-300">
              {tCommon('admin.campaigns.form_template')} <span className="text-red-600 dark:text-red-400">*</span>
            </Label>
            <Combobox
              options={templateOptions}
              value={watch('emailTemplateId') || ''}
              onChange={(value) => setValue('emailTemplateId', value)}
              placeholder={tCommon('admin.campaigns.form_template_placeholder')}
              searchPlaceholder={tCommon('admin.campaigns.search_email_template')}
            />
            {errors.emailTemplateId && (
              <p className="text-red-600 dark:text-red-400 text-xs">{errors.emailTemplateId.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="landingPageTemplateId" className="text-gray-700 dark:text-gray-300">
              {tCommon('admin.campaigns.form_landing_template_label')} <span className="text-red-600 dark:text-red-400">*</span>
            </Label>
            <Combobox
              options={landingPageOptions}
              value={watch('landingPageTemplateId') || ''}
              onChange={(value) => setValue('landingPageTemplateId', value)}
              placeholder={tCommon('admin.campaigns.form_template_placeholder')}
              searchPlaceholder={tCommon('admin.campaigns.search_landing_template')}
            />
            {errors.landingPageTemplateId && (
              <p className="text-red-600 dark:text-red-400 text-xs">{errors.landingPageTemplateId.message}</p>
            )}
          </div>
        </div>
      </FormSection>

      <FormSection
        icon={CalendarClock}
        title={tCommon('admin.campaigns.form_scheduling')}
        description={tCommon('admin.campaigns.form_period_desc')}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="scheduledAt" className="text-gray-700 dark:text-gray-300">
              {tCommon('admin.campaigns.form_start')}
            </Label>
            <Input
              id="scheduledAt"
              type="datetime-local"
              {...register('scheduledAt')}
              className="bg-white dark:bg-[#071120] border-gray-300 dark:border-white/10 text-gray-900 dark:text-white"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="endAt" className="text-gray-700 dark:text-gray-300">
              {tCommon('admin.campaigns.form_end')}
            </Label>
            <Input
              id="endAt"
              type="datetime-local"
              {...register('endAt')}
              className="bg-white dark:bg-[#071120] border-gray-300 dark:border-white/10 text-gray-900 dark:text-white"
            />
            {errors.endAt && <p className="text-red-600 dark:text-red-400 text-xs">{errors.endAt.message}</p>}
          </div>
        </div>
      </FormSection>

      <FormSection
        icon={Users}
        title={tCommon('admin.campaigns.form_recipients')}
        description={tCommon('admin.campaigns.form_group_desc')}
      >
        <div className="flex items-center justify-end text-sm mb-4">
          <Link
            to="/dashboard/groups"
            className="font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            {tCommon('admin.campaigns.form_create_group')}
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="targetGroupId" className="text-gray-700 dark:text-gray-300">
              {tCommon('admin.campaigns.form_target_group')}
            </Label>
            <Combobox
              options={groupOptions}
              value={watch('targetGroupId') || ''}
              onChange={(value) => setValue('targetGroupId', value)}
              placeholder={tCommon('admin.campaigns.form_group_placeholder')}
              searchPlaceholder={tCommon('admin.campaigns.search_group')}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="targetEmails" className="text-gray-700 dark:text-gray-300">
              {tCommon('admin.campaigns.form_extra_emails')}
            </Label>
            <Textarea
              id="targetEmails"
              {...register('targetEmails')}
              className="bg-white dark:bg-[#071120] border-gray-300 dark:border-white/10 text-gray-900 dark:text-white"
              placeholder={tCommon('admin.campaigns.form_emails_placeholder')}
              rows={3}
            />
            {errors.targetEmails && (
              <p className="text-red-600 dark:text-red-400 text-xs">{errors.targetEmails.message}</p>
            )}
          </div>
        </div>
      </FormSection>

      <div className="flex items-center justify-end gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            {tCommon('user.formations.cancel')}
          </Button>
        )}
        <Button type="button" variant="outline" onClick={() => reset(defaultFormValues)}>
          {tCommon('admin.campaigns.form_reset')}
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitLabel ?? tCommon('admin.campaigns.create_campaign')}
        </Button>
      </div>
    </form>
  );
}