'use client';

import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useUserStore, User } from '@/store/user.store';
import { Organization } from '@/store/organization.store';
import { Group } from '@/store/group.store';
import { useAuthStore } from '@/store/auth.store';
import { roleEnum } from '@/constants/roleEnum';
import { Combobox } from '@/components/ui/combobox';
import { useTranslation } from 'react-i18next';

type UserFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phone?: string | null;
  position?: string | null;
  role: 'user' | 'admin' | 'superadmin';
  organizationId?: string | null;
  groupId?: string | null;
  isActive: boolean;
  sendCredentials: boolean;
};

interface UserFormProps {
  initialData?: User | null;
  organizations: Organization[];
  groups: Group[];
  onSuccess: () => void;
  onCancel: () => void;
}

export const UserForm = ({ initialData, organizations, groups, onSuccess, onCancel }: UserFormProps) => {
  const { t: tCommon } = useTranslation('common');
  const { createUser, updateUser, isLoading } = useUserStore();
  const { user: currentUser } = useAuthStore();

  const userSchema = useMemo(() => z.object({
    firstName: z.string().min(2, tCommon('admin.users.user_error_firstname_required')),
    lastName: z.string().min(2, tCommon('admin.users.user_error_lastname_required')),
    email: z.string().email(tCommon('admin.organizations.org_error_email_invalid')),
    password: z.string().optional(),
    phone: z.string().optional().nullable(),
    position: z.string().optional().nullable(),
    role: z.enum(['user', 'admin', 'superadmin']).default('user'),
    organizationId: z.string().optional().nullable(),
    groupId: z.string().optional().nullable(),
    isActive: z.boolean().default(true).catch(true),
    sendCredentials: z.boolean().default(true),
  }), [tCommon]);

  const isNotSuperAdmin = currentUser?.role !== roleEnum.SUPERADMIN;

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
    setError,
    formState: { errors },
  } = useForm<UserFormData>({
     //@ts-expect-error ts(2769) @typescript-eslint
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: initialData?.firstName || '',
      lastName: initialData?.lastName || '',
      email: initialData?.email || '',
      password: '',
      phone: initialData?.phone || '',
      position: initialData?.position || '',
      role: initialData?.role || 'user',
      organizationId: defaultOrganizationId,
      groupId: initialData?.groupId || '',
      isActive: initialData?.isActive ?? true,
      sendCredentials: true, 
    },
  });

  const watchRole = watch('role');
  const watchOrganizationId = watch('organizationId');
  const watchGroupId = watch('groupId');
  const watchSendCredentials = watch('sendCredentials');

  // Si non superadmin, on s'assure que organizationId ne peut pas être modifié
  useEffect(() => {
    if (isNotSuperAdmin && currentUser?.organizationId) {
      setValue('organizationId', currentUser.organizationId);
    }
  }, [isNotSuperAdmin, currentUser, setValue]);

  // Si non superadmin, on empêche la sélection du rôle superadmin
  useEffect(() => {
    if (isNotSuperAdmin && watchRole === 'superadmin') {
      setValue('role', 'user');
    }
  }, [isNotSuperAdmin, watchRole, setValue]);

  const availableGroups = useMemo(() => {
    if (!watchOrganizationId) return groups;
    return groups.filter(group => group.organizationId === watchOrganizationId);
  }, [groups, watchOrganizationId]);

  const selectedOrganization = organizations.find(organization => organization.id === watchOrganizationId);
  const selectedGroup = availableGroups.find(group => group.id === watchGroupId);

  useEffect(() => {
    if (!watchGroupId) return;
    const selectedGroup = groups.find(group => group.id === watchGroupId);
    if (selectedGroup && watchOrganizationId && selectedGroup.organizationId !== watchOrganizationId) {
      setValue('groupId', '');
    }
  }, [groups, setValue, watchGroupId, watchOrganizationId]);

  const onSubmit = async (data: UserFormData) => {
    try {
      // Validation du mot de passe pour la création
      if (!initialData && !data.password) {
        setError('password', { message: tCommon('admin.users.user_error_password_required') });
        return;
      }

      if (data.password && data.password.length < 6) {
        setError('password', { message: tCommon('admin.users.user_error_password_length') });
        return;
      }

      const payload = {
        ...data,
        phone: data.phone || null,
        position: data.position || null,
        organizationId: isNotSuperAdmin ? currentUser?.organizationId || null : (data.organizationId || null),
        groupId: data.groupId || null,
        sendCredentials: data.sendCredentials,
      };

      // Si non superadmin, on force le rôle à ne pas être superadmin
      if (isNotSuperAdmin && payload.role === 'superadmin') {
        payload.role = 'user';
      }

      // Supprimer le mot de passe s'il est vide
      if (!payload.password) {
        delete payload.password;
      }

      if (initialData) {
        // En édition, on peut aussi envoyer sendCredentials pour renvoyer un nouveau mot de passe
        await updateUser(initialData.id, payload);
      } else {
        // Création : le mot de passe est obligatoire et on peut envoyer les identifiants
        await createUser(payload as typeof payload & { password: string });
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const roleOptions = useMemo(() => {
    if (isNotSuperAdmin) {
      return [
        { value: 'user', label: tCommon('admin.grc.user_name')},
        { value: 'admin', label: 'Admin' },
      ];
    }
    return [
      { value: 'user', label: tCommon('admin.grc.user_name') },
      { value: 'admin', label: 'Admin' },
      { value: 'superadmin', label: 'Superadmin' },
    ];
  }, [isNotSuperAdmin]);

  return (
    //@ts-expect-error ts(2769) @typescript-eslint
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        {/* Prénom / Nom */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName" className="text-gray-700 dark:text-gray-300">{tCommon('admin.ambassadors.first_name')}</Label>
            <Input
              id="firstName"
              {...register('firstName')}
              className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white mt-1"
              placeholder={tCommon('admin.users.user_firstname_placeholder')}
            />
            {errors.firstName && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.firstName.message}</p>}
          </div>

          <div>
            <Label htmlFor="lastName" className="text-gray-700 dark:text-gray-300">{tCommon('admin.ambassadors.last_name')}</Label>
            <Input
              id="lastName"
              {...register('lastName')}
              className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white mt-1"
              placeholder={tCommon('admin.users.user_lastname_placeholder')}
            />
            {errors.lastName && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.lastName.message}</p>}
          </div>
        </div>

        {/* Position */}
        <div>
          <Label htmlFor="position" className="text-gray-700 dark:text-gray-300">{tCommon('admin.users.user_position_label')}</Label>
          <Input
            id="position"
            {...register('position')}
            className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white mt-1"
            placeholder={tCommon('admin.users.position_placeholder')}
          />
        </div>

        {/* Email / Téléphone */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">{tCommon('admin.users.email')}</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white mt-1"
              placeholder={tCommon('admin.users.user_email_placeholder')}
            />
            {errors.email && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">{tCommon('admin.ambassadors.table_phone')}</Label>
            <Input
              id="phone"
              {...register('phone')}
              className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white mt-1"
              placeholder={tCommon('register.phone_placeholder')}
            />
          </div>
        </div>

      {/* Mot de passe / Rôle */}
<div className="grid grid-cols-2 gap-4">
  <div>
    <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
      {initialData ? tCommon('reset_password.new_password') : tCommon('admin.users.user_password_label')}
    </Label>
    <Input
      id="password"
      type="password"
      {...register('password')}
      className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white mt-1"
      placeholder={initialData ? tCommon('admin.users.user_password_keep') : tCommon('admin.users.user_password_temp')}
    />
    {errors.password && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.password.message}</p>}
  </div>

  <div>
    <Label htmlFor="role" className="text-gray-700 dark:text-gray-300">{tCommon('admin.users.user_role_label')}</Label>
    <Combobox
      options={roleOptions.map((option) => ({
        value: option.value,
        label: option.label,
      }))}
      value={watchRole}
      onChange={(value) => setValue('role', value as User['role'])}
      placeholder={tCommon('admin.users.role_placeholder')}
      searchPlaceholder={tCommon('admin.users.user_search_role')}
      className="mt-1 bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white w-full"
    />
  </div>
</div>

{/* Organisation et Groupe (visible uniquement si superadmin) */}
{!isNotSuperAdmin && (
  <div className="grid grid-cols-2 gap-4">
    <div>
      <Label htmlFor="organizationId" className="text-gray-700 dark:text-gray-300">{tCommon('admin.grc.org_name')}</Label>
      <Combobox
        options={[
          { value: '', label: tCommon('admin.users.org_placeholder') },
          ...organizations.map((org) => ({
            value: org.id,
            label: org.name,
          })),
        ]}
        value={watchOrganizationId || ''}
        onChange={(value) => setValue('organizationId', value)}
        placeholder={tCommon('admin.users.org_placeholder')}
        searchPlaceholder={tCommon('admin.formations.create_search_org')}
        className="mt-1 bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white w-full"
      />
    </div>

    <div>
      <Label htmlFor="groupId" className="text-gray-700 dark:text-gray-300">{tCommon('admin.groups.table_group')}</Label>
      <Combobox
        options={[
          { value: '', label: tCommon('admin.users.group_placeholder') },
          ...availableGroups.map((group) => ({
            value: group.id,
            label: group.name,
          })),
        ]}
        value={watchGroupId || ''}
        onChange={(value) => setValue('groupId', value)}
        placeholder={tCommon('admin.users.group_placeholder')}
        searchPlaceholder={tCommon('admin.users.user_search_group')}
        className="mt-1 bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white w-full"
      />
    </div>
  </div>
)}

{/* Si non superadmin, uniquement le groupe */}
{isNotSuperAdmin && (
  <div className="grid grid-cols-1 gap-4">
    <div>
      <Label htmlFor="groupId" className="text-gray-700 dark:text-gray-300">{tCommon('admin.groups.table_group')}</Label>
      <Combobox
        options={[
          { value: '', label: tCommon('admin.users.group_placeholder') },
          ...availableGroups.map((group) => ({
            value: group.id,
            label: group.name,
          })),
        ]}
        value={watchGroupId || ''}
        onChange={(value) => setValue('groupId', value)}
        placeholder={tCommon('admin.users.group_placeholder')}
        searchPlaceholder={tCommon('admin.users.user_search_group')}
        className="mt-1 bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white w-full"
      />
    </div>
  </div>
)}

        {/* Statut du compte + Envoi des identifiants */}
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/30 p-4">
            <div>
              <Label htmlFor="isActive" className="text-gray-700 dark:text-gray-300">{tCommon('admin.users.account_status')}</Label>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{tCommon('admin.users.account_status_desc')}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">{tCommon('common.inactive')}</span>
              <Switch
                id="isActive"
                checked={watch('isActive')}
                onCheckedChange={(checked) => setValue('isActive', checked)}
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">{tCommon('common.active')}</span>
            </div>
          </div>

          {/* 👇 Nouveau switch pour l'envoi des identifiants */}
          <div className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/30 p-4">
            <div>
              <Label htmlFor="sendCredentials" className="text-gray-700 dark:text-gray-300">{tCommon('admin.users.send_credentials')}</Label>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {tCommon('admin.users.user_credentials_desc')}
                {initialData && ` ${tCommon('admin.users.user_credentials_edit')}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">{tCommon('admin.plans.no')}</span>
              <Switch
                id="sendCredentials"
                checked={watchSendCredentials}
                onCheckedChange={(checked) => setValue('sendCredentials', checked)}
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">{tCommon('admin.plans.yes')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Boutons */}
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
          {initialData ? tCommon('user.profile.save') : tCommon('admin.organizations.org_create_btn')}
        </Button>
      </div>
    </form>
  );
};