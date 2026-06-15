// components/organizations/OrganizationDialog.tsx
'use client';

import { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Organization } from '@/store/organization.store';
import { Plan } from '@/store/plan.store';
import { OrganizationForm } from './organization-form';

interface OrganizationDialogProps {
  open: boolean;
  onClose: () => void;
  editingOrg: Organization | null;
  plans: Plan[];
}

export const OrganizationDialog = ({ open, onClose, editingOrg, plans }: OrganizationDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-[#070b18] px-6 space-y-4 border border-gray-200 dark:border-white/[0.08] text-gray-900 dark:text-white min-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            {editingOrg ? "Modifier l'organisation" : "Créer une organisation"}
          </DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-white/40">
            {editingOrg
              ? "Modifiez les informations de l'organisation"
              : "Remplissez les informations pour créer une nouvelle organisation"}
          </DialogDescription>
        </DialogHeader>
        <OrganizationForm
          initialData={editingOrg}
          plans={plans}
          onSuccess={onClose}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};