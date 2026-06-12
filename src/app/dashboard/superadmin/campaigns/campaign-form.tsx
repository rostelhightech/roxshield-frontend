'use client';

import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCampaignStore, CampaignTargetPayload } from '@/store/campaign.store';
import { Organization } from '@/store/organization.store';
import { Group } from '@/store/group.store';
import { Template } from '@/store/template.store';
import { LandingPageTemplate } from '@/store/landing-page-template.store';
import { SmtpProfile } from '@/store/smtp-profile.store';

const campaignSchema = z.object({
  name: z.string().min(3, 'Le nom de la campagne est requis'),
  description: z.string().optional().nullable(),
  organizationId: z.string().min(1, 'Organisation requise'),
  smtpProfileId: z.string().min(1, 'Profil SMTP requis'),
  emailTemplateId: z.string().min(1, 'Template email requise'),
  landingPageTemplateId: z.string().min(1, 'Template de landing page requise'),
  scheduledAt: z.string().optional().nullable(),
  endAt: z.string().optional().nullable(),
  targetGroupId: z.string().optional().nullable(),
  targetEmails: z.string().optional().nullable(),
}).superRefine((data, ctx) => {
  const hasEmailTargets = Boolean(data.targetEmails?.trim());
  if (!data.targetGroupId && !hasEmailTargets) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Sélectionnez un groupe ou saisissez au moins une adresse email',
      path: ['targetEmails'],
    });
  }
  if (data.scheduledAt && data.endAt && data.endAt <= data.scheduledAt) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'La date de fin doit être postérieure à la date de début',
      path: ['endAt'],
    });
  }
});

export type CampaignFormData = z.infer<typeof campaignSchema>;

