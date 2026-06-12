// Types pour le nouveau système de formations avec modules, chapitres et évaluations

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  options?: string[];
  correctAnswer: number | string;
  points: number;
  explanation?: string;
}

export interface FormationEvaluation {
  id?: string;
  type: 'CHAPTER' | 'MODULE' | 'FORMATION';
  title: string;
  description?: string;
  questions: QuizQuestion[];
  passingScore: number;
  timeLimit?: number;
  allowRetries: boolean;
  maxAttempts: number;
  showCorrectAnswers: boolean;
  randomizeQuestions: boolean;
  randomizeOptions: boolean;
}

export interface FormationChapter {
  id?: string;
  title: string;
  description?: string;
  content: string;
  order: number;
  type: 'VIDEO' | 'DOCUMENT' | 'INTERACTIVE' | 'QUIZ' | 'WEBINAR';
  estimatedDuration: number;
  metadata?: {
    videoUrl?: string;
    documentUrl?: string;
    resources?: Array<{
      name: string;
      url: string;
      type: string;
    }>;
  };
  evaluation?: FormationEvaluation;
}

export interface FormationModule {
  id?: string;
  title: string;
  description?: string;
  order: number;
  estimatedDuration: number;
  chapters: FormationChapter[];
  evaluation?: FormationEvaluation;
}

export interface FormationData {
  // Informations générales
  title: string;
  description?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  estimatedDuration: number;
  isRequired: boolean;
  passingScore: number;
  allowRetries: boolean;
  maxAttempts: number;
  organizationId: string;
  
  // Audience
  targetAudience: {
    allUsers: boolean;
    specificGroups: string[];
    specificUsers: string[];
  };

  // Structure hiérarchique
  modules: FormationModule[];
  finalEvaluation?: FormationEvaluation;
}

export interface CreateFormationPayload {
  // Formation principale
  title: string;
  description?: string;
  status?: 'DRAFT' | 'PUBLISHED';
  estimatedDuration: number;
  isRequired: boolean;
  passingScore: number;
  allowRetries: boolean;
  maxAttempts: number;
  organizationId: string;
  targetAudience: {
    allUsers: boolean;
    specificGroups: string[];
    specificUsers: string[];
  };
  
  // Modules avec chapitres
  modules: Array<{
    title: string;
    description?: string;
    order: number;
    estimatedDuration: number;
  }>;
  
  // Chapitres
  chapters: Array<{
    moduleIndex: number; // Index du module parent
    title: string;
    description?: string;
    content: string;
    order: number;
    type: 'VIDEO' | 'DOCUMENT' | 'INTERACTIVE' | 'QUIZ' | 'WEBINAR';
    estimatedDuration: number;
    metadata?: any;
  }>;
  
  // Évaluations
  evaluations: Array<{
    type: 'CHAPTER' | 'MODULE' | 'FORMATION';
    moduleIndex?: number;
    chapterIndex?: number;
    title: string;
    description?: string;
    questions: QuizQuestion[];
    passingScore: number;
    timeLimit?: number;
    allowRetries: boolean;
    maxAttempts: number;
    showCorrectAnswers: boolean;
    randomizeQuestions: boolean;
    randomizeOptions: boolean;
  }>;
}
