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
import { toast } from 'sonner';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error('❌ Prénom, nom et email sont requis');
      return;
    }

    try {
      await createAmbassador({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || undefined,
      });
      toast.success('✅ Ambassadeur créé avec succès');
      setFormData({ firstName: '', lastName: '', email: '', phone: '' });
      onOpenChange(false);
    } catch (error) {
      toast.error('❌ Erreur lors de la création de l\'ambassadeur');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-[#070b18] px-6 space-y-4 border border-gray-200 dark:border-white/[0.08] text-gray-900 dark:text-white min-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white text-xl">Créer un ambassadeur</DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-gray-400">
            Ajoutez un nouvel ambassadeur pour suivre les parrainages
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 pb-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-gray-700 dark:text-gray-300">Prénom *</Label>
              <Input
                className="bg-white dark:bg-slate-800/50 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white pr-10"
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
              <Label htmlFor="lastName" className="text-gray-700 dark:text-gray-300">Nom *</Label>
              <Input
                className="bg-white dark:bg-slate-800/50 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white pr-10"
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
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email *</Label>
              <Input
                className="bg-white dark:bg-slate-800/50 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white pr-10"
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
              <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">Téléphone</Label>
              <Input
                className="bg-white dark:bg-slate-800/50 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white pr-10"
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
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Création...' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}