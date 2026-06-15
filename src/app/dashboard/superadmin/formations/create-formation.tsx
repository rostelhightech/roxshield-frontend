'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { ArrowLeft, Save, Eye, Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from '@tanstack/react-router';
import { DashboardTopbar } from '@/components/layout/topbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/auth.store';
import { useOrganizationStore } from '@/store/organization.store';
import { useFormationStore } from '@/store/formation.store';
import { toast } from 'sonner';
import { BlockNoteEditor } from '@/components/blocknote-editor';
import '@/styles/blocknote.css';
import type { FormationData, FormationModule, FormationChapter, FormationEvaluation, QuizQuestion } from '@/types/formation.types';

// ============================================================================
// Sous-composants
// ============================================================================

export function ChapterItem({
  moduleIndex,
  chapterIndex,
  chapter,
  onUpdate,
  onDelete,
}: {
  moduleIndex: number;
  chapterIndex: number;
  chapter: FormationChapter;
  onUpdate: (moduleIndex: number, chapterIndex: number, field: keyof FormationChapter, value: any) => void;
  onDelete: (moduleIndex: number, chapterIndex: number) => void;
}) {
  return (
    <div className="p-3 bg-gray-100 dark:bg-slate-700/20 rounded border border-gray-300 dark:border-slate-600 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <Badge variant="outline" className="text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-400/50">
          Chapitre {chapterIndex + 1}
        </Badge>
        <Input
          value={chapter.title}
          onChange={(e) => onUpdate(moduleIndex, chapterIndex, 'title', e.target.value)}
          className="flex-1 bg-white dark:bg-slate-700/50 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white text-sm"
          placeholder="Titre du chapitre"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(moduleIndex, chapterIndex)}
          className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-gray-700 dark:text-white text-xs">Type</Label>
          <Select
            value={chapter.type}
            onValueChange={(value) => {
              if (value) {
                onUpdate(moduleIndex, chapterIndex, 'type', value as FormationChapter['type']);
              }
            }}
          >
            <SelectTrigger className="bg-white dark:bg-slate-700/50 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-600">
              <SelectItem value="VIDEO" className="text-gray-900 dark:text-white">Vidéo</SelectItem>
              <SelectItem value="DOCUMENT" className="text-gray-900 dark:text-white">Document</SelectItem>
              <SelectItem value="INTERACTIVE" className="text-gray-900 dark:text-white">Interactif</SelectItem>
              <SelectItem value="QUIZ" className="text-gray-900 dark:text-white">Quiz</SelectItem>
              <SelectItem value="WEBINAR" className="text-gray-900 dark:text-white">Webinaire</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="text-gray-700 dark:text-white text-xs">Durée (min)</Label>
          <Input
            type="number"
            value={chapter.estimatedDuration}
            onChange={(e) =>
              onUpdate(moduleIndex, chapterIndex, 'estimatedDuration', parseInt(e.target.value) || 0)
            }
            className="bg-white dark:bg-slate-700/50 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white h-8 text-sm"
          />
        </div>
      </div>

      {chapter.type === 'VIDEO' && (
        <div className="space-y-1">
          <Label className="text-gray-700 dark:text-white text-xs">URL de la vidéo</Label>
          <Input
            value={chapter.metadata?.videoUrl || ''}
            onChange={(e) =>
              onUpdate(moduleIndex, chapterIndex, 'metadata', {
                ...chapter.metadata,
                videoUrl: e.target.value,
              })
            }
            placeholder="https://youtube.com/..."
            className="bg-white dark:bg-slate-700/50 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white h-8 text-sm"
          />
        </div>
      )}

      <div className="space-y-1">
        <Label className="text-gray-700 dark:text-white text-xs">Contenu</Label>
        <BlockNoteEditor
          initialContent={chapter.content}
          onChange={(content) => onUpdate(moduleIndex, chapterIndex, 'content', content)}
          editable={true}
        />
      </div>
    </div>
  );
}

