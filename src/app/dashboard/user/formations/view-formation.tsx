'use client';

import { useEffect, useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DashboardTopbar } from '@/components/layout/topbar';
import { useFormationStore } from '@/store/formation.store';
import { EvaluationQuiz } from '@/components/evaluation-quiz';
import { Award, CheckCircle2, ChevronRight, ChevronLeft, BookOpen, XCircle, Menu } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { ResultBanner } from './result-banner';
import { FormationSidebar } from './formation-sidebar';
import { ChapterHeader } from './chapter-header';
import { ChapterContentViewer } from './chapter-content-viewer';
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

export default function ViewFormationPage() {
  const { t: tCommon } = useTranslation('common');
  const navigate = useNavigate();
  const searchParams = useSearch({ from: '/_authenticated/dashboard/user/formation-view' });
  const formationId = (searchParams as any)?.id as string;

  const {
    selectedFormation,
    myFormations,
    fetchById,
    completeFormation,
    saveChapterProgress,
    getChaptersProgress,
    submitEvaluation,
    startEvaluation,
    isLoading,
    addTime,
    getEvaluationAttempts,
  } = useFormationStore();

  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [completedChapters, setCompletedChapters] = useState<Set<string>>(new Set());
  const [showSidebar, setShowSidebar] = useState(true);
  const [showFinalEvaluation, setShowFinalEvaluation] = useState(false);
  const [evaluationPassed, setEvaluationPassed] = useState(false);
  const [evaluationFailed, setEvaluationFailed] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(null);
  const [finalScore, setFinalScore] = useState(0);
  const [currentAttemptId, setCurrentAttemptId] = useState<string | null>(null);
  const [hasReachedMaxAttempts, setHasReachedMaxAttempts] = useState(false);

  // Sauvegarder l'état de la sidebar dans localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('formation-sidebar-visible');
    if (savedState !== null) {
      setShowSidebar(savedState === 'true');
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !showSidebar;
    setShowSidebar(newState);
    localStorage.setItem('formation-sidebar-visible', String(newState));
  };

  useEffect(() => {
    if (formationId) {
      fetchById(formationId);
      getChaptersProgress(formationId).then((progress) => {
        const completedIds = progress
          .filter((p: any) => p.isCompleted)
          .map((p: any) => p.chapterId);
        setCompletedChapters(new Set(completedIds));
      });
    }
  }, [formationId, fetchById]);

  const userFormationProgress = myFormations.find((f) => f.id === formationId);
  const isFormationCompleted = userFormationProgress?.status === 'COMPLETED';
  const userFinalScore = userFormationProgress?.bestScore || 0;

  const totalChapters =
    selectedFormation?.modules?.reduce((sum, mod) => sum + (mod.chapters?.length || 0), 0) || 0;
  const progressPercentage = totalChapters > 0 ? (completedChapters.size / totalChapters) * 100 : 0;

  const currentModule = selectedFormation?.modules?.[currentModuleIndex];
  const currentChapter = currentModule?.chapters?.[currentChapterIndex];

  useEffect(() => {
  if (!currentChapter) return;
  if (userFormationProgress?.status !== 'IN_PROGRESS') return;

  let lastSent = Date.now();

  const interval = setInterval(() => {
    const now = Date.now();
    const delta = now - lastSent;
    lastSent = now;

    addTime(currentChapter.id, { timeSpent: Math.floor(delta / 1000) });
  }, 30000);

  return () => clearInterval(interval);
}, [currentChapter, userFormationProgress?.status]);

  const goToNextChapter = async () => {
    if (!currentModule || !currentChapter) return;

    if (currentChapter?.id && !completedChapters.has(currentChapter.id)) {
      setCompletedChapters((prev) => new Set(prev).add(currentChapter.id!));

      try {
        await saveChapterProgress(formationId, currentChapter.id, {
          isCompleted: true,
        });
      } catch (error) {
        console.error('Erreur lors de la sauvegarde de la progression:', error);
      }
    }

    if (currentChapterIndex < (currentModule.chapters?.length || 0) - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
    } else if (currentModuleIndex < (selectedFormation?.modules?.length || 0) - 1) {
      setCurrentModuleIndex(currentModuleIndex + 1);
      setCurrentChapterIndex(0);
    }
  };

  const goToPreviousChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1);
    } else if (currentModuleIndex > 0) {
      const previousModule = selectedFormation?.modules?.[currentModuleIndex - 1];
      setCurrentModuleIndex(currentModuleIndex - 1);
      setCurrentChapterIndex((previousModule?.chapters?.length || 1) - 1);
    }
  };

  const isFirstChapter = currentModuleIndex === 0 && currentChapterIndex === 0;
  const isLastChapter =
    currentModuleIndex === (selectedFormation?.modules?.length || 0) - 1 &&
    currentChapterIndex === (currentModule?.chapters?.length || 0) - 1;

  const allChaptersCompleted = totalChapters > 0 && completedChapters.size === totalChapters;

  const hasFinalEvaluation =
    selectedFormation?.finalEvaluation &&
    selectedFormation.finalEvaluation.questions &&
    selectedFormation.finalEvaluation.questions.length > 0;

  const shouldShowEvaluation = showFinalEvaluation && hasFinalEvaluation && currentAttemptId !== null && !evaluationPassed;

  const handleComplete = async () => {
    try {
      if (currentChapter?.id && !completedChapters.has(currentChapter.id)) {
        await saveChapterProgress(formationId, currentChapter.id, {
          isCompleted: true,
        });
      }

      await completeFormation(formationId, {
        finalScore: finalScore,
      });

      navigate({ to: '/dashboard/user/formations' });
    } catch (error) {
      console.error('Erreur lors de la complétion de la formation:', error);
    }
  };

  const handleEvaluationSubmit = async (answers: any[], attemptId: string) => {
    if (!selectedFormation?.finalEvaluation?.id) {
      throw new Error('Évaluation finale introuvable');
    }

    const response = await submitEvaluation(formationId, selectedFormation.finalEvaluation.id, {
      answers,
      attemptId,
    }) as unknown as { data: { score: number; passed: boolean } };

    return {
      score: response?.data?.score ?? 0,
      passed: response?.data?.passed ?? false,
    };
  };

  const getEvaluationsAttemps = async () => {
    if (selectedFormation?.finalEvaluation) {
      const res = (await getEvaluationAttempts(formationId, selectedFormation.finalEvaluation.id)) as unknown as {
        data: [];
        hasReachedMaxAttempts: boolean;
      };
      setHasReachedMaxAttempts(res?.hasReachedMaxAttempts);
    }
    return [];
  };

  useEffect(() => {
    if (selectedFormation?.finalEvaluation) {
      getEvaluationsAttemps();
    }
  }, [selectedFormation?.finalEvaluation]);

  const handleStartEvaluation = async () => {
    if (!selectedFormation?.finalEvaluation?.id) return;

    try {
      const apiResponse = await startEvaluation(formationId, selectedFormation.finalEvaluation.id) as unknown as { data: { id: string }, attemptsUsed: number, attemptsRemaining: number };
      const attemptId = apiResponse?.data?.id;

      if (attemptId) {
        setCurrentAttemptId(attemptId);
        setShowFinalEvaluation(true);

        if (apiResponse?.attemptsUsed !== undefined) {
          setAttemptCount(apiResponse.attemptsUsed);
        }
        if (apiResponse?.attemptsRemaining !== undefined) {
          setAttemptsRemaining(apiResponse.attemptsRemaining);
        }
      } else {
        console.error('attemptId introuvable. Response:', apiResponse);
      }
    } catch (error: unknown) {
      console.error("Erreur lors du démarrage de l'évaluation:", error);
    }
  };

  const handleEvaluationSuccess = (score: number) => {
    setEvaluationPassed(true);
    setEvaluationFailed(false);
    setFinalScore(score);
    setShowFinalEvaluation(false);
    setCurrentAttemptId(null);
  };

  const handleEvaluationFailure = (score: number, canRetry: boolean) => {
    setFinalScore(score);
    setEvaluationFailed(true);
    setShowFinalEvaluation(false);
    setCurrentAttemptId(null);
    setAttemptCount((prev) => prev + 1);
  };

  const handleRetryEvaluation = () => {
    setEvaluationFailed(false);
    setCurrentAttemptId(null);
    handleStartEvaluation();
  };

  const jumpToChapter = (moduleIndex: number, chapterIndex: number) => {
    setCurrentModuleIndex(moduleIndex);
    setCurrentChapterIndex(chapterIndex);
  };

  const shouldShowResultBanner = () => {
    if (isFormationCompleted) return true;
    if (evaluationPassed) return true;
    if (evaluationFailed && hasReachedMaxAttempts) return true;
    return false;
  };

 const getBannerStatus = (): 'success' | 'failure' => {
  if (!hasFinalEvaluation && isFormationCompleted) {
    return 'success';
  }

  if (evaluationPassed || (isFormationCompleted && (userFinalScore || 0) >= (selectedFormation?.passingScore || 0))) {
    return 'success';
  }
  return 'failure';
};

  // Pas encore branché à un vrai système de certificat — UI seule pour l'instant
  const handleViewCertificate = () => {
    //
  };

  if (isLoading || !selectedFormation) {
    return (
      <>
        <DashboardTopbar title="Formation" description={tCommon('admin.page_overview.risk_by_dept_loading')} />
        <div className="min-h-screen bg-gray-50 dark:bg-[#050816] px-4 sm:px-6 pb-12 pt-6">
          <Skeleton className="h-24 w-full bg-gray-200 dark:bg-gray-800/50 mb-6 rounded-2xl" />
          <div className="flex gap-6">
            <Skeleton className="hidden lg:block h-96 w-72 bg-gray-200 dark:bg-gray-800/50 rounded-2xl" />
            <Skeleton className="h-96 w-full bg-gray-200 dark:bg-gray-800/50 rounded-2xl" />
          </div>
        </div>
      </>
    );
  }

  

  return (
    <>
      <DashboardTopbar
        title={selectedFormation.title}
        description={`Module ${currentModuleIndex + 1} - Chapitre ${currentChapterIndex + 1}`}
      />
 <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: '/dashboard/user/formations' })}
          className="mb-4 -mt-2 gap-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <ChevronLeft className="w-4 h-4" />
          {tCommon('user.formations.back_to_trainings')}
        </Button>
      <div className="min-h-screen bg-gray-50 dark:bg-[#050816] px-4 sm:px-6 pb-12 pt-6">
       

        {selectedFormation.status === 'DRAFT' && (
          <Card className="rounded-2xl border border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/10 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-amber-100 dark:bg-amber-500/15 p-2 rounded-lg">
                  <BookOpen className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-gray-900 dark:text-white font-medium">{tCommon('user.formations.draft_mode')}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Cette formation n'est pas encore publiée</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

   {shouldShowResultBanner() && (
  <ResultBanner
    status={getBannerStatus()}
    score={hasFinalEvaluation ? (finalScore || userFinalScore || 0) : null}
    passingScore={hasFinalEvaluation ? (selectedFormation.passingScore || 0) : null}
    hasFinalEvaluation={!!hasFinalEvaluation}
    onViewCertificate={handleViewCertificate}
  />
)}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Bouton pour afficher la sidebar sur mobile */}
          {!showSidebar && (
            <Button
              variant="outline"
              size="sm"
              onClick={toggleSidebar}
              className="lg:hidden fixed bottom-4 left-4 z-50 rounded-full shadow-lg border-gray-200 dark:border-white/10 bg-white dark:bg-[#050816]"
            >
              <Menu className="w-5 h-5" />
            </Button>
          )}

          <FormationSidebar
            formationTitle={selectedFormation.title}
            formationDescription={selectedFormation.description}
            modules={selectedFormation.modules || []}
            completedChapters={completedChapters}
            totalChapters={totalChapters}
            progressPercentage={progressPercentage}
            currentModuleIndex={currentModuleIndex}
            currentChapterIndex={currentChapterIndex}
            isFormationCompleted={isFormationCompleted || evaluationPassed}
            onJumpToChapter={jumpToChapter}
            onDownloadCertificate={handleViewCertificate}
            isCollapsed={!showSidebar}
            onToggleCollapse={toggleSidebar}
          />

          <div className="flex-1 space-y-6 min-w-0">
            {/* Bouton pour réafficher la sidebar (quand elle est cachée) */}
            {!showSidebar && (
              <Button
                variant="outline"
                size="sm"
                onClick={toggleSidebar}
                className="hidden lg:flex text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/10"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                {tCommon('user.formations.show_toc')}
              </Button>
            )}

            {shouldShowEvaluation ? (
              selectedFormation?.finalEvaluation && currentAttemptId ? (
                <>
                  {attemptsRemaining !== null && attemptsRemaining >= 0 && (
                    <Card className="rounded-2xl border border-orange-200 dark:border-orange-500/20 bg-orange-50 dark:bg-orange-500/10">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-orange-100 dark:bg-orange-500/15 p-2 rounded-lg">
                            <Award className="w-5 h-5 text-orange-500" />
                          </div>
                          <div>
                            <p className="text-gray-900 dark:text-white font-medium">
                              Tentative {attemptCount} / {selectedFormation.finalEvaluation.maxAttempts || 3}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {attemptsRemaining > 0
                                ? `Il vous reste ${attemptsRemaining} tentative${attemptsRemaining > 1 ? 's' : ''} après celle-ci`
                                : tCommon('user.formations.last_attempt_available')}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <EvaluationQuiz
                    evaluation={selectedFormation.finalEvaluation as any}
                    attemptId={currentAttemptId}
                    onSubmit={handleEvaluationSubmit}
                    onSuccess={handleEvaluationSuccess}
                    onFailure={handleEvaluationFailure}
                  />
                </>
              ) : currentAttemptId === null ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">Démarrage de l'évaluation...</p>
                </div>
              ) : null
            ) : evaluationFailed && !evaluationPassed ? (
              (attemptsRemaining !== null && attemptsRemaining <= 0) || !selectedFormation?.finalEvaluation?.allowRetries ? (
                <Card className="rounded-2xl border border-red-200 dark:border-red-500/20 bg-white dark:bg-white/[0.02]">
                  <CardContent className="p-8 text-center space-y-6">
                    <div className="text-red-500">
                      <XCircle className="w-20 h-20 mx-auto mb-4" />
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{tCommon('user.formations.eval_failed')}</h2>
                      <p className="text-xl text-red-500 mb-4">Score obtenu : {finalScore}%</p>
                      <p className="text-gray-500 dark:text-gray-400">
                        Score minimum requis : {selectedFormation?.passingScore}%
                      </p>
                    </div>

                    <div className="space-y-4">
                      <p className="text-red-500 font-medium">{tCommon('user.formations.max_attempts_reached')}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {tCommon('user.formations.max_attempts_desc')}
                      </p>
                      <Button
                        onClick={() => navigate({ to: '/dashboard/user/formations' })}
                        variant="outline"
                        className="border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400"
                      >
                        {tCommon('user.formations.back_to_trainings')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="rounded-2xl border border-orange-200 dark:border-orange-500/20 bg-white dark:bg-white/[0.02]">
                  <CardContent className="p-8 text-center space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{tCommon('user.formations.eval_failed')}</h2>
                      <p className="text-xl text-orange-500 mb-4">Score obtenu : {finalScore}%</p>
                      <p className="text-gray-500 dark:text-gray-400">
                        Score minimum requis : {selectedFormation?.passingScore}%
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 border border-gray-100 dark:border-white/10">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Tentatives</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {attemptCount} / {selectedFormation?.finalEvaluation?.maxAttempts || 3} utilisées
                        </p>
                        <p className="text-sm text-orange-500 mt-1">
                          {attemptsRemaining} tentative{(attemptsRemaining || 0) > 1 ? 's' : ''} restante
                          {(attemptsRemaining || 0) > 1 ? 's' : ''}
                        </p>
                      </div>
                      <Button onClick={handleRetryEvaluation} className="bg-orange-600 hover:bg-orange-700" size="lg">
                        Réessayer l'évaluation
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            ) : (
              <>
                <ChapterHeader
                  moduleNumber={currentModuleIndex + 1}
                  chapterType={currentChapter?.type || 'DOCUMENT'}
                  chapterTitle={currentChapter?.title}
                  chapterDescription={currentChapter?.description}
                  estimatedDuration={currentChapter?.estimatedDuration}
                  passingScore={selectedFormation.passingScore}
                  onQuit={() => navigate({ to: '/dashboard/user/formations' })}
                />

                {currentChapter?.type === 'VIDEO' && currentChapter.metadata?.videoUrl && (
                  <Card className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.02]">
                    <CardContent className="p-4">
                      <div className="aspect-video bg-black rounded-xl overflow-hidden">
                        <iframe
                          src={currentChapter.metadata.videoUrl}
                          className="w-full h-full"
                          allowFullScreen
                          title={currentChapter.title}
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}

                <ChapterContentViewer
                  chapterId={currentChapter?.id || ''}
                  content={currentChapter?.content}
                  pdfUrl={(currentChapter as any)?.pdfUrl}
                />

                <div className="flex items-center justify-between flex-wrap gap-3">
                  <Button
                    variant="outline"
                    onClick={goToPreviousChapter}
                    disabled={isFirstChapter}
                    className="text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/10"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    {tCommon('user.formations.prev_chapter')}
                  </Button>

                  <div className="text-sm text-gray-400 order-first sm:order-none w-full sm:w-auto text-center sm:text-left">
                    Chapitre {currentChapterIndex + 1} / {currentModule?.chapters?.length || 0}
                  </div>

                  {!completedChapters.has(currentChapter?.id || '') ? (
  <Button onClick={goToNextChapter} className="bg-violet-600 hover:bg-violet-700">
    <CheckCircle2 className="w-4 h-4 mr-2" />
    {tCommon('user.formations.mark_completed')}
  </Button>
) : isLastChapter ? (
  hasFinalEvaluation ? (
    <div className="flex flex-col items-end gap-2">
      {selectedFormation?.finalEvaluation?.maxAttempts && (
        <Badge
          variant="outline"
          className="text-xs border-orange-200 dark:border-orange-500/20 text-orange-500"
        >
          {selectedFormation.finalEvaluation.maxAttempts} tentative
          {selectedFormation.finalEvaluation.maxAttempts > 1 ? 's' : ''} disponible
          {selectedFormation.finalEvaluation.maxAttempts > 1 ? 's' : ''}
        </Badge>
      )}
      <AlertDialog>
  <AlertDialogTrigger disabled={!allChaptersCompleted || evaluationPassed || isFormationCompleted || hasReachedMaxAttempts}>
    <Button
      disabled={!allChaptersCompleted || evaluationPassed || isFormationCompleted || hasReachedMaxAttempts}
      className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Passer l'évaluation finale
      <ChevronRight className="w-4 h-4 ml-2" />
    </Button>
  </AlertDialogTrigger>

  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle className="flex items-center gap-2">
        {tCommon('user.formations.alert_final_eval')}
      </AlertDialogTitle>
      <AlertDialogDescription className="space-y-2 text-left">
        <p>Une fois l'évaluation démarrée :</p>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>Vous <span className="font-semibold text-orange-500">ne pouvez pas quitter</span> sans que votre tentative soit comptabilisée</li>
          <li>Quitter la page ou changer d'onglet trop longtemps entraînera une <span className="font-semibold text-red-500">soumission automatique</span></li>
          <li>Vous disposez de <span className="font-semibold">{selectedFormation?.finalEvaluation?.maxAttempts ?? 3} tentative{(selectedFormation?.finalEvaluation?.maxAttempts ?? 3) > 1 ? 's' : ''}</span> au total</li>
          {selectedFormation?.finalEvaluation?.timeLimit && (
            <li>Temps imparti : <span className="font-semibold">{selectedFormation.finalEvaluation.timeLimit} minutes</span></li>
          )}
        </ul>
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>{tCommon('user.formations.cancel')}</AlertDialogCancel>
      <AlertDialogAction
        onClick={handleStartEvaluation}
        className="bg-orange-600 hover:bg-orange-700"
      >
        Je comprends, démarrer l'évaluation
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
    </div>
  ) : isFormationCompleted ? (
    // ✅ Formation sans quiz déjà complétée : état final, non cliquable
    <Button disabled className="bg-emerald-600/50 text-white cursor-not-allowed">
      <CheckCircle2 className="w-4 h-4 mr-2" />
      {tCommon('user.formations.training_completed')}
    </Button>
  ) : (
    <Button onClick={handleComplete} className="bg-emerald-600 hover:bg-emerald-700">
      <CheckCircle2 className="w-4 h-4 mr-2" />
      {tCommon('user.formations.finish_training')}
    </Button>
  )
) : (
  <Button onClick={goToNextChapter} className="bg-violet-600 hover:bg-violet-700">
    {tCommon('user.formations.next_chapter')}
    <ChevronRight className="w-4 h-4 ml-2" />
  </Button>
)}
                </div>
              </>
            )}

           {allChaptersCompleted && evaluationPassed && !isFormationCompleted && (
  <div className="flex justify-center">
    <Button onClick={handleComplete} size="lg" className="bg-emerald-600 hover:bg-emerald-700">
      <CheckCircle2 className="w-5 h-5 mr-2" />
      {tCommon('user.formations.finish_training')}
    </Button>
  </div>
)}
          </div>
        </div>
      </div>
    </>
  );
}