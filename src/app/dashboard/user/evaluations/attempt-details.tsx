'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, Award, CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { EvaluationAttempt, EvaluationQuestion } from '@/store/evaluation.store';
import { useTranslation } from 'react-i18next';

interface AttemptDetailProps {
  attempt: EvaluationAttempt;
  questions: EvaluationQuestion[];
  passingScore: number;
  showCorrectAnswers: boolean;
}

function AttemptDetail({ attempt, questions, passingScore, showCorrectAnswers }: AttemptDetailProps) {
  const { t: tCommon } = useTranslation('common');
  const [expanded, setExpanded] = useState(false);

  const formatTime = (seconds: number | null) => {
    if (!seconds) return '—';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${seconds}s`;
  };

  const getStatusBadge = () => {
    if (attempt.status !== 'COMPLETED') {
      return (
        <Badge className="bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20">
          {tCommon('user.formations.in_progress_status')}
        </Badge>
      );
    }
    return attempt.passed ? (
      <Badge className="bg-green-100 dark:bg-green-500/15 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20">
        {tCommon('admin.formations.progress_passed')}
      </Badge>
    ) : (
      <Badge className="bg-red-100 dark:bg-red-500/15 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20">
        {tCommon('admin.formations.progress_failed')}
      </Badge>
    );
  };

  const formatAnswer = (raw: string, question: EvaluationQuestion) => {
    if (question.type === 'multiple_choice' && question.options) {
      return question.options[parseInt(raw)] ?? 'Non répondu';
    }
    if (question.type === 'true_false') {
      return raw === 'true' ? 'Vrai' : raw === 'false' ? 'Faux' : 'Non répondu';
    }
    return raw || 'Non répondu';
  };

  const formatCorrect = (question: EvaluationQuestion) => {
    if (!question.correctAnswer && question.correctAnswer !== 0) return '—';
    if (question.type === 'multiple_choice' && question.options) {
      return question.options[question.correctAnswer as number] ?? '—';
    }
    if (question.type === 'true_false') {
      return question.correctAnswer === 'true' ? 'Vrai' : 'Faux';
    }
    return String(question.correctAnswer);
  };

  return (
    <div className="rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.02] overflow-hidden">
      {/* En-tête de la tentative */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left"
      >
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            Tentative {attempt.attemptNumber}
          </span>
          {getStatusBadge()}
          {attempt.completedAt && (
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {new Date(attempt.completedAt).toLocaleDateString('fr-FR', {
                day: '2-digit', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
              })}
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <Clock className="h-3.5 w-3.5" />
            {formatTime(attempt.timeSpent)}
          </div>
          {attempt.score !== null && (
            <div className="flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5 text-gray-400" />
              <span className={cn(
                'text-sm font-bold',
                attempt.passed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              )}>
                {attempt.score}%
              </span>
              <span className="text-xs text-gray-400">/ {passingScore}%</span>
            </div>
          )}
          {attempt.totalPoints != null && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {attempt.earnedPoints} / {attempt.totalPoints} pts
            </span>
          )}
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </button>

      {/* Détail des réponses */}
      {expanded && (
        attempt.status !== 'COMPLETED' ? (
          <div className="px-4 pb-4 text-sm text-gray-500 dark:text-gray-400 text-center py-6">
            Cette tentative est en cours. Les résultats seront disponibles une fois l'évaluation terminée.
          </div>
        ) : attempt.answers && attempt.answers.length > 0 ? (
          <div className="overflow-x-auto border-t border-gray-100 dark:border-white/5">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide border-b border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02]">
                  <th className="px-4 py-2.5 font-medium">Question</th>
                  <th className="px-4 py-2.5 font-medium">{tCommon('admin.formations.user_answers_your_answer')}</th>
                  {showCorrectAnswers && (
                    <th className="px-4 py-2.5 font-medium">{tCommon('admin.formations.user_answers_correct_answer')}</th>
                  )}
                  {showCorrectAnswers && (
                    <th className="px-4 py-2.5 font-medium">{tCommon('admin.formations.create_explanation')}</th>
                  )}
                  <th className="px-4 py-2.5 font-medium text-right">Points</th>
                </tr>
              </thead>
              <tbody>
                {attempt.answers.map((answer, index) => {
                  const question = questions.find((q) => q.id === answer.questionId);
                  if (!question) return null;

                  return (
                    <tr
                      key={answer.questionId}
                      className="border-b border-gray-100 dark:border-white/5 last:border-0"
                    >
                      <td className="px-4 py-3 text-gray-900 dark:text-white max-w-[200px]">
                        {index + 1}. {question.question}
                      </td>
                      <td className={cn(
                        'px-4 py-3 font-medium',
                        answer.isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      )}>
                        <span className="flex items-center gap-1.5">
                          {answer.isCorrect ? (
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                          ) : (
                            <XCircle className="h-3.5 w-3.5 shrink-0" />
                          )}
                          {formatAnswer(answer.selectedAnswer, question)}
                        </span>
                      </td>
                      {showCorrectAnswers && (
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                          {answer.isCorrect ? '—' : formatCorrect(question)}
                        </td>
                      )}
                      {showCorrectAnswers && (
                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400 max-w-[200px] text-xs">
                          {answer.isCorrect ? '—' : (question.explanation || '—')}
                        </td>
                      )}
                      <td className={cn(
                        'px-4 py-3 text-right font-medium whitespace-nowrap',
                        answer.isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      )}>
                        {answer.pointsEarned} / {question.points}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-4 pb-4 text-sm text-gray-500 dark:text-gray-400 text-center py-6">
            Aucune réponse enregistrée pour cette tentative.
          </div>
        )
      )}
    </div>
  );
}

interface EvaluationAttemptsProps {
  attempts: EvaluationAttempt[];
  questions: EvaluationQuestion[];
  passingScore: number;
  showCorrectAnswers: boolean;
}

export function EvaluationAttempts({ attempts, questions, passingScore, showCorrectAnswers }: EvaluationAttemptsProps) {
  if (attempts.length === 0) {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">
        Aucune tentative pour cette évaluation.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {attempts.map((attempt) => (
        <AttemptDetail
          key={attempt.id}
          attempt={attempt}
          questions={questions}
          passingScore={passingScore}
          showCorrectAnswers={showCorrectAnswers}
        />
      ))}
    </div>
  );
}