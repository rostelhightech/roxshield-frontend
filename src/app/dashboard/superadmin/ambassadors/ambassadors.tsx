'use client';

import { useEffect, useState } from 'react';
import { Filter, LayoutGrid, List, Plus, UserCheck as UserCheckIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Ambassador, useAmbassadorStore } from '@/store/ambassador.store';
import { AmbassadorFilters } from './ambassador-filters';
import { AmbassadorTable } from './ambassador-table';
import { AmbassadorCard } from './ambassador-card';
import { CreateAmbassadorDialog } from './create-ambassador-dialog';
import { EditAmbassadorDialog } from './edit-ambassador-dialog';
import { QRCodeDialog } from './qrcode-dialog';
import { AmbassadorStatsDialog } from './stats-dialog';

export const AmbassadorsPage = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAmbassador, setEditingAmbassador] = useState<Ambassador | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [statsDialogOpen, setStatsDialogOpen] = useState(false);
  const [selectedAmbassadorId, setSelectedAmbassadorId] = useState<string | null>(null);

  const {
    ambassadors,
    filteredAmbassadors,
    isLoading,
    filters,
    fetchAmbassadors,
    deleteAmbassador,
    resetFilters,
  } = useAmbassadorStore();

  useEffect(() => {
    fetchAmbassadors();
   }, []);

  const handleEdit = (ambassador: Ambassador) => {
    setEditingAmbassador(ambassador);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingAmbassador(null);
  };

  const handleQRCode = (id: string) => {
    setSelectedAmbassadorId(id);
    setQrDialogOpen(true);
  };

  const handleStats = (id: string) => {
    setSelectedAmbassadorId(id);
    setStatsDialogOpen(true);
  };

  const hasFilters = filters.search || filters.isActive !== undefined;
  const activeAmbassadors = ambassadors.filter(amb => amb.isActive).length;
  const totalReferrals = ambassadors.reduce((total, amb) => total + amb.totalReferrals, 0);
  const totalSuccessful = ambassadors.reduce((total, amb) => total + amb.successfulReferrals, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050816]">
      <div className="border-b border-gray-200 dark:border-gray-800/50 bg-white dark:bg-[#0a0f1e]/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto py-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Button
              onClick={() => setDialogOpen(true)}
              className="bg-gray-200 hover:bg-gray-300 dark:bg-slate-600 dark:hover:bg-slate-700 ml-2 text-gray-900 dark:text-white   cursor-pointer transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvel ambassadeur
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="rounded-sm hover:bg-gray-100 dark:hover:bg-[#1a1f36] cursor-pointer transition-colors duration-200 border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0c1023] p-4">
            <div className="p-4">
              <p className="text-gray-500 dark:text-gray-400 text-sm">Total ambassadeurs</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{ambassadors.length}</p>
            </div>
          </Card>
          <Card className="rounded-sm hover:bg-gray-100 dark:hover:bg-[#1a1f36] cursor-pointer transition-colors duration-200 border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0c1023] p-4">
            <div className="p-4">
              <p className="text-gray-500 dark:text-gray-400 text-sm">Ambassadeurs actifs</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeAmbassadors}</p>
            </div>
          </Card>
          <Card className="rounded-sm hover:bg-gray-100 dark:hover:bg-[#1a1f36] cursor-pointer transition-colors duration-200 border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0c1023] p-4">
            <div className="p-4">
              <p className="text-gray-500 dark:text-gray-400 text-sm">Total parrainages</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalReferrals}</p>
            </div>
          </Card>
          <Card className="rounded-sm hover:bg-gray-100 dark:hover:bg-[#1a1f36] cursor-pointer transition-colors duration-200 border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0c1023] p-4">
            <div className="p-4">
              <p className="text-gray-500 dark:text-gray-400 text-sm">Parrainages réussis</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalSuccessful}</p>
            </div>
          </Card>
        </div>

        <div className="mb-6">
          <AmbassadorFilters />
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <Filter className="w-4 h-4 mr-2" />
                Réinitialiser les filtres
              </Button>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {filteredAmbassadors.length} ambassadeur(s) trouvé(s)
            </p>
          </div>
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800/30 rounded-lg p-1">
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
              className={viewMode === 'table' ? 'bg-gray-300 dark:bg-gray-700' : 'text-gray-700 dark:text-gray-300'}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'cards' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('cards')}
              className={viewMode === 'cards' ? 'bg-gray-300 dark:bg-gray-700' : 'text-gray-700 dark:text-gray-300'}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 bg-gray-200 dark:bg-gray-800/50" />
            ))}
          </div>
        ) : filteredAmbassadors.length === 0 ? (
          <Card className="bg-white dark:bg-gray-800/30 border-gray-200 dark:border-gray-700/50">
            <div className="p-12 text-center">
              <UserCheckIcon className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Aucun ambassadeur</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {hasFilters ? "Aucun ambassadeur ne correspond aux filtres" : "Commencez par créer votre premier ambassadeur"}
              </p>
              {!hasFilters && (
                <Button
                  onClick={() => setDialogOpen(true)}
                  variant="outline"
                  className="mt-4"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Créer un ambassadeur
                </Button>
              )}
            </div>
          </Card>
        ) : viewMode === 'table' ? (
          <AmbassadorTable
            ambassadors={filteredAmbassadors}
            onEdit={handleEdit}
            onDelete={deleteAmbassador}
            onQRCode={handleQRCode}
            onStats={handleStats}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAmbassadors.map((ambassador) => (
              <AmbassadorCard
                key={ambassador.id}
                ambassador={ambassador}
                onEdit={handleEdit}
                onDelete={deleteAmbassador}
                onQRCode={handleQRCode}
                onStats={handleStats}
              />
            ))}
          </div>
        )}
      </div>

      <CreateAmbassadorDialog
        open={dialogOpen && !editingAmbassador}
        onOpenChange={setDialogOpen}
      />
      
      {editingAmbassador && (
        <EditAmbassadorDialog
          open={dialogOpen}
          onOpenChange={handleCloseDialog}
          ambassadorId={editingAmbassador.id}
        />
      )}

      {selectedAmbassadorId && (
        <>
          <QRCodeDialog
            open={qrDialogOpen}
            onOpenChange={setQrDialogOpen}
            ambassadorId={selectedAmbassadorId}
          />
          <AmbassadorStatsDialog
            open={statsDialogOpen}
            onOpenChange={setStatsDialogOpen}
            ambassadorId={selectedAmbassadorId}
          />
        </>
      )}
    </div>
  );
};