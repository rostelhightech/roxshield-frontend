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

interface GroupDialogProps {
  open: boolean;
  onClose: () => void;
  editingGroup: Group | null;
  organizations: Organization[];
}

export const GroupDialog = ({ open, onClose, editingGroup, organizations }: GroupDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#070b18] px-6 space-y-4 border border-white/[0.08] text-white min-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">
            {editingGroup ? 'Modifier le groupe' : 'Créer un groupe'}
          </DialogTitle>
          <DialogDescription className="text-white/40">
            {editingGroup
              ? 'Modifiez le nom, la description ou l\'organisation du groupe'
              : 'Créez un groupe pour organiser les utilisateurs par équipe, classe ou service'}
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
