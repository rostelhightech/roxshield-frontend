'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { User } from '@/store/user.store';
import { Organization } from '@/store/organization.store';
import { Group } from '@/store/group.store';
import { UserForm } from './user-form';
import { useTranslation } from 'react-i18next';

interface UserDialogProps {
  open: boolean;
  onClose: () => void;
  editingUser: User | null;
  organizations: Organization[];
  groups: Group[];
}

export const UserDialog = ({ open, onClose, editingUser, organizations, groups }: UserDialogProps) => {
  const { t: tCommon } = useTranslation('common');
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-[#070b18] px-4 sm:px-6 space-y-4 border border-gray-200 dark:border-white/[0.08] text-gray-900 dark:text-white w-[calc(100vw-2rem)] sm:w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
            {editingUser ? "Modifier l'utilisateur" : tCommon('admin.users.create_user')}
          </DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-white/40">
            {editingUser
              ? tCommon('admin.users.edit_title')
              : tCommon('admin.users.create_title')}
          </DialogDescription>
        </DialogHeader>
        <UserForm
          initialData={editingUser}
          organizations={organizations}
          groups={groups}
          onSuccess={onClose}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};