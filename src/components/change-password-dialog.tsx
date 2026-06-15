'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/auth.store';
import { Eye, EyeOff, Lock } from 'lucide-react';

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChangePasswordDialog({ open, onOpenChange }: ChangePasswordDialogProps) {
  const { changePassword } = useAuthStore();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Tous les champs sont requis');
      return;
    }

    if (newPassword.length < 6) {
      setError('Le nouveau mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (currentPassword === newPassword) {
      setError('Le nouveau mot de passe doit être différent de l\'ancien');
      return;
    }

    setIsLoading(true);

    try {
      await changePassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onOpenChange(false);
    } catch (error) {
      setError('Erreur lors du changement de mot de passe');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-white dark:bg-[#0c1023] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Lock className="w-5 h-5" />
            Changer mon mot de passe
          </DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-gray-400">
            Entrez votre mot de passe actuel et choisissez un nouveau mot de passe sécurisé
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pb-2">
          {error && (
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-300 dark:border-red-500/30 rounded-lg p-3 text-sm text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Mot de passe actuel */}
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="text-gray-700 dark:text-white">
              Mot de passe actuel *
            </Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="bg-white dark:bg-slate-800/50 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white pr-10"
                placeholder="Entrez votre mot de passe actuel"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Nouveau mot de passe */}
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-gray-700 dark:text-white">
              Nouveau mot de passe *
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-white dark:bg-slate-800/50 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white pr-10"
                placeholder="Entrez votre nouveau mot de passe"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Au moins 6 caractères</p>
          </div>

          {/* Confirmation */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-white">
              Confirmer le nouveau mot de passe *
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-white dark:bg-slate-800/50 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white pr-10"
                placeholder="Confirmez votre nouveau mot de passe"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <DialogFooter className="bg-white dark:bg-[#0c1023]">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Modification...' : 'Modifier le mot de passe'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}