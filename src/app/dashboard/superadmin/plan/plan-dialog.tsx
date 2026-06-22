// components/plans/PlanDialog.tsx
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Plan } from '@/store/plan.store';
import { PlanForm } from './plan-form';
import { useTranslation } from 'react-i18next';

interface PlanDialogProps {
  open: boolean;
  onClose: () => void;
  editingPlan: Plan | null;
}

export const PlanDialog = ({ open, onClose, editingPlan }: PlanDialogProps) => {
  const { t: tCommon } = useTranslation('common');
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white min-w-3xl max-h-[90vh] overflow-y-auto rounded-sm">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            {editingPlan ? tCommon('admin.plans.edit_plan') : tCommon('admin.plans.create_plan')}
          </DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-gray-400">
            {editingPlan ? tCommon('admin.plans.edit_title') : tCommon('admin.plans.create_title')}
          </DialogDescription>
        </DialogHeader>
        <PlanForm
          initialData={editingPlan}
          onSuccess={onClose}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};