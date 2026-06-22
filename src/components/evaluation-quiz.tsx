'use client';

import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { CheckCircle2, XCircle, Clock, Award, Loader2, AlertTriangle, AlertTriangleIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBlocker } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'multiple_select';
  options?: string[];
  points: number;
  // correctAnswer intentionnellement absent : ne doit jamais arriver côté client pendant le quiz
}

interface EvaluationData {
  id: string;
  title: string;
  description?: string;
  questions: QuizQuestion[];
  passingScore: number;
  timeLimit?: number;
  allowRetries: boolean;
  maxAttempts: number;
  showCorrectAnswers: boolean;
}

interface SubmitResult {
  score: number;
  passed: boolean;
}

interface EvaluationQuizProps {
  evaluation: EvaluationData;
  attemptId: string;
  onSubmit: (answers: any[], attemptId: string) => Promise<SubmitResult>;
  onSuccess: (score: number) => void;
  onFailure: (score: number, canRetry: boolean) => void;
}

export function EvaluationQuiz({
  evaluation,
  attemptId,
  onSubmit,
  onSuccess,
  onFailure,
}: EvaluationQuizProps) {
  // Pour multiple_choice / true_false : string (index ou "true"/"false")
  // Pour multiple_select : string[] (tableau d'index sous forme string)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t: tCommon } = useTranslation('common');

  // ─── Timer ───────────────────────────────────────────────────────────────────

  const getInitialTime = () => {
    if (!evaluation.timeLimit) return null;

    const storageKey = `eval-timer-${attemptId}`;
    const stored = localStorage.getItem(storageKey);

    if (stored) {
      const { startTime, timeLimit } = JSON.parse(stored);
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = timeLimit * 60 - elapsed;
      return remaining > 0 ? remaining : 0;
    }

    localStorage.setItem(
      storageKey,
      JSON.stringify({ startTime: Date.now(), timeLimit: evaluation.timeLimit })
    );
    return evaluation.timeLimit * 60;
  };

  const [timeRemaining, setTimeRemaining] = useState<number | null>(getInitialTime);

  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0 || isSubmitted) return;
    const interval = setInterval(() => {
      setTimeRemaining((prev) => (prev === null || prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [timeRemaining, isSubmitted]);

  useEffect(() => {
    if (timeRemaining === 0 && !isSubmitted && !isSubmitting) {
      handleSubmitQuizRef.current();
    }
  }, [timeRemaining, isSubmitted, isSubmitting]);

  useEffect(() => {
    if (isSubmitted) {
      localStorage.removeItem(`eval-timer-${attemptId}`);
    }
  }, [isSubmitted, attemptId]);

  useEffect(() => {
    if (isSubmitted) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue =
        tCommon('common.evaluation.eval_in_progress');
      return e.returnValue;
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isSubmitted]);

  // ─── Gestion des réponses ────────────────────────────────────────────────────

  const handleSingleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleMultipleSelectToggle = (questionId: string, optionIndex: string) => {
    setAnswers((prev) => {
      const current = (prev[questionId] as string[]) ?? [];
      const updated = current.includes(optionIndex)
        ? current.filter((i) => i !== optionIndex)
        : [...current, optionIndex];
      return { ...prev, [questionId]: updated };
    });
  };

  const isAnswered = (question: QuizQuestion): boolean => {
    const answer = answers[question.id];
    if (question.type === 'multiple_select') {
      return Array.isArray(answer) && answer.length > 0;
    }
    return answer !== undefined && answer !== '';
  };

  const allQuestionsAnswered = evaluation.questions.every(isAnswered);

  // ─── Soumission ──────────────────────────────────────────────────────────────

  const handleSubmitQuiz = async () => {
    setIsSubmitting(true);
    try {
      const formattedAnswers = evaluation.questions.map((q) => {
        if (q.type === 'multiple_select') {
          const selected = (answers[q.id] as string[]) ?? [];
          return {
            questionId: q.id,
            // Envoyer les index triés comme tableau de nombres
            selectedAnswer: selected.map(Number).sort((a, b) => a - b),
            answer: selected.join(','),
          };
        }
        return {
          questionId: q.id,
          selectedAnswer: answers[q.id] ?? '',
          answer: answers[q.id] ?? '',
        };
      });

      const result = await onSubmit(formattedAnswers, attemptId);

      setScore(result.score);
      setIsSubmitted(true);

      if (result.passed) {
        onSuccess(result.score);
      } else {
        onFailure(result.score, evaluation.allowRetries);
      }
    } catch (error: unknown) {
      if ((error as { response: { data: { timeExceeded: boolean } } }).response?.data?.timeExceeded) {
        setIsSubmitted(true);
        setScore(0);
        onFailure(0, false);
        toast.error("Temps dépassé ! Votre évaluation ne peut plus être soumise.");
      } else {
        toast.error("Erreur lors de la soumission de l'évaluation");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitQuizRef = useRef(handleSubmitQuiz);

  useEffect(() => {
  handleSubmitQuizRef.current = handleSubmitQuiz;
});


 
// Ajouter ce state dans EvaluationQuiz
const [focusWarning, setFocusWarning] = useState<{
  visible: boolean;
  secondsLeft: number;
  violations: number;
} | null>(null);

const focusTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
const isSubmittedRef = useRef(isSubmitted);
const isSubmittingRef = useRef(isSubmitting);
const [navWarning, setNavWarning] = useState(false);
const blockerProceedRef = useRef<(() => void) | null>(null);

const GRACE_SECONDS = 30;
const MAX_VIOLATIONS = 3; // nombre max de fois qu'on tolère une perte de focus


useEffect(() => { isSubmittedRef.current = isSubmitted; }, [isSubmitted]);
useEffect(() => { isSubmittingRef.current = isSubmitting; }, [isSubmitting]);

useEffect(() => {
  const handleVisibilityChange = () => {
  if (isSubmittedRef.current || isSubmittingRef.current) return;

  if (document.hidden) {
    // Nettoyer un éventuel timer précédent
    if (focusTimerRef.current) {
      clearInterval(focusTimerRef.current);
      focusTimerRef.current = null;
    }

    setFocusWarning((prev) => ({
      visible: true,
      secondsLeft: GRACE_SECONDS,
      violations: (prev?.violations ?? 0) + 1,
    }));

    focusTimerRef.current = setInterval(() => {
      setFocusWarning((prev) => {
        if (!prev) return null;

        if (prev.secondsLeft <= 1) {
          clearInterval(focusTimerRef.current!);
          focusTimerRef.current = null;
          handleSubmitQuizRef.current();
          return null;
        }

        return { ...prev, secondsLeft: prev.secondsLeft - 1 };
      });
    }, 1000);

    // ✅ Plus de bloc else — on ne fait rien quand la page redevient visible
    // Le timer continue, l'overlay reste, l'utilisateur doit cliquer
  }
};

  document.addEventListener('visibilitychange', handleVisibilityChange);
  
   return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    if (focusTimerRef.current) clearInterval(focusTimerRef.current);
  };
}, []); 

const blocker = useBlocker({
  shouldBlockFn: () => !isSubmittedRef.current && !isSubmittingRef.current,
  withResolver: true,
});

// Réagir au blocage via useEffect
useEffect(() => {
  if (blocker.status === 'blocked') {
    blockerProceedRef.current = blocker.proceed;
    setNavWarning(true);
  }
}, [blocker.status]);

useEffect(() => {
  if (isSubmitted || isSubmitting) return;

  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  
    const payload = JSON.stringify({
      attemptId,
      answers: [], // réponses vides — le backend marquera score: 0, passed: false
      abandoned: true,
    });

    navigator.sendBeacon(
  `${import.meta.env.VITE_API_URL}/api/v1/formations/attempts/${attemptId}/abandon`,
  new Blob([payload], { type: 'application/json' })
);

    // Afficher le message de confirmation natif du navigateur
    e.preventDefault();
    e.returnValue = "Votre évaluation sera soumise comme échouée si vous quittez.";
    return e.returnValue;
  };

  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => window.removeEventListener('beforeunload', handleBeforeUnload);
}, [isSubmitted, isSubmitting, attemptId]);

  // ─── Rendu : écran loader pendant correction ─────────────────────────────────

  if (isSubmitting) {
    return (
      <Card className="rounded-md border border-white/10 bg-white dark:bg-[#0c1023]/90">
        <CardContent className="py-16 text-center space-y-4">
          <Loader2 className="w-12 h-12 mx-auto text-orange-500 animate-spin" />
          <p className="text-gray-600 dark:text-gray-300 font-medium">{tCommon('common.evaluation.correcting')}</p>
          <p className="text-gray-400 text-sm">{tCommon('common.evaluation.please_wait')}</p>
        </CardContent>
      </Card>
    );
  }

  // ─── Rendu : résultat après soumission ───────────────────────────────────────

  if (isSubmitted && score !== null) {
    const passed = score >= evaluation.passingScore;
    return (
      <Card className="rounded-md border border-white/10 bg-white dark:bg-[#0c1023]/90">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white text-center">
            Résultat de l'évaluation
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className={cn('mb-4', passed ? 'text-green-400' : 'text-red-400')}>
            {passed ? (
              <CheckCircle2 className="w-32 h-32 mx-auto" />
            ) : (
              <XCircle className="w-32 h-32 mx-auto" />
            )}
          </div>

          <div>
            <p className={cn('text-3xl font-bold mb-2', passed ? 'text-green-400' : 'text-red-400')}>
              Score : {score}%
            </p>
            <p className="text-gray-400">
              {passed
                ? `Félicitations ! Vous avez réussi (minimum requis : ${evaluation.passingScore}%)`
                : `Score insuffisant. Minimum requis : ${evaluation.passingScore}%`}
            </p>
          </div>

          {!passed && evaluation.allowRetries && (
            <p className="text-gray-400 text-sm">{tCommon('common.evaluation.retry')}</p>
          )}

          {evaluation.showCorrectAnswers && (
            <p className="text-gray-400 text-sm text-center">
              Consultez le détail de vos réponses dans l'historique de vos tentatives.
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  // ─── Rendu : formulaire quiz ─────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Overlay d'avertissement perte de focus */}
{focusWarning?.visible && !isSubmitted && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
    <div className="bg-white dark:bg-[#0c1023] border border-orange-500/30 rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl text-center space-y-5">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/15 mx-auto">
        <AlertTriangleIcon className="h-8 w-8 text-orange-500" />
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Vous avez quitté l'évaluation
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {tCommon('common.evaluation.auto_submit')}
        </p>
      </div>

      {/* Compte à rebours */}
      <div className={cn(
        'text-6xl font-bold tabular-nums',
        focusWarning.secondsLeft <= 10 ? 'text-red-500' : 'text-orange-500'
      )}>
        {focusWarning.secondsLeft}
      </div>

      <p className="text-xs text-gray-400">
        {focusWarning.violations > 1 && (
          <span className="text-red-400">
            ⚠️ {focusWarning.violations} sortie{focusWarning.violations > 1 ? 's' : ''} détectée{focusWarning.violations > 1 ? 's' : ''}
            {' — '}
          </span>
        )}
        Revenez sur cette page pour continuer votre évaluation.
      </p>

     <button
  onClick={() => {
    if (focusTimerRef.current) clearInterval(focusTimerRef.current);
    focusTimerRef.current = null;
    setFocusWarning((prev) => prev ? { ...prev, visible: false } : null);
  }}
  className="w-full py-3 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-medium transition-colors"
>
  Je suis de retour → Continuer l'évaluation
</button>
    </div>
  </div>
)}

{navWarning && !isSubmitted && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
    <div className="bg-white dark:bg-[#0c1023] border border-red-500/30 rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl text-center space-y-5">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/15 mx-auto">
        <AlertTriangle className="h-8 w-8 text-red-500" />
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Quitter l'évaluation ?
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Si vous quittez maintenant, votre tentative sera marquée comme{' '}
          <span className="text-red-500 font-semibold">{tCommon('common.evaluation.failed')}</span> {tCommon('common.evaluation.failed_score')}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={async () => {
  await handleSubmitQuizRef.current();
  setNavWarning(false);
  blocker.proceed?.();
}}
          className="w-full py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
        >
          {tCommon('common.evaluation.quit_and_fail')}
        </button>
        <button
          onClick={() => {
  setNavWarning(false);
  blocker.reset?.();
}}
          className="w-full py-3 rounded-lg border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 font-medium transition-colors"
        >
          Rester et continuer l'évaluation
        </button>
      </div>
    </div>
  </div>
)}
      {/* En-tête avec timer */}
      <Card className="rounded-md border border-white/10 bg-white dark:bg-[#0c1023]/90">
        <CardHeader>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <CardTitle className="text-gray-900 dark:text-white">{evaluation.title}</CardTitle>
            {timeRemaining !== null && (
              <div
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg font-bold',
                  timeRemaining <= 60
                    ? 'bg-red-600/20 text-red-400 animate-pulse'
                    : timeRemaining <= 300
                    ? 'bg-orange-600/20 text-orange-400'
                    : 'bg-blue-600/20 text-blue-400'
                )}
              >
                <Clock className="w-5 h-5" />
                <span>
                  {Math.floor(timeRemaining / 60)}:
                  {(timeRemaining % 60).toString().padStart(2, '0')}
                </span>
              </div>
            )}
          </div>

          {timeRemaining !== null && timeRemaining <= 60 && (
            <div className="bg-red-600/10 border border-red-600/30 rounded p-2 mb-2">
              <p className="text-red-400 text-sm text-center font-medium">
                ⚠️ Moins d'une minute restante !
              </p>
            </div>
          )}

          {timeRemaining !== null && !isSubmitted && (
            <div className="bg-blue-600/10 border border-blue-600/30 rounded p-3 mb-2">
              <p className="text-blue-400 text-sm">
                ⏰ <strong>Important :</strong> Le chronomètre continue même si vous quittez cette
                page. Votre évaluation sera automatiquement soumise à la fin du temps imparti.
              </p>
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>{evaluation.questions.length} question{evaluation.questions.length > 1 ? 's' : ''}</span>
            <span>
              {evaluation.questions.filter(isAnswered).length} /{' '}
              {evaluation.questions.length} répondue
              {evaluation.questions.filter(isAnswered).length > 1 ? 's' : ''}
            </span>
          </div>
        </CardHeader>
      </Card>

      {/* Questions */}
      <div className="space-y-4">
        {evaluation.questions.map((question, index) => (
          <Card
            key={question.id}
            className="rounded-md border border-white/10 bg-white dark:bg-[#0c1023]/90"
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-gray-900 dark:text-white text-lg">
                  Question {index + 1}
                  {question.type === 'multiple_select' && (
                    <span className="ml-2 text-xs font-normal text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full">
                      {tCommon('common.evaluation.multiple_answers')}
                    </span>
                  )}
                </CardTitle>
                <div className="flex items-center gap-2 text-orange-400">
                  <Award className="w-4 h-4" />
                  <span className="text-sm">
                    {question.points} point{question.points > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-gray-900 dark:text-white text-lg">{question.question}</p>

              {/* Choix unique */}
              {question.type === 'multiple_choice' && question.options && (
                <RadioGroup
                  value={(answers[question.id] as string) ?? ''}
                  onValueChange={(value) => handleSingleAnswer(question.id, value)}
                >
                  <div className="space-y-3">
                    {question.options.map((option, oIndex) => (
                      <div
                        key={oIndex}
                        className={cn(
                          'flex items-center space-x-3 p-4 rounded-lg border transition-colors cursor-pointer',
                          answers[question.id] === oIndex.toString()
                            ? 'border-orange-500 bg-orange-500/10'
                            : 'border-slate-700 hover:border-orange-600 hover:bg-slate-800/30'
                        )}
                        onClick={() => handleSingleAnswer(question.id, oIndex.toString())}
                      >
                        <RadioGroupItem value={oIndex.toString()} id={`q${index}-opt-${oIndex}`} />
                        <Label
                          htmlFor={`q${index}-opt-${oIndex}`}
                          className="text-gray-900 dark:text-white flex-1 cursor-pointer"
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              )}

              {/* Choix multiples */}
              {question.type === 'multiple_select' && question.options && (
                <div className="space-y-3">
                  {question.options.map((option, oIndex) => {
                    const selected = ((answers[question.id] as string[]) ?? []).includes(
                      oIndex.toString()
                    );
                    return (
                      <div
                        key={oIndex}
                        className={cn(
                          'flex items-center space-x-3 p-4 rounded-lg border transition-colors cursor-pointer',
                          selected
                            ? 'border-orange-500 bg-orange-500/10'
                            : 'border-slate-700 hover:border-orange-600 hover:bg-slate-800/30'
                        )}
                        onClick={() =>
                          handleMultipleSelectToggle(question.id, oIndex.toString())
                        }
                      >
                        <Checkbox
                          id={`q${index}-ms-${oIndex}`}
                          checked={selected}
                          onCheckedChange={() =>
                            handleMultipleSelectToggle(question.id, oIndex.toString())
                          }
                          className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                        />
                        <Label
                          htmlFor={`q${index}-ms-${oIndex}`}
                          className="text-gray-900 dark:text-white flex-1 cursor-pointer"
                        >
                          {option}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Vrai / Faux */}
              {question.type === 'true_false' && (
                <RadioGroup
                  value={(answers[question.id] as string) ?? ''}
                  onValueChange={(value) => handleSingleAnswer(question.id, value)}
                >
                  <div className="space-y-3">
                    {[
                      { value: 'true', label: 'Vrai' },
                      { value: 'false', label: 'Faux' },
                    ].map(({ value, label }) => (
                      <div
                        key={value}
                        className={cn(
                          'flex items-center space-x-3 p-4 rounded-lg border transition-colors cursor-pointer',
                          answers[question.id] === value
                            ? 'border-orange-500 bg-orange-500/10'
                            : 'border-slate-700 hover:border-orange-600 hover:bg-slate-800/30'
                        )}
                        onClick={() => handleSingleAnswer(question.id, value)}
                      >
                        <RadioGroupItem value={value} id={`q${index}-${value}`} />
                        <Label
                          htmlFor={`q${index}-${value}`}
                          className="text-gray-900 dark:text-white flex-1 cursor-pointer"
                        >
                          {label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bouton soumettre */}
      <Card className="rounded-md border border-white/10 bg-white dark:bg-[#0c1023]/90">
        <CardContent className="pt-6">
          <Button
            onClick={handleSubmitQuiz}
            disabled={!allQuestionsAnswered || isSubmitting}
            className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Soumission…
              </>
            ) : (
              "Soumettre l'évaluation"
            )}
          </Button>
          {!allQuestionsAnswered && (
            <p className="text-center text-gray-400 text-sm mt-2">
              {tCommon('common.evaluation.answer_all')}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}