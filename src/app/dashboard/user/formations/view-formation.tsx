'use client';

import { useEffect, useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DashboardTopbar } from '@/components/layout/topbar';
import { useFormationStore } from '@/store/formation.store';
import { EvaluationQuiz } from '@/components/evaluation-quiz';
import { ArrowLeft, Clock, Award, CheckCircle2, ChevronRight, ChevronLeft, BookOpen, XCircle, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { BlockNoteEditor } from '@/components/blocknote-editor';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function ViewFormationPage() {
  const navigate = useNavigate();
  const searchParams = useSearch({ from: '/_authenticated/dashboard/user/formation-view' });
  const formationId = (searchParams as any)?.id as string;
  
  const { selectedFormation, myFormations, fetchById, completeFormation, saveChapterProgress, getChaptersProgress, submitEvaluation, startEvaluation, isLoading } = useFormationStore();
  const [startTime] = useState(() => Date.now());
  const [sessionTime, setSessionTime] = useState(0);
  
  // Navigation entre modules et chapitres
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

  // ✅ Charger la formation ET la progression des chapitres
  useEffect(() => {
    if (formationId) {
      fetchById(formationId);
      // Charger les chapitres complétés depuis le backend
      getChaptersProgress(formationId).then(progress => {
        const completedIds = progress
          .filter((p: any) => p.isCompleted)
          .map((p: any) => p.chapterId);
        setCompletedChapters(new Set(completedIds));
      });
    }
  }, [formationId, fetchById, getChaptersProgress]);

  // Récupérer la progression de l'utilisateur depuis myFormations
  const userFormationProgress = myFormations.find(f => f.id === formationId);
  const isFormationCompleted = userFormationProgress?.status === 'COMPLETED';
  const userFinalScore = userFormationProgress?.bestScore || 0;

  // Timer pour calculer le temps de session
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  // Calculer la progression totale
  const totalChapters = selectedFormation?.modules?.reduce((sum, mod) => sum + (mod.chapters?.length || 0), 0) || 0;
  const progressPercentage = totalChapters > 0 ? (completedChapters.size / totalChapters) * 100 : 0;

  // Module et chapitre actuels
  const currentModule = selectedFormation?.modules?.[currentModuleIndex];
  const currentChapter = currentModule?.chapters?.[currentChapterIndex];

  // Navigation
  const goToNextChapter = async () => {
    if (!currentModule || !currentChapter) return;
    
    // Marquer le chapitre actuel comme terminé et sauvegarder la progression
    if (currentChapter?.id && !completedChapters.has(currentChapter.id)) {
      setCompletedChapters(prev => new Set(prev).add(currentChapter.id!));
      
      // Sauvegarder la progression du chapitre
      try {
        await saveChapterProgress(formationId, currentChapter.id, {
          isCompleted: true,
          timeSpent: sessionTime,
        });
      } catch (error) {
        console.error('Erreur lors de la sauvegarde de la progression:', error);
      }
    }

    // Si ce n'est pas le dernier chapitre du module
    if (currentChapterIndex < (currentModule.chapters?.length || 0) - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
    } 
    // Sinon, passer au module suivant
    else if (currentModuleIndex < (selectedFormation?.modules?.length || 0) - 1) {
      setCurrentModuleIndex(currentModuleIndex + 1);
      setCurrentChapterIndex(0);
    }
  };

  const goToPreviousChapter = () => {
    // Si ce n'est pas le premier chapitre du module
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1);
    }
    // Sinon, revenir au module précédent (dernier chapitre)
    else if (currentModuleIndex > 0) {
      const previousModule = selectedFormation?.modules?.[currentModuleIndex - 1];
      setCurrentModuleIndex(currentModuleIndex - 1);
      setCurrentChapterIndex((previousModule?.chapters?.length || 1) - 1);
    }
  };

  const isFirstChapter = currentModuleIndex === 0 && currentChapterIndex === 0;
  const isLastChapter = 
    currentModuleIndex === (selectedFormation?.modules?.length || 0) - 1 &&
    currentChapterIndex === (currentModule?.chapters?.length || 0) - 1;
  
  // Vérifier si tous les chapitres sont complétés
  const allChaptersCompleted = totalChapters > 0 && completedChapters.size === totalChapters;
  
  // Déterminer si on doit afficher l'évaluation finale
  const hasFinalEvaluation = selectedFormation?.finalEvaluation && 
    selectedFormation.finalEvaluation.questions && 
    selectedFormation.finalEvaluation.questions.length > 0;
  
  // ✅ Afficher l'évaluation si bouton cliqué ET attemptId disponible
  const shouldShowEvaluation = showFinalEvaluation && hasFinalEvaluation && currentAttemptId !== null && !evaluationPassed;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'VIDEO': return '🎥';
      case 'DOCUMENT': return '📄';
      case 'INTERACTIVE': return '🖱️';
      case 'QUIZ': return '❓';
      case 'WEBINAR': return '📺';
      default: return '📄';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'VIDEO': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'DOCUMENT': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'INTERACTIVE': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'QUIZ': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'WEBINAR': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const handleComplete = async () => {
    try {
      // Marquer le dernier chapitre comme complété si pas déjà fait
      if (currentChapter?.id && !completedChapters.has(currentChapter.id)) {
        await saveChapterProgress(formationId, currentChapter.id, {
          isCompleted: true,
          timeSpent: sessionTime,
        });
      }

      // Terminer la formation avec le score final
      await completeFormation(formationId, {
        timeSpent: sessionTime,
        finalScore: finalScore,
      });

      // Naviguer vers la liste des formations
      navigate({ to: '/dashboard/user/formations' });
    } catch (error) {
      console.error('Erreur lors de la complétion de la formation:', error);
    }
  };

  const handleEvaluationSubmit = async (answers: any[], _score: number, _attemptId: string) => {
    if (!selectedFormation?.finalEvaluation?.id || !currentAttemptId) return;
    
    try {
      await submitEvaluation(formationId, selectedFormation.finalEvaluation.id, {
        answers,
        timeSpent: sessionTime,
        attemptId: currentAttemptId, // ✅ Utiliser l'ID de la tentative créée
      });
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      throw error;
    }
  };

  const handleStartEvaluation = async () => {
    if (!selectedFormation?.finalEvaluation?.id) return;
    
    try {
      // ✅ Démarrer l'évaluation côté serveur
      // Backend retourne: { success: true, data: attempt, message: '...', attemptsUsed, attemptsRemaining }
      const apiResponse = await startEvaluation(formationId, selectedFormation.finalEvaluation.id);
      console.log(apiResponse)
      const attemptId = apiResponse?.data?.id;
      
      if (attemptId) {
        setCurrentAttemptId(attemptId);
        setShowFinalEvaluation(true);
        
        // ✅ Sauvegarder le nombre de tentatives
        if (apiResponse?.attemptsUsed !== undefined) {
          setAttemptCount(apiResponse.attemptsUsed);
        }
        if (apiResponse?.attemptsRemaining !== undefined) {
          setAttemptsRemaining(apiResponse.attemptsRemaining);
        }
        
        // Si l'évaluation était déjà en cours, afficher un message
        if (apiResponse?.message === 'Évaluation déjà en cours') {
          toast.success('Reprise de votre évaluation en cours');
        } else {
          toast.success('Évaluation démarrée');
        }
      } else {
        console.error('attemptId introuvable. Response:', apiResponse);
        toast.error('Erreur: impossible de récupérer l\'ID de la tentative');
      }
    } catch (error: any) {
      console.error('Erreur lors du démarrage de l\'évaluation:', error);
      toast.error(error.response?.data?.error || 'Erreur lors du démarrage de l\'évaluation');
    }
  };

  const handleEvaluationSuccess = (score: number) => {
    setEvaluationPassed(true);
    setEvaluationFailed(false);
    setFinalScore(score);
    setShowFinalEvaluation(false);
    setCurrentAttemptId(null); // ✅ Reset attemptId
  };

  const handleEvaluationFailure = (score: number, canRetry: boolean) => {
    setFinalScore(score);
    setEvaluationFailed(true);
    setShowFinalEvaluation(false); // ✅ Cacher le quiz pour afficher les boutons dans le parent
    setCurrentAttemptId(null); // ✅ Reset attemptId pour permettre retry
    setAttemptCount(prev => prev + 1);
  };

  const handleRetryEvaluation = () => {
    setEvaluationFailed(false);
    setCurrentAttemptId(null);
    handleStartEvaluation(); // ✅ Créer une nouvelle tentative côté serveur
  };

  const jumpToChapter = (moduleIndex: number, chapterIndex: number) => {
    setCurrentModuleIndex(moduleIndex);
    setCurrentChapterIndex(chapterIndex);
  };

  if (isLoading || !selectedFormation) {
    return (
      <>
        <DashboardTopbar title="Formation" description="Chargement..." />
        <div className="min-h-screen bg-[#050816] px-6 pb-12">
          <Skeleton className="h-64 w-full bg-gray-800/50 mb-6" />
          <Skeleton className="h-96 w-full bg-gray-800/50" />
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
      
      <div className="min-h-screen bg-[#050816] px-6 pb-12">
        {/* Bandeau de résultat si formation terminée */}
        {selectedFormation.status === 'DRAFT' && (
          <Card className="rounded-md border border-yellow-500/30 bg-yellow-600/10 shadow-xl mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-yellow-600/20 p-2 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Formation en mode brouillon</p>
                  <p className="text-sm text-gray-400">Cette formation n'est pas encore publiée</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bandeau de résultat RÉUSSITE/ÉCHEC pour formations terminées */}
        {(evaluationPassed || isFormationCompleted) && (
          <Card className={cn(
            "rounded-md border shadow-xl mb-6",
            (finalScore || userFinalScore) >= selectedFormation.passingScore
              ? "border-green-500/30 bg-green-600/10"
              : "border-red-500/30 bg-red-600/10"
          )}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  (finalScore || userFinalScore) >= selectedFormation.passingScore
                    ? "bg-green-600/20"
                    : "bg-red-600/20"
                )}>
                  {(finalScore || userFinalScore) >= selectedFormation.passingScore ? (
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={cn(
                    "font-semibold text-lg",
                    (finalScore || userFinalScore) >= selectedFormation.passingScore
                      ? "text-white"
                      : "text-white"
                  )}>
                    {(finalScore || userFinalScore) >= selectedFormation.passingScore 
                      ? "✅ Formation réussie !" 
                      : "❌ Formation échouée"}
                  </p>
                  <p className="text-sm text-gray-400">
                    Score final: <span className={cn(
                      "font-semibold",
                      (finalScore || userFinalScore) >= selectedFormation.passingScore
                        ? "text-green-400"
                        : "text-red-400"
                    )}>{finalScore || userFinalScore}%</span> (minimum requis: {selectedFormation.passingScore}%)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-6">
          {/* Sidebar - Table des matières */}
          {showSidebar && (
            <div className="w-80 flex-shrink-0">
              <Card className="rounded-md border border-white/10 bg-[#0c1023]/90 shadow-xl sticky top-6">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-sm">Contenu de la formation</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSidebar(false)}
                      className="text-slate-400 h-6 w-6 p-0"
                    >
                      ✕
                    </Button>
                  </div>
                  <div className="mt-3">
                    <div className="text-xs text-slate-400 mb-1">Progression</div>
                    <Progress value={progressPercentage} className="h-2" />
                    <div className="text-xs text-slate-400 mt-1">
                      {completedChapters.size} / {totalChapters} chapitres
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 max-h-[calc(100vh-250px)] overflow-y-auto">
                  {selectedFormation.modules?.map((module, modIndex) => (
                    <div key={module.id} className="space-y-1">
                      <div className="flex items-center gap-2 px-2 py-1.5 rounded bg-slate-800/30">
                        <BookOpen className="w-3 h-3 text-orange-400" />
                        <span className="text-sm font-medium text-white">{module.title}</span>
                      </div>
                      {module.chapters?.map((chapter, chapIndex) => {
                        const isActive = modIndex === currentModuleIndex && chapIndex === currentChapterIndex;
                        const isCompleted = completedChapters.has(chapter.id || '');
                        return (
                          <button
                            key={chapter.id}
                            onClick={() => jumpToChapter(modIndex, chapIndex)}
                            className={cn(
                              "w-full text-left px-3 py-2 rounded text-sm flex items-center gap-2 transition-colors",
                              isActive 
                                ? "bg-orange-600/20 text-orange-400 border-l-2 border-orange-600" 
                                : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                            )}
                          >
                            {isCompleted && <CheckCircle2 className="w-3 h-3 text-green-400" />}
                            <span className="flex-1">{chapter.title}</span>
                            <span className="text-xs">{chapter.estimatedDuration}min</span>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Contenu principal */}
          <div className="flex-1 space-y-6">
            {/* Bouton pour rouvrir la sidebar */}
            {!showSidebar && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSidebar(true)}
                className="text-slate-400 border-slate-600"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Afficher le sommaire
              </Button>
            )}

            {/* Afficher l'évaluation finale si tous les chapitres sont complétés OU si le bouton a été cliqué */}
            {shouldShowEvaluation ? (
              selectedFormation?.finalEvaluation && currentAttemptId ? (
                <>
                  {/* Info sur les tentatives */}
                  {attemptsRemaining !== null && attemptsRemaining >= 0 && (
                    <Card className="rounded-md border border-orange-500/30 bg-orange-600/10 shadow-xl">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-orange-600/20 p-2 rounded-lg">
                            <Award className="w-5 h-5 text-orange-400" />
                          </div>
                          <div>
                            <p className="text-white font-medium">
                              Tentative {attemptCount} / {selectedFormation.finalEvaluation.maxAttempts || 3}
                            </p>
                            <p className="text-sm text-gray-400">
                              {attemptsRemaining > 0 
                                ? `Il vous reste ${attemptsRemaining} tentative${attemptsRemaining > 1 ? 's' : ''} après celle-ci`
                                : 'Dernière tentative disponible'}
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
              /* Afficher message d'échec et bouton réessayer */
              <Card className="rounded-md border border-red-500/30 bg-[#0c1023]/90 shadow-xl">
                <CardContent className="p-8 text-center space-y-6">
                  <div className="text-red-400">
                    <XCircle className="w-24 h-24 mx-auto mb-4" />
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Évaluation non réussie
                    </h2>
                    <p className="text-xl text-red-400 mb-4">
                      Score obtenu: {finalScore}%
                    </p>
                    <p className="text-gray-400">
                      Score minimum requis: {selectedFormation?.passingScore}%
                    </p>
                  </div>

                  {selectedFormation?.finalEvaluation?.allowRetries && 
                   attemptCount < (selectedFormation?.finalEvaluation?.maxAttempts || 3) && (
                    <div className="space-y-4">
                      <p className="text-gray-400">
                        Vous pouvez réessayer l'évaluation.
                      </p>
                      <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
                        <p className="text-sm text-gray-400 mb-1">Tentatives</p>
                        <p className="text-lg font-semibold text-white">
                          {attemptCount} / {selectedFormation?.finalEvaluation?.maxAttempts || 3} utilisées
                        </p>
                        <p className="text-sm text-orange-400 mt-1">
                          {(selectedFormation?.finalEvaluation?.maxAttempts || 3) - attemptCount} tentative{((selectedFormation?.finalEvaluation?.maxAttempts || 3) - attemptCount) > 1 ? 's' : ''} restante{((selectedFormation?.finalEvaluation?.maxAttempts || 3) - attemptCount) > 1 ? 's' : ''}
                        </p>
                      </div>
                      <Button 
                        onClick={handleRetryEvaluation}
                        className="bg-orange-600 hover:bg-orange-700"
                        size="lg"
                      >
                        Réessayer l'évaluation
                      </Button>
                    </div>
                  )}

                  {(!selectedFormation?.finalEvaluation?.allowRetries || 
                    attemptCount >= (selectedFormation?.finalEvaluation?.maxAttempts || 3)) && (
                    <div className="space-y-4">
                      <p className="text-red-400 font-medium">
                        Nombre maximum de tentatives atteint
                      </p>
                      <p className="text-gray-400 text-sm">
                        Vous ne pouvez plus passer cette évaluation. Contactez votre formateur.
                      </p>
                      <Button 
                        onClick={() => navigate({ to: '/dashboard/user/formations' })}
                        variant="outline"
                        className="border-slate-600 text-gray-400"
                      >
                        Retour aux formations
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <>
                {/* En-tête du chapitre actuel */}
                <Card className="rounded-md border border-white/10 bg-[#0c1023]/90 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-orange-600/20 text-orange-400 border-orange-400/50">
                        Module {currentModuleIndex + 1}
                      </Badge>
                      <Badge className={getTypeColor(currentChapter?.type || 'DOCUMENT')}>
                        {getTypeIcon(currentChapter?.type || 'DOCUMENT')} {currentChapter?.type}
                      </Badge>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-1">{currentChapter?.title}</h1>
                    {currentChapter?.description && (
                      <p className="text-gray-400 text-sm">{currentChapter.description}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => navigate({ to: '/dashboard/user/formations' })}
                    className="text-slate-400"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Quitter
                  </Button>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{currentChapter?.estimatedDuration} minutes</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Award className="w-4 h-4" />
                    <span className="text-sm">Score requis: {selectedFormation.passingScore}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vidéo (si type VIDEO) */}
            {currentChapter?.type === 'VIDEO' && currentChapter.metadata?.videoUrl && (
              <Card className="rounded-md border border-white/10 bg-[#0c1023]/90 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white">Vidéo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
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

            {/* Contenu du chapitre */}
            <Card className="rounded-md border border-white/10 bg-[#0c1023]/90 shadow-xl">
              <CardHeader>
                <CardTitle className="text-white">Contenu</CardTitle>
              </CardHeader>
              <CardContent>
                <BlockNoteEditor
                  initialContent={currentChapter?.content || ''}
                  editable={false}
                />
              </CardContent>
            </Card>

            {/* Navigation entre chapitres */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={goToPreviousChapter}
                disabled={isFirstChapter}
                className="text-gray-400 border-slate-600"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Chapitre précédent
              </Button>

              <div className="text-sm text-slate-400">
                Chapitre {currentChapterIndex + 1} / {currentModule?.chapters?.length || 0}
              </div>

              {/* Si le chapitre n'est pas encore complété, afficher "Marquer comme complété" */}
              {!completedChapters.has(currentChapter?.id || '') ? (
                <Button onClick={goToNextChapter} className="bg-orange-600 hover:bg-orange-700">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Marquer comme complété
                </Button>
              ) : isLastChapter ? (
                /* Dernier chapitre complété - afficher bouton évaluation ou terminer */
                hasFinalEvaluation ? (
                  <div className="flex flex-col items-end gap-2">
                    {selectedFormation?.finalEvaluation?.maxAttempts && (
                      <Badge variant="outline" className="text-xs border-orange-500/30 text-orange-400">
                        {selectedFormation.finalEvaluation.maxAttempts} tentative{selectedFormation.finalEvaluation.maxAttempts > 1 ? 's' : ''} disponible{selectedFormation.finalEvaluation.maxAttempts > 1 ? 's' : ''}
                      </Badge>
                    )}
                    <Button 
                      onClick={handleStartEvaluation}
                      disabled={!allChaptersCompleted}
                      className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Passer l'évaluation finale
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                ) : (
                  <Button onClick={handleComplete} className="bg-green-600 hover:bg-green-700">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Terminer la formation
                  </Button>
                )
              ) : (
                /* Chapitre complété mais pas le dernier - bouton "Chapitre suivant" */
                <Button onClick={goToNextChapter} className="bg-orange-600 hover:bg-orange-700">
                  Chapitre suivant
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
              </>
            )}

            {/* Bouton Terminer après évaluation réussie */}
            {allChaptersCompleted && evaluationPassed && (
              <div className="flex justify-center">
                <Button 
                  onClick={handleComplete} 
                  size="lg"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Terminer la formation
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
