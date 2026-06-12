'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Group, useGroupStore } from '@/store/group.store';
import { Organization } from '@/store/organization.store';

const groupSchema = z.object({
  name: z.string().min(2, 'Le nom est requis'),
  description: z.string().optional().nullable(),
  organizationId: z.string().min(1, 'L\'organisation est requise'),
});

type GroupFormData = z.infer<typeof groupSchema>;

interface GroupFormProps {
  initialData?: Group | null;
  organizations: Organization[];
  onSuccess: () => void;
  onCancel: () => void;
}

export const GroupForm = ({ initialData, organizations, onSuccess, onCancel }: GroupFormProps) => {
  const { createGroup, updateGroup, isLoading } = useGroupStore();

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
      organizationId: initialData?.organizationId || '',
    },
  });

  const watchOrganizationId = watch('organizationId');
  const selectedOrganization = organizations.find(organization => organization.id === watchOrganizationId);

  const onSubmit = async (data: GroupFormData) => {
    try {
      const payload = {
        ...data,
        description: data.description || null,
      };

      if (initialData) {
        await updateGroup(initialData.id, payload);
      } else {
        await createGroup(payload);
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
          <Label htmlFor="name" className="text-gray-300">Nom du groupe *</Label>
          <Input
            id="name"
            {...register('name')}
            className="bg-gray-800/50 border-gray-700 text-white mt-1"
            placeholder="Ex: Finance, RH, Étudiants L3..."
          />
          {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <Label htmlFor="organizationId" className="text-gray-300">Organisation *</Label>
          <Select
            value={watchOrganizationId}
            onValueChange={(value) => setValue('organizationId', value)}
          >
            <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white mt-1">
              {selectedOrganization ? (
                <span className="truncate">{selectedOrganization.name}</span>
              ) : (
                <span className="text-gray-400">Sélectionner une organisation</span>
              )}
            </SelectTrigger>
            <SelectContent className="bg-slate-200 border-gray-700">
              {organizations.map((organization) => (
                <SelectItem key={organization.id} value={organization.id}>
                  {organization.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.organizationId && <p className="text-red-400 text-sm mt-1">{errors.organizationId.message}</p>}
        </div>

        <div>
          <Label htmlFor="description" className="text-gray-300">Description</Label>
          <Textarea
            id="description"
            {...register('description')}
            className="bg-gray-800/50 border-gray-700 text-white mt-1 min-h-24"
            placeholder="Décrivez brièvement le périmètre ou l'usage de ce groupe"
          />
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
