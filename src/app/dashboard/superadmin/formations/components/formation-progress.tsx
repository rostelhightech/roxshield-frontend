'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import type { FormationProgress } from '@/store/formation.store';
import { useFormationStore } from '@/store/formation.store';
import { UserAnswersDialog } from './user-answers-dialog';

interface FormationProgressProps {
  progress: FormationProgress[];
}

export function FormationProgressComponent({ progress }: FormationProgressProps) {
  const { selectedFormation } = useFormationStore();
  const passingScore = selectedFormation?.passingScore || 80;

  const getProgressStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return '✅';
      case 'FAILED': return '❌';
      case 'IN_PROGRESS': return '🔄';
      default: return '⏳';
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

  // Fonction pour déterminer si l'utilisateur a réussi ou échoué
  const getResultBadge = (userProgress: FormationProgress) => {
    if (userProgress.status !== 'COMPLETED') return null;
    
    const hasPassed = userProgress.finalScore >= passingScore;
    
    return hasPassed ? (
      <Badge className="bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border-green-300 dark:border-green-500/30 gap-1">
        <CheckCircle2 className="w-3 h-3" />
        Réussi
      </Badge>
    ) : (
      <Badge className="bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border-red-300 dark:border-red-500/30 gap-1">
        <XCircle className="w-3 h-3" />
        Échoué
      </Badge>
    );
  };

  return (
    <Card className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1023]/90">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">Progression des utilisateurs</CardTitle>
      </CardHeader>
      <CardContent>
        {progress.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Aucune progression d'utilisateur enregistrée</p>
          </div>
        ) : (
          <div className="space-y-4">
            {progress.slice(0, 10).map((userProgress) => (
              <motion.div
                key={userProgress.progressId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/30 rounded-lg border border-gray-200 dark:border-slate-700/50"
              >
                <div className="flex items-center gap-4 flex-1">
                  <span className="text-xl">{getProgressStatusIcon(userProgress.status)}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-gray-900 dark:text-white font-medium">
                        {userProgress.userFirstName} {userProgress.userLastName}
                      </p>
                      {getResultBadge(userProgress)}
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{userProgress.userEmail}</p>
                    {userProgress.userPosition && (
                      <p className="text-gray-400 dark:text-gray-500 text-xs">{userProgress.userPosition}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className={`font-medium ${getProgressStatusColor(userProgress.status)}`}>
                      {userProgress.status === 'COMPLETED' ? 'Complété' : 
                       userProgress.status === 'IN_PROGRESS' ? 'En cours' :
                       userProgress.status === 'FAILED' ? 'Échoué' : 'Non commencé'}
                    </p>
                    {userProgress.finalScore > 0 && (
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

                  {/* Bouton pour voir les réponses */}
                  {userProgress.status === 'COMPLETED' && selectedFormation && (
                    <UserAnswersDialog
                      formationId={selectedFormation.id}
                      userId={userProgress.userId}
                      userName={`${userProgress.userFirstName} ${userProgress.userLastName}`}
                    />
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