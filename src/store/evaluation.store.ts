import { create } from 'zustand';
import { apiService } from '@/app/services/api.service';

export interface EvaluationAttempt {
  id: string;
  attemptNumber: number;
  status: 'IN_PROGRESS' | 'COMPLETED';
  score: number | null;
  passed: boolean;
  timeSpent: number | null;
  startedAt: string;
  completedAt: string | null;
  totalPoints: number | null;
  earnedPoints: number | null;
  answers: Array<{
    questionId: string;
    answer: string;
    selectedAnswer: string;
    isCorrect: boolean;
    pointsEarned: number;
  }> | null;
}

export interface EvaluationQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  options?: string[];
  points: number;
  correctAnswer?: number | string;
  explanation?: string;
}

export interface MyEvaluation {
  // Formation
  formationId: string;
  formationTitle: string;
  formationPassingScore: number;
  progressStatus: string;

  // Évaluation
  evaluationId: string;
  evaluationTitle: string;
  passingScore: number;
  maxAttempts: number | null;
  allowRetries: boolean;
  showCorrectAnswers: boolean;
  timeLimit: number | null;
  questions: EvaluationQuestion[];

  // Méta
  hasReachedMaxAttempts: boolean;
  attemptsUsed: number;
  attemptsRemaining: number | null;
  bestScore: number | null;
  isPassed: boolean;

  // Historique
  attempts: EvaluationAttempt[];
}

interface EvaluationStore {
  myEvaluations: MyEvaluation[];
  isLoading: boolean;
  error: string | null;
  fetchMyEvaluations: () => Promise<void>;
}

export const useEvaluationStore = create<EvaluationStore>((set) => ({
  myEvaluations: [],
  isLoading: false,
  error: null,

  fetchMyEvaluations: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.get('/formations/my/evaluations');
      set({
        myEvaluations: response.data ?? [],
        isLoading: false,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      set({ error: message, isLoading: false });
    }
  },
}));