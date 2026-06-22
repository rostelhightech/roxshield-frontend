'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Users, CheckCircle2, XCircle, RotateCcw, Hourglass } from 'lucide-react';
import { motion } from 'framer-motion';
import type { FormationProgress } from '@/store/formation.store';
import { useFormationStore } from '@/store/formation.store';
import { UserAnswersDialog } from './user-answers-dialog';
import { apiService } from '@/app/services/api.service';
import toast from 'react-hot-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { useTranslation } from 'react-i18next';


interface FormationProgressProps {
  progress: FormationProgress[];
}

export function FormationProgressComponent({ progress }: FormationProgressProps) {
  const { t: tCommon } = useTranslation('common');
  const { selectedFormation, fetchFormationProgress } = useFormationStore();
  const passingScore = selectedFormation?.passingScore || 80;

   const hasFinalEvaluation = !!(
    selectedFormation?.finalEvaluation &&
    selectedFormation.finalEvaluation.questions &&
    selectedFormation.finalEvaluation.questions.length > 0
  );

  // ✅ Sélection multiple pour le reset groupé
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
  const [bulkResetting, setBulkResetting] = useState(false);

  const toggleUserSelection = (userId: string) => {
    setSelectedUserIds((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedUserIds.size === progress.length) {
      setSelectedUserIds(new Set());
    } else {
      setSelectedUserIds(new Set(progress.map((p) => p.userId)));
    }
  };

  const handleBulkReset = async () => {
    if (!selectedFormation || selectedUserIds.size === 0) return;

    setBulkResetting(true);
    try {
      await apiService.post(`/formations/${selectedFormation.id}/reset-attempts`, {
        userIds: Array.from(selectedUserIds),
      });
      toast.success(`${selectedUserIds.size} utilisateur(s) réinitialisé(s)`);
      setSelectedUserIds(new Set());
      await fetchFormationProgress?.(selectedFormation.id);
    } catch (error) {
      console.error('Erreur lors de la réinitialisation groupée:', error);
      toast.error('Erreur lors de la réinitialisation groupée');
    } finally {
      setBulkResetting(false);
    }
  };

  const getProgressStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle2 className="w-3 h-3" />;
      case 'FAILED': return <XCircle className="w-3 h-3" />;
      case 'IN_PROGRESS': return <RotateCcw className="w-3 h-3 animate-spin" />;
      default: return <Hourglass className="w-3 h-3" />;
    }
  };

  const getProgressStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'text-green-600 dark:text-green-400';
      case 'FAILED': return 'text-red-600 dark:text-red-400';
      case 'IN_PROGRESS': return 'text-blue-600 dark:text-blue-400';
      default: return 'text-gray-400 dark:text-gray-400';
    }
  };

  const getResultBadge = (userProgress: FormationProgress) => {
    if (userProgress.status !== 'COMPLETED') return null;
    if (!hasFinalEvaluation) return null;

    const hasPassed = userProgress.finalScore >= passingScore;

    return hasPassed ? (
      <Badge className="bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border-green-300 dark:border-green-500/30 gap-1">
        <CheckCircle2 className="w-3 h-3" />
        {tCommon('admin.formations.progress_passed')}
      </Badge>
    ) : (
      <Badge className="bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border-red-300 dark:border-red-500/30 gap-1">
        <XCircle className="w-3 h-3" />
        {tCommon('admin.formations.progress_failed')}
      </Badge>
    );
  };

  return (
  <Card className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1023]/90">
  <CardHeader>
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <CardTitle className="text-gray-900 dark:text-white">{tCommon('admin.formations.progress_users')}</CardTitle>

      {selectedUserIds.size > 0 && (
        <AlertDialog>
          <AlertDialogTrigger >
            <Button
              variant="outline"
              size="sm"
              disabled={bulkResetting}
              className="text-orange-500 border-orange-500/30 hover:bg-orange-500/10 w-full sm:w-auto"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Réinitialiser la sélection ({selectedUserIds.size})
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Réinitialiser {selectedUserIds.size} utilisateur(s) ?</AlertDialogTitle>
              <AlertDialogDescription>
                Ces utilisateurs pourront repasser l'évaluation depuis le début. Leur historique de
                tentatives reste consultable mais ne comptera plus dans la limite.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{tCommon('user.formations.cancel')}</AlertDialogCancel>
              <AlertDialogAction onClick={handleBulkReset}>{tCommon('login.confirm')}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  </CardHeader>
  <CardContent>
    {progress.length === 0 ? (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Aucune progression d'utilisateur enregistrée</p>
      </div>
    ) : (
      <div className="space-y-4">
        {/* ✅ Sélectionner tout */}
        <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-white/10">
          <Checkbox
            checked={selectedUserIds.size === progress.length}
            onCheckedChange={toggleSelectAll}
          />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Tout sélectionner ({progress.length})
          </span>
        </div>

        {progress.slice(0, 10).map((userProgress) => (
          <motion.div
            key={userProgress.progressId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-gray-50 dark:bg-slate-800/30 rounded-lg border border-gray-200 dark:border-slate-700/50"
          >
            <div className="flex items-start sm:items-center gap-3 sm:gap-4 w-full sm:flex-1 min-w-0">
              {/* ✅ Checkbox de sélection */}
              <Checkbox
                checked={selectedUserIds.has(userProgress.userId)}
                onCheckedChange={() => toggleUserSelection(userProgress.userId)}
                className="shrink-0 mt-1 sm:mt-0"
              />

              <span className="text-xl shrink-0">{getProgressStatusIcon(userProgress.status)}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <p className="text-gray-900 dark:text-white font-medium truncate">
                    {userProgress.userFirstName} {userProgress.userLastName}
                  </p>
                  {getResultBadge(userProgress)}
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm truncate">{userProgress.userEmail}</p>
                {userProgress.userPosition && (
                  <p className="text-gray-400 dark:text-gray-500 text-xs truncate">{userProgress.userPosition}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto pl-9 sm:pl-0">
              <div className="text-left sm:text-right">
                <p className={`font-medium ${getProgressStatusColor(userProgress.status)}`}>
                  {userProgress.status === 'COMPLETED' ? 'Complété' :
                   userProgress.status === 'IN_PROGRESS' ? tCommon('user.formations.in_progress_status') :
                   userProgress.status === 'FAILED' ? tCommon('admin.formations.progress_failed') : 'Non commencé'}
                </p>
                {hasFinalEvaluation && userProgress.finalScore > 0 && (
                  <p className={`text-sm font-semibold ${
                    userProgress.finalScore >= passingScore
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    Score: {userProgress.finalScore}% {userProgress.status === 'COMPLETED' && `/ ${passingScore}%`}
                  </p>
                )}
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Temps: {(() => {
                    const seconds = userProgress.timeSpent || 0;
                    const minutes = Math.floor(seconds / 60);
                    const remainingSeconds = seconds % 60;
                    if (minutes === 0) {
                      return `${seconds}s`;
                    } else if (remainingSeconds === 0) {
                      return `${minutes} min`;
                    } else {
                      return `${minutes}min ${remainingSeconds}s`;
                    }
                  })()}
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-xs">
                  Progression: {userProgress.progressPercentage}%
                </p>
                {userProgress.completedAt && (
                  <p className="text-gray-400 dark:text-gray-500 text-xs">
                    Terminé le {new Date(userProgress.completedAt).toLocaleDateString('fr-FR')}
                  </p>
                )}
              </div>

              {/* Bouton pour voir les réponses (inclut maintenant le reset individuel) */}
              {selectedFormation && hasFinalEvaluation && (
                <div className="shrink-0">
                  <UserAnswersDialog
                    formationId={selectedFormation.id}
                    userId={userProgress.userId}
                    userName={`${userProgress.userFirstName} ${userProgress.userLastName}`}
                  />
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {progress.length > 10 && (
          <div className="text-center pt-4">
            <Button variant="outline" size="sm">
              Voir tous les utilisateurs ({progress.length})
            </Button>
          </div>
        )}
      </div>
    )}
  </CardContent>
</Card>
  );
}