'use client';

import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { DashboardTopbar } from '@/components/layout/topbar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Clock,
  Award,
  CheckCircle2,
  XCircle,
  BookOpen,
  ChevronRight,
  History,
  ClipboardList,
  AlertCircle,
  Trophy,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { EvaluationAttempts } from './attempt-details';
import { MyEvaluation, useEvaluationStore } from '@/store/evaluation.store';
import { useTranslation } from 'react-i18next';

type TabType = 'todo' | 'history';

function EvaluationStatusBadge({ evaluation }: { evaluation: MyEvaluation }) {
  const { t: tCommon } = useTranslation('common');
  if (evaluation.isPassed) {
    return (
      <Badge className="bg-green-100 dark:bg-green-500/15 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20 gap-1">
        <CheckCircle2 className="w-3 h-3" />
        {tCommon('admin.formations.progress_passed')}
      </Badge>
    );
  }
  if (evaluation.hasReachedMaxAttempts) {
    return (
      <Badge className="bg-red-100 dark:bg-red-500/15 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20 gap-1">
        <XCircle className="w-3 h-3" />
        {tCommon('admin.formations.progress_failed')}
      </Badge>
    );
  }
  if (evaluation.attemptsUsed > 0) {
    return (
      <Badge className="bg-orange-100 dark:bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-500/20 gap-1">
        <AlertCircle className="w-3 h-3" />
        {tCommon('user.formations.in_progress_status')}
      </Badge>
    );
  }
  return (
    <Badge className="bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/10">
      {tCommon('user.evaluations.to_take')}
    </Badge>
  );
}

