'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ArrowLeft, Save, Eye, Plus, Trash2, GripVertical, ChevronDown, ChevronUp, Minus, FileText, Upload, Pencil, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from '@tanstack/react-router';
import { DashboardTopbar } from '@/components/layout/topbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/auth.store';
import { useOrganizationStore } from '@/store/organization.store';
import { useFormationStore } from '@/store/formation.store';
import { BlockNoteEditor } from '@/components/blocknote-editor';
import '@/styles/blocknote.css';
import type { FormationData, FormationModule, FormationChapter, QuizQuestion, FormationEvaluation } from '@/types/formation.types';
import { Combobox } from '@/components/ui/combobox';
import toast from 'react-hot-toast';
import { roleEnum } from '@/constants/roleEnum';

// ============================================================================
// Sous-composants
// ============================================================================

export function ChapterItem({

  moduleIndex,
  chapterIndex,
  chapter,
  onUpdate,
  onDelete,
  organizationId,
}: {
  moduleIndex: number;
  chapterIndex: number;
  chapter: FormationChapter;
  onUpdate: (moduleIndex: number, chapterIndex: number, field: keyof FormationChapter, value: any) => void;
  onDelete: (moduleIndex: number, chapterIndex: number) => void;
  organizationId: string;
}) {
  const { uploadChapterPdf } = useFormationStore();
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const { t: tCommon } = useTranslation('common');
  // État local du mode : initialisé depuis chapter.pdfUrl
  const [contentMode, setContentMode] = useState<'editor' | 'pdf'>(
    chapter.pdfUrl ? 'pdf' : 'editor'
  );

  const handleSwitchMode = (mode: 'editor' | 'pdf') => {
    setContentMode(mode);
    if (mode === 'editor') {
      // Revenir en éditeur : effacer les champs PDF
      onUpdate(moduleIndex, chapterIndex, 'pdfUrl', null);
      onUpdate(moduleIndex, chapterIndex, 'pdfPublicId', null);
    }
    // Passer en PDF : on n'efface pas le contenu éditeur immédiatement,
    // l'upload le remplacera une fois effectué
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!organizationId) {
      toast.error(tCommon('admin.formations.create_no_org_error'));
      return;
    }

    setIsUploadingPdf(true);
    try {
      const { pdfUrl, pdfPublicId } = await uploadChapterPdf(file, organizationId);
      onUpdate(moduleIndex, chapterIndex, 'pdfUrl', pdfUrl);
      onUpdate(moduleIndex, chapterIndex, 'pdfPublicId', pdfPublicId);
      toast.success(tCommon('admin.formations.create_pdf_upload_success'));
    } catch {
      toast.error(tCommon('admin.formations.create_pdf_upload_error'));
    } finally {
      setIsUploadingPdf(false);
      e.target.value = '';
    }
  };

  const handleRemovePdf = () => {
    onUpdate(moduleIndex, chapterIndex, 'pdfUrl', null);
    onUpdate(moduleIndex, chapterIndex, 'pdfPublicId', null);
  };

  return (
    <div className="p-3 bg-gray-100 dark:bg-slate-700/20 rounded border border-gray-300 dark:border-slate-600 space-y-3">
      {/* En-tête */}
      <div className="flex items-center justify-between gap-3">
        <Badge variant="outline" className="text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-400/50">
          {tCommon('admin.formations.create_chapter_badge', { count: chapterIndex + 1 })}
        </Badge>
        <Input
          value={chapter.title}
          onChange={(e) => onUpdate(moduleIndex, chapterIndex, 'title', e.target.value)}
          className="flex-1 bg-white dark:bg-slate-700/50 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white text-sm"
          placeholder={tCommon('admin.formations.create_chapter_title')}
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
          <Label className="text-gray-700 dark:text-white text-xs">{tCommon('admin.campaigns.tracking_type')}</Label>
          <Combobox
            options={[
              { value: 'VIDEO', label: tCommon('admin.formations.type_video') },
              { value: 'DOCUMENT', label: tCommon('admin.formations.type_document') },
              { value: 'INTERACTIVE', label: tCommon('admin.formations.type_interactive') },
              { value: 'QUIZ', label: tCommon('admin.formations.type_quiz') },
              { value: 'WEBINAR', label: tCommon('admin.formations.type_webinar') },
            ]}
            value={chapter.type}
            onChange={(value) => {
              if (value) onUpdate(moduleIndex, chapterIndex, 'type', value as FormationChapter['type']);
            }}
            placeholder={tCommon('admin.plans.type_placeholder')}
            searchPlaceholder={tCommon('admin.formations.create_search_type')}
            className="bg-white dark:bg-slate-700/50 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white h-8 text-sm"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-gray-700 dark:text-white text-xs">{tCommon('admin.formations.create_duration')}</Label>
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
          <Label className="text-gray-700 dark:text-white text-xs">{tCommon('admin.formations.create_video_url')}</Label>
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

      {/* Toggle éditeur / PDF */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label className="text-gray-700 dark:text-white text-xs">{tCommon('admin.formations.tab_content')}</Label>
          <div className="flex rounded-md border border-gray-300 dark:border-slate-600 overflow-hidden ml-auto">
            <button
              type="button"
              onClick={() => handleSwitchMode('editor')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs transition-colors ${
                contentMode === 'editor'
                  ? 'bg-orange-600 text-white'
                  : 'bg-white dark:bg-slate-700/50 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}
            >
              <Pencil className="w-3 h-3" />
              {tCommon('admin.formations.create_editor')}
            </button>
            <button
              type="button"
              onClick={() => handleSwitchMode('pdf')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs transition-colors border-l border-gray-300 dark:border-slate-600 ${
                contentMode === 'pdf'
                  ? 'bg-orange-600 text-white'
                  : 'bg-white dark:bg-slate-700/50 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}
            >
              <FileText className="w-3 h-3" />
              PDF
            </button>
          </div>
        </div>

        {contentMode === 'editor' ? (
          <BlockNoteEditor
            initialContent={chapter.content}
            onChange={(content) => onUpdate(moduleIndex, chapterIndex, 'content', content)}
            editable={true}
          />
        ) : (
          <div className="rounded border border-dashed border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700/20 p-4">
            {chapter.pdfUrl ? (
              /* PDF déjà uploadé */
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-5 h-5 text-orange-500 shrink-0" />
                  <a
                    href={chapter.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 dark:text-blue-400 underline truncate"
                  >
                    {tCommon('admin.formations.create_pdf_uploaded')}
                  </a>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => pdfInputRef.current?.click()}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 h-7 text-xs"
                  >
                    <Upload className="w-3 h-3 mr-1" />
                    {tCommon('admin.formations.create_pdf_replace')}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemovePdf}
                    className="text-red-500 hover:text-red-600 h-7"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ) : (
              /* Zone d'upload */
              <div className="text-center space-y-2">
                <FileText className="w-8 h-8 text-gray-400 mx-auto" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {tCommon('admin.formations.create_drag_drop')}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{tCommon('admin.formations.create_pdf_constraints')}</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => pdfInputRef.current?.click()}
                  disabled={isUploadingPdf || !organizationId}
                  className="border-orange-300 dark:border-orange-500/50 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-500/10"
                >
                  <Upload className="w-3 h-3 mr-1.5" />
                  {isUploadingPdf ? tCommon('user.profile.uploading') : tCommon('admin.formations.create_pdf_choose')}
                </Button>
                {!organizationId && (
                  <p className="text-xs text-amber-500">{tCommon('admin.formations.create_select_org_first')}</p>
                )}
              </div>
            )}

            <input
              ref={pdfInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handlePdfUpload}
            />
          </div>
        )}
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
  organizationId,
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
  organizationId: string;
}) {

    const { t: tCommon } = useTranslation('common');

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
              {tCommon('admin.formations.create_module_badge', { count: moduleIndex + 1 })}
            </Badge>
            <Input
              value={module.title}
              onChange={(e) => onUpdateModule(moduleIndex, 'title', e.target.value)}
              className="flex-1 bg-white dark:bg-slate-700/50 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white"
              placeholder={tCommon('admin.formations.create_module_title_placeholder')}
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
              <Label className="text-gray-700 dark:text-white">{tCommon('admin.formations.create_module_desc')}</Label>
              <Textarea
                value={module.description}
                onChange={(e) => onUpdateModule(moduleIndex, 'description', e.target.value)}
                placeholder={tCommon('admin.formations.create_module_desc_placeholder')}
                rows={2}
                className="bg-white dark:bg-slate-700/50 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-gray-700 dark:text-white">{tCommon('admin.formations.create_chapters_count', { count: module.chapters.length })}</Label>
                <Button
                  onClick={() => onAddChapter(moduleIndex)}
                  size="sm"
                  variant="outline"
                  className="text-orange-600 dark:text-orange-400 border-orange-300 dark:border-orange-400/50"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  {tCommon('admin.formations.create_add_chapter')}
                </Button>
              </div>

              {module.chapters.length === 0 ? (
                <div className="text-center py-6 text-gray-500 dark:text-slate-500 bg-gray-100 dark:bg-slate-800/20 rounded border border-dashed border-gray-300 dark:border-slate-600">
                  {tCommon('admin.formations.create_no_chapters')}
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
                      organizationId={organizationId}
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

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

// TYPE_LABELS migré vers i18n — voir clés create_q_type_single/multi/true_false

interface QuestionItemProps {
  question: QuizQuestion;
  questionIndex: number;
  totalQuestions: number;
  evaluation: FormationEvaluation;
  onUpdateEvaluation: (updater: (prev: FormationEvaluation) => FormationEvaluation) => void;
}

export function QuestionItem({
  question,
  questionIndex,
  totalQuestions,
  evaluation,
  onUpdateEvaluation,
}: QuestionItemProps) {
  const updateQuestion = (field: keyof QuizQuestion, value: any) => {
    onUpdateEvaluation((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === question.id ? { ...q, [field]: value } : q
      ),
    }));
  };

  const deleteQuestion = () => {
    onUpdateEvaluation((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== question.id),
    }));
  };

  const moveQuestion = (direction: 'up' | 'down') => {
    onUpdateEvaluation((prev) => {
      const questions = [...prev.questions];
      const index = questions.findIndex((q) => q.id === question.id);
      const swapIndex = direction === 'up' ? index - 1 : index + 1;
      if (swapIndex < 0 || swapIndex >= questions.length) return prev;
      [questions[index], questions[swapIndex]] = [questions[swapIndex], questions[index]];
      return { ...prev, questions };
    });
  };

  const handleTypeChange = (newType: "multiple_choice" | "true_false" | "multiple_select" | null) => {
    // Réinitialiser correctAnswer et options selon le nouveau type
    if (newType === 'true_false') {
      updateQuestion('type', newType);
      updateQuestion('options', ['Vrai', 'Faux']);
      updateQuestion('correctAnswer', 'true');
    } else if (newType === 'multiple_select') {
      updateQuestion('type', newType);
      updateQuestion('options', ['', '', '', '']);
      updateQuestion('correctAnswer', []);
    } else {
      updateQuestion('type', newType);
      updateQuestion('options', ['', '', '', '']);
      updateQuestion('correctAnswer', 0);
    }
  };

  const addOption = () => {
    if ((question.options?.length ?? 0) >= 6) return;
    updateQuestion('options', [...(question.options ?? []), '']);
  };

  const removeOption = (index: number) => {
    if ((question.options?.length ?? 0) <= 2) return;
    const newOptions = question.options!.filter((_, i) => i !== index);

    // Ajuster correctAnswer si nécessaire
    if (question.type === 'multiple_choice') {
      const correct = question.correctAnswer as number;
      if (correct === index) {
        updateQuestion('correctAnswer', 0);
      } else if (correct > index) {
        updateQuestion('correctAnswer', correct - 1);
      }
    } else if (question.type === 'multiple_select') {
      const correct = (question.correctAnswer as number[]).filter(
        (i) => i !== index
      ).map((i) => (i > index ? i - 1 : i));
      updateQuestion('correctAnswer', correct);
    }

    updateQuestion('options', newOptions);
  };

  const toggleMultipleSelectAnswer = (index: number) => {
    const current = (question.correctAnswer as number[]) ?? [];
    const updated = current?.includes(index)
      ? current.filter((i) => i !== index)
      : [...current, index];
    updateQuestion('correctAnswer', updated);
  };

  const { t: tCommon } = useTranslation('common');

  // Validations inline
  const questionEmpty = !question.question.trim();
  const optionErrors = question.options?.map((o) => !o.trim()) ?? [];
  const hasEmptyOption = question.type !== 'true_false' && optionErrors.some(Boolean);
  const noCorrectAnswer =
    question.type === 'multiple_select' &&
    (question?.correctAnswer as number[])?.length === 0;
  const hasError = questionEmpty || hasEmptyOption || noCorrectAnswer;

  return (
    <div className={cn(
      'rounded-sm border p-4 space-y-4 transition-colors',
      hasError
        ? 'bg-red-50 dark:bg-red-500/5 border-red-300 dark:border-red-500/30'
        : 'bg-gray-50 dark:bg-slate-700/20 border-gray-200 dark:border-slate-600'
    )}>
      {/* En-tête : numéro, type, actions */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={cn(
              hasError
                ? 'text-red-600 dark:text-red-400 border-red-300 dark:border-red-500/50'
                : 'text-gray-600 dark:text-gray-300 border-gray-300 dark:border-slate-500'
            )}
          >
            Q{questionIndex + 1}
          </Badge>

          <Select value={question.type} onValueChange={handleTypeChange}>
            <SelectTrigger className="h-7 w-44 text-xs bg-white dark:bg-slate-700/50 border-gray-300 dark:border-slate-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="multiple_choice">{tCommon('admin.formations.create_q_type_single')}</SelectItem>
              <SelectItem value="multiple_select">{tCommon('admin.formations.create_q_type_multi')}</SelectItem>
              <SelectItem value="true_false">{tCommon('admin.formations.create_q_type_true_false')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => moveQuestion('up')}
            disabled={questionIndex === 0}
            className="h-7 w-7 p-0 text-gray-400 disabled:opacity-30"
            title={tCommon('admin.formations.create_q_move_up')}
          >
            <ChevronUp className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => moveQuestion('down')}
            disabled={questionIndex === totalQuestions - 1}
            className="h-7 w-7 p-0 text-gray-400 disabled:opacity-30"
            title={tCommon('admin.formations.create_q_move_down')}
          >
            <ChevronDown className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={deleteQuestion}
            className="h-7 w-7 p-0 text-red-500 hover:text-red-600 dark:text-red-400"
            title={tCommon('admin.ambassadors.delete')}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Texte de la question */}
      <div className="space-y-1">
        <Label className="text-gray-700 dark:text-white text-sm">
          {tCommon('admin.formations.create_q_label')} <span className="text-red-500">*</span>
        </Label>
        <Textarea
          value={question.question}
          onChange={(e) => updateQuestion('question', e.target.value)}
          placeholder={tCommon('admin.formations.create_q_placeholder')}
          rows={2}
          className={cn(
            'bg-white dark:bg-slate-700/50 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white resize-none',
            questionEmpty && 'border-red-400 dark:border-red-500'
          )}
        />
        {questionEmpty && (
          <p className="text-xs text-red-500">{tCommon('admin.formations.create_question_required')}</p>
        )}
      </div>

      {/* Points */}
      <div className="flex items-center gap-3">
        <Label className="text-gray-700 dark:text-white text-sm shrink-0">{tCommon('admin.formations.create_points_label')}</Label>
        <Input
          type="number"
          min="1"
          max="100"
          value={question.points}
          onChange={(e) => updateQuestion('points', Math.max(1, parseInt(e.target.value) || 1))}
          className="w-20 h-8 text-sm bg-white dark:bg-slate-700/50 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white"
        />
      </div>

      {/* Options */}
      {question.type === 'true_false' ? (
        <div className="space-y-2">
          <Label className="text-gray-700 dark:text-white text-sm">{tCommon('admin.formations.create_correct_answer')}</Label>
          <div className="flex gap-3">
            {(['true', 'false'] as const).map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => updateQuestion('correctAnswer', val)}
                className={cn(
                  'flex-1 py-2 rounded-sm border text-sm font-medium transition-colors',
                  question.correctAnswer === val
                    ? 'border-green-500 bg-green-50 dark:bg-green-500/15 text-green-700 dark:text-green-400'
                    : 'border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700/50 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                )}
              >
                {val === 'true' ? tCommon('admin.formations.create_true') : tCommon('admin.formations.create_false')}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-gray-700 dark:text-white text-sm">
  {
  question.type === 'multiple_select'
    ? tCommon('admin.formations.create_options_multi')
    : tCommon('admin.formations.create_options_single')
}           <span className="text-red-500 ml-1">*</span>
            </Label>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeOption((question.options?.length ?? 1) - 1)}
                disabled={(question.options?.length ?? 0) <= 2}
                className="h-6 w-6 p-0 text-gray-400 disabled:opacity-30"
                title={tCommon('admin.formations.create_remove_option')}
              >
                <Minus className="w-3 h-3" />
              </Button>
              <span className="text-xs text-gray-400">{question.options?.length ?? 0}/6</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addOption}
                disabled={(question.options?.length ?? 0) >= 6}
                className="h-6 w-6 p-0 text-gray-400 disabled:opacity-30"
                title={tCommon('admin.formations.create_add_option')}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            {question.options?.map((option, oIndex) => {
              const isCorrect =
                question.type === 'multiple_select'
                  ? (question.correctAnswer as number[])?.includes(oIndex)
                  : question.correctAnswer === oIndex;

              return (
                <div key={oIndex} className="flex items-center gap-2">
                  {question.type === 'multiple_select' ? (
                    <input
                      type="checkbox"
                      checked={isCorrect}
                      onChange={() => toggleMultipleSelectAnswer(oIndex)}
                      className="w-4 h-4 rounded text-green-600 dark:text-green-500 accent-green-600"
                      title={tCommon('admin.formations.create_correct_answer')}
                    />
                  ) : (
                    <input
                      type="radio"
                      name={`correct-${question.id}`}
                      checked={isCorrect}
                      onChange={() => updateQuestion('correctAnswer', oIndex)}
                      className="w-4 h-4 text-green-600 dark:text-green-500 accent-green-600"
                      title={tCommon('admin.formations.create_correct_answer')}
                    />
                  )}
                  <Input
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...(question.options ?? [])];
                      newOptions[oIndex] = e.target.value;
                      updateQuestion('options', newOptions);
                    }}
                    placeholder={tCommon('admin.formations.create_option_placeholder', { count: oIndex + 1 })}
                    className={cn(
                      'flex-1 h-8 text-sm bg-white dark:bg-slate-700/50 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white',
                      isCorrect && 'border-green-400 dark:border-green-500/50 bg-green-50 dark:bg-green-500/10',
                      optionErrors[oIndex] && 'border-red-400 dark:border-red-500'
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOption(oIndex)}
                    disabled={(question.options?.length ?? 0) <= 2}
                    className="h-7 w-7 p-0 text-gray-300 dark:text-gray-600 hover:text-red-500 disabled:opacity-20"
                    title={tCommon('admin.formations.create_remove_this_option')}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                </div>
              );
            })}
          </div>

          {hasEmptyOption && (
            <p className="text-xs text-red-500">{tCommon('admin.formations.create_all_options_required')}</p>
          )}
          {noCorrectAnswer && (
            <p className="text-xs text-red-500">{tCommon('admin.formations.create_select_correct')}</p>
          )}
        </div>
      )}

      {/* Explication (optionnelle) */}
      <div className="space-y-1">
        <Label className="text-gray-700 dark:text-white text-sm text-opacity-70">
          {tCommon('admin.formations.create_explanation')} <span className="text-gray-400 text-xs">{tCommon('admin.formations.create_explanation_optional')}</span>
        </Label>
        <Input
          value={question.explanation ?? ''}
          onChange={(e) => updateQuestion('explanation', e.target.value)}
          placeholder={tCommon('admin.formations.create_explanation_placeholder')}
          className="bg-white dark:bg-slate-700/50 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white text-sm"
        />
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
const { t: tCommon } = useTranslation('common');
  return (
    <Card className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1023]/90 shadow-sm dark:shadow-xl">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">{tCommon('admin.campaigns.form_general_title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {user?.role === 'superadmin' && (
          <div className="space-y-2">
            <Label htmlFor="organization" className="text-gray-700 dark:text-white">{tCommon('admin.formations.create_org_label')}</Label>
            {loadingOrgs ? (
              <div className="bg-gray-100 dark:bg-slate-800/50 border border-gray-300 dark:border-slate-600 rounded-md p-3">
                <span className="text-gray-500 dark:text-gray-400">{tCommon('admin.page_overview.risk_by_dept_loading')}</span>
              </div>
            ) : (
              <Combobox
  options={organizations.map((org) => ({
    value: org.id,
    label: org.name,
  }))}
  value={formData.organizationId || ''}
  onChange={(value) => {
    if (value) {
      setFormData((prev) => ({ ...prev, organizationId: value }));
    }
  }}
  placeholder={tCommon('admin.campaigns.form_org_placeholder')}
  searchPlaceholder={tCommon('admin.formations.create_search_org')}
  className="bg-white dark:bg-slate-800/50 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white"
/>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="title" className="text-gray-700 dark:text-white">{tCommon('admin.formations.create_formation_title_label')}</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            placeholder={tCommon('admin.formations.create_formation_title_placeholder')}
            className="bg-white dark:bg-slate-800/50 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-gray-700 dark:text-white">{tCommon('admin.campaigns.form_description')}</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            placeholder={tCommon('admin.formations.create_formation_desc_placeholder')}
            rows={3}
            className="bg-white dark:bg-slate-800/50 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-white">{tCommon('admin.formations.create_total_duration')}</Label>
            <div className="bg-gray-100 dark:bg-slate-700/30 border border-gray-300 dark:border-slate-600 rounded-md p-3 text-gray-900 dark:text-white">
              {tCommon('admin.formations.header_duration_minutes', { count: formData.estimatedDuration })}
              <span className="text-gray-500 dark:text-slate-400 text-sm ml-2">{tCommon('admin.formations.create_auto_calculated')}</span>
            </div>
          </div>

          {/* <div className="flex items-center space-x-2 pt-8">
            <Switch
              id="required"
              checked={formData.isRequired}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isRequired: checked }))}
            />
            <Label htmlFor="required" className="text-gray-700 dark:text-white">{tCommon('admin.formations.overview_mandatory')}</Label>
          </div> */}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="passingScore" className="text-gray-700 dark:text-white">{tCommon('admin.formations.create_passing_score')}</Label>
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
            <Label htmlFor="maxAttempts" className="text-gray-700 dark:text-white">{tCommon('admin.formations.overview_max_attempts')}</Label>
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
            <Label htmlFor="allowRetries" className="text-gray-700 dark:text-white">{tCommon('admin.formations.create_allow_retries')}</Label>
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
            <Label htmlFor="allUsers" className="text-gray-700 dark:text-white">{tCommon('admin.formations.create_assign_all')}</Label>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onNext} className="bg-orange-600 hover:bg-orange-700 text-white">
            {tCommon('admin.formations.create_next_modules')}
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
  const { t: tCommon } = useTranslation('common');
  

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
          <CardTitle className="text-gray-900 dark:text-white">{tCommon('admin.formations.create_modules_title')}</CardTitle>
          <Button onClick={addModule} className="bg-orange-600 hover:bg-orange-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            {tCommon('admin.formations.create_add_module')}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {formData.modules.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-slate-400">
            <div className="text-6xl mb-4">📚</div>
            <p>{tCommon('admin.formations.create_no_modules')}</p>
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
                organizationId={formData.organizationId}
              />
            ))}
          </div>
        )}

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onPrev}>
            {tCommon('admin.formations.create_previous')}
          </Button>
          <Button onClick={onNext} className="bg-orange-600 hover:bg-orange-700 text-white">
            {tCommon('admin.formations.create_next_evaluation')}
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

  // Ajouter cette fonction dans EvaluationStep avant le return
