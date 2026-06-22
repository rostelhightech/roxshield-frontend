import { useState } from 'react';
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
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

interface CreateAmbassadorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateAmbassadorDialog({
  open,
  onOpenChange,
}: CreateAmbassadorDialogProps) {
  const { createAmbassador, isLoading } = useAmbassadorStore();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
const { t: tCommon } = useTranslation('common');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error(`❌ ${tCommon('admin.ambassadors.required_fields_error')}`);
      return;
    }

    try {
      await createAmbassador({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || undefined,
      });
      setFormData({ firstName: '', lastName: '', email: '', phone: '' });
      onOpenChange(false);
    } catch (error) {
      //
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-[#070b18] px-4 sm:px-6 space-y-4 border border-gray-200 dark:border-white/[0.08] text-gray-900 dark:text-white w-[calc(100vw-2rem)] sm:w-full sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white text-lg sm:text-xl">{tCommon('admin.ambassadors.create_ambassador')}</DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-gray-400">
            {tCommon('admin.ambassadors.create_description')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 pb-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-gray-700 dark:text-gray-300">{tCommon('admin.ambassadors.first_name')}</Label>
              <Input
                className="bg-white dark:bg-slate-800/50 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white"
                id="firstName"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                placeholder="Jean"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-gray-700 dark:text-gray-300">{tCommon('admin.ambassadors.last_name')}</Label>
              <Input
                className="bg-white dark:bg-slate-800/50 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white"
                id="lastName"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                placeholder="Dupont"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">{tCommon('admin.users.email')}</Label>
              <Input
                className="bg-white dark:bg-slate-800/50 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white"
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="jean.dupont@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">{tCommon('admin.ambassadors.table_phone')}</Label>
              <Input
                className="bg-white dark:bg-slate-800/50 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white"
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="+33 6 12 34 56 78"
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
              {isLoading ? tCommon('admin.ambassadors.creating') : tCommon('admin.organizations.org_create_btn')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}