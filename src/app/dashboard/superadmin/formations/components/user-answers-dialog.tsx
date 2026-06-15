'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, CheckCircle2, XCircle, Clock, Award } from 'lucide-react';
import { apiService } from '@/app/services/api.service';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface UserAnswersDialogProps {
  formationId: string;
  userId: string;
  userName: string;
}

export function UserAnswersDialog({ formationId, userId, userName }: UserAnswersDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const loadUserAnswers = async () => {
    setLoading(true);
    try {
      const response = await apiService.get(`/formations/${formationId}/user/${userId}/attempts`);
      setData(response.data?.data || response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des réponses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen && !data) {
      loadUserAnswers();
    }
  };

  const getAttemptStatusBadge = (attempt: any) => {
    if (attempt.status !== 'COMPLETED') {
      return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">En cours</Badge>;
    }
    
    return attempt.passed ? (
      <Badge className="bg-green-500/20 text-green-400 border-green-500/30 gap-1">
        <CheckCircle2 className="w-3 h-3" />
        Réussi
      </Badge>
    ) : (
      <Badge className="bg-red-500/20 text-red-400 border-red-500/30 gap-1">
        <XCircle className="w-3 h-3" />
        Échoué
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger >
        <Button variant="outline" size="sm" className="text-gray-400 border-slate-600">
          <Eye className="w-4 h-4 mr-2" />
          Voir les réponses
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#0c1023] border-white/10">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white text-xl">Réponses de {userName}</DialogTitle>
          <DialogDescription className="text-gray-400">
            Détails des tentatives d'évaluation
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full bg-gray-800/50" />
            ))}
          </div>
        ) : data ? (
          <div className="space-y-2">
            {/* Info utilisateur */}
            <Card className="rounded-md border border-white/10 bg-gray-100 dark:bg-slate-900/50">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Nom</p>
                    <p className="text-gray-900 dark:text-white font-medium">{data.user.firstName} {data.user.lastName}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Email</p>
                    <p className="text-gray-900 dark:text-white">{data.user.email}</p>
                  </div>
                  {data.user.position && (
                    <div>
                      <p className="text-gray-400">Poste</p>
                      <p className="text-gray-900 dark:text-white">{data.user.position}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-gray-400">Nombre de tentatives</p>
                    <p className="text-gray-900 dark:text-white font-medium">{data.attempts.length} / {data.evaluation.maxAttempts}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tentatives */}
            {data.attempts.length === 0 ? (
              <Card className="rounded-md border border-white/10 bg-gray-100 dark:bg-slate-900/50">
                <CardContent className="p-8 text-center text-gray-400">
                  <p>Aucune tentative enregistrée</p>
                </CardContent>
              </Card>
            ) : (
              data.attempts.map((attempt: any, attemptIndex: number) => (
                <Card key={attempt.id} className="rounded-md border border-white/10 bg-gray-100 dark:bg-slate-900/50">
                  <CardContent className="p-6 space-y-4">
                    {/* En-tête tentative */}
                    <div className="flex items-center justify-between pb-4 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <h3 className="text-gray-900 dark:text-white font-semibold text-lg">Tentative {attempt.attemptNumber}</h3>
                        {getAttemptStatusBadge(attempt)}
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                          <Clock className="w-4 h-4" />
                          <span>
                            {(() => {
                              const seconds = attempt.timeSpent || 0;
                              const minutes = Math.floor(seconds / 60);
                              const remainingSeconds = seconds % 60;
                              return minutes > 0 ? `${minutes}min ${remainingSeconds}s` : `${seconds}s`;
                            })()}
                          </span>
                        </div>
                        {attempt.score !== null && (
                          <div className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-orange-400" />
                            <span className={cn(
                              "text-lg font-bold",
                              attempt.passed ? "text-green-400" : "text-red-400"
                            )}>
                              {attempt.score}%
                            </span>
                            <span className="text-gray-400 text-sm">/ {data.evaluation.passingScore}%</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Réponses */}
                    {attempt.answers && attempt.answers.length > 0 ? (
                      <div className="space-y-4">
                        <h4 className="text-gray-900 dark:text-white font-medium">Réponses détaillées</h4>
                        {attempt.answers.map((answer: any, answerIndex: number) => {
                          const question = data.evaluation.questions.find((q: any) => q.id === answer.questionId);
                          if (!question) return null;

                          return (
                            <div
                              key={answer.questionId}
                              className={cn(
                                "p-4 rounded-lg border",
                                answer.isCorrect
                                  ? "border-green-500/30 bg-green-500/10"
                                  : "border-red-500/30 bg-red-500/10"
                              )}
                            >
                              <div className="flex items-start gap-3">
                                <div className={cn(
                                  "mt-1 p-1 rounded",
                                  answer.isCorrect ? "bg-green-500/20" : "bg-red-500/20"
                                )}>
                                  {answer.isCorrect ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                                  ) : (
                                    <XCircle className="w-5 h-5 text-red-400" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p className="text-gray-900 dark:text-white font-medium mb-2">
                                    {answerIndex + 1}. {question.question}
                                  </p>
                                  
                                  {question.type === 'multiple_choice' && question.options && (
                                    <div className="space-y-2 text-sm">
                                      <div className="flex items-center gap-2">
                                        <span className="text-gray-400">Réponse donnée:</span>
                                        <span className={answer.isCorrect ? "text-green-400" : "text-red-400"}>
                                          {question.options[parseInt(answer.selectedAnswer)] || 'Non répondu'}
                                        </span>
                                      </div>
                                      {!answer.isCorrect && (
                                        <div className="flex items-center gap-2">
                                          <span className="text-gray-400">Réponse correcte:</span>
                                          <span className="text-green-400 font-medium">
                                            {question.options[question.correctAnswer]}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {question.type === 'true_false' && (
                                    <div className="space-y-2 text-sm">
                                      <div className="flex items-center gap-2">
                                        <span className="text-gray-400">Réponse donnée:</span>
                                        <span className={answer.isCorrect ? "text-green-400" : "text-red-400"}>
                                          {answer.selectedAnswer === 'true' ? 'Vrai' : answer.selectedAnswer === 'false' ? 'Faux' : 'Non répondu'}
                                        </span>
                                      </div>
                                      {!answer.isCorrect && (
                                        <div className="flex items-center gap-2">
                                          <span className="text-gray-400">Réponse correcte:</span>
                                          <span className="text-green-400 font-medium">
                                            {question.correctAnswer === 'true' ? 'Vrai' : 'Faux'}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {question.explanation && (
                                    <div className="mt-2 p-3 bg-slate-800/50 rounded text-sm">
                                      <p className="text-gray-400">
                                        <span className="font-medium">💡 Explication:</span> {question.explanation}
                                      </p>
                                    </div>
                                  )}

                                  <div className="mt-2 text-xs text-gray-500">
                                    Points: {answer.pointsEarned || 0} / {question.points}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm">Aucune réponse enregistrée pour cette tentative</p>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <p>Aucune donnée disponible</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
