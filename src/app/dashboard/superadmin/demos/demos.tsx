'use client';

import { useEffect, useState } from 'react';
import { Calendar, Mail, Phone, Users, Clock, CheckCircle, XCircle, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDemoStore, type DemoRequest } from '@/store/demo.store';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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

export const Demos = () => {
  const { demoRequests, isLoading, fetchAll, updateDemoStatus, deleteDemoRequest } = useDemoStore();
  const [selectedDemo, setSelectedDemo] = useState<DemoRequest | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [demoToDelete, setDemoToDelete] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const getStatusBadge = (status: DemoRequest['demoStatus']) => {
    const badges = {
      pending: (
        <Badge className="bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border border-yellow-300 dark:border-yellow-500/20 font-normal">
          En attente
        </Badge>
      ),
      scheduled: (
        <Badge className="bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-500/20 font-normal">
          Planifiée
        </Badge>
      ),
      completed: (
        <Badge className="bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-500/20 font-normal">
          Terminée
        </Badge>
      ),
      cancelled: (
        <Badge className="bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-500/20 font-normal">
          Annulée
        </Badge>
      ),
    };
    return badges[status];
  };

  const handleStatusChange = async (id: string, status: DemoRequest['demoStatus']) => {
    await updateDemoStatus(id, status);
  };

  const handleDelete = (id: string, name: string) => {
    setDemoToDelete({ id, name });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!demoToDelete) return;
    await deleteDemoRequest(demoToDelete.id);
    setDeleteDialogOpen(false);
    setDemoToDelete(null);
  };

  const pendingCount = demoRequests.filter(d => d.demoStatus === 'pending').length;
  const scheduledCount = demoRequests.filter(d => d.demoStatus === 'scheduled').length;
  const completedCount = demoRequests.filter(d => d.demoStatus === 'completed').length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#070b18]">
      <div className="mx-auto py-6">

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total demandes", value: demoRequests.length, valueClass: "text-gray-900 dark:text-white" },
            { label: "En attente",     value: pendingCount,        valueClass: "text-yellow-700 dark:text-yellow-400" },
            { label: "Planifiées",     value: scheduledCount,      valueClass: "text-blue-700 dark:text-blue-400" },
            { label: "Terminées",      value: completedCount,      valueClass: "text-green-700 dark:text-green-400" },
          ].map(({ label, value, valueClass }) => (
            <Card
              key={label}
              className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.05] rounded-sm p-5 shadow-none"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
              <p className={`text-2xl font-semibold ${valueClass}`}>{value}</p>
            </Card>
          ))}
        </div>

        {/* Liste */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Chargement...</p>
          </div>
        ) : demoRequests.length === 0 ? (
          <Card className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.05] rounded-sm shadow-none">
            <div className="p-12 text-center">
              <Calendar className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-base font-medium text-gray-900 dark:text-white mb-1">Aucune demande</h3>
              <p className="text-sm text-gray-400">Les demandes de démo apparaîtront ici</p>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {demoRequests.map((demo) => (
              <Card
                key={demo.id}
                className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.05] hover:border-gray-300 dark:hover:border-white/10 rounded-sm shadow-none transition-colors duration-200 cursor-pointer"
                onClick={() => setSelectedDemo(demo)}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <h3 className="font-medium text-gray-900 dark:text-white text-[15px] truncate">
                          {demo.name}
                        </h3>
                        {demo.referredByAmbassador && (
                          <Badge className="bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-500/20 text-[11px] font-normal">
                            Parrainé
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">{demo.adminName}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 shrink-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm"
                      >
                        <DropdownMenuItem
                          onClick={(e) => { e.stopPropagation(); handleStatusChange(demo.id, 'scheduled'); }}
                          className="text-sm text-gray-700 dark:text-gray-300"
                        >
                          <CheckCircle className="w-4 h-4 mr-2 text-blue-500" />
                          Marquer comme planifiée
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => { e.stopPropagation(); handleStatusChange(demo.id, 'completed'); }}
                          className="text-sm text-gray-700 dark:text-gray-300"
                        >
                          <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                          Marquer comme terminée
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => { e.stopPropagation(); handleStatusChange(demo.id, 'cancelled'); }}
                          className="text-sm text-gray-700 dark:text-gray-300"
                        >
                          <XCircle className="w-4 h-4 mr-2 text-gray-400" />
                          Annuler
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => { e.stopPropagation(); handleDelete(demo.id, demo.name); }}
                          className="text-sm text-red-600 dark:text-red-400"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="mb-4">{getStatusBadge(demo.demoStatus)}</div>

                  <div className="space-y-1.5 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{demo.adminEmail}</span>
                    </div>
                    {demo.adminPhone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 shrink-0" />
                        <span>{demo.adminPhone}</span>
                      </div>
                    )}
                    {demo.companySize && (
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 shrink-0" />
                        <span>{demo.companySize} employés</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span>{format(new Date(demo.createdAt), 'dd MMM yyyy', { locale: fr })}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedDemo} onOpenChange={() => setSelectedDemo(null)}>
        <DialogContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 max-w-2xl shadow-none rounded-sm">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white text-lg font-medium">
              {selectedDemo?.name}
            </DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400 text-sm">
              Détails de la demande de démo
            </DialogDescription>
          </DialogHeader>
          {selectedDemo && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 mb-0.5">Contact</p>
                  <p className="text-gray-900 dark:text-white font-medium">{selectedDemo.adminName}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 mb-0.5">Statut</p>
                  {getStatusBadge(selectedDemo.demoStatus)}
                </div>
              </div>

              <div>
                <p className="text-gray-500 dark:text-gray-400 mb-0.5">Email</p>
                <p className="text-gray-900 dark:text-white">{selectedDemo.adminEmail}</p>
              </div>

              {selectedDemo.adminPhone && (
                <div>
                  <p className="text-gray-500 dark:text-gray-400 mb-0.5">Téléphone</p>
                  <p className="text-gray-900 dark:text-white">{selectedDemo.adminPhone}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {selectedDemo.sector && (
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 mb-0.5">Secteur</p>
                    <p className="text-gray-900 dark:text-white">{selectedDemo.sector}</p>
                  </div>
                )}
                {selectedDemo.companySize && (
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 mb-0.5">Taille</p>
                    <p className="text-gray-900 dark:text-white">{selectedDemo.companySize}</p>
                  </div>
                )}
              </div>

              {selectedDemo.country && (
                <div>
                  <p className="text-gray-500 dark:text-gray-400 mb-0.5">Pays</p>
                  <p className="text-gray-900 dark:text-white">{selectedDemo.country}</p>
                </div>
              )}

              {selectedDemo.referredByAmbassador && (
                <div className="rounded-lg border border-blue-300 dark:border-blue-500/20 bg-blue-50 dark:bg-blue-500/5 p-3">
                  <p className="text-gray-500 dark:text-gray-400 mb-1">Parrainé par</p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {selectedDemo.referredByAmbassador.firstName} {selectedDemo.referredByAmbassador.lastName}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400">{selectedDemo.referredByAmbassador.email}</p>
                </div>
              )}

              {selectedDemo.message && (
                <div>
                  <p className="text-gray-500 dark:text-gray-400 mb-2">Message</p>
                  <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-lg p-3 text-gray-900 dark:text-white">
                    {selectedDemo.message}
                  </div>
                </div>
              )}

              <div>
                <p className="text-gray-500 dark:text-gray-400 mb-0.5">Date de demande</p>
                <p className="text-gray-900 dark:text-white">
                  {format(new Date(selectedDemo.createdAt), "dd MMMM yyyy 'à' HH:mm", { locale: fr })}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-none rounded-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-white font-medium">
              Supprimer la demande ?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
              Êtes-vous sûr de vouloir supprimer la demande de{" "}
              <span className="font-medium text-gray-900 dark:text-white">"{demoToDelete?.name}"</span> ?
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border-0 text-gray-700 dark:text-gray-300">
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white border-0"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};