const validateEvaluation = (): string | null => {
  if (!formData.finalEvaluation) return null;

  const { questions } = formData.finalEvaluation;

  if (questions.length === 0) {
    return tCommon('admin.formations.create_eval_min_question');
  }

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];

    if (!q.question.trim()) {
      return tCommon('admin.formations.create_eval_q_empty', { num: i + 1 });
    }

    if (q.type === 'multiple_choice') {
      const emptyOptions = q.options?.some((o) => !o.trim());
      if (emptyOptions) {
        return tCommon('admin.formations.create_eval_q_empty_options', { num: i + 1 });
      }
      // Vérifier les doublons
      const uniqueOptions = new Set(q.options?.map((o) => o.trim().toLowerCase()));
      if (uniqueOptions.size !== q.options?.length) {
        return tCommon('admin.formations.create_eval_q_duplicate_options', { num: i + 1 });
      }
    }
  }

  return null;
};

const { t: tCommon } = useTranslation('common');


const handlePublish = () => {
  const error = validateEvaluation();
  if (error) {
    toast.error(error); // ou un setState pour afficher l'erreur inline
    return;
  }
  onPublish();
};

const handleSave = () => {
  const error = validateEvaluation();
  if (error) {
    toast.error(error);
    return;
  }
  onSave();
};

  return (
    <Card className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1023]/90 shadow-sm dark:shadow-xl">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">{tCommon('admin.formations.create_evaluation_title')}</CardTitle>
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
                    title: tCommon('admin.formations.content_final_quiz'),
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
            {tCommon('admin.formations.create_add_final_eval')}
          </Label>
        </div>

        {formData.finalEvaluation && (
          <div className="space-y-6 pl-2 md:pl-6 border-l-2 border-orange-500 dark:border-orange-600">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-white">{tCommon('admin.formations.create_eval_title_label')}</Label>
                <Input
                  value={formData.finalEvaluation.title}
                  onChange={(e) => updateEvaluation((prev) => ({ ...prev, title: e.target.value }))}
                  className="bg-white dark:bg-slate-800/50 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-700 dark:text-white">{tCommon('admin.formations.create_required_score')}</Label>
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
                  <Label className="text-gray-700 dark:text-white">{tCommon('admin.formations.create_time_limit_min')}</Label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.finalEvaluation.timeLimit || ''}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      updateEvaluation((prev) => ({ ...prev, timeLimit: isNaN(val) ? undefined : val }));
                    }}
                    placeholder={tCommon('admin.plans.unlimited')}
                    className="bg-white dark:bg-slate-800/50 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 dark:text-white">{tCommon('admin.formations.overview_max_attempts')}</Label>
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
                  <Label className="text-gray-700 dark:text-white">{tCommon('admin.formations.create_show_answers')}</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.finalEvaluation.randomizeQuestions}
                    onCheckedChange={(checked) =>
                      updateEvaluation((prev) => ({ ...prev, randomizeQuestions: checked }))
                    }
                  />
                  <Label className="text-gray-700 dark:text-white">{tCommon('admin.formations.create_random_order')}</Label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-gray-700 dark:text-white">{tCommon('admin.formations.create_questions_count', { count: formData.finalEvaluation.questions.length })}</Label>
                <Button onClick={addQuestion} size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
                  <Plus className="w-4 h-4 mr-1" />
                  {tCommon('admin.formations.create_add_question')}
                </Button>
              </div>

              {formData.finalEvaluation.questions.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-800/20 rounded border border-dashed border-gray-300 dark:border-slate-600">
                  <div className="text-4xl mb-2">❓</div>
                  <p>{tCommon('admin.formations.create_no_questions')}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.finalEvaluation.questions.map((question, qIndex) => (
  <QuestionItem
    key={question.id}
    question={question}
    questionIndex={qIndex}
    totalQuestions={formData.finalEvaluation!.questions.length}
    evaluation={formData.finalEvaluation!}
    onUpdateEvaluation={updateEvaluation}
  />
))}
                </div>
              )}
            </div>
          </div>
        )}

       <div className="flex flex-col sm:flex-row sm:justify-between gap-3 pt-4">
  <Button variant="outline" onClick={onPrev} className="w-full sm:w-auto">
    {tCommon('admin.formations.create_previous')}
  </Button>

  <div className="flex gap-2 w-full sm:w-auto">
    <Button variant="outline" onClick={onSave} className="flex-1 sm:flex-none">
      <Save className="w-4 h-4 mr-2" />
      {tCommon('admin.formations.create_save_draft')}
    </Button>
    <Button
      onClick={onPublish}
      className="bg-green-600 hover:bg-green-700 text-white flex-1 sm:flex-none"
    >
      <Eye className="w-4 h-4 mr-2" />
      {tCommon('admin.formations.create_publish')}
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
    isRequired: true,
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
function validateFormationData(formData: FormationData, tCommon: (key: string, opts?: Record<string, any>) => string): { valid: boolean; error?: string; step?: 'info' | 'modules' | 'evaluation' } {
  if (!formData.title.trim()) {
    return { valid: false, error: tCommon('admin.formations.create_validate_title_required'), step: 'info' };
  }
  if (!formData.organizationId) {
    return { valid: false, error: tCommon('admin.formations.create_no_org_error'), step: 'info' };
  }
  if (formData.modules.length === 0) {
    return { valid: false, error: tCommon('admin.formations.create_validate_min_module'), step: 'modules' };
  }
  const moduleWithoutTitle = formData.modules.find((m) => !m.title.trim());
  if (moduleWithoutTitle) {
    const index = formData.modules.indexOf(moduleWithoutTitle) + 1;
    return { valid: false, error: tCommon('admin.formations.create_validate_module_title', { num: index }), step: 'modules' };
  }
  const moduleWithoutChapters = formData.modules.find((m) => m.chapters.length === 0);
  if (moduleWithoutChapters) {
    return { valid: false, error: tCommon('admin.formations.create_validate_module_chapters', { title: moduleWithoutChapters.title }), step: 'modules' };
  }
  for (const modules of formData.modules) {
    const chapterWithoutTitle = modules.chapters.find((c) => !c.title.trim());
    if (chapterWithoutTitle) {
      return { valid: false, error: tCommon('admin.formations.create_validate_chapter_title', { title: modules.title }), step: 'modules' };
    }
  }
  if (formData.finalEvaluation && formData.finalEvaluation.questions.length > 0) {
    if (!formData.finalEvaluation.title.trim()) {
      return { valid: false, error: tCommon('admin.formations.create_validate_eval_title'), step: 'evaluation' };
    }
    const questionWithoutText = formData.finalEvaluation.questions.find((q) => !q.question.trim());
    if (questionWithoutText) {
      return { valid: false, error: tCommon('admin.formations.create_validate_q_text'), step: 'evaluation' };
    }
    const mcqWithoutOptions = formData.finalEvaluation.questions.find(
      (q) => q.type === 'multiple_choice' && (!q.options || q.options.length < 2)
    );
    if (mcqWithoutOptions) {
      return { valid: false, error: tCommon('admin.formations.create_validate_q_options'), step: 'evaluation' };
    }
    const questionWithoutAnswer = formData.finalEvaluation.questions.find(
      (q) => q.correctAnswer === undefined || q.correctAnswer === null || q.correctAnswer === ''
    );
    if (questionWithoutAnswer) {
      return { valid: false, error: tCommon('admin.formations.create_validate_q_answer'), step: 'evaluation' };
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
  const { organizations } = useOrganizationStore();
  const {user} = useAuthStore();
const { t: tCommon } = useTranslation('common');

  useEffect(()=>{
    if (user?.role !== roleEnum.SUPERADMIN) {
      setFormData((prev) => ({ ...prev, organizationId: user?.organizationId as string }));
    }
  },[user])
  

  const handleSave = useCallback(async (shouldPublish: boolean) => {
    const validation = validateFormationData(formData, tCommon);
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
            pdfUrl: chapter.pdfUrl ?? null,
            pdfPublicId: chapter.pdfPublicId ?? null,
          })),
        })),
      };
      await createFormation(payload as any);
      toast.success(shouldPublish ? tCommon('admin.formations.create_success_published') : tCommon('admin.formations.create_success_saved'));
      navigate({ to: '/dashboard/formations' });
    } catch (error) {
      toast.error(tCommon('admin.formations.create_save_error'));
      console.error(error);
    }
  }, [formData, createFormation, navigate]);

  return (
    <>
      <DashboardTopbar
        title={tCommon('admin.formations.list_create')}
        description={tCommon('admin.formations.create_page_desc')}
      />
      <div className="min-h-screen bg-gray-50 dark:bg-[#050816] px-0 md:px-6 pb-12">
       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
  <Button
    variant="ghost"
    onClick={() => navigate({ to: '/dashboard/formations' })}
    className="text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white self-start sm:self-auto"
  >
    <ArrowLeft className="w-4 h-4 mr-2" />
    {tCommon('user.formations.back_to_trainings')}
  </Button>

  <div className="flex gap-3 w-full sm:w-auto">
    <Button
      variant="outline"
      onClick={() => handleSave(false)}
      className="flex-1 sm:flex-none"
    >
      <Save className="w-4 h-4 mr-2" />
      {tCommon('admin.formations.create_save_draft_btn')}
    </Button>
    <Button
      onClick={() => handleSave(true)}
      className="flex-1 sm:flex-none"
    >
      <Eye className="w-4 h-4 mr-2" />
      {tCommon('admin.formations.header_publish')}
    </Button>
  </div>
</div>

       <Tabs value={currentStep} onValueChange={(value: any) => setCurrentStep(value)} className="space-y-6">
  <div className="w-full overflow-x-auto scrollbar-hide">
    <TabsList className="flex w-max sm:w-full sm:max-w-md sm:mx-auto gap-1 sm:gap-2 bg-gray-100 dark:bg-slate-800/50 p-1">
      <TabsTrigger
        value="info"
        className="data-[state=active]:bg-orange-600 data-[state=active]:text-white text-gray-700 dark:text-white text-xs sm:text-sm px-3 py-2 whitespace-nowrap flex-1"
      >
        {tCommon('admin.formations.create_tab_info')}
      </TabsTrigger>
      <TabsTrigger
        value="modules"
        className="data-[state=active]:bg-orange-600 data-[state=active]:text-white text-gray-700 dark:text-white text-xs sm:text-sm px-3 py-2 whitespace-nowrap flex-1"
      >
        {tCommon('admin.formations.create_tab_modules')}
      </TabsTrigger>
      <TabsTrigger
        value="evaluation"
        className="data-[state=active]:bg-orange-600 data-[state=active]:text-white text-gray-700 dark:text-white text-xs sm:text-sm px-3 py-2 whitespace-nowrap flex-1"
      >
        {tCommon('admin.formations.content_final_quiz')}
      </TabsTrigger>
    </TabsList>
  </div>

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