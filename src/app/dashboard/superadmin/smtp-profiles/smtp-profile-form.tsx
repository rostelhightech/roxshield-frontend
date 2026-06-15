'use client';

import { useEffect, useMemo } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useSmtpProfileStore, SmtpProfile } from '@/store/smtp-profile.store';

const smtpProfileSchema = z.object({
  organizationId: z.string().min(1, 'L’organisation est requise'),
  name: z.string().min(2, 'Le nom est requis'),
  interfaceType: z.enum(['SMTP', 'API']),
  fromName: z.string().min(2, 'Le nom de l’expéditeur est requis'),
  fromAddress: z.string().email('L’adresse de l’expéditeur est invalide').min(1, 'L’adresse de l’expéditeur est requise'),
  host: z.string().min(1, 'Le serveur SMTP est requis'),
  port: z.number().min(1, 'Le port est requis').max(65535, 'Port invalide'),
  username: z.string().min(1, 'Le nom d’utilisateur est requis'),
  password: z.string().optional(),
  ignoreCertificateErrors: z.boolean().default(false),
  emailHeaders: z.string().optional(),
});

type SmtpProfileFormData = z.infer<typeof smtpProfileSchema>;

interface SmtpProfileFormProps {
  organizations: { id: string; name?: string | null }[];
  profile?: SmtpProfile | null;
  onCancel?: () => void;
}

export const SmtpProfileForm = ({ organizations, profile, onCancel }: SmtpProfileFormProps) => {
  const { createSmtpProfile, updateSmtpProfile, isSaving } = useSmtpProfileStore();

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
  }, [profile, organizations, reset]);

  const onSubmit = async (data: SmtpProfileFormData) => {
    let parsedHeaders: Record<string, string> | null = null;

    if (data.emailHeaders?.trim()) {
      try {
        const parsed = JSON.parse(data.emailHeaders);
        if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') {
          throw new Error('Structure des en-têtes invalide');
        }
        parsedHeaders = parsed as Record<string, string>;
      } catch {
        setError('emailHeaders', { type: 'manual', message: 'JSON invalide pour les en-têtes' });
        return;
      }
    }

    const payload: any = {
      organizationId: data.organizationId,
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
      await updateSmtpProfile(profile.id, payload);
    } else {
      await createSmtpProfile(payload);
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
    }
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
            onValueChange={(value) => value && setValue('organizationId', value)}
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
          <Label htmlFor="interfaceType" className="text-gray-700 dark:text-gray-300">Interface</Label>
          <Select
            value={watch('interfaceType')}
            onValueChange={(value) => setValue('interfaceType', value as 'SMTP' | 'API')}
          >
            <SelectTrigger className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white mt-1">
              <SelectValue placeholder="Sélectionnez le type" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <SelectItem value="SMTP">SMTP</SelectItem>
              <SelectItem value="API">API</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="fromName" className="text-gray-700 dark:text-gray-300">Nom de l'expéditeur</Label>
          <Input id="fromName" {...register('fromName')} className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white mt-1" />
          {errors.fromName && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.fromName.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fromAddress" className="text-gray-700 dark:text-gray-300">Adresse de l'expéditeur</Label>
          <Input id="fromAddress" {...register('fromAddress')} className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white mt-1" />
          {errors.fromAddress && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.fromAddress.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="host" className="text-gray-700 dark:text-gray-300">Hôte SMTP</Label>
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
          <Label htmlFor="username" className="text-gray-700 dark:text-gray-300">Nom d'utilisateur</Label>
          <Input id="username" {...register('username')} className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white mt-1" />
          {errors.username && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.username.message}</p>}
        </div>

        <div>
          <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">Mot de passe{profile ? ' (laisser vide pour ne pas modifier)' : ''}</Label>
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
          Ignorer les erreurs de certificat
        </Label>
      </div>

      <div>
        <Label htmlFor="emailHeaders" className="text-gray-700 dark:text-gray-300">En-têtes SMTP (JSON)</Label>
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
          Annuler
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Enregistrement...' : profile ? 'Mettre à jour' : 'Créer le profil SMTP'}
        </Button>
      </div>
    </form>
  );
};