function EvaluationCard({ evaluation, showAttempts }: { evaluation: MyEvaluation; showAttempts: boolean }) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const { t: tCommon } = useTranslation('common');

  const handleGoToFormation = () => {
    navigate({
      to: '/dashboard/user/formation-view',
      search: { id: evaluation.formationId },
    });
  };

  return (
    <Card className="rounded-md border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.02] overflow-hidden">
      <CardContent className="p-0">
        {/* En-tête de la carte */}
        <div className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            {/* Icône */}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-violet-100 dark:bg-violet-500/15">
              {evaluation.isPassed ? (
                <Trophy className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              ) : (
                <ClipboardList className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  {evaluation.evaluationTitle}
                </h3>
                <EvaluationStatusBadge evaluation={evaluation} />
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5" />
                {evaluation.formationTitle}
              </p>

              {/* Métriques */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5" />
                  {tCommon('user.evaluations.required_score')} <span className="font-medium text-gray-700 dark:text-gray-300">{evaluation.passingScore}%</span>
                </span>

                {evaluation.maxAttempts != null && (
                  <span className="flex items-center gap-1.5">
                    <ClipboardList className="h-3.5 w-3.5" />
                    {tCommon('user.evaluations.attempts_label', { used: evaluation.attemptsUsed, max: evaluation.maxAttempts })}
                  </span>
                )}

                {evaluation.timeLimit && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {evaluation.timeLimit} min
                  </span>
                )}

                {evaluation.bestScore !== null && (
                  <span className="flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5" />
                    {tCommon('user.evaluations.best_score')}
                    <span className={cn(
                      'font-semibold',
                      evaluation.isPassed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    )}>
                      {evaluation.bestScore}%
                    </span>
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 shrink-0 self-start">
              {!evaluation.isPassed && !evaluation.hasReachedMaxAttempts && (
                <Button
                  size="sm"
                  onClick={handleGoToFormation}
                  className="bg-violet-600 hover:bg-violet-700 text-white gap-1.5"
                >
                  {evaluation.attemptsUsed === 0 ? tCommon('user.formations.action_start') : tCommon('user.evaluations.retry_btn')}
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              )}

              {showAttempts && evaluation.attempts.length > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setExpanded(!expanded)}
                  className="text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/10 gap-1.5"
                >
                  <History className="h-3.5 w-3.5" />
                  {expanded ? tCommon('user.formations.hide_sidebar') : tCommon('user.evaluations.history_count', { count: evaluation.attempts.length })}
                </Button>
              )}
            </div>
          </div>

          {/* Barre de progression vers le score requis */}
          {evaluation.bestScore !== null && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>{tCommon('user.evaluations.best_score_label')}</span>
                <span className={cn(
                  'font-medium',
                  evaluation.isPassed ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'
                )}>
                  {evaluation.bestScore}% / {tCommon('user.evaluations.required_score_value', { score: evaluation.passingScore })}
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-white/10 overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all',
                    evaluation.isPassed ? 'bg-green-500' : 'bg-orange-500'
                  )}
                  style={{ width: `${Math.min(100, (evaluation.bestScore / evaluation.passingScore) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Historique des tentatives (expandable) */}
        {expanded && (
          <div className="border-t border-gray-100 dark:border-white/5 p-5 bg-gray-50/50 dark:bg-black/10">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">{tCommon('user.evaluations.attempt_history')}</h4>
            <EvaluationAttempts
              attempts={evaluation.attempts}
              questions={evaluation.questions}
              passingScore={evaluation.passingScore}
              showCorrectAnswers={evaluation.showCorrectAnswers}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function UserEvaluationsPage() {
  const { myEvaluations, fetchMyEvaluations, isLoading } = useEvaluationStore();
  const [activeTab, setActiveTab] = useState<TabType>('todo');
  const { t: tCommon } = useTranslation('common');

  useEffect(() => {
    fetchMyEvaluations();
  }, []);

  const todoEvaluations = myEvaluations.filter(
    (e) => !e.isPassed && !e.hasReachedMaxAttempts
  );

  const historyEvaluations = myEvaluations.filter(
    (e) => e.attempts.length > 0
  );

  const stats = {
    total: myEvaluations.length,
    passed: myEvaluations.filter((e) => e.isPassed).length,
    failed: myEvaluations.filter((e) => e.hasReachedMaxAttempts && !e.isPassed).length,
    todo: todoEvaluations.length,
  };

  if (isLoading) {
    return (
      <>
        <DashboardTopbar title={tCommon('nav.topbar.evaluations_title')} description={tCommon('nav.topbar.evaluations_desc')} />
        <div className="min-h-screen bg-gray-50 dark:bg-[#050816] px-4 sm:px-6 pb-12 pt-6 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-36 w-full bg-gray-200 dark:bg-gray-800/50 rounded-md" />
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardTopbar title={tCommon('nav.topbar.evaluations_title')} description={tCommon('nav.topbar.evaluations_desc')} />

      <div className="min-h-screen bg-gray-50 dark:bg-[#050816] px-4 sm:px-6 pb-12 pt-6 space-y-6">
        {/* Statistiques */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="rounded-md border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.02]">
            <CardContent className="p-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{tCommon('user.formations.total_label')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </CardContent>
          </Card>
          <Card className="rounded-md border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.02]">
            <CardContent className="p-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{tCommon('user.evaluations.passed_count')}</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.passed}</p>
            </CardContent>
          </Card>
          <Card className="rounded-md border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.02]">
            <CardContent className="p-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{tCommon('user.evaluations.failed_count')}</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.failed}</p>
            </CardContent>
          </Card>
          <Card className="rounded-md border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.02]">
            <CardContent className="p-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{tCommon('user.evaluations.to_take')}</p>
              <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">{stats.todo}</p>
            </CardContent>
          </Card>
        </div>

        {/* Onglets */}
        <div className="flex gap-1 p-1 rounded-md bg-gray-100 dark:bg-white/5 w-fit">
          <button
            onClick={() => setActiveTab('todo')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
              activeTab === 'todo'
                ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            )}
          >
            <ClipboardList className="h-4 w-4" />
            {tCommon('user.evaluations.to_take')}
            {todoEvaluations.length > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-400 text-xs font-semibold">
                {todoEvaluations.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
              activeTab === 'history'
                ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            )}
          >
            <History className="h-4 w-4" />
            {tCommon('user.evaluations.history_tab')}
            {historyEvaluations.length > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-300 text-xs font-semibold">
                {historyEvaluations.length}
              </span>
            )}
          </button>
        </div>

        {/* Contenu de l'onglet actif */}
        {activeTab === 'todo' && (
          <div className="space-y-4">
            {todoEvaluations.length === 0 ? (
              <Card className="rounded-md border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.02]">
                <CardContent className="p-12 text-center">
                  <CheckCircle2 className="h-12 w-12 mx-auto text-green-500 mb-3" />
                  <p className="text-base font-medium text-gray-900 dark:text-white mb-1">
                    {tCommon('user.evaluations.all_completed')}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {tCommon('user.evaluations.no_pending')}
                  </p>
                </CardContent>
              </Card>
            ) : (
              todoEvaluations.map((evaluation) => (
                <EvaluationCard
                  key={evaluation.evaluationId}
                  evaluation={evaluation}
                  showAttempts={evaluation.attemptsUsed > 0}
                />
              ))
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            {historyEvaluations.length === 0 ? (
              <Card className="rounded-md border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.02]">
                <CardContent className="p-12 text-center">
                  <History className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                  <p className="text-base font-medium text-gray-900 dark:text-white mb-1">
                    {tCommon('user.evaluations.no_history')}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {tCommon('user.evaluations.no_history_desc')}
                  </p>
                </CardContent>
              </Card>
            ) : (
              historyEvaluations.map((evaluation) => (
                <EvaluationCard
                  key={evaluation.evaluationId}
                  evaluation={evaluation}
                  showAttempts={true}
                />
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
}