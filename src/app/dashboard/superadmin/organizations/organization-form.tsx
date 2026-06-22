// components/organizations/OrganizationForm.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { useOrganizationStore, Organization } from '@/store/organization.store';
import { Plan } from '@/store/plan.store';
import { Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Combobox } from '@/components/ui/combobox';
import { useTranslation } from 'react-i18next';

type OrganizationFormData = {
  name: string;
  type: 'enterprise' | 'campus';
  planId: string;
  isActive: boolean;
  sector?: string | null;
  city?: string | null;
  country?: string | null;
  adminName?: string | null;
  adminEmail?: string | null;
  currentEmployees: number;
};

interface OrganizationFormProps {
  initialData?: Organization | null;
  plans: Plan[];
  onSuccess: () => void;
  onCancel: () => void;
}

export const OrganizationForm = ({ initialData, plans, onSuccess, onCancel }: OrganizationFormProps) => {
  const { t: tCommon } = useTranslation('common');
  const { createOrganization, updateOrganization, isLoading } = useOrganizationStore();

  const organizationSchema = useMemo(() => z.object({
    name: z.string().min(2, tCommon('admin.organizations.org_error_name_required')),
    type: z.enum(['enterprise', 'campus']),
    planId: z.string().min(1, tCommon('admin.organizations.org_error_plan_required')),
    isActive: z.boolean().default(true).catch(true),
    sector: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    country: z.string().optional().nullable(),
    adminName: z.string().optional().nullable(),
    adminEmail: z.string().email(tCommon('admin.organizations.org_error_email_invalid')).optional().nullable(),
    currentEmployees: z.number().min(0).default(0),
  }), [tCommon]) as unknown as z.ZodSchema<OrganizationFormData>;
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema as z.ZodType<OrganizationFormData,OrganizationFormData>),
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
          <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">{tCommon('admin.organizations.org_name_label')}</Label>
          <Input
            id="name"
            {...register('name')}
            className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white mt-1"
            placeholder={tCommon('admin.organizations.org_name_placeholder')}
          />
          {errors.name && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.name.message}</p>}
        </div>

        {/* Type et Plan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="type" className="text-gray-700 dark:text-gray-300">
              {tCommon('admin.campaigns.tracking_type')} <span className="text-red-600 dark:text-red-400">*</span>
            </Label>
            <Combobox
              options={[
                { value: 'enterprise', label: tCommon('admin.organizations.org_type_enterprise') },
                { value: 'campus', label: tCommon('admin.organizations.org_type_campus') },
              ]}
              value={watchType}
              onChange={(value) => setValue('type', value as 'enterprise' | 'campus')}
              placeholder={tCommon('admin.plans.type_placeholder')}
              searchPlaceholder={tCommon('admin.organizations.org_search_type')}
              className="mt-1 bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white w-full"
            />
          </div>

          <div>
            <Label htmlFor="planId" className="text-gray-700 dark:text-gray-300">
              {tCommon('admin.organizations.org_plan_label')}
            </Label>
            <Combobox
              options={plans.map((plan) => ({
                value: plan.id,
                label: `${plan.label} - ${plan.pricePerUser.toLocaleString()} F/utilisateur`,
              }))}
              value={watchPlanId}
              onChange={(value) => setValue('planId', value)}
              placeholder={tCommon('admin.organizations.org_plan_placeholder')}
              searchPlaceholder={tCommon('admin.organizations.org_search_plan')}
              className="mt-1 bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white w-full"
            />
            {errors.planId && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                {errors.planId.message}
              </p>
            )}
          </div>
        </div>

        {/* Détails du plan sélectionné */}
        {selectedPlan && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-500/10 dark:to-purple-500/10 rounded-lg p-4 border border-blue-200 dark:border-blue-500/20">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{tCommon('admin.organizations.org_plan_details', { label: selectedPlan.label })}</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-gray-500 dark:text-gray-400">{tCommon('admin.organizations.price_per_user')}</span>
              <span className="text-gray-900 dark:text-white break-words">{selectedPlan.pricePerUser.toLocaleString()} F</span>
              <span className="text-gray-500 dark:text-gray-400">{tCommon('admin.organizations.employees_label')}</span>
              <span className="text-gray-900 dark:text-white break-words">
                {selectedPlan.minEmployees} - {selectedPlan.maxEmployees || '∞'}
              </span>
              <span className="text-gray-500 dark:text-gray-400">{tCommon('admin.organizations.description_label')}</span>
              <span className="text-gray-900 dark:text-white text-sm break-words">{selectedPlan.targetDescription}</span>
            </div>
          </div>
        )}

        {/* Localisation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city" className="text-gray-700 dark:text-gray-300">{tCommon('admin.organizations.org_city_label')}</Label>
            <Input
              id="city"
              {...register('city')}
              className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white mt-1"
              placeholder={tCommon('admin.organizations.org_city_placeholder')}
            />
          </div>

          <div>
            <Label htmlFor="country" className="text-gray-700 dark:text-gray-300">{tCommon('admin.organizations.org_country_label')}</Label>
            <Input
              id="country"
              {...register('country')}
              className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white mt-1"
              placeholder={tCommon('admin.organizations.country_placeholder')}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="sector" className="text-gray-700 dark:text-gray-300">{tCommon('register.sector_label')}</Label>
          <Input
            id="sector"
            {...register('sector')}
            className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white mt-1"
            placeholder={tCommon('admin.organizations.industry_placeholder')}
          />
        </div>

        {/* Admin */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="adminName" className="text-gray-700 dark:text-gray-300">{tCommon('admin.organizations.org_admin_name_label')}</Label>
            <Input
              id="adminName"
              {...register('adminName')}
              className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white mt-1"
              placeholder={tCommon('admin.organizations.name_placeholder')}
            />
          </div>

          <div>
            <Label htmlFor="adminEmail" className="text-gray-700 dark:text-gray-300">{tCommon('admin.organizations.org_admin_email_label')}</Label>
            <Input
              id="adminEmail"
              type="email"
              {...register('adminEmail')}
              className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white mt-1"
              placeholder={tCommon('admin.organizations.org_admin_email_placeholder')}
            />
            {errors.adminEmail && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.adminEmail.message}</p>}
          </div>
        </div>

        {/* Employés et Statut */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="currentEmployees" className="text-gray-700 dark:text-gray-300">{tCommon('admin.organizations.org_employees_count_label')}</Label>
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
                {tCommon('admin.organizations.org_max_employees', { max: selectedPlan.maxEmployees })}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between sm:flex-col sm:items-start sm:justify-start gap-2">
            <Label htmlFor="isActive" className="text-gray-700 dark:text-gray-300">{tCommon('admin.ambassadors.status_placeholder')}</Label>
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
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer w-full sm:w-auto"
        >
          {tCommon('user.formations.cancel')}
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="cursor-pointer w-full sm:w-auto"
        >
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {initialData ? tCommon('user.profile.save') : tCommon('admin.organizations.org_create_btn')}
        </Button>
      </div>
    </form>
  );
};