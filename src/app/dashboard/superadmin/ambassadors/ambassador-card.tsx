'use client';

import { Edit, MoreVertical, Trash2, QrCode, TrendingUp, Mail, Phone, UserCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Ambassador } from '@/store/ambassador.store';
import { useState } from 'react';
import { toast } from 'sonner';

interface AmbassadorCardProps {
  ambassador: Ambassador;
  onEdit: (ambassador: Ambassador) => void;
  onDelete: (id: string) => Promise<void>;
  onQRCode: (id: string) => void;
  onStats: (id: string) => void;
}

export const AmbassadorCard = ({ ambassador, onEdit, onDelete, onQRCode, onStats }: AmbassadorCardProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await onDelete(ambassador.id);
      toast.success('✅ Ambassadeur supprimé avec succès');
      setDeleteDialogOpen(false);
    } catch (error) {
      toast.error('❌ Erreur lors de la suppression');
    }
  };

  return (
    <>
      <Card className="bg-gradient-to-br from-white to-gray-100 dark:from-gray-900/50 dark:to-gray-800/30 border-gray-200 dark:border-gray-700/50 hover:border-blue-500/30 transition-all duration-300 overflow-hidden">
        <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-500/10">
                <UserCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                  {ambassador.firstName} {ambassador.lastName}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {ambassador.email}
                </p>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-700 dark:text-gray-300">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 w-auto">
                <DropdownMenuItem
                  onClick={(event) => {
                    event.stopPropagation();
                    onQRCode(ambassador.id);
                  }}
                  className="text-gray-700 dark:text-gray-300"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  Générer QR Code
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(event) => {
                    event.stopPropagation();
                    onStats(ambassador.id);
                  }}
                  className="text-blue-600 dark:text-blue-400"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Voir statistiques
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(event) => {
                    event.stopPropagation();
                    onEdit(ambassador);
                  }}
                  className="text-gray-700 dark:text-gray-300"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(event) => {
                    event.stopPropagation();
                    setDeleteDialogOpen(true);
                  }}
                  className="text-red-600 dark:text-red-400"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {ambassador.phone && (
            <div className="mb-3">
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {ambassador.phone}
              </p>
            </div>
          )}

          <div className="flex items-center gap-2 mb-4">
            {ambassador.isActive ? (
              <Badge className="bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border-green-300 dark:border-green-500/30">
                Actif
              </Badge>
            ) : (
              <Badge className="bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400 border-gray-300 dark:border-gray-500/30">
                Inactif
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200 dark:border-gray-700/50">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Parrainages</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{ambassador.totalReferrals}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Succès</p>
              <p className="text-lg font-bold text-green-600 dark:text-green-400">{ambassador.successfulReferrals}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-white">Supprimer l'ambassadeur?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
              Cette action est irréversible. L'ambassadeur sera supprimé mais les organisations parrainées seront conservées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-white">
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};