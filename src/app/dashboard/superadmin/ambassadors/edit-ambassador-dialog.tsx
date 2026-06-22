import { useEffect, useState } from 'react';
import { useAmbassadorStore } from '@/store/ambassador.store';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useTranslation } from 'react-i18next';

interface EditAmbassadorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ambassadorId: string;
}

export function EditAmbassadorDialog({
  open,
  onOpenChange,
  ambassadorId,
}: EditAmbassadorDialogProps) {
  const { ambassadors, updateAmbassador, isLoading } = useAmbassadorStore();
  const ambassador = ambassadors.find((a) => a.id === ambassadorId);
const { t: tCommon } = useTranslation('common');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    isActive: true,
  });

  useEffect(() => {
    if (ambassador) {
      setFormData({
        firstName: ambassador.firstName,
        lastName: ambassador.lastName,
        email: ambassador.email,
        phone: ambassador.phone || '',
        isActive: ambassador.isActive,
      });
    }
  }, [ambassador]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateAmbassador(ambassadorId, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || undefined,
        isActive: formData.isActive,
      });
      onOpenChange(false);
    } catch (error) {
      //
    }
  };

  if (!ambassador) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-[#070b18] px-6 space-y-4 border border-gray-200 dark:border-white/[0.08] text-gray-900 dark:text-white min-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white text-xl">Modifier l'ambassadeur</DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-gray-400">
            Modifiez les informations de l'ambassadeur
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 pb-4">
            <div className="space-y-2">
              <Label htmlFor="edit-firstName" className="text-gray-700 dark:text-gray-300">{tCommon('admin.ambassadors.first_name')}</Label>
              <Input
                className="bg-white dark:bg-slate-800/50 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white pr-10"
                id="edit-firstName"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-lastName" className="text-gray-700 dark:text-gray-300">{tCommon('admin.ambassadors.last_name')}</Label>
              <Input
                className="bg-white dark:bg-slate-800/50 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white pr-10"
                id="edit-lastName"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email" className="text-gray-700 dark:text-gray-300">{tCommon('contact.email_label')}</Label>
              <Input
                className="bg-white dark:bg-slate-800/50 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white pr-10"
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone" className="text-gray-700 dark:text-gray-300">{tCommon('admin.ambassadors.table_phone')}</Label>
              <Input
                className="bg-white dark:bg-slate-800/50 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white pr-10"
                id="edit-phone"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="edit-isActive" className="text-gray-700 dark:text-gray-300">{tCommon('admin.ambassadors.active_status')}</Label>
              <Switch
                id="edit-isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked })
                }
              />
            </div>
          </div>
          <DialogFooter className="bg-white dark:bg-[#070b18]">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              {tCommon('user.formations.cancel')}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Mise à jour...' : 'Mettre à jour'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}