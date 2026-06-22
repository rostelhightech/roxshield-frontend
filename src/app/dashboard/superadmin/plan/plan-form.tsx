// components/plans/PlanForm.tsx
'use client';

import { useMemo, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { usePlanStore, Plan } from '@/store/plan.store';
import { Loader2, Plus, X } from 'lucide-react';
import { Combobox } from '@/components/ui/combobox';
import { useTranslation } from 'react-i18next';

 

interface PlanFormProps {
  initialData?: Plan | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const PlanForm = ({ initialData, onSuccess, onCancel }: PlanFormProps) => {
  const { t: tCommon } = useTranslation('common');
  const { createPlan, updatePlan, isLoading } = usePlanStore();
  const [newFeature, setNewFeature] = useState('');

  const planSchema = useMemo(() => z.object({
    name: z.enum(['starter', 'business', 'enterprise']),
    label: z.string().min(2, tCommon('admin.plans.error_label')),
    pricePerUser: z.number().min(0, tCommon('admin.plans.error_price')),
    targetDescription: z.string().min(10, tCommon('admin.plans.error_description')),
    minEmployees: z.number().min(0, tCommon('admin.plans.error_min_employees')),
    maxEmployees: z.number().nullable(),
    features: z.array(z.string()).min(1, tCommon('admin.plans.error_features')),
    isPopular: z.boolean().default(false).catch(false),
  }), [tCommon]) as unknown as z.ZodSchema<Plan>;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<Plan>({
    resolver: zodResolver(planSchema as z.ZodType<Plan, Plan>),
    defaultValues: {
      name: initialData?.name || 'starter',
      label: initialData?.label || '',
      pricePerUser: initialData?.pricePerUser || 0,
      targetDescription: initialData?.targetDescription || '',
      minEmployees: initialData?.minEmployees || 0,
      maxEmployees: initialData?.maxEmployees || null,
      features: initialData?.features || [''],
      isPopular: initialData?.isPopular || false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    //@ts-expect-error 
    name: 'features'
  });

  const watchMinEmployees = watch('minEmployees');
  const watchMaxEmployees = watch('maxEmployees');


  const addFeature = () => {
    if (newFeature.trim()) {
      append(newFeature.trim());
      setNewFeature('');
    }
  };

  const onSubmit = async (data: Plan) => {
    try {
      if (initialData) {
        await updatePlan(initialData.id, data);
      } else {
        await createPlan(data);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving plan:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        {/* Type de plan et Label */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">{tCommon('admin.plans.plan_type')}</Label>
           <Combobox
  options={[
    { value: 'starter', label: 'Starter' },
    { value: 'business', label: 'Business' },
    { value: 'enterprise', label: 'Enterprise' },
  ]}
  value={watch('name')}
  onChange={(value) => setValue('name', value as any)}
  placeholder={tCommon('admin.plans.type_placeholder')}
  searchPlaceholder={tCommon('admin.templates.search_criteria')}
  className="mt-1 bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white w-full"
/>
          </div>

          <div>
            <Label htmlFor="label" className="text-gray-700 dark:text-gray-300">{tCommon('admin.plans.display_name')}</Label>
            <Input
              id="label"
              {...register('label')}
              className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white mt-1"
              placeholder="Ex: Business Pro"
            />
            {errors.label && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.label.message}</p>}
          </div>
        </div>

        {/* Prix et Description */}
        <div>
          <Label htmlFor="pricePerUser" className="text-gray-700 dark:text-gray-300">{tCommon('admin.plans.price_per_user')}</Label>
          <Input
            id="pricePerUser"
            type="number"
            {...register('pricePerUser', { valueAsNumber: true })}
            className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white mt-1"
            placeholder="0"
          />
          {errors.pricePerUser && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.pricePerUser.message}</p>}
        </div>

        <div>
          <Label htmlFor="targetDescription" className="text-gray-700 dark:text-gray-300">{tCommon('admin.plans.description')}</Label>
          <Textarea
            id="targetDescription"
            {...register('targetDescription')}
            className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white mt-1"
            placeholder={tCommon('admin.plans.desc_placeholder')}
            rows={3}
          />
          {errors.targetDescription && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.targetDescription.message}</p>}
        </div>

        {/* Employés min/max */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="minEmployees" className="text-gray-700 dark:text-gray-300">{tCommon('admin.plans.min_employees')}</Label>
            <Input
              id="minEmployees"
              type="number"
              {...register('minEmployees', { valueAsNumber: true })}
              className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white mt-1"
              placeholder="0"
            />
            {errors.minEmployees && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.minEmployees.message}</p>}
          </div>

          <div>
            <Label htmlFor="maxEmployees" className="text-gray-700 dark:text-gray-300">{tCommon('admin.plans.max_employees')}</Label>
            <Input
              id="maxEmployees"
              type="number"
              value={watchMaxEmployees === null ? '' : watchMaxEmployees}
              onChange={(e) => {
                const value = e.target.value;
                setValue('maxEmployees', value === '' ? null : parseInt(value));
              }}
              className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white mt-1"
              placeholder={tCommon('admin.plans.unlimited')}
            />
          </div>
        </div>

         {watchMinEmployees > 0 && watchMaxEmployees && watchMinEmployees > watchMaxEmployees && (
          <p className="text-red-600 dark:text-red-400 text-sm">{tCommon('admin.plans.min_greater_than_max')}</p>
        )}

        {/* Fonctionnalités */}
        <div>
          <Label className="text-gray-700 dark:text-gray-300 mb-2 block">{tCommon('admin.plans.features')}</Label>
          <div className="space-y-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <Input
                  {...register(`features.${index}`)}
                  className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white flex-1"
                  placeholder="Ex: Support 24/7"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                  className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2 mt-2">
            <Input
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addFeature();
                }
              }}
              className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white flex-1"
              placeholder={tCommon('admin.plans.feature_placeholder')}
            />
            <Button
              type="button"
              onClick={addFeature}
              variant="outline"
              className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {errors.features && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.features.message}</p>}
        </div>

        {/* Plan populaire */}
        <div className="flex items-center justify-between">
          <Label htmlFor="isPopular" className="text-gray-700 dark:text-gray-300">{tCommon('admin.plans.popular_plan')}</Label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">{tCommon('admin.plans.no')}</span>
            <Switch
              id="isPopular"
              checked={watch('isPopular')}
              onCheckedChange={(checked) => setValue('isPopular', checked)}
            />
            <span className="text-sm text-gray-500 dark:text-gray-400">{tCommon('admin.plans.yes')}</span>
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
          {tCommon('user.formations.cancel')}
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="cursor-pointer"
        >
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {initialData ? tCommon('admin.smtp.smtp.update') : tCommon('admin.plans.create')}
        </Button>
      </div>
    </form>
  );
};