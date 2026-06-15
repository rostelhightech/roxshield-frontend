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

interface UserDialogProps {
  open: boolean;
  onClose: () => void;
  editingUser: User | null;
  organizations: Organization[];
  groups: Group[];
}

export const UserDialog = ({ open, onClose, editingUser, organizations, groups }: UserDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-[#070b18] px-6 space-y-4 border border-gray-200 dark:border-white/[0.08] text-gray-900 dark:text-white min-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            {editingUser ? "Modifier l'utilisateur" : "Créer un utilisateur"}
          </DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-white/40">
            {editingUser
              ? "Modifiez les informations et les accès de l'utilisateur"
              : "Renseignez les informations pour créer un nouvel utilisateur"}
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