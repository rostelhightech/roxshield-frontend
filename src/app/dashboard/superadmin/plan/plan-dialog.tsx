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

interface PlanDialogProps {
  open: boolean;
  onClose: () => void;
  editingPlan: Plan | null;
}

export const PlanDialog = ({ open, onClose, editingPlan }: PlanDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white min-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            {editingPlan ? 'Modifier le plan' : 'Créer un plan'}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {editingPlan 
              ? 'Modifiez les informations du plan d\'abonnement' 
              : 'Remplissez les informations pour créer un nouveau plan'}
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