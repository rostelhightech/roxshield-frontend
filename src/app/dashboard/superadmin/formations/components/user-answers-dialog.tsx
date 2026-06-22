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
import { Eye, Clock, RotateCcw } from 'lucide-react';
import { apiService } from '@/app/services/api.service';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
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

interface UserAnswersDialogProps {
  formationId: string;
  userId: string;
  userName: string;
}

export function UserAnswersDialog({ formationId, userId, userName }: UserAnswersDialogProps) {
  const { t: tCommon } = useTranslation('common');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
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

  const handleReset = async () => {
    setResetting(true);
    try {
      await apiService.post(`/formations/${formationId}/reset-attempts`, {
        userIds: [userId],
      });
      toast.success(`Tentatives de ${userName} réinitialisées`);
      setData(null);
      await loadUserAnswers();
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
      toast.error('Erreur lors de la réinitialisation');
    } finally {
      setResetting(false);
    }
  };

  const getAttemptStatusBadge = (attempt: any) => {
    if (attempt.status !== 'COMPLETED') {
      return (
        <Badge className="bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20 font-medium">
          {tCommon('user.formations.in_progress_status')}
        </Badge>
      );
    }

    return attempt.passed ? (
      <Badge className="bg-green-100 dark:bg-green-500/15 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20 font-medium">
        {tCommon('admin.formations.progress_passed')}
      </Badge>
    ) : (
      <Badge className="bg-red-100 dark:bg-red-500/15 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20 font-medium">
        {tCommon('admin.formations.progress_failed')}
      </Badge>
    );
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${seconds}s`;
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger>
        <Button variant="outline" size="sm" className="text-gray-600 dark:text-gray-400 border-gray-300 dark:border-slate-600">
          <Eye className="w-4 h-4 mr-2" />
          Voir les réponses
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#0a0e1f] border-gray-200 dark:border-white/10">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-gray-900 dark:text-white text-2xl font-bold">{userName}</DialogTitle>
              <DialogDescription className="text-gray-500 dark:text-gray-400">
                {tCommon('user.evaluations.attempt_history')}
              </DialogDescription>
            </div>

            {data && (
              <AlertDialog>
                <AlertDialogTrigger>
                  <Button
                    size="sm"
                    disabled={resetting}
                    className="bg-orange-500 hover:bg-orange-600 text-white shrink-0"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    {tCommon('admin.campaigns.form_reset')}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{tCommon('admin.formations.user_answers_reset_confirm')}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {userName} pourra repasser l'évaluation depuis le début. L'historique actuel
                      ({data.attempts.length} tentative{data.attempts.length > 1 ? 's' : ''}) reste consultable mais
                      ne comptera plus dans la limite de tentatives.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{tCommon('user.formations.cancel')}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleReset}>{tCommon('login.confirm')}</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </DialogHeader>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full bg-gray-100 dark:bg-gray-800/50" />
            ))}
          </div>
        ) : data ? (
          <div className="space-y-5">
            {/* Info utilisateur */}
            <Card className="rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/[0.03]">
              <CardContent className="p-4">
                <div className="flex justify-between flex-wrap gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide mb-1">{tCommon('user.profile.last_name')}</p>
                    <p className="text-gray-900 dark:text-white font-medium">{data.user.firstName} {data.user.lastName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide mb-1">{tCommon('user.profile.email')}</p>
                    <p className="text-gray-900 dark:text-white">{data.user.email}</p>
                  </div>
                  {data.user.position && (
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide mb-1">Poste</p>
                      <p className="text-gray-900 dark:text-white">{data.user.position}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide mb-1">Tentatives</p>
                    <p className="text-gray-900 dark:text-white font-medium">{data.attempts.length} / {data.evaluation.maxAttempts}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tentatives */}
            {data.attempts.length === 0 ? (
              <Card className="rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/[0.03]">
                <CardContent className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <p>{tCommon('admin.formations.user_answers_no_attempts')}</p>
                </CardContent>
              </Card>
            ) : (
              data.attempts.map((attempt: any) => (
                <Card key={attempt.id} className="rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.02] overflow-hidden">
                  {/* En-tête tentative */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-white/10 flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-gray-900 dark:text-white font-semibold text-base">
                        Tentative {attempt.attemptNumber}
                      </h3>
                      {getAttemptStatusBadge(attempt)}
                    </div>

                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{formatTime(attempt.timeSpent || 0)}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-500 dark:text-gray-400">Score</span>
                        {attempt.score !== null ? (
                          <span className={cn(
                            "font-bold",
                            attempt.passed ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                          )}>
                            {attempt.score}%
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-500 dark:text-gray-400">Requis</span>
                        <span className="text-gray-700 dark:text-gray-300">{data.evaluation.passingScore}%</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-500 dark:text-gray-400">Points</span>
                        {attempt.totalPoints ? (
                          <span className="text-gray-700 dark:text-gray-300">{attempt.earnedPoints} / {attempt.totalPoints}</span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Tableau des réponses */}
                  {attempt.status !== 'COMPLETED' ? (
                    <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-8">
                      Cette tentative est en cours. Les résultats seront disponibles une fois l'évaluation terminée.
                    </p>
                  ) : attempt.answers && attempt.answers.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide border-b border-gray-200 dark:border-white/10">
                            <th className="px-4 py-2.5 font-medium">Question</th>
                            <th className="px-4 py-2.5 font-medium">{tCommon('admin.formations.user_answers_your_answer')}</th>
                            <th className="px-4 py-2.5 font-medium">{tCommon('admin.formations.user_answers_correct_answer')}</th>
                            <th className="px-4 py-2.5 font-medium">{tCommon('admin.formations.create_explanation')}</th>
                            <th className="px-4 py-2.5 font-medium text-right">Points</th>
                          </tr>
                        </thead>
                        <tbody>
                          {attempt.answers.map((answer: any, answerIndex: number) => {
                            const question = data.evaluation.questions.find((q: any) => q.id === answer.questionId);
                            if (!question) return null;

                            const formatAnswer = (raw: string) => {
                              if (question.type === 'multiple_choice' && question.options) {
                                return question.options[parseInt(raw)] ?? 'Non répondu';
                              }
                              if (question.type === 'true_false') {
                                return raw === 'true' ? 'Vrai' : raw === 'false' ? 'Faux' : 'Non répondu';
                              }
                              return raw || 'Non répondu';
                            };

                            const formatCorrect = () => {
                              if (question.type === 'multiple_choice' && question.options) {
                                return question.options[question.correctAnswer];
                              }
                              if (question.type === 'true_false') {
                                return question.correctAnswer === 'true' ? 'Vrai' : 'Faux';
                              }
                              return question.correctAnswer;
                            };

                            return (
                              <tr
                                key={answer.questionId}
                                className="border-b border-gray-100 dark:border-white/5 last:border-0"
                              >
                                <td className="px-4 py-3 text-gray-900 dark:text-white max-w-[220px]">
                                  {answerIndex + 1}. {question.question}
                                </td>
                                <td className={cn(
                                  "px-4 py-3 font-medium",
                                  answer.isCorrect ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                                )}>
                                  {formatAnswer(answer.selectedAnswer)}
                                </td>
                                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                                  {answer.isCorrect ? '—' : formatCorrect()}
                                </td>
                                <td className="px-4 py-3 text-gray-500 dark:text-gray-400 max-w-[280px]">
                                  {answer.isCorrect ? '—' : (question.explanation || '—')}
                                </td>
                                <td className={cn(
                                  "px-4 py-3 text-right font-medium whitespace-nowrap",
                                  answer.isCorrect ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                                )}>
                                  {answer.pointsEarned || 0} / {question.points}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-8">
                      {tCommon('admin.formations.user_answers_no_response')}
                    </p>
                  )}
                </Card>
              ))
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>{tCommon('admin.page_overview.no_data')}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}