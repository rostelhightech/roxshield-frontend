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
import { useTranslation } from 'react-i18next';

interface OrganizationDialogProps {
  open: boolean;
  onClose: () => void;
  editingOrg: Organization | null;
  plans: Plan[];
}

export const OrganizationDialog = ({ open, onClose, editingOrg, plans }: OrganizationDialogProps) => {
  const { t: tCommon } = useTranslation('common');
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-[#070b18] px-4 sm:px-6 space-y-4 border border-gray-200 dark:border-white/[0.08] text-gray-900 dark:text-white w-[calc(100vw-2rem)] sm:w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
            {editingOrg ? tCommon('admin.organizations.org_edit_title') : tCommon('admin.organizations.create_org')}
          </DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-white/40">
            {editingOrg
              ? tCommon('admin.organizations.edit_title')
              : tCommon('admin.organizations.create_title')}
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