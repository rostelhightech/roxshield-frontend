'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Group } from '@/store/group.store';
import { Organization } from '@/store/organization.store';
import { GroupForm } from './group-form';
import { useTranslation } from 'react-i18next';

interface GroupDialogProps {
  open: boolean;
  onClose: () => void;
  editingGroup: Group | null;
  organizations: Organization[];
}

export const GroupDialog = ({ open, onClose, editingGroup, organizations }: GroupDialogProps) => {
  const { t: tCommon } = useTranslation('common');
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-[#070b18] px-4 sm:px-6 space-y-4 border border-gray-200 dark:border-white/[0.08] text-gray-900 dark:text-white w-[calc(100vw-2rem)] sm:w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
            {editingGroup ? tCommon('admin.groups.group_edit_title') : tCommon('admin.groups.create_group')}
          </DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-white/40">
            {editingGroup
              ? tCommon('admin.groups.edit_title')
              : tCommon('admin.groups.create_title')}
          </DialogDescription>
        </DialogHeader>
        <GroupForm
          initialData={editingGroup}
          organizations={organizations}
          onSuccess={onClose}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};