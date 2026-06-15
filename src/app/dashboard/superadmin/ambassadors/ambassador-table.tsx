'use client';

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Edit, MoreHorizontal, Trash2, QrCode, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { toast } from 'sonner';

interface AmbassadorTableProps {
  ambassadors: Ambassador[];
  onEdit: (ambassador: Ambassador) => void;
  onDelete: (id: string) => Promise<void>;
  onQRCode: (id: string) => void;
  onStats: (id: string) => void;
}

export const AmbassadorTable = ({ ambassadors, onEdit, onDelete, onQRCode, onStats }: AmbassadorTableProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      await onDelete(selectedId);
      toast.success('✅ Ambassadeur supprimé avec succès');
      setDeleteDialogOpen(false);
      setSelectedId(null);
    } catch (error) {
      toast.error('❌ Erreur lors de la suppression');
    }
  };

  const openDeleteDialog = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedId(id);
    setDeleteDialogOpen(true);
  };

  return (
    <>
      <div className="rounded-sm border border-gray-200 dark:border-gray-800/50 bg-white dark:bg-gray-900/30 backdrop-blur-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-100 dark:bg-gray-800/50">
            <TableRow className="border-gray-200 dark:border-gray-800 hover:bg-transparent">
              <TableHead className="text-gray-700 dark:text-gray-300">Nom</TableHead>
              <TableHead className="text-gray-700 dark:text-gray-300">Email</TableHead>
              <TableHead className="text-gray-700 dark:text-gray-300">Téléphone</TableHead>
              <TableHead className="text-gray-700 dark:text-gray-300">Parrainages</TableHead>
              <TableHead className="text-gray-700 dark:text-gray-300">Succès</TableHead>
              <TableHead className="text-gray-700 dark:text-gray-300">Statut</TableHead>
              <TableHead className="text-gray-700 dark:text-gray-300">Créé le</TableHead>
              <TableHead className="text-gray-700 dark:text-gray-300 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ambassadors.map((ambassador) => (
              <TableRow
                key={ambassador.id}
                className="border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 cursor-pointer"
              >
                <TableCell className="font-medium text-gray-900 dark:text-white">
                  {ambassador.firstName} {ambassador.lastName}
                </TableCell>
                <TableCell className="text-gray-700 dark:text-gray-300">{ambassador.email}</TableCell>
                <TableCell className="text-gray-700 dark:text-gray-300">{ambassador.phone || '-'}</TableCell>
                <TableCell className="text-gray-700 dark:text-gray-300">{ambassador.totalReferrals}</TableCell>
                <TableCell className="text-gray-700 dark:text-gray-300">{ambassador.successfulReferrals}</TableCell>
                <TableCell>
                  {ambassador.isActive ? (
                    <Badge className="bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border-green-300 dark:border-green-500/30">
                      Actif
                    </Badge>
                  ) : (
                    <Badge className="bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400 border-gray-300 dark:border-gray-500/30">
                      Inactif
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-gray-700 dark:text-gray-300">
                  {format(new Date(ambassador.createdAt), 'dd MMM yyyy', { locale: fr })}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-700 dark:text-gray-300">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 w-auto">
                      <DropdownMenuItem
                        onClick={(event) => {
                          event.stopPropagation();
                          onQRCode(ambassador.id);
                        }}
                        className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                      >
                        <QrCode className="w-4 h-4 mr-2" />
                        Générer QR Code
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(event) => {
                          event.stopPropagation();
                          onStats(ambassador.id);
                        }}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                      >
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Voir statistiques
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(event) => {
                          event.stopPropagation();
                          onEdit(ambassador);
                        }}
                        className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(event) => openDeleteDialog(ambassador.id, event)}
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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