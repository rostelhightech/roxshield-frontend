'use client';

import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Group, useGroupStore } from '@/store/group.store';
import { Organization } from '@/store/organization.store';
import { useAuthStore } from '@/store/auth.store';
import { roleEnum } from '@/constants/roleEnum';
import { Combobox } from '@/components/ui/combobox';
import { useTranslation } from 'react-i18next';

type GroupFormData = {
  name: string;
  description?: string | null;
  organizationId?: string | null;
};

interface GroupFormProps {
  initialData?: Group | null;
  organizations: Organization[];
  onSuccess: () => void;
  onCancel: () => void;
}

export const GroupForm = ({ initialData, organizations, onSuccess, onCancel }: GroupFormProps) => {
  const { t: tCommon } = useTranslation('common');
  const { createGroup, updateGroup, isLoading } = useGroupStore();
  const { user: currentUser } = useAuthStore();

  const isNotSuperAdmin = currentUser?.role !== roleEnum.SUPERADMIN;

  // Schéma de validation dynamique
  const groupSchema = useMemo(() => {
    return z.object({
      name: z.string().min(2, 'Le nom est requis'),
      description: z.string().optional().nullable(),
      organizationId: isNotSuperAdmin
        ? z.string().optional()
        : z.string().min(1, "L'organisation est requise"),
    });
  }, [isNotSuperAdmin]);

  type GroupFormData = z.infer<typeof groupSchema>;

  // Déterminer l'organisation par défaut
  const defaultOrganizationId = useMemo(() => {
    if (initialData?.organizationId) return initialData.organizationId;
    if (isNotSuperAdmin && currentUser?.organizationId) return currentUser.organizationId;
    return '';
  }, [initialData, isNotSuperAdmin, currentUser]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<GroupFormData>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      organizationId: defaultOrganizationId,
    },
  });

  const watchOrganizationId = watch('organizationId');
  const selectedOrganization = organizations.find(organization => organization.id === watchOrganizationId);

  // Si non superadmin, forcer l'organisation de l'utilisateur
  useEffect(() => {
    if (isNotSuperAdmin && currentUser?.organizationId) {
      setValue('organizationId', currentUser.organizationId);
    }
  }, [isNotSuperAdmin, currentUser, setValue]);

  const onSubmit = async (data: GroupFormData) => {
    try {
      const finalOrgId = isNotSuperAdmin && currentUser?.organizationId
        ? currentUser.organizationId
        : data.organizationId ?? null;

      const payload = {
        name: data.name,
        description: data.description || null,
        organizationId: finalOrgId,
      };

      if (initialData) {
        await updateGroup(initialData.id, payload);
      } else {
        await createGroup(payload as any);
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving group:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">{tCommon('admin.groups.group_name')}</Label>
          <Input
            id="name"
            {...register('name')}
            className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white mt-1"
            placeholder={tCommon('admin.groups.name_placeholder')}
          />
          {errors.name && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.name.message}</p>}
        </div>

        {/* Champ Organisation : masqué si non superadmin */}
        {!isNotSuperAdmin && (
       <div>
  <Label htmlFor="organizationId" className="text-gray-700 dark:text-gray-300">
    {tCommon('admin.grc.org_name')} <span className="text-red-600 dark:text-red-400">*</span>
  </Label>
  <Combobox
    options={organizations.map((org) => ({
      value: org.id,
      label: org.name,
    }))}
    value={watchOrganizationId || ''}
    onChange={(value) => setValue('organizationId', value)}
    placeholder={tCommon('admin.campaigns.form_org_placeholder')}
    searchPlaceholder="Rechercher une organisation..."
    className="mt-1 bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white w-full"
  />
  {errors.organizationId && (
    <p className="text-red-600 dark:text-red-400 text-sm mt-1">
      {errors.organizationId.message}
    </p>
  )}
</div>
        )}

        <div>
          <Label htmlFor="description" className="text-gray-700 dark:text-gray-300">{tCommon('admin.campaigns.form_description')}</Label>
          <Textarea
            id="description"
            {...register('description')}
            className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white mt-1 min-h-24"
            placeholder={tCommon('admin.groups.desc_placeholder')}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
        >
          {tCommon('user.formations.cancel')}
        </Button>
        <Button type="submit" disabled={isLoading} className="cursor-pointer">
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {initialData ? 'Mettre à jour' : 'Créer'}
        </Button>
      </div>
    </form>
  );
};