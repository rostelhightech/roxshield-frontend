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
import { Switch } from '@/components/ui/switch';
import { useUserStore, User } from '@/store/user.store';
import { Organization } from '@/store/organization.store';
import { Group } from '@/store/group.store';

const userSchema = z.object({
  firstName: z.string().min(2, 'Le prénom est requis'),
  lastName: z.string().min(2, 'Le nom est requis'),
  email: z.string().email('Email invalide'),
  password: z.string().optional(),
  phone: z.string().optional().nullable(),
  position: z.string().optional().nullable(),
  role: z.enum(['user', 'admin', 'superadmin']).default('user'),
  organizationId: z.string().optional().nullable(),
  groupId: z.string().optional().nullable(),
  isActive: z.boolean().default(true).catch(true),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  initialData?: User | null;
  organizations: Organization[];
  groups: Group[];
  onSuccess: () => void;
  onCancel: () => void;
}

export const UserForm = ({ initialData, organizations, groups, onSuccess, onCancel }: UserFormProps) => {
  const { createUser, updateUser, isLoading } = useUserStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: initialData?.firstName || '',
      lastName: initialData?.lastName || '',
      email: initialData?.email || '',
      password: '',
      phone: initialData?.phone || '',
      position: initialData?.position || '',
      role: initialData?.role || 'user',
      organizationId: initialData?.organizationId || '',
      groupId: initialData?.groupId || '',
      isActive: initialData?.isActive ?? true,
    },
  });

  const watchRole = watch('role');
  const watchOrganizationId = watch('organizationId');
  const watchGroupId = watch('groupId');

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
      if (!initialData && !data.password) {
        setError('password', { message: 'Le mot de passe est requis' });
        return;
      }

      if (data.password && data.password.length < 6) {
        setError('password', { message: 'Le mot de passe doit contenir au moins 6 caractères' });
        return;
      }

      const payload = {
        ...data,
        phone: data.phone || null,
        position: data.position || null,
        organizationId: data.organizationId || null,
        groupId: data.groupId || null,
      };

      if (!payload.password) {
        delete payload.password;
      }

      if (initialData) {
        await updateUser(initialData.id, payload);
      } else {
        await createUser(payload as typeof payload & { password: string });
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName" className="text-gray-300">Prénom *</Label>
            <Input
              id="firstName"
              {...register('firstName')}
              className="bg-gray-800/50 border-gray-700 text-white mt-1"
              placeholder="Ex: Awa"
            />
            {errors.firstName && <p className="text-red-400 text-sm mt-1">{errors.firstName.message}</p>}
          </div>

          <div>
            <Label htmlFor="lastName" className="text-gray-300">Nom *</Label>
            <Input
              id="lastName"
              {...register('lastName')}
              className="bg-gray-800/50 border-gray-700 text-white mt-1"
              placeholder="Ex: Diop"
            />
            {errors.lastName && <p className="text-red-400 text-sm mt-1">{errors.lastName.message}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="position" className="text-gray-300">Position</Label>
          <Input
            id="position"
            {...register('position')}
            className="bg-gray-800/50 border-gray-700 text-white mt-1"
            placeholder="Ex: Comptable, RH, Étudiant, RSSI..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email" className="text-gray-300">Email *</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              className="bg-gray-800/50 border-gray-700 text-white mt-1"
              placeholder="user@entreprise.com"
            />
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <Label htmlFor="phone" className="text-gray-300">Téléphone</Label>
            <Input
              id="phone"
              {...register('phone')}
              className="bg-gray-800/50 border-gray-700 text-white mt-1"
              placeholder="+221 77 000 00 00"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="password" className="text-gray-300">
              {initialData ? 'Nouveau mot de passe' : 'Mot de passe *'}
            </Label>
            <Input
              id="password"
              type="password"
              {...register('password')}
              className="bg-gray-800/50 border-gray-700 text-white mt-1"
              placeholder={initialData ? 'Laisser vide pour conserver' : 'Mot de passe temporaire'}
            />
            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <Label htmlFor="role" className="text-gray-300">Rôle *</Label>
            <Select value={watchRole} onValueChange={(value) => setValue('role', value as User['role'])}>
              <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white mt-1">
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
              <SelectContent className="bg-slate-200 border-gray-700">
                <SelectItem value="user">Utilisateur</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="superadmin">Superadmin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="organizationId" className="text-gray-300">Organisation</Label>
            <Select
              value={watchOrganizationId || ''}
              onValueChange={(value) => setValue('organizationId', value)}
            >
              <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white mt-1">
                {selectedOrganization ? (
                  <span className="truncate">{selectedOrganization.name}</span>
                ) : (
                  <span className="text-gray-400">Aucune organisation</span>
                )}
              </SelectTrigger>
              <SelectContent className="bg-slate-200 border-gray-700">
                <SelectItem value="">Aucune organisation</SelectItem>
                {organizations.map((organization) => (
                  <SelectItem key={organization.id} value={organization.id}>
                    {organization.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="groupId" className="text-gray-300">Groupe</Label>
            <Select
              value={watchGroupId || ''}
              onValueChange={(value) => setValue('groupId', value)}
            >
              <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white mt-1">
                {selectedGroup ? (
                  <span className="truncate">{selectedGroup.name}</span>
                ) : (
                  <span className="text-gray-400">Aucun groupe</span>
                )}
              </SelectTrigger>
              <SelectContent className="bg-slate-200 border-gray-700">
                <SelectItem value="">Aucun groupe</SelectItem>
                {availableGroups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900/30 p-4">
          <div>
            <Label htmlFor="isActive" className="text-gray-300">Statut du compte</Label>
            <p className="text-xs text-gray-500 mt-1">Un compte inactif ne peut pas se connecter.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Inactif</span>
            <Switch
              id="isActive"
              checked={watch('isActive')}
              onCheckedChange={(checked) => setValue('isActive', checked)}
            />
            <span className="text-sm text-gray-400">Actif</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-gray-700 text-gray-500 hover:text-gray-600 cursor-pointer"
        >
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading} className="cursor-pointer">
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {initialData ? 'Mettre à jour' : 'Créer'}
        </Button>
      </div>
    </form>
  );
};
