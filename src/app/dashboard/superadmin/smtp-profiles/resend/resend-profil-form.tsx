// components/smtp/ResendProfileForm.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useSmtpProfileStore, SmtpProfile } from '@/store/smtp-profile.store';
import { Combobox } from '@/components/ui/combobox';
import { Checkbox } from '@/components/ui/checkbox'; // ✅ Import du Checkbox
import { roleEnum } from '@/constants/roleEnum';
import { useAuthStore } from '@/store/auth.store';
import { useTranslation } from 'react-i18next';

type ResendProfileFormData = {
  organizationId?: string;
  name: string;
  fromName: string;
  fromAddress: string;
  resendApiKey?: string;
  emailHeaders?: string;
};

interface ResendProfileFormProps {
  organizations: { id: string; name?: string | null }[];
  profile?: SmtpProfile | null;
  onCancel?: () => void;
}

export const ResendProfileForm = ({ organizations, profile, onCancel }: ResendProfileFormProps) => {
  const { t: tCommon } = useTranslation('common');
  const { createSmtpProfile, updateSmtpProfile, isSaving } = useSmtpProfileStore();

  const resendProfileSchema = useMemo(() => z.object({
    organizationId: z.string().optional(),
    name: z.string().min(2, tCommon('admin.smtp.smtp.error_name')),
    fromName: z.string().min(2, tCommon('admin.smtp.smtp.error_from_name')),
    fromAddress: z.string().email(tCommon('admin.smtp.smtp.error_from_address_invalid')).min(1, tCommon('admin.smtp.smtp.error_from_address_required')),
    resendApiKey: z.string().optional(),
    emailHeaders: z.string().optional(),
  }), [tCommon]);
  
  // ✅ Récupération du user et vérification du rôle
  const { user } = useAuthStore();
  const isSuperAdmin = user?.role === roleEnum.SUPERADMIN;

  // ✅ State pour isDefault
  const [isDefault, setIsDefault] = useState(profile?.isDefault ?? false);

  const { register, handleSubmit, reset, setValue, watch, setError, formState: { errors } } = useForm<ResendProfileFormData>({
    resolver: zodResolver(resendProfileSchema) as Resolver<ResendProfileFormData>,
    defaultValues: {
      name: '',
      fromAddress: '',
      resendApiKey: '',
      emailHeaders: '',
      organizationId: organizations?.[0]?.id || '',
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name ?? '',
        organizationId: profile.organizationId ?? organizations?.[0]?.id ?? '',
        fromName: profile.fromName ?? '',
        fromAddress: profile.fromAddress ?? '',
        resendApiKey: '',
        emailHeaders: profile.emailHeaders ? JSON.stringify(profile.emailHeaders, null, 2) : '',
      });
      setIsDefault(profile.isDefault ?? false); // ✅ Reset isDefault
    } else {
      reset({
        name: '',
        organizationId: organizations?.[0]?.id || '',
        fromName: '',
        fromAddress: '',
        resendApiKey: '',
        emailHeaders: '',
      });
      setIsDefault(false); // ✅ Reset isDefault pour un nouveau profil
    }
  }, [profile, organizations, reset]);

  const onSubmit = async (data: ResendProfileFormData) => {
    // ✅ Validation : si pas default, organisation requise
    if (!isDefault && !data.organizationId) {
      setError('organizationId', { type: 'manual', message: tCommon('admin.smtp.smtp.error_org_required') });
      return;
    }

    let parsedHeaders: Record<string, string> | null = null;

    // ✅ La clé API est requise uniquement pour la création et quand ce n'est pas un profil par défaut
    if (!profile && !data.resendApiKey?.trim()) {
      setError('resendApiKey', { type: 'manual', message: tCommon('admin.smtp.resend.error_api_key_required') });
      return;
    }

    if (data.emailHeaders?.trim()) {
      try {
        const parsed = JSON.parse(data.emailHeaders);
        if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') {
          throw new Error('Structure des en-têtes invalide');
        }
        parsedHeaders = parsed as Record<string, string>;
      } catch {
        setError('emailHeaders', { type: 'manual', message: tCommon('admin.smtp.smtp.error_headers_invalid') });
        return;
      }
    }

    const payload = {
      organizationId: isDefault ? null : data.organizationId, // ✅ null pour les profils par défaut
      name: data.name,
      provider: 'resend' as const,
      fromName: data.fromName,
      fromAddress: data.fromAddress,
      resendApiKey: data?.resendApiKey?.trim(),
      emailHeaders: parsedHeaders,
    };

    if (profile?.id) {
      // Si c'est une mise à jour, on envoie seulement les champs modifiés
      const updatePayload: any = {
        organizationId: isDefault ? null : data.organizationId,
        name: data.name,
        fromName: data.fromName,
        fromAddress: data.fromAddress,
        emailHeaders: parsedHeaders,
      };
      
      if (data?.resendApiKey?.trim()) {
        updatePayload.resendApiKey = data.resendApiKey.trim();
      }

      await updateSmtpProfile(profile.id, updatePayload, isDefault); // ✅ Passage de isDefault
    } else {
      await createSmtpProfile(payload, isDefault); // ✅ Passage de isDefault
      reset({
        name: '',
        fromAddress: '',
        resendApiKey: '',
        emailHeaders: '',
        organizationId: organizations?.[0]?.id || '',
      });
      setIsDefault(false); // ✅ Reset après création
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* ✅ Checkbox pour profil par défaut (visible uniquement pour SUPERADMIN) */}
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
            {tCommon('admin.smtp.resend.default_profile')}
          </Label>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">{tCommon('admin.smtp.resend.profile_name')}</Label>
          <Input 
            id="name" 
            {...register('name')} 
            className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white mt-1" 
          />
          {errors.name && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.name.message}</p>}
        </div>

        {/* ✅ Organisation cachée si profil par défaut */}
        {!isDefault && (
          <div>
            <Label htmlFor="organizationId" className="text-gray-700 dark:text-gray-300">{tCommon('admin.grc.org_name')}</Label>
            <Combobox
              options={organizations.map((org) => ({
                value: org.id,
                label: org.name || org.id,
              }))}
              value={watch('organizationId') || ''}
              onChange={(value) => value && setValue('organizationId', value)}
              placeholder={tCommon('admin.landing_templates.org_placeholder')}
              searchPlaceholder={tCommon('admin.formations.create_search_org')}
              className="mt-1 bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white w-full"
            />
            {errors.organizationId && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                {errors.organizationId.message}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fromName" className="text-gray-700 dark:text-gray-300">{tCommon('admin.campaigns.form_sender_name')}</Label>
          <Input 
            id="fromName" 
            {...register('fromName')} 
            className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white mt-1" 
          />
          {errors.fromName && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.fromName.message}</p>}
        </div>

        <div>
          <Label htmlFor="fromAddress" className="text-gray-700 dark:text-gray-300">{tCommon('admin.smtp.smtp.from_address_label')}</Label>
          <Input 
            id="fromAddress" 
            {...register('fromAddress')} 
            className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white mt-1" 
          />
          {errors.fromAddress && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.fromAddress.message}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="resendApiKey" className="text-gray-700 dark:text-gray-300">
          {tCommon('admin.smtp.resend.api_key_label')}{profile ? ` ${tCommon('admin.smtp.smtp.password_hint')}` : ''}
        </Label>
        <Input
          id="resendApiKey"
          type="password"
          {...register('resendApiKey')}
          placeholder="re_xxxxxxxxxxxxxxxxxxxxxxxx"
          className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white mt-1"
        />
        {errors.resendApiKey && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.resendApiKey.message}</p>}
        {!profile && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {tCommon('admin.smtp.resend.api_key_secure')}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="emailHeaders" className="text-gray-700 dark:text-gray-300">{tCommon('admin.smtp.resend.custom_headers')}</Label>
        <Textarea
          id="emailHeaders"
          {...register('emailHeaders')}
          rows={3}
          className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white mt-1"
          placeholder='{"X-Mailer":"RoxShield"}'
        />
        {errors.emailHeaders && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.emailHeaders.message}</p>}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Format JSON valide. Exemple: {"{"}"X-Mailer":"RoxShield"{"}"}
        </p>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-white/10">
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
        {(isSuperAdmin || !profile?.isDefault) && (
          <Button type="submit" disabled={isSaving}>
            {isSaving ? tCommon('admin.templates.saving') : profile ? tCommon('admin.smtp.smtp.update') : tCommon('admin.smtp.resend.create_profile')}
          </Button>
        )}
      </div>
    </form>
  );
};