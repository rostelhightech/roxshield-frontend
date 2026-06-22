'use client';

import { useEffect, useMemo, useState } from 'react'; // ✅ Ajout de useState
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

type SmtpProfileFormData = {
  organizationId?: string;
  name: string;
  interfaceType: 'SMTP' | 'API';
  fromName: string;
  fromAddress: string;
  host: string;
  port: number;
  username: string;
  password?: string;
  ignoreCertificateErrors: boolean;
  emailHeaders?: string;
};

interface SmtpProfileFormProps {
  organizations: { id: string; name?: string | null }[];
  profile?: SmtpProfile | null;
  onCancel?: () => void;
}

export const SmtpProfileForm = ({ organizations, profile, onCancel }: SmtpProfileFormProps) => {
  const { t: tCommon } = useTranslation('common');
  const { createSmtpProfile, updateSmtpProfile, isSaving, fetchAll } = useSmtpProfileStore();

  const smtpProfileSchema = useMemo(() => z.object({
    organizationId: z.string().optional(),
    name: z.string().min(2, tCommon('admin.smtp.smtp.error_name')),
    interfaceType: z.enum(['SMTP', 'API']),
    fromName: z.string().min(2, tCommon('admin.smtp.smtp.error_from_name')),
    fromAddress: z.string().email(tCommon('admin.smtp.smtp.error_from_address_invalid')).min(1, tCommon('admin.smtp.smtp.error_from_address_required')),
    host: z.string().min(1, tCommon('admin.smtp.smtp.error_host')),
    port: z.number().min(1, tCommon('admin.smtp.smtp.error_port_required')).max(65535, tCommon('admin.smtp.smtp.error_port_invalid')),
    username: z.string().min(1, tCommon('admin.smtp.smtp.error_username')),
    password: z.string().optional(),
    ignoreCertificateErrors: z.boolean().default(false),
    emailHeaders: z.string().optional(),
  }), [tCommon]);

  // ✅ Récupération du user et vérification du rôle
  const { user } = useAuthStore();
  const isSuperAdmin = user?.role === roleEnum.SUPERADMIN;

  // ✅ State pour isDefault
  const [isDefault, setIsDefault] = useState(profile?.isDefault ?? false);

  const { register, handleSubmit, reset, setValue, watch, setError, formState: { errors } } = useForm<SmtpProfileFormData>({
    resolver: zodResolver(smtpProfileSchema) as Resolver<SmtpProfileFormData>,
    defaultValues: {
      name: '',
      interfaceType: 'SMTP',
      fromAddress: '',
      host: '',
      port: 587,
      username: '',
      password: '',
      ignoreCertificateErrors: false,
      emailHeaders: '',
      organizationId: organizations?.[0]?.id || '',
    },
  });

  const selectedOrganization = useMemo(
    () => organizations.find((org) => org.id === watch('organizationId')),
    [organizations, watch('organizationId')],
  );

  useEffect(() => {
    reset({
      name: profile?.name ?? '',
      organizationId: profile?.organizationId ?? organizations?.[0]?.id ?? '',
      interfaceType: (profile?.interfaceType ?? 'SMTP') as 'SMTP' | 'API',
      fromName: profile?.fromName ?? '',
      fromAddress: profile?.fromAddress ?? '',
      host: profile?.host ?? '',
      port: profile?.port ?? 587,
      username: profile?.username ?? '',
      password: '',
      ignoreCertificateErrors: profile?.ignoreCertificateErrors ?? false,
      emailHeaders: profile?.emailHeaders ? JSON.stringify(profile.emailHeaders, null, 2) : '',
    });
    setIsDefault(profile?.isDefault ?? false); // ✅ Reset isDefault
  }, [profile, organizations, reset]);

  const onSubmit = async (data: SmtpProfileFormData) => {
    // ✅ Validation : si pas default, organisation requise
    if (!isDefault && !data.organizationId) {
      setError('organizationId', { type: 'manual', message: tCommon('admin.smtp.smtp.error_org_required') });
      return;
    }

    let parsedHeaders: Record<string, string> | null = null;

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

    const payload: any = {
      organizationId: isDefault ? null : data.organizationId, // ✅ null pour les profils par défaut
      name: data.name,
      interfaceType: data.interfaceType,
      fromName: data.fromName,
      fromAddress: data.fromAddress,
      host: data.host,
      port: data.port,
      username: data.username,
      ignoreCertificateErrors: data.ignoreCertificateErrors,
      emailHeaders: parsedHeaders,
    };

    if (data.password?.trim()) {
      payload.password = data.password.trim();
    }

    if (profile?.id) {
      await updateSmtpProfile(profile.id, payload, isDefault); // ✅ Passage de isDefault
    } else {
      await createSmtpProfile(payload, isDefault); // ✅ Passage de isDefault
      reset({
        name: '',
        interfaceType: 'SMTP',
        fromAddress: '',
        host: '',
        port: 587,
        username: '',
        password: '',
        ignoreCertificateErrors: false,
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
          <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">{tCommon('user.profile.last_name')}</Label>
          <Input id="name" {...register('name')} className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white mt-1" />
          {errors.name && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.name.message}</p>}
        </div>

        {/* ✅ Organisation cachée si profil par défaut */}
        {!isDefault && (
          <div>
            <Label htmlFor="organizationId" className="text-gray-700 dark:text-gray-300">
              {tCommon('admin.grc.org_name')}
            </Label>
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
          <Label htmlFor="interfaceType" className="text-gray-700 dark:text-gray-300">
            Interface
          </Label>
          <Combobox
            options={[
              { value: 'SMTP', label: 'SMTP' },
              { value: 'API', label: 'API' },
            ]}
            value={watch('interfaceType')}
            onChange={(value) => setValue('interfaceType', value as 'SMTP' | 'API')}
            placeholder={tCommon('admin.smtp.smtp.type_placeholder')}
            searchPlaceholder={tCommon('admin.smtp.smtp.search_type')}
            className="mt-1 bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white w-full"
          />
        </div>

        <div>
          <Label htmlFor="fromName" className="text-gray-700 dark:text-gray-300">
            {tCommon('admin.campaigns.form_sender_name')}
          </Label>
          <Input 
            id="fromName" 
            {...register('fromName')} 
            className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white mt-1" 
          />
          {errors.fromName && (
            <p className="text-red-600 dark:text-red-400 text-sm mt-1">
              {errors.fromName.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fromAddress" className="text-gray-700 dark:text-gray-300">{tCommon('admin.smtp.smtp.from_address_label')}</Label>
          <Input id="fromAddress" {...register('fromAddress')} className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white mt-1" />
          {errors.fromAddress && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.fromAddress.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="host" className="text-gray-700 dark:text-gray-300">{tCommon('admin.smtp.smtp.smtp_host')}</Label>
          <Input id="host" {...register('host')} className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white mt-1" />
          {errors.host && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.host.message}</p>}
        </div>

        <div>
          <Label htmlFor="port" className="text-gray-700 dark:text-gray-300">Port</Label>
          <Input
            id="port"
            type="number"
            {...register('port', { valueAsNumber: true })}
            className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white mt-1"
          />
          {errors.port && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.port.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="username" className="text-gray-700 dark:text-gray-300">{tCommon('admin.smtp.smtp.username_label')}</Label>
          <Input id="username" {...register('username')} className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white mt-1" />
          {errors.username && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.username.message}</p>}
        </div>

        <div>
          <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
            {tCommon('admin.smtp.smtp.password_label')}{profile ? ` ${tCommon('admin.smtp.smtp.password_hint')}` : ''}
          </Label>
          <Input id="password" type="password" {...register('password')} className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white mt-1" />
          {errors.password && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.password.message}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input
          id="ignoreCertificateErrors"
          type="checkbox"
          {...register('ignoreCertificateErrors')}
          className="h-4 w-4 rounded border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 text-sky-400 focus:ring-sky-500"
        />
        <Label htmlFor="ignoreCertificateErrors" className="text-gray-700 dark:text-gray-300">
          {tCommon('admin.smtp.smtp.ignore_cert')}
        </Label>
      </div>

      <div>
        <Label htmlFor="emailHeaders" className="text-gray-700 dark:text-gray-300">{tCommon('admin.smtp.smtp.smtp_headers')}</Label>
        <Textarea
          id="emailHeaders"
          {...register('emailHeaders')}
          rows={5}
          className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white mt-1"
          placeholder='{"X-Mailer":"RoxShield"}'
        />
        {errors.emailHeaders && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.emailHeaders.message}</p>}
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
        {(isSuperAdmin || !profile?.isDefault) && (
          <Button type="submit" disabled={isSaving}>
            {isSaving ? tCommon('admin.templates.saving') : profile ? tCommon('admin.smtp.smtp.update') : tCommon('admin.smtp.smtp.create_profile')}
          </Button>
        )}
      </div>
    </form>
  );
};