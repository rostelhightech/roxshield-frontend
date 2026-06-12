'use client';

import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DashboardTopbar } from '@/components/layout/topbar';
import { useFormationStore } from '@/store/formation.store';
import { Play, CheckCircle2, Clock, Award, TrendingUp, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function UserFormationsPage() {
  const navigate = useNavigate();
  const { myFormations, fetchMyFormations, startFormation, isLoading } = useFormationStore();
  const [filter, setFilter] = useState<'all' | 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'>('all');

  useEffect(() => {
    fetchMyFormations();
  }, [fetchMyFormations]);

  const handleStartFormation = async (formationId: string) => {
    try {
      await startFormation(formationId);
      // Naviguer vers la page de visualisation après avoir démarré la formation
      navigate({ to: '/dashboard/user/formation-view', search: { id: formationId } });
    } catch (error) {
      console.error('Erreur lors du démarrage de la formation:', error);
    }
  };

  const handleContinueFormation = (formationId: string) => {
    navigate({ to: '/dashboard/user/formation-view', search: { id: formationId } });
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (percentage >= 50) return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    if (percentage > 0) return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'IN_PROGRESS': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'FAILED': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'Terminée';
      case 'IN_PROGRESS': return 'En cours';
      case 'FAILED': return 'Échouée';
      default: return 'Non commencée';
    }
  };

  const filteredFormations = filter === 'all' 
    ? myFormations 
    : myFormations.filter(f => f.status === filter);

  const stats = {
    total: myFormations.length,
    completed: myFormations.filter(f => f.status === 'COMPLETED').length,
    inProgress: myFormations.filter(f => f.status === 'IN_PROGRESS').length,
    notStarted: myFormations.filter(f => f.status === 'NOT_STARTED').length,
  };

  if (isLoading) {
    return (
      <>
        <DashboardTopbar title="Mes Formations" description="Suivez votre progression" />
        <div className="min-h-screen bg-[#050816] px-6 pb-12">
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full bg-gray-800/50" />
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardTopbar title="Mes Formations" description="Suivez votre progression" />
      
      <div className="min-h-screen bg-[#050816] px-6 pb-12">
        <div className="space-y-6">
          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="rounded-md border border-white/10 bg-[#0c1023]/90">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total</p>
                    <p className="text-2xl font-bold text-white">{stats.total}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-md border border-white/10 bg-[#0c1023]/90">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Terminées</p>
                    <p className="text-2xl font-bold text-green-400">{stats.completed}</p>
                  </div>
                  <CheckCircle2 className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-md border border-white/10 bg-[#0c1023]/90">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">En cours</p>
                    <p className="text-2xl font-bold text-blue-400">{stats.inProgress}</p>
                  </div>
                  <Play className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-md border border-white/10 bg-[#0c1023]/90">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">À commencer</p>
                    <p className="text-2xl font-bold text-gray-400">{stats.notStarted}</p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filtres */}
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
              className={filter === 'all' ? '' : 'text-gray-400'}
            >
              Toutes ({myFormations.length})
            </Button>
            <Button
              variant={filter === 'NOT_STARTED' ? 'default' : 'outline'}
              onClick={() => setFilter('NOT_STARTED')}
              className={filter === 'NOT_STARTED' ? '' : 'text-gray-400'}
            >
              Non commencées ({stats.notStarted})
            </Button>
            <Button
              variant={filter === 'IN_PROGRESS' ? 'default' : 'outline'}
              onClick={() => setFilter('IN_PROGRESS')}
              className={filter === 'IN_PROGRESS' ? '' : 'text-gray-400'}
            >
              En cours ({stats.inProgress})
            </Button>
            <Button
              variant={filter === 'COMPLETED' ? 'default' : 'outline'}
              onClick={() => setFilter('COMPLETED')}
              className={filter === 'COMPLETED' ? '' : 'text-gray-400'}
            >
              Terminées ({stats.completed})
            </Button>
          </div>

          {/* Liste des formations */}
          {filteredFormations.length === 0 ? (
            <Card className="rounded-md border border-white/10 bg-[#0c1023]/90">
              <CardContent className="p-12 text-center">
                <div className="text-6xl mb-4">📚</div>
                <p className="text-xl text-white mb-2">Aucune formation trouvée</p>
                <p className="text-gray-400">
                  {filter === 'all' 
                    ? "Vous n'avez pas encore de formations assignées"
                    : `Vous n'avez pas de formations ${filter === 'COMPLETED' ? 'terminées' : filter === 'IN_PROGRESS' ? 'en cours' : 'non commencées'}`
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {filteredFormations.map((formation) => (
                <Card key={formation.id} className="rounded-md border border-white/10 bg-[#0c1023]/90 shadow-xl hover:shadow-2xl transition-all">
                  <CardContent className="px-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`p-3 rounded-sm text-2xl ${getProgressColor(formation.progressPercentage || 0)}`}>
                          {formation.progressPercentage >= 100 ? '✅' : formation.progressPercentage > 0 ? '📖' : '📚'}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-2">{formation.title}</h3>
                          <p className="text-gray-400 text-sm">{formation.description}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(formation.status)}>
                        {getStatusText(formation.status)}
                      </Badge>
                    </div>

                    {/* Progression */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Progression</span>
                        <span className="text-white font-medium">{formation.progressPercentage || 0}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all"
                          style={{ width: `${formation.progressPercentage || 0}%` }}
                        />
                      </div>
                    </div>

                    {/* Statistiques */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{formation.estimatedDuration} min</span>
                      </div>
                      {formation.bestScore !== undefined && formation.bestScore > 0 && (
                        <div className="flex items-center gap-2 text-sm">
                          <Award className="w-4 h-4" />
                          <span className={
                            formation.bestScore >= formation.passingScore 
                              ? 'text-green-400 font-semibold' 
                              : 'text-red-400 font-semibold'
                          }>
                            Score: {formation.bestScore}%
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>
                          {(() => {
                            const seconds = formation.timeSpent || 0;
                            const minutes = Math.floor(seconds / 60);
                            const remainingSeconds = seconds % 60;
                            if (minutes === 0) {
                              return `${seconds}s passées`;
                            } else if (remainingSeconds === 0) {
                              return `${minutes} min passées`;
                            } else {
                              return `${minutes}min ${remainingSeconds}s passées`;
                            }
                          })()}
                        </span>
                      </div>
                    </div>

                    {/* Résultat de l'évaluation pour les formations terminées */}
                    {formation.status === 'COMPLETED' && formation.bestScore !== undefined && (
                      <div className={`mb-4 p-3 rounded-lg border ${
                        formation.bestScore >= formation.passingScore
                          ? 'bg-green-500/10 border-green-500/30'
                          : 'bg-red-500/10 border-red-500/30'
                      }`}>
                        <div className="flex items-center gap-2">
                          {formation.bestScore >= formation.passingScore ? (
                            <>
                              <CheckCircle2 className="w-5 h-5 text-green-400" />
                              <span className="text-green-400 font-semibold">
                                ✅ Formation réussie - Score: {formation.bestScore}% (minimum: {formation.passingScore}%)
                              </span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-5 h-5 text-red-400" />
                              <span className="text-red-400 font-semibold">
                                ❌ Formation échouée - Score: {formation.bestScore}% (minimum requis: {formation.passingScore}%)
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end">
                      <Button onClick={() => {
                        if (formation.status === 'NOT_STARTED') {
                          handleStartFormation(formation.id);
                        } else {
                          handleContinueFormation(formation.id);
                        }
                      }}>
                        {formation.status === 'COMPLETED' ? 'Revoir' : formation.status === 'IN_PROGRESS' ? 'Continuer' : 'Commencer'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
