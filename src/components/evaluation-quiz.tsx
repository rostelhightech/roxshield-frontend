'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, Clock, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  options?: string[];
  correctAnswer: number | string;
  points: number;
  explanation?: string;
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

interface EvaluationQuizProps {
  evaluation: EvaluationData;
  attemptId: string;
  onSubmit: (answers: any[], score: number, attemptId: string) => Promise<void>;
  onSuccess: (score: number) => void;
  onFailure: (score: number, canRetry: boolean) => void;
}

export function EvaluationQuiz({ evaluation, attemptId, onSubmit, onSuccess, onFailure }: EvaluationQuizProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Timer avec localStorage pour persistance UI uniquement
  const getInitialTime = () => {
    if (!evaluation.timeLimit) return null;
    
    const storageKey = `eval-timer-${attemptId}`;
    const stored = localStorage.getItem(storageKey);
    
    if (stored) {
      const { startTime, timeLimit } = JSON.parse(stored);
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = (timeLimit * 60) - elapsed;
      return remaining > 0 ? remaining : 0;
    }
    
    // Première fois: sauvegarder l'heure de début
    const startTime = Date.now();
    localStorage.setItem(storageKey, JSON.stringify({
      startTime,
      timeLimit: evaluation.timeLimit
    }));
    
    return evaluation.timeLimit * 60;
  };

  const [timeRemaining, setTimeRemaining] = useState<number | null>(getInitialTime());

  // Décompte du timer
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0 || isSubmitted) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === null || prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining, isSubmitted]);

  // Soumission automatique quand le temps est écoulé
  useEffect(() => {
    if (timeRemaining === 0 && !isSubmitted && !isSubmitting) {
      handleSubmitQuiz();
    }
  }, [timeRemaining, isSubmitted, isSubmitting]);

  // Nettoyer le localStorage après soumission
  useEffect(() => {
    if (isSubmitted) {
      const storageKey = `eval-timer-${attemptId}`;
      localStorage.removeItem(storageKey);
    }
  }, [isSubmitted, attemptId]);

  // Avertir l'utilisateur s'il essaie de quitter pendant l'évaluation
  useEffect(() => {
    if (isSubmitted) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = 'Vous avez une évaluation en cours. Si vous quittez, le temps continuera de s\'écouler.';
      return e.returnValue;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isSubmitted]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const calculateScore = () => {
    let totalPoints = 0;
    let earnedPoints = 0;

    evaluation.questions.forEach(question => {
      totalPoints += question.points;
      const userAnswer = answers[question.id];
      
      if (question.type === 'multiple_choice' && userAnswer !== undefined) {
        if (parseInt(userAnswer) === question.correctAnswer) {
          earnedPoints += question.points;
        }
      } else if (question.type === 'true_false' && userAnswer !== undefined) {
        if (userAnswer === question.correctAnswer.toString()) {
          earnedPoints += question.points;
        }
      }
    });

    return totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
  };

  const handleSubmitQuiz = async () => {
    setIsSubmitting(true);
    
    try {
      const calculatedScore = calculateScore();
      setScore(calculatedScore);
      
      const formattedAnswers = evaluation.questions.map(q => ({
        questionId: q.id,
        answer: answers[q.id] || '',
        selectedAnswer: answers[q.id] || '',
        isCorrect: (() => {
          if (q.type === 'multiple_choice') {
            return parseInt(answers[q.id]) === q.correctAnswer;
          } else if (q.type === 'true_false') {
            return answers[q.id] === q.correctAnswer.toString();
          }
          return false;
        })(),
      }));

      // ✅ ENVOYER L'ID DE LA TENTATIVE pour validation côté serveur
      await onSubmit(formattedAnswers, calculatedScore, attemptId);
      setIsSubmitted(true);

      // Déterminer si l'utilisateur a réussi
      if (calculatedScore >= evaluation.passingScore) {
        onSuccess(calculatedScore);
      } else {
        onFailure(calculatedScore, evaluation.allowRetries);
      }
    } catch (error: any) {
      console.error('Erreur lors de la soumission:', error);
      
      // Si le temps est dépassé côté serveur
      if (error.response?.data?.timeExceeded) {
        setIsSubmitted(true);
        setScore(0);
        onFailure(0, false);
        toast.error('Temps dépassé! Votre évaluation ne peut plus être soumise.');
      } else {
        toast.error('Erreur lors de la soumission de l\'évaluation');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const allQuestionsAnswered = evaluation.questions.every(q => answers[q.id] !== undefined);

  if (isSubmitted) {
    const passed = score >= evaluation.passingScore;
    
    return (
      <Card className="rounded-md border border-white/10 bg-[#0c1023]/90 shadow-xl">
        <CardHeader>
          <CardTitle className="text-white text-center">Résultat de l'évaluation</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className={cn(
            "text-8xl mb-4",
            passed ? "text-green-400" : "text-red-400"
          )}>
            {passed ? <CheckCircle2 className="w-32 h-32 mx-auto" /> : <XCircle className="w-32 h-32 mx-auto" />}
          </div>
          
          <div>
            <p className={cn(
              "text-3xl font-bold mb-2",
              passed ? "text-green-400" : "text-red-400"
            )}>
              Score: {score}%
            </p>
            <p className="text-gray-400">
              {passed 
                ? `Félicitations! Vous avez réussi l'évaluation (minimum requis: ${evaluation.passingScore}%)`
                : `Score insuffisant. Minimum requis: ${evaluation.passingScore}%`
              }
            </p>
          </div>

          {!passed && evaluation.allowRetries && (
            <p className="text-gray-400 text-sm">
              Vous pouvez réessayer cette évaluation.
            </p>
          )}

          {evaluation.showCorrectAnswers && (
            <div className="mt-6 text-left space-y-4">
              <h3 className="text-white font-semibold">Réponses correctes:</h3>
              {evaluation.questions.map((question, index) => {
                const userAnswer = answers[question.id];
                const isCorrect = (() => {
                  if (question.type === 'multiple_choice') {
                    return parseInt(userAnswer) === question.correctAnswer;
                  } else if (question.type === 'true_false') {
                    return userAnswer === question.correctAnswer.toString();
                  }
                  return false;
                })();

                return (
                  <div key={question.id} className={cn(
                    "p-4 rounded-lg border",
                    isCorrect ? "border-green-500/30 bg-green-500/10" : "border-red-500/30 bg-red-500/10"
                  )}>
                    <p className="text-white font-medium mb-2">
                      {index + 1}. {question.question}
                    </p>
                    {question.type === 'multiple_choice' && question.options && (
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-400">
                          Votre réponse: {userAnswer !== undefined ? question.options[parseInt(userAnswer)] : 'Non répondu'}
                        </p>
                        {!isCorrect && (
                          <p className="text-green-400">
                            Réponse correcte: {question.options[question.correctAnswer as number]}
                          </p>
                        )}
                      </div>
                    )}
                    {question.type === 'true_false' && (
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-400">
                          Votre réponse: {userAnswer === 'true' ? 'Vrai' : userAnswer === 'false' ? 'Faux' : 'Non répondu'}
                        </p>
                        {!isCorrect && (
                          <p className="text-green-400">
                            Réponse correcte: {question.correctAnswer === 'true' ? 'Vrai' : 'Faux'}
                          </p>
                        )}
                      </div>
                    )}
                    {question.explanation && (
                      <p className="text-gray-400 text-sm mt-2 italic">
                        💡 {question.explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec timer */}
      <Card className="rounded-md border border-white/10 bg-[#0c1023]/90 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-white">{evaluation.title}</CardTitle>
            {timeRemaining !== null && (
              <div className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg font-bold",
                timeRemaining <= 60 ? "bg-red-600/20 text-red-400 animate-pulse" :
                timeRemaining <= 300 ? "bg-orange-600/20 text-orange-400" :
                "bg-blue-600/20 text-blue-400"
              )}>
                <Clock className="w-5 h-5" />
                <span>
                  {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                </span>
              </div>
            )}
          </div>
          {timeRemaining !== null && timeRemaining <= 60 && (
            <div className="bg-red-600/10 border border-red-600/30 rounded p-2 mb-2">
              <p className="text-red-400 text-sm text-center font-medium">
                ⚠️ Moins d'une minute restante!
              </p>
            </div>
          )}
          {timeRemaining !== null && !isSubmitted && (
            <div className="bg-blue-600/10 border border-blue-600/30 rounded p-3 mb-2">
              <p className="text-blue-400 text-sm">
                ⏰ <strong>Important:</strong> Le chronomètre continue même si vous quittez cette page. 
                Votre évaluation sera automatiquement soumise à la fin du temps imparti.
              </p>
            </div>
          )}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>{evaluation.questions.length} questions</span>
              <span>{Object.keys(answers).length} / {evaluation.questions.length} répondue{Object.keys(answers).length > 1 ? 's' : ''}</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Toutes les questions */}
      <div className="space-y-4">
        {evaluation.questions.map((question, index) => (
          <Card key={question.id} className="rounded-md border border-white/10 bg-[#0c1023]/90 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-lg">
                  Question {index + 1}
                </CardTitle>
                <div className="flex items-center gap-2 text-orange-400">
                  <Award className="w-4 h-4" />
                  <span className="text-sm">{question.points} point{question.points > 1 ? 's' : ''}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-white text-lg">{question.question}</p>

              {question.type === 'multiple_choice' && question.options && (
                <RadioGroup
                  value={answers[question.id]}
                  onValueChange={(value) => handleAnswerChange(question.id, value)}
                >
                  <div className="space-y-3">
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-3 p-4 rounded-lg border border-slate-700 hover:border-orange-600 hover:bg-slate-800/30 transition-colors">
                        <RadioGroupItem value={optionIndex.toString()} id={`q${index}-option-${optionIndex}`} />
                        <Label htmlFor={`q${index}-option-${optionIndex}`} className="text-white flex-1 cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              )}

              {question.type === 'true_false' && (
                <RadioGroup
                  value={answers[question.id]}
                  onValueChange={(value) => handleAnswerChange(question.id, value)}
                >
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-4 rounded-lg border border-slate-700 hover:border-orange-600 hover:bg-slate-800/30 transition-colors">
                      <RadioGroupItem value="true" id={`q${index}-true`} />
                      <Label htmlFor={`q${index}-true`} className="text-white flex-1 cursor-pointer">
                        Vrai
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 rounded-lg border border-slate-700 hover:border-orange-600 hover:bg-slate-800/30 transition-colors">
                      <RadioGroupItem value="false" id={`q${index}-false`} />
                      <Label htmlFor={`q${index}-false`} className="text-white flex-1 cursor-pointer">
                        Faux
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bouton de soumission */}
      <Card className="rounded-md border border-white/10 bg-[#0c1023]/90 shadow-xl">
        <CardContent className="pt-6">
          <Button
            onClick={handleSubmitQuiz}
            disabled={!allQuestionsAnswered || isSubmitting}
            className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6"
          >
            {isSubmitting ? 'Soumission...' : 'Soumettre l\'évaluation'}
          </Button>
          {!allQuestionsAnswered && (
            <p className="text-center text-gray-400 text-sm mt-2">
              Veuillez répondre à toutes les questions avant de soumettre
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
