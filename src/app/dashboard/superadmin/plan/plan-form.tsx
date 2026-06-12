// components/plans/PlanForm.tsx
'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePlanStore, Plan } from '@/store/plan.store';
import { Loader2, Plus, X } from 'lucide-react';

const planSchema = z.object({
  name: z.enum(['starter', 'business', 'enterprise']),
  label: z.string().min(2, 'Le label est requis'),
  pricePerUser: z.number().min(0, 'Le prix doit être positif'),
  targetDescription: z.string().min(10, 'Description trop courte'),
  minEmployees: z.number().min(0, 'Minimum d\'employés requis'),
  maxEmployees: z.number().nullable(),
  features: z.array(z.string()).min(1, 'Au moins une fonctionnalité'),
  isPopular: z.boolean().default(false).catch(false),
});

type PlanFormData = z.infer<typeof planSchema>;

interface PlanFormProps {
  initialData?: Plan | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const PlanForm = ({ initialData, onSuccess, onCancel }: PlanFormProps) => {
  const { createPlan, updatePlan, isLoading } = usePlanStore();
  const [newFeature, setNewFeature] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<PlanFormData>({
    resolver: zodResolver(planSchema),
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

  const onSubmit = async (data: PlanFormData) => {
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
            <Label htmlFor="name" className="text-gray-300">Type de plan *</Label>
            <Select
              value={watch('name')}
              onValueChange={(value) => setValue('name', value as any)}
            >
              <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white mt-1">
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent className="bg-slate-200 border-gray-700">
                <SelectItem value="starter">Starter</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="label" className="text-gray-300">Nom affiché *</Label>
            <Input
              id="label"
              {...register('label')}
              className="bg-gray-800/50 border-gray-700 text-white mt-1"
              placeholder="Ex: Business Pro"
            />
            {errors.label && <p className="text-red-400 text-sm mt-1">{errors.label.message}</p>}
          </div>
        </div>

        {/* Prix et Description */}
        <div>
          <Label htmlFor="pricePerUser" className="text-gray-300">Prix par utilisateur (FCFA) *</Label>
          <Input
            id="pricePerUser"
            type="number"
            {...register('pricePerUser', { valueAsNumber: true })}
            className="bg-gray-800/50 border-gray-700 text-white mt-1"
            placeholder="0"
          />
          {errors.pricePerUser && <p className="text-red-400 text-sm mt-1">{errors.pricePerUser.message}</p>}
        </div>

        <div>
          <Label htmlFor="targetDescription" className="text-gray-300">Description *</Label>
          <Textarea
            id="targetDescription"
            {...register('targetDescription')}
            className="bg-gray-800/50 border-gray-700 text-white mt-1"
            placeholder="Décrivez à qui s'adresse ce plan..."
            rows={3}
          />
          {errors.targetDescription && <p className="text-red-400 text-sm mt-1">{errors.targetDescription.message}</p>}
        </div>

        {/* Employés min/max */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="minEmployees" className="text-gray-300">Employés minimum *</Label>
            <Input
              id="minEmployees"
              type="number"
              {...register('minEmployees', { valueAsNumber: true })}
              className="bg-gray-800/50 border-gray-700 text-white mt-1"
              placeholder="0"
            />
            {errors.minEmployees && <p className="text-red-400 text-sm mt-1">{errors.minEmployees.message}</p>}
          </div>

          <div>
            <Label htmlFor="maxEmployees" className="text-gray-300">Employés maximum</Label>
            <Input
              id="maxEmployees"
              type="number"
              value={watchMaxEmployees === null ? '' : watchMaxEmployees}
              onChange={(e) => {
                const value = e.target.value;
                setValue('maxEmployees', value === '' ? null : parseInt(value));
              }}
              className="bg-gray-800/50 border-gray-700 text-white mt-1"
              placeholder="Illimité"
            />
          </div>
        </div>

        {/* Validation employés */}
        {watchMinEmployees > 0 && watchMaxEmployees && watchMinEmployees > watchMaxEmployees && (
          <p className="text-red-400 text-sm">Le minimum ne peut pas être supérieur au maximum</p>
        )}

        {/* Fonctionnalités */}
        <div>
          <Label className="text-gray-300 mb-2 block">Fonctionnalités *</Label>
          <div className="space-y-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <Input
                  {...register(`features.${index}`)}
                  className="bg-gray-800/50 border-gray-700 text-white flex-1"
                  placeholder="Ex: Support 24/7"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                  className="text-red-400 hover:text-red-300"
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
              className="bg-gray-800/50 border-gray-700 text-white flex-1"
              placeholder="Nouvelle fonctionnalité..."
            />
            <Button
              type="button"
              onClick={addFeature}
              variant="outline"
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {errors.features && <p className="text-red-400 text-sm mt-1">{errors.features.message}</p>}
        </div>

        {/* Plan populaire */}
        <div className="flex items-center justify-between">
          <Label htmlFor="isPopular" className="text-gray-300">Plan populaire</Label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Non</span>
            <Switch
              id="isPopular"
              checked={watch('isPopular')}
              onCheckedChange={(checked) => setValue('isPopular', checked)}
            />
            <span className="text-sm text-gray-400">Oui</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-gray-700 text-gray-500 hover:text-gray-600 cursor-pointer"
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