const defaultFormValues: CampaignFormData = {
  name: '',
  description: '',
  organizationId: '',
  smtpProfileId: '',
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
  onSubmitAction?: (data: CampaignFormData) => Promise<void>;
  initialValues?: CampaignFormData;
  submitLabel?: string;
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
}: CampaignFormProps) {
  const { createCampaign, isSaving } = useCampaignStore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
    defaultValues: initialValues ?? defaultFormValues,
  });

  useEffect(() => {
    reset(initialValues ?? defaultFormValues);
  }, [initialValues, reset]);

  const selectedOrganizationId = watch('organizationId');
  const selectedSmtpProfileId = watch('smtpProfileId');
  const selectedEmailTemplateId = watch('emailTemplateId');
  const selectedLandingPageTemplateId = watch('landingPageTemplateId');
  const selectedTargetGroupId = watch('targetGroupId');

  const selectedOrganization = organizations.find((organization) => organization.id === selectedOrganizationId);
  const selectedSmtpProfile = smtpProfiles.find((profile) => profile.id === selectedSmtpProfileId);
  const selectedEmailTemplate = templates.find((template) => template.id === selectedEmailTemplateId);
  const selectedLandingPageTemplate = landingPageTemplates.find(
    (template) => template.id === selectedLandingPageTemplateId,
  );
  const selectedTargetGroup = groups.find((group) => group.id === selectedTargetGroupId);

  const availableGroups = useMemo(
    () => groups.filter((group) => group.organizationId === selectedOrganizationId),
    [groups, selectedOrganizationId],
  );
  const availableSmtpProfiles = useMemo(
    () => smtpProfiles.filter((profile) => profile.organizationId === selectedOrganizationId),
    [smtpProfiles, selectedOrganizationId],
  );
  const availableTemplates = useMemo(
    () => templates.filter((template) => template.organizationId === selectedOrganizationId),
    [templates, selectedOrganizationId],
  );
  const availableLandingPages = useMemo(
    () => landingPageTemplates.filter((template) => template.organizationId === selectedOrganizationId),
    [landingPageTemplates, selectedOrganizationId],
  );

  const handleFormSubmit = async (data: CampaignFormData) => {
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

return (
  <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">

    {/* Section: Informations générales */}
    <div className="space-y-4">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40">Informations générales</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-gray-300">Nom de la campagne <span className="text-red-400">*</span></Label>
          <Input
            id="name"
            {...register('name')}
            className="bg-[#071120] border-white/10 text-white"
            placeholder="Ex: Campagne de sensibilisation Q3"
          />
          {errors.name && <p className="text-red-400 text-xs">{errors.name.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="organizationId" className="text-gray-300">Organisation <span className="text-red-400">*</span></Label>
          <Select value={watch('organizationId') || ''} onValueChange={(value) => setValue('organizationId', value ?? '')}>
            <SelectTrigger className="bg-[#071120] border-white/10 text-white">
              <SelectValue placeholder="Sélectionner une organisation">
                {selectedOrganization ? selectedOrganization.name : undefined}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-slate-200 border-gray-700">
              <SelectItem value="">Sélectionner une organisation</SelectItem>
              {organizations.map((organization) => (
                <SelectItem key={organization.id} value={organization.id}>
                  {organization.name ?? organization.id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.organizationId && <p className="text-red-400 text-xs">{errors.organizationId.message}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description" className="text-gray-300">Description</Label>
        <Textarea
          id="description"
          {...register('description')}
          className="bg-[#071120] border-white/10 text-white"
          placeholder="Décrivez les objectifs ou les détails de la campagne..."
          rows={3}
        />
      </div>
    </div>

    {/* Section: Configuration */}
    <div className="space-y-4">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40">Configuration</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="smtpProfileId" className="text-gray-300">Profil SMTP <span className="text-red-400">*</span></Label>
          <Select value={watch('smtpProfileId') || ''} onValueChange={(value) => setValue('smtpProfileId', value ?? '')}>
            <SelectTrigger className="bg-[#071120] border-white/10 text-white">
              <SelectValue placeholder="Sélectionner un profil SMTP">
                {selectedSmtpProfile?.name}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-slate-200 border-gray-700">
              <SelectItem value="">Sélectionner un profil SMTP</SelectItem>
              {availableSmtpProfiles.map((profile) => (
                <SelectItem key={profile.id} value={profile.id}>{profile.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.smtpProfileId && <p className="text-red-400 text-xs">{errors.smtpProfileId.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="emailTemplateId" className="text-gray-300">Template email <span className="text-red-400">*</span></Label>
          <Select value={watch('emailTemplateId') || ''} onValueChange={(value) => setValue('emailTemplateId', value ?? '')}>
            <SelectTrigger className="bg-[#071120] border-white/10 text-white">
              <SelectValue placeholder="Sélectionner un template">
                {selectedEmailTemplate?.name}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-slate-200 border-gray-700">
              <SelectItem value="">Sélectionner un template email</SelectItem>
              {availableTemplates.map((template) => (
                <SelectItem key={template.id} value={template.id}>{template.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.emailTemplateId && <p className="text-red-400 text-xs">{errors.emailTemplateId.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="landingPageTemplateId" className="text-gray-300">Template landing page <span className="text-red-400">*</span></Label>
          <Select value={watch('landingPageTemplateId') || ''} onValueChange={(value) => setValue('landingPageTemplateId', value ?? '')}>
            <SelectTrigger className="bg-[#071120] border-white/10 text-white">
              <SelectValue placeholder="Sélectionner un template">
                {selectedLandingPageTemplate?.name}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-slate-200 border-gray-700">
              <SelectItem value="">Sélectionner un template de landing page</SelectItem>
              {availableLandingPages.map((template) => (
                <SelectItem key={template.id} value={template.id}>{template.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.landingPageTemplateId && <p className="text-red-400 text-xs">{errors.landingPageTemplateId.message}</p>}
        </div>
      </div>
    </div>

    {/* Section: Planification */}
    <div className="space-y-4">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40">Planification</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="scheduledAt" className="text-gray-300">Date de début</Label>
          <Input
            id="scheduledAt"
            type="datetime-local"
            {...register('scheduledAt')}
            className="bg-[#071120] border-white/10 text-white"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="endAt" className="text-gray-300">Date de fin</Label>
          <Input
            id="endAt"
            type="datetime-local"
            {...register('endAt')}
            className="bg-[#071120] border-white/10 text-white"
          />
          {errors.endAt && <p className="text-red-400 text-xs">{errors.endAt.message}</p>}
        </div>
      </div>
    </div>

    {/* Section: Destinataires */}
    <div className="space-y-4">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40">Destinataires</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="targetGroupId" className="text-gray-300">Groupe de destinataires</Label>
          <Select value={watch('targetGroupId') || ''} onValueChange={(value) => setValue('targetGroupId', value ?? '')}>
            <SelectTrigger className="bg-[#071120] border-white/10 text-white">
              <SelectValue placeholder="Sélectionner un groupe">
                {selectedTargetGroup?.name}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-slate-200 border-gray-700">
              <SelectItem value="">Sélectionner un groupe</SelectItem>
              {availableGroups.map((group) => (
                <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="targetEmails" className="text-gray-300">Adresses email supplémentaires</Label>
          <Textarea
            id="targetEmails"
            {...register('targetEmails')}
            className="bg-[#071120] border-white/10 text-white"
            placeholder="Une adresse par ligne..."
            rows={3}
          />
          {errors.targetEmails && <p className="text-red-400 text-xs">{errors.targetEmails.message}</p>}
        </div>
      </div>
    </div>

    {/* Actions */}
    <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-6">
      {onCancel && (
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
      )}
      <Button type="button" variant="outline" onClick={() => reset(defaultFormValues)}>
        Réinitialiser
      </Button>
      <Button type="submit" disabled={isSaving}>
        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {submitLabel ?? 'Créer la campagne'}
      </Button>
    </div>

  </form>
);
}