export function ModuleItem({
  module,
  moduleIndex,
  isExpanded,
  onToggleExpand,
  onUpdateModule,
  onDeleteModule,
  onAddChapter,
  onUpdateChapter,
  onDeleteChapter,
}: {
  module: FormationModule;
  moduleIndex: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onUpdateModule: (index: number, field: keyof FormationModule, value: any) => void;
  onDeleteModule: (index: number) => void;
  onAddChapter: (moduleIndex: number) => void;
  onUpdateChapter: (moduleIndex: number, chapterIndex: number, field: keyof FormationChapter, value: any) => void;
  onDeleteChapter: (moduleIndex: number, chapterIndex: number) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-800/30 overflow-hidden"
    >
      <div className="p-4 bg-gray-100 dark:bg-slate-700/30 border-b border-gray-200 dark:border-slate-600">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <GripVertical className="w-5 h-5 text-gray-400 dark:text-slate-500" />
            <Badge className="bg-orange-100 dark:bg-orange-600/20 text-orange-700 dark:text-orange-400 border-orange-300 dark:border-orange-400/50">
              Module {moduleIndex + 1}
            </Badge>
            <Input
              value={module.title}
              onChange={(e) => onUpdateModule(moduleIndex, 'title', e.target.value)}
              className="flex-1 bg-white dark:bg-slate-700/50 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white"
              placeholder="Titre du module"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onToggleExpand} className="text-gray-500 dark:text-slate-400">
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDeleteModule(moduleIndex)} className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="p-4 space-y-4"
          >
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-white">Description du module</Label>
              <Textarea
                value={module.description}
                onChange={(e) => onUpdateModule(moduleIndex, 'description', e.target.value)}
                placeholder="Décrivez brièvement ce module..."
                rows={2}
                className="bg-white dark:bg-slate-700/50 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-gray-700 dark:text-white">Chapitres ({module.chapters.length})</Label>
                <Button
                  onClick={() => onAddChapter(moduleIndex)}
                  size="sm"
                  variant="outline"
                  className="text-orange-600 dark:text-orange-400 border-orange-300 dark:border-orange-400/50"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Ajouter un chapitre
                </Button>
              </div>

              {module.chapters.length === 0 ? (
                <div className="text-center py-6 text-gray-500 dark:text-slate-500 bg-gray-100 dark:bg-slate-800/20 rounded border border-dashed border-gray-300 dark:border-slate-600">
                  Aucun chapitre. Ajoutez-en un pour commencer.
                </div>
              ) : (
                <div className="space-y-3">
                  {module.chapters.map((chapter, chapterIndex) => (
                    <ChapterItem
                      key={chapter.id}
                      moduleIndex={moduleIndex}
                      chapterIndex={chapterIndex}
                      chapter={chapter}
                      onUpdate={onUpdateChapter}
                      onDelete={onDeleteChapter}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function QuestionItem({
  question,
  questionIndex,
  evaluation,
  onUpdateEvaluation,
}: {
  question: QuizQuestion;
  questionIndex: number;
  evaluation: FormationEvaluation;
  onUpdateEvaluation: (updater: (prev: FormationEvaluation) => FormationEvaluation) => void;
}) {
  const updateQuestion = (field: keyof QuizQuestion, value: any) => {
    onUpdateEvaluation((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => (q.id === question.id ? { ...q, [field]: value } : q)),
    }));
  };

  const deleteQuestion = () => {
    onUpdateEvaluation((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== question.id),
    }));
  };

  return (
    <div className="p-4 bg-gray-100 dark:bg-slate-700/20 rounded border border-gray-300 dark:border-slate-600 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <Badge variant="outline" className="text-green-700 dark:text-green-400 border-green-300 dark:border-green-400/50">
          Q{questionIndex + 1}
        </Badge>
        <Button variant="ghost" size="sm" onClick={deleteQuestion} className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-2">
        <Label className="text-gray-700 dark:text-white text-sm">Question</Label>
        <Textarea
          value={question.question}
          onChange={(e) => updateQuestion('question', e.target.value)}
          placeholder="Tapez votre question..."
          rows={2}
          className="bg-white dark:bg-slate-700/50 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-gray-700 dark:text-white text-sm">Options de réponse</Label>
        {question.options?.map((option, oIndex) => (
          <div key={oIndex} className="flex items-center gap-2">
            <input
              type="radio"
              name={`correct-${question.id}`}
              checked={question.correctAnswer === oIndex}
              onChange={() => updateQuestion('correctAnswer', oIndex)}
              className="w-4 h-4 text-green-600 dark:text-green-500"
            />
            <Input
              value={option}
              onChange={(e) => {
                const newOptions = [...(question.options || [])];
                newOptions[oIndex] = e.target.value;
                updateQuestion('options', newOptions);
              }}
              placeholder={`Option ${oIndex + 1}`}
              className="flex-1 bg-white dark:bg-slate-700/50 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white text-sm"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Étape Informations générales
// ============================================================================
export function InfoStep({
  formData,
  setFormData,
  onNext,
}: {
  formData: FormationData;
  setFormData: React.Dispatch<React.SetStateAction<FormationData>>;
  onNext: () => void;
}) {
  const { user } = useAuthStore();
  const { organizations, isLoading: loadingOrgs } = useOrganizationStore();

  return (
    <Card className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1023]/90 shadow-sm dark:shadow-xl">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">Informations générales</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {user?.role === 'superadmin' && (
          <div className="space-y-2">
            <Label htmlFor="organization" className="text-gray-700 dark:text-white">Organisation *</Label>
            {loadingOrgs ? (
              <div className="bg-gray-100 dark:bg-slate-800/50 border border-gray-300 dark:border-slate-600 rounded-md p-3">
                <span className="text-gray-500 dark:text-gray-400">Chargement...</span>
              </div>
            ) : (
              <Select
                value={formData.organizationId}
                onValueChange={(value) => {
                  if (value) {
                    setFormData((prev) => ({ ...prev, organizationId: value }));
                  }
                }}
              >
                <SelectTrigger className="bg-white dark:bg-slate-800/50 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white">
                  <SelectValue placeholder="Sélectionner une organisation" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-600">
                  {organizations.map((org) => (
                    <SelectItem key={org.id} value={org.id} className="text-gray-900 dark:text-white">
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="title" className="text-gray-700 dark:text-white">Titre de la formation *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="Ex: Sensibilisation au Phishing Avancé"
            className="bg-white dark:bg-slate-800/50 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-gray-700 dark:text-white">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Décrivez brièvement le contenu de cette formation..."
            rows={3}
            className="bg-white dark:bg-slate-800/50 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-white">Durée totale estimée</Label>
            <div className="bg-gray-100 dark:bg-slate-700/30 border border-gray-300 dark:border-slate-600 rounded-md p-3 text-gray-900 dark:text-white">
              {formData.estimatedDuration} minutes
              <span className="text-gray-500 dark:text-slate-400 text-sm ml-2">(Calculée automatiquement)</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-8">
            <Switch
              id="required"
              checked={formData.isRequired}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isRequired: checked }))}
            />
            <Label htmlFor="required" className="text-gray-700 dark:text-white">Formation obligatoire</Label>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="passingScore" className="text-gray-700 dark:text-white">Score de réussite (%)</Label>
            <Input
              id="passingScore"
              type="number"
              min="0"
              max="100"
              value={formData.passingScore}
              onChange={(e) => setFormData((prev) => ({ ...prev, passingScore: parseInt(e.target.value) || 0 }))}
              className="bg-white dark:bg-slate-800/50 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxAttempts" className="text-gray-700 dark:text-white">Tentatives max</Label>
            <Input
              id="maxAttempts"
              type="number"
              min="1"
              value={formData.maxAttempts}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setFormData((prev) => ({ ...prev, maxAttempts: isNaN(val) ? 1 : val }));
              }}
              disabled={!formData.allowRetries}
              className="bg-white dark:bg-slate-800/50 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex items-center space-x-2 pt-8">
            <Switch
              id="allowRetries"
              checked={formData.allowRetries}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, allowRetries: checked }))}
            />
            <Label htmlFor="allowRetries" className="text-gray-700 dark:text-white">Autoriser nouvelles tentatives</Label>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-slate-700">
          <div className="flex items-center space-x-2">
            <Switch
              id="allUsers"
              checked={formData.targetAudience.allUsers}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  targetAudience: { ...prev.targetAudience, allUsers: checked },
                }))
              }
            />
            <Label htmlFor="allUsers" className="text-gray-700 dark:text-white">Assigner à tous les utilisateurs</Label>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onNext} className="bg-orange-600 hover:bg-orange-700 text-white">
            Suivant : Modules & Chapitres
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Étape Modules & Chapitres
// ============================================================================
export function ModulesStep({
  formData,
  setFormData,
  onNext,
  onPrev,
}: {
  formData: FormationData;
  setFormData: React.Dispatch<React.SetStateAction<FormationData>>;
  onNext: () => void;
  onPrev: () => void;
}) {
  const [selectedModuleIndex, setSelectedModuleIndex] = useState<number | null>(null);

  const addModule = () => {
    const newMod: FormationModule = {
      id: `temp-${Date.now()}`,
      title: `Module ${formData.modules.length + 1}`,
      description: '',
      order: formData.modules.length,
      estimatedDuration: 0,
      chapters: [],
    };
    setFormData((prev) => ({ ...prev, modules: [...prev.modules, newMod] }));
    setSelectedModuleIndex(formData.modules.length);
  };

  const updateModule = (index: number, field: keyof FormationModule, value: any) => {
    setFormData((prev) => ({
      ...prev,
      modules: prev.modules.map((mod, idx) => (idx === index ? { ...mod, [field]: value } : mod)),
    }));
  };

  const deleteModule = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      modules: prev.modules.filter((_, idx) => idx !== index),
    }));
    if (selectedModuleIndex === index) setSelectedModuleIndex(null);
  };

  const addChapter = (moduleIndex: number) => {
    const mod = formData.modules[moduleIndex];
    const newChapter: FormationChapter = {
      id: `temp-${Date.now()}`,
      title: `Chapitre ${mod.chapters.length + 1}`,
      description: '',
      content: '',
      order: mod.chapters.length,
      type: 'DOCUMENT',
      estimatedDuration: 15,
      metadata: {},
    };
    setFormData((prev) => ({
      ...prev,
      modules: prev.modules.map((m, idx) =>
        idx === moduleIndex ? { ...m, chapters: [...m.chapters, newChapter] } : m
      ),
    }));
  };

  const updateChapter = (moduleIndex: number, chapterIndex: number, field: keyof FormationChapter, value: any) => {
    setFormData((prev) => ({
      ...prev,
      modules: prev.modules.map((mod, modIdx) =>
        modIdx === moduleIndex
          ? {
              ...mod,
              chapters: mod.chapters.map((ch, chIdx) => (chIdx === chapterIndex ? { ...ch, [field]: value } : ch)),
            }
          : mod
      ),
    }));
  };

  const deleteChapter = (moduleIndex: number, chapterIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      modules: prev.modules.map((mod, modIdx) =>
        modIdx === moduleIndex
          ? { ...mod, chapters: mod.chapters.filter((_, chIdx) => chIdx !== chapterIndex) }
          : mod
      ),
    }));
  };

  return (
    <Card className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1023]/90 shadow-sm dark:shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-gray-900 dark:text-white">Modules de formation</CardTitle>
          <Button onClick={addModule} className="bg-orange-600 hover:bg-orange-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un module
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {formData.modules.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-slate-400">
            <div className="text-6xl mb-4">📚</div>
            <p>Aucun module créé. Commencez par ajouter un module.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {formData.modules.map((mod, moduleIndex) => (
              <ModuleItem
                key={mod.id}
                module={mod}
                moduleIndex={moduleIndex}
                isExpanded={selectedModuleIndex === moduleIndex}
                onToggleExpand={() =>
                  setSelectedModuleIndex(selectedModuleIndex === moduleIndex ? null : moduleIndex)
                }
                onUpdateModule={updateModule}
                onDeleteModule={deleteModule}
                onAddChapter={addChapter}
                onUpdateChapter={updateChapter}
                onDeleteChapter={deleteChapter}
              />
            ))}
          </div>
        )}

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onPrev}>
            Précédent
          </Button>
          <Button onClick={onNext} className="bg-orange-600 hover:bg-orange-700 text-white">
            Suivant : Évaluation finale
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Étape Évaluation finale
// ============================================================================
export function EvaluationStep({
  formData,
  setFormData,
  onSave,
  onPublish,
  onPrev,
}: {
  formData: FormationData;
  setFormData: React.Dispatch<React.SetStateAction<FormationData>>;
  onSave: () => void;
  onPublish: () => void;
  onPrev: () => void;
}) {
  const addQuestion = () => {
    if (!formData.finalEvaluation) return;
    const newQuestion: QuizQuestion = {
      id: `q-${Date.now()}`,
      question: '',
      type: 'multiple_choice',
      options: ['', '', '', ''],
      correctAnswer: 0,
      points: 1,
      explanation: '',
    };
    setFormData((prev) => ({
      ...prev,
      finalEvaluation: prev.finalEvaluation
        ? { ...prev.finalEvaluation, questions: [...prev.finalEvaluation.questions, newQuestion] }
        : prev.finalEvaluation,
    }));
  };

  const updateEvaluation = (updater: (prev: FormationEvaluation) => FormationEvaluation) => {
    setFormData((prev) => ({
      ...prev,
      finalEvaluation: prev.finalEvaluation ? updater(prev.finalEvaluation) : prev.finalEvaluation,
    }));
  };

  return (
    <Card className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1023]/90 shadow-sm dark:shadow-xl">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">Évaluation finale (Optionnelle)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-2">
          <Switch
            id="hasFinalEval"
            checked={!!formData.finalEvaluation}
            onCheckedChange={(checked) => {
              if (checked) {
                setFormData((prev) => ({
                  ...prev,
                  finalEvaluation: {
                    type: 'FORMATION',
                    title: 'Évaluation finale',
                    description: '',
                    questions: [],
                    passingScore: 80,
                    allowRetries: true,
                    maxAttempts: 3,
                    showCorrectAnswers: true,
                    randomizeQuestions: false,
                    randomizeOptions: false,
                  },
                }));
              } else {
                setFormData((prev) => ({ ...prev, finalEvaluation: undefined }));
              }
            }}
          />
          <Label htmlFor="hasFinalEval" className="text-gray-700 dark:text-white">
            Ajouter une évaluation finale pour valider la formation complète
          </Label>
        </div>

        {formData.finalEvaluation && (
          <div className="space-y-6 pl-6 border-l-2 border-orange-500 dark:border-orange-600">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-white">Titre de l'évaluation</Label>
                <Input
                  value={formData.finalEvaluation.title}
                  onChange={(e) => updateEvaluation((prev) => ({ ...prev, title: e.target.value }))}
                  className="bg-white dark:bg-slate-800/50 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-700 dark:text-white">Score requis (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.finalEvaluation.passingScore}
                    onChange={(e) =>
                      updateEvaluation((prev) => ({ ...prev, passingScore: parseInt(e.target.value) || 0 }))
                    }
                    className="bg-white dark:bg-slate-800/50 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 dark:text-white">Temps limite (min)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.finalEvaluation.timeLimit || ''}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      updateEvaluation((prev) => ({ ...prev, timeLimit: isNaN(val) ? undefined : val }));
                    }}
                    placeholder="Illimité"
                    className="bg-white dark:bg-slate-800/50 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 dark:text-white">Tentatives max</Label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.finalEvaluation.maxAttempts}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      updateEvaluation((prev) => ({ ...prev, maxAttempts: isNaN(val) ? 1 : val }));
                    }}
                    className="bg-white dark:bg-slate-800/50 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.finalEvaluation.showCorrectAnswers}
                    onCheckedChange={(checked) =>
                      updateEvaluation((prev) => ({ ...prev, showCorrectAnswers: checked }))
                    }
                  />
                  <Label className="text-gray-700 dark:text-white">Afficher les bonnes réponses après tentative</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.finalEvaluation.randomizeQuestions}
                    onCheckedChange={(checked) =>
                      updateEvaluation((prev) => ({ ...prev, randomizeQuestions: checked }))
                    }
                  />
                  <Label className="text-gray-700 dark:text-white">Ordre aléatoire des questions</Label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-gray-700 dark:text-white">Questions ({formData.finalEvaluation.questions.length})</Label>
                <Button onClick={addQuestion} size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
                  <Plus className="w-4 h-4 mr-1" />
                  Ajouter une question
                </Button>
              </div>

              {formData.finalEvaluation.questions.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-800/20 rounded border border-dashed border-gray-300 dark:border-slate-600">
                  <div className="text-4xl mb-2">❓</div>
                  <p>Aucune question ajoutée</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.finalEvaluation.questions.map((question, qIndex) => (
                    <QuestionItem
                      key={question.id}
                      question={question}
                      questionIndex={qIndex}
                      evaluation={formData.finalEvaluation!}
                      onUpdateEvaluation={updateEvaluation}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onPrev}>
            Précédent
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onSave}>
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder brouillon
            </Button>
            <Button onClick={onPublish} className="bg-green-600 hover:bg-green-700 text-white">
              <Eye className="w-4 h-4 mr-2" />
              Publier la formation
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Hook personnalisé pour la gestion du formulaire
// ============================================================================
function useFormationForm() {
  const [formData, setFormData] = useState<FormationData>({
    title: '',
    description: '',
    status: 'DRAFT',
    estimatedDuration: 0,
    isRequired: false,
    passingScore: 80,
    allowRetries: true,
    maxAttempts: 3,
    organizationId: '',
    targetAudience: {
      allUsers: true,
      specificGroups: [],
      specificUsers: [],
    },
    modules: [],
    finalEvaluation: undefined,
  });

  const estimatedDuration = useMemo(() => {
    return formData.modules.reduce(
      (total, mod) =>
        total + mod.chapters.reduce((chapterTotal, chapter) => chapterTotal + chapter.estimatedDuration, 0),
      0
    );
  }, [formData.modules]);

  const formDataWithDuration = useMemo(() => ({
    ...formData,
    estimatedDuration,
  }), [formData, estimatedDuration]);

  return { formData: formDataWithDuration, setFormData };
}

// ============================================================================
// Validation centralisée
// ============================================================================
function validateFormationData(formData: FormationData): { valid: boolean; error?: string; step?: 'info' | 'modules' | 'evaluation' } {
  if (!formData.title.trim()) {
    return { valid: false, error: 'Le titre de la formation est requis', step: 'info' };
  }
  if (!formData.organizationId) {
    return { valid: false, error: 'Veuillez sélectionner une organisation', step: 'info' };
  }
  if (formData.modules.length === 0) {
    return { valid: false, error: 'Ajoutez au moins un module à la formation', step: 'modules' };
  }
  const moduleWithoutTitle = formData.modules.find((m) => !m.title.trim());
  if (moduleWithoutTitle) {
    const index = formData.modules.indexOf(moduleWithoutTitle) + 1;
    return { valid: false, error: `Le module ${index} doit avoir un titre`, step: 'modules' };
  }
  const moduleWithoutChapters = formData.modules.find((m) => m.chapters.length === 0);
  if (moduleWithoutChapters) {
    return { valid: false, error: `Le module "${moduleWithoutChapters.title}" doit avoir au moins un chapitre`, step: 'modules' };
  }
  for (const modules of formData.modules) {
    const chapterWithoutTitle = modules.chapters.find((c) => !c.title.trim());
    if (chapterWithoutTitle) {
      return { valid: false, error: `Module "${modules.title}" : tous les chapitres doivent avoir un titre`, step: 'modules' };
    }
  }
  if (formData.finalEvaluation && formData.finalEvaluation.questions.length > 0) {
    if (!formData.finalEvaluation.title.trim()) {
      return { valid: false, error: "L'évaluation finale doit avoir un titre", step: 'evaluation' };
    }
    const questionWithoutText = formData.finalEvaluation.questions.find((q) => !q.question.trim());
    if (questionWithoutText) {
      return { valid: false, error: 'Toutes les questions de l’évaluation doivent avoir un texte', step: 'evaluation' };
    }
    const mcqWithoutOptions = formData.finalEvaluation.questions.find(
      (q) => q.type === 'multiple_choice' && (!q.options || q.options.length < 2)
    );
    if (mcqWithoutOptions) {
      return { valid: false, error: 'Les questions à choix multiples doivent avoir au moins 2 options', step: 'evaluation' };
    }
    const questionWithoutAnswer = formData.finalEvaluation.questions.find(
      (q) => q.correctAnswer === undefined || q.correctAnswer === null || q.correctAnswer === ''
    );
    if (questionWithoutAnswer) {
      return { valid: false, error: 'Toutes les questions doivent avoir une réponse correcte définie', step: 'evaluation' };
    }
  }
  return { valid: true };
}

// ============================================================================
// Composant principal
// ============================================================================
export function CreateFormationPage() {
  const navigate = useNavigate();
  const { formData, setFormData } = useFormationForm();
  const [currentStep, setCurrentStep] = useState<'info' | 'modules' | 'evaluation'>('info');
  const { createFormation } = useFormationStore();

  const handleSave = useCallback(async (shouldPublish: boolean) => {
    const validation = validateFormationData(formData);
    if (!validation.valid) {
      toast.error(`❌ ${validation.error}`);
      if (validation.step) setCurrentStep(validation.step);
      return;
    }

    try {
      const payload = {
        ...formData,
        status: shouldPublish ? 'PUBLISHED' : 'DRAFT',
        modules: formData.modules.map((module) => ({
          title: module.title,
          description: module.description,
          order: module.order,
          estimatedDuration: module.estimatedDuration,
          chapters: module.chapters.map((chapter) => ({
            title: chapter.title,
            description: chapter.description,
            content: chapter.content,
            order: chapter.order,
            type: chapter.type,
            estimatedDuration: chapter.estimatedDuration,
            metadata: chapter.metadata,
          })),
        })),
      };
      await createFormation(payload as any);
      toast.success(`✅ Formation ${shouldPublish ? 'publiée' : 'sauvegardée'} avec succès`);
      navigate({ to: '/dashboard/formations' });
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
      console.error(error);
    }
  }, [formData, createFormation, navigate]);

  return (
    <>
      <DashboardTopbar
        title="Créer une formation"
        description="Créez une formation structurée avec modules, chapitres et évaluations"
      />
      <div className="min-h-screen bg-gray-50 dark:bg-[#050816] px-6 pb-12">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate({ to: '/dashboard/formations' })}
            className="text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux formations
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => handleSave(false)}>
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder en brouillon
            </Button>
            <Button onClick={() => handleSave(true)}>
              <Eye className="w-4 h-4 mr-2" />
              Publier
            </Button>
          </div>
        </div>

        <Tabs value={currentStep} onValueChange={(value: any) => setCurrentStep(value)} className="space-y-6">
          <TabsList className="grid w-full gap-4 max-w-md mx-auto grid-cols-3 bg-gray-100 dark:bg-slate-800/50">
            <TabsTrigger value="info" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white text-gray-700 dark:text-white">
              Informations
            </TabsTrigger>
            <TabsTrigger value="modules" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white text-gray-700 dark:text-white">
              Modules & Chapitres
            </TabsTrigger>
            <TabsTrigger value="evaluation" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white text-gray-700 dark:text-white">
              Évaluation finale
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <InfoStep formData={formData} setFormData={setFormData} onNext={() => setCurrentStep('modules')} />
          </TabsContent>

          <TabsContent value="modules">
            <ModulesStep
              formData={formData}
              setFormData={setFormData}
              onNext={() => setCurrentStep('evaluation')}
              onPrev={() => setCurrentStep('info')}
            />
          </TabsContent>

          <TabsContent value="evaluation">
            <EvaluationStep
              formData={formData}
              setFormData={setFormData}
              onSave={() => handleSave(false)}
              onPublish={() => handleSave(true)}
              onPrev={() => setCurrentStep('modules')}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}