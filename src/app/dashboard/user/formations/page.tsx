'use client';

import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DashboardTopbar } from '@/components/layout/topbar';
import { useFormationStore } from '@/store/formation.store';
import { Play, CheckCircle2, Clock, Award, TrendingUp, AlertCircle, XCircle, BookOpen, Library, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

export default function UserFormationsPage() {
  const { t: tCommon } = useTranslation('common');
  const navigate = useNavigate();
  const { myFormations, fetchMyFormations, startFormation, isLoading } = useFormationStore();
  const [filter, setFilter] = useState<'all' | 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'>('all');

  useEffect(() => {
    fetchMyFormations();
  }, []);

  const handleStartFormation = async (formationId: string) => {
    try {
      await startFormation(formationId);
      navigate({ to: '/dashboard/user/formation-view', search: { id: formationId } });
    } catch (error) {
      console.error('Erreur lors du démarrage de la formation:', error);
    }
  };

  const handleContinueFormation = (formationId: string) => {
    navigate({ to: '/dashboard/user/formation-view', search: { id: formationId } });
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'text-emerald-500 dark:text-emerald-400';
    if (percentage >= 50) return 'text-blue-500 dark:text-blue-400';
    if (percentage > 0) return 'text-orange-500 dark:text-orange-400';
    return 'text-gray-400 dark:text-gray-500';
  };

  const getStatusVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'COMPLETED': return 'default';
      case 'IN_PROGRESS': return 'secondary';
      case 'FAILED': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED': return tCommon('admin.page_overview.phishing_completed');
      case 'IN_PROGRESS': return tCommon('user.formations.in_progress_status');
      case 'FAILED': return tCommon('user.formations.failed_status');
      default: return tCommon('user.formations.not_started_status');
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
        <DashboardTopbar title={tCommon('nav.topbar.formations_user_title')} description={tCommon('nav.topbar.formations_user_desc')} />
        <div className="min-h-screen bg-gray-50 dark:bg-[#050816] px-4 sm:px-6 pb-12 pt-6">
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full bg-gray-200 dark:bg-gray-800/50 rounded-sm" />
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardTopbar title={tCommon('nav.topbar.formations_user_title')} description={tCommon('nav.topbar.formations_user_desc')} />
      
      <div className="min-h-screen bg-gray-50 dark:bg-[#050816] px-4 sm:px-6 pb-12 pt-6">
        <div className="space-y-6">
          {/* Statistiques */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.02]">
              <CardContent className="p-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">{tCommon('user.formations.total_label')}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</p>
              </CardContent>
            </Card>

            <Card className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.02]">
              <CardContent className="p-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">{tCommon('user.formations.completed_status')}</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{stats.completed}</p>
              </CardContent>
            </Card>

            <Card className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.02]">
              <CardContent className="p-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">{tCommon('user.formations.in_progress_status')}</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{stats.inProgress}</p>
              </CardContent>
            </Card>

            <Card className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.02]">
              <CardContent className="p-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">{tCommon('user.formations.to_start_status')}</p>
                <p className="text-2xl font-bold text-gray-400 dark:text-gray-500 mt-1">{stats.notStarted}</p>
              </CardContent>
            </Card>
          </div>

          {/* Filtres */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
              className={cn(
                "rounded-sm",
                filter === 'all' ? '' : 'text-gray-500 dark:text-gray-400'
              )}
            >
              {tCommon('user.formations.filter_all', { count: myFormations.length })}
            </Button>
            <Button
              variant={filter === 'NOT_STARTED' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('NOT_STARTED')}
              className={cn(
                "rounded-sm",
                filter === 'NOT_STARTED' ? '' : 'text-gray-500 dark:text-gray-400'
              )}
            >
              {tCommon('user.formations.filter_not_started', { count: stats.notStarted })}
            </Button>
            <Button
              variant={filter === 'IN_PROGRESS' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('IN_PROGRESS')}
              className={cn(
                "rounded-sm",
                filter === 'IN_PROGRESS' ? '' : 'text-gray-500 dark:text-gray-400'
              )}
            >
              {tCommon('user.formations.filter_in_progress', { count: stats.inProgress })}
            </Button>
            <Button
              variant={filter === 'COMPLETED' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('COMPLETED')}
              className={cn(
                "rounded-sm",
                filter === 'COMPLETED' ? '' : 'text-gray-500 dark:text-gray-400'
              )}
            >
              {tCommon('user.formations.filter_completed', { count: stats.completed })}
            </Button>
          </div>

          {/* Liste des formations */}
          {filteredFormations.length === 0 ? (
            <Card className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.02]">
              <CardContent className="p-12 text-center">
                <div className="flex justify-center mb-3">
                  <Library className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                </div>
                <p className="text-base font-medium text-gray-900 dark:text-white mb-1">{tCommon('user.formations.no_trainings')}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {filter === 'all' 
                    ? tCommon('user.formations.no_trainings_assigned')
                    : filter === 'COMPLETED' ? tCommon('user.formations.no_completed') : filter === 'IN_PROGRESS' ? tCommon('user.formations.no_in_progress') : tCommon('user.formations.no_not_started')
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredFormations?.map((formation) => (
                <Card 
                  key={formation.id} 
                  className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.02] hover:border-gray-300 dark:hover:border-white/20 transition-colors"
                >
                  <CardContent className="p-5">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      {/* Icône et infos */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1.5">
                              <div className={cn(
                                "p-1.5 rounded-sm",
                                formation.progressPercentage >= 100 
                                  ? "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                                  : formation.progressPercentage > 0
                                  ? "bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400"
                                  : "bg-gray-100 dark:bg-white/10 text-gray-400 dark:text-gray-500"
                              )}>
                                {formation.progressPercentage >= 100 ? (
                                  <CheckCircle2 className="w-4 h-4" />
                                ) : formation.progressPercentage > 0 ? (
                                  <BookOpen className="w-4 h-4" />
                                ) : (
                                  <Library className="w-4 h-4" />
                                )}
                              </div>
                              <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                                {formation.title}
                              </h3>
                            </div>
                            {formation.description && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                                {formation.description}
                              </p>
                            )}
                          </div>
                          <Badge 
                            variant={getStatusVariant(formation.status)}
                            className="shrink-0 text-xs font-medium"
                          >
                            {getStatusText(formation.status)}
                          </Badge>
                        </div>

                        {/* Métriques */}
                        <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {formation.estimatedDuration} min
                          </span>
                          {formation.bestScore !== undefined && formation.bestScore > 0 && (
                            <span className="flex items-center gap-1.5">
                              <Award className="w-3.5 h-3.5" />
                              <span className={cn(
                                "font-medium",
                                formation.bestScore >= formation.passingScore 
                                  ? "text-emerald-600 dark:text-emerald-400" 
                                  : "text-red-600 dark:text-red-400"
                              )}>
                                {formation.bestScore}%
                              </span>
                            </span>
                          )}
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {(() => {
                              const seconds = formation.timeSpent || 0;
                              const minutes = Math.floor(seconds / 60);
                              if (minutes === 0) return `${seconds}s`;
                              return `${minutes}min`;
                            })()}
                          </span>
                        </div>

                        {/* Barre de progression */}
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                            <span>{tCommon('admin.formations.progression')}</span>
                            <span className={cn("font-medium", getProgressColor(formation.progressPercentage || 0))}>
                              {formation.progressPercentage || 0}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all duration-500",
                                formation.progressPercentage >= 100 
                                  ? "bg-emerald-500" 
                                  : formation.progressPercentage >= 50
                                  ? "bg-blue-500"
                                  : formation.progressPercentage > 0
                                  ? "bg-orange-500"
                                  : "bg-gray-300 dark:bg-gray-600"
                              )}
                              style={{ width: `${formation.progressPercentage || 0}%` }}
                            />
                          </div>
                        </div>

                        {/* Résultat pour formations terminées */}
                        {formation.status === 'COMPLETED' && formation?.hasFinalEvaluation && formation.bestScore !== undefined && (
  <div className={cn(
    "mt-3 px-3 py-2 rounded-sm border text-sm flex items-center gap-2",
    formation.bestScore >= formation.passingScore
      ? "border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
      : "border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400"
  )}>
    {formation.bestScore >= formation.passingScore ? (
      <CheckCircle2 className="w-4 h-4 shrink-0" />
    ) : (
      <XCircle className="w-4 h-4 shrink-0" />
    )}
    <span>
      {formation.bestScore >= formation.passingScore ? tCommon('user.formations.result_passed') : tCommon('user.formations.result_failed')} —
      <span className="font-semibold"> {formation.bestScore}%</span>
      {' '}{tCommon('user.formations.required_passing', { score: formation.passingScore })}
    </span>
  </div>
)}
                      </div>

                      {/* Bouton d'action */}
                      <div className="shrink-0 self-start md:self-center">
                        <Button
                          size="sm"
                          onClick={() => {
                            if (formation.status === 'NOT_STARTED') {
                              handleStartFormation(formation.id);
                            } else {
                              handleContinueFormation(formation.id);
                            }
                          }}
                          className="rounded-sm gap-1.5"
                        >
                          {formation.status === 'COMPLETED' ? tCommon('user.formations.action_review') : formation.status === 'IN_PROGRESS' ? tCommon('user.formations.action_continue') : tCommon('user.formations.action_start')}
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Button>
                      </div>
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