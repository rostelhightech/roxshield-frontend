// components/organizations/OrganizationForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOrganizationStore, Organization } from '@/store/organization.store';
import { Plan } from '@/store/plan.store';
import { Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const organizationSchema = z.object({
  name: z.string().min(2, 'Le nom est requis'),
  type: z.enum(['enterprise', 'campus']),
  planId: z.string().min(1, 'Le plan est requis'),
  isActive: z.boolean().default(true).catch(true),
  sector: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  adminName: z.string().optional().nullable(),
  adminEmail: z.string().email('Email invalide').optional().nullable(),
  currentEmployees: z.number().min(0).default(0),
});

type OrganizationFormData = z.infer<typeof organizationSchema>;

interface OrganizationFormProps {
  initialData?: Organization | null;
  plans: Plan[];
  onSuccess: () => void;
  onCancel: () => void;
}

export const OrganizationForm = ({ initialData, plans, onSuccess, onCancel }: OrganizationFormProps) => {
  const { createOrganization, updateOrganization, isLoading } = useOrganizationStore();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: initialData?.name || '',
      type: initialData?.type || 'enterprise',
      planId: initialData?.planId || '',
      isActive: initialData?.isActive ?? true,
      sector: initialData?.sector || '',
      city: initialData?.city || '',
      country: initialData?.country || '',
      adminName: initialData?.adminName || '',
      adminEmail: initialData?.adminEmail || '',
      currentEmployees: initialData?.currentEmployees || 0,
    },
  });

  const watchPlanId = watch('planId');
  const watchType = watch('type');

  useEffect(() => {
    if (watchPlanId) {
      const plan = plans.find(p => p.id === watchPlanId);
      setSelectedPlan(plan || null);
    }
  }, [watchPlanId, plans]);

  const onSubmit = async (data: OrganizationFormData) => {
    try {
      if (initialData) {
        await updateOrganization(initialData.id, data);
      } else {
        await createOrganization(data);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving organization:', error);
    }
  };

  return (
 <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        {/* Nom */}
        <div>
          <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Nom de l'organisation *</Label>
          <Input
            id="name"
            {...register('name')}
            className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white mt-1"
            placeholder="Ex: Rostel High-Tech"
          />
          {errors.name && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.name.message}</p>}
        </div>

        {/* Type et Plan */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="type" className="text-gray-700 dark:text-gray-300">Type *</Label>
            <Select
              value={watchType}
              onValueChange={(value) => setValue('type', value as 'enterprise' | 'campus')}
            >
              <SelectTrigger className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white mt-1">
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <SelectItem value="enterprise">Entreprise</SelectItem>
                <SelectItem value="campus">Campus</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="planId" className="text-gray-700 dark:text-gray-300">Plan *</Label>
            <Select
              value={watchPlanId}
              onValueChange={(value) => setValue('planId', value)}
            >
              <SelectTrigger className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white mt-1">
                {selectedPlan ? (
                  <span>{selectedPlan.label} - {selectedPlan.pricePerUser.toLocaleString()} F/utilisateur</span>
                ) : (
                  <SelectValue placeholder="Sélectionner un plan" />
                )}
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                {plans.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.label} - {plan.pricePerUser.toLocaleString()} F/utilisateur
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.planId && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.planId.message}</p>}
          </div>
        </div>

        {/* Détails du plan sélectionné */}
        {selectedPlan && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-500/10 dark:to-purple-500/10 rounded-lg p-4 border border-blue-200 dark:border-blue-500/20">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Détails du plan {selectedPlan.label}</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-gray-500 dark:text-gray-400">Prix par utilisateur:</span>
              <span className="text-gray-900 dark:text-white">{selectedPlan.pricePerUser.toLocaleString()} F</span>
              <span className="text-gray-500 dark:text-gray-400">Employés:</span>
              <span className="text-gray-900 dark:text-white">
                {selectedPlan.minEmployees} - {selectedPlan.maxEmployees || '∞'}
              </span>
              <span className="text-gray-500 dark:text-gray-400">Description:</span>
              <span className="text-gray-900 dark:text-white text-sm">{selectedPlan.targetDescription}</span>
            </div>
          </div>
        )}

        {/* Localisation */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city" className="text-gray-700 dark:text-gray-300">Ville</Label>
            <Input
              id="city"
              {...register('city')}
              className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white mt-1"
              placeholder="Ex: Dakar"
            />
          </div>

          <div>
            <Label htmlFor="country" className="text-gray-700 dark:text-gray-300">Pays</Label>
            <Input
              id="country"
              {...register('country')}
              className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white mt-1"
              placeholder="Ex: Sénégal"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="sector" className="text-gray-700 dark:text-gray-300">Secteur d'activité</Label>
          <Input
            id="sector"
            {...register('sector')}
            className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white mt-1"
            placeholder="Ex: Technologie, Éducation..."
          />
        </div>

        {/* Admin */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="adminName" className="text-gray-700 dark:text-gray-300">Nom de l'admin</Label>
            <Input
              id="adminName"
              {...register('adminName')}
              className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white mt-1"
              placeholder="Nom complet"
            />
          </div>

          <div>
            <Label htmlFor="adminEmail" className="text-gray-700 dark:text-gray-300">Email de l'admin</Label>
            <Input
              id="adminEmail"
              type="email"
              {...register('adminEmail')}
              className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white mt-1"
              placeholder="admin@exemple.com"
            />
            {errors.adminEmail && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.adminEmail.message}</p>}
          </div>
        </div>

        {/* Employés et Statut */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="currentEmployees" className="text-gray-700 dark:text-gray-300">Nombre d'employés</Label>
            <Input
              id="currentEmployees"
              type="number"
              {...register('currentEmployees', { valueAsNumber: true })}
              className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white mt-1"
              min={0}
              max={selectedPlan?.maxEmployees ?? undefined}
            />
            {selectedPlan?.maxEmployees !== null && selectedPlan?.maxEmployees !== undefined && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Maximum autorisé pour ce plan : {selectedPlan.maxEmployees}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="isActive" className="text-gray-700 dark:text-gray-300">Statut</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Inactif</span>
              <Switch
                id="isActive"
                checked={watch('isActive')}
                onCheckedChange={(checked) => setValue('isActive', checked)}
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">Actif</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
        >
          Annuler
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="cursor-pointer"
        >
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {initialData ? 'Mettre à jour' : 'Créer'}
        </Button>
      </div>
    </form>
  );
};