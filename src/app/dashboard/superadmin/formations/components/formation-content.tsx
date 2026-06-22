'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BlockNoteEditor } from '@/components/blocknote-editor';
import { ChapterContentViewer } from '@/app/dashboard/user/formations/chapter-content-viewer';
import { ChevronDown, ChevronRight, FileText, Video, HelpCircle, Users, Monitor } from 'lucide-react';
import type { Formation } from '@/store/formation.store';
import '@/styles/blocknote.css';
import { useTranslation } from 'react-i18next';

interface FormationContentProps {
  formation: Formation;
}

export function FormationContent({ formation }: FormationContentProps) {
  const { t: tCommon } = useTranslation('common');
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [selectedChapter, setSelectedChapter] = useState<any>(null);

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'VIDEO': return <Video className="w-4 h-4" />;
      case 'DOCUMENT': return <FileText className="w-4 h-4" />;
      case 'INTERACTIVE': return <Users className="w-4 h-4" />;
      case 'QUIZ': return <HelpCircle className="w-4 h-4" />;
      case 'WEBINAR': return <Monitor className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'VIDEO': return 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-500/30';
      case 'DOCUMENT': return 'bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400 border-gray-300 dark:border-gray-500/30';
      case 'INTERACTIVE': return 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-500/30';
      case 'QUIZ': return 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-300 dark:border-orange-500/30';
      case 'WEBINAR': return 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border-green-300 dark:border-green-500/30';
      default: return 'bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400 border-gray-300 dark:border-gray-500/30';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'VIDEO': return tCommon('admin.formations.type_video');
      case 'DOCUMENT': return tCommon('admin.formations.type_document');
      case 'INTERACTIVE': return tCommon('admin.formations.type_interactive');
      case 'QUIZ': return tCommon('admin.formations.type_quiz');
      case 'WEBINAR': return tCommon('admin.formations.type_webinar');
      default: return type;
    }
  };

  if (!formation.modules || formation.modules.length === 0) {
    return (
      <Card className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1023]/90">
        <CardContent className="p-12 text-center">
          <FileText className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{tCommon('admin.formations.content_no_content')}</h3>
          <p className="text-gray-500 dark:text-gray-400">
            {tCommon('admin.formations.content_no_content_desc')}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Sidebar - Liste des modules et chapitres */}
      <div className="lg:col-span-1">
        <Card className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1023]/90 sticky top-6">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">{tCommon('admin.formations.content_structure')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
            {formation.modules.map((module, moduleIndex) => (
              <div key={module.id} className="space-y-2">
                {/* Module */}
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left hover:bg-gray-100 dark:hover:bg-slate-700/50"
                  onClick={() => toggleModule(module.id)}
                >
                  {expandedModules.has(module.id) ? (
                    <ChevronDown className="w-4 h-4 mr-2 shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 mr-2 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-orange-100 dark:bg-orange-600/20 text-orange-700 dark:text-orange-400 border-orange-300 dark:border-orange-400/50">
                        M{moduleIndex + 1}
                      </Badge>
                      <span className="text-gray-900 dark:text-white text-sm truncate">{module.title}</span>
                    </div>
                  </div>
                </Button>

                {/* Chapitres */}
                {expandedModules.has(module.id) && module.chapters && (
                  <div className="ml-6 space-y-1">
                    {module.chapters.map((chapter, chapterIndex) => (
                      <Button
                        key={chapter.id}
                        variant="ghost"
                        className={`w-full justify-start text-left hover:bg-gray-100 dark:hover:bg-slate-700/50 ${
                          selectedChapter?.id === chapter.id ? 'bg-blue-100 dark:bg-blue-600/30 border border-blue-300 dark:border-blue-500/50' : ''
                        }`}
                        onClick={() => setSelectedChapter(chapter)}
                      >
                        <div className="flex items-center gap-2 w-full">
                          <div className={`p-1 rounded ${getTypeColor(chapter.type)}`}>
                            {getTypeIcon(chapter.type)}
                          </div>
                          <span className="text-gray-700 dark:text-gray-300 text-sm truncate flex-1">
                            {chapterIndex + 1}. {chapter.title}
                          </span>
                        </div>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {/* Évaluation finale */}
            {formation.finalEvaluation && formation.finalEvaluation.questions && formation.finalEvaluation.questions.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-left hover:bg-gray-100 dark:hover:bg-slate-700/50 ${
                    selectedChapter?.id === 'final-evaluation' ? 'bg-blue-100 dark:bg-blue-600/30 border border-blue-300 dark:border-blue-500/50' : ''
                  }`}
                  onClick={() => setSelectedChapter({ 
                    id: 'final-evaluation', 
                    title: formation.finalEvaluation!.title,
                    type: 'QUIZ',
                    evaluation: formation.finalEvaluation
                  })}
                >
                  <div className="flex items-center gap-2 w-full">
                    <div className="p-1 rounded bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border-red-300 dark:border-red-500/30">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 text-sm flex-1">
                      {tCommon('admin.formations.content_final_quiz')}
                    </span>
                    <Badge variant="outline" className="bg-red-100 dark:bg-red-600/20 text-red-700 dark:text-red-400 border-red-300 dark:border-red-400/50 text-xs">
                      {tCommon('admin.formations.content_questions_badge', { count: formation.finalEvaluation.questions.length })}
                    </Badge>
                  </div>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Content - Affichage du chapitre sélectionné */}
      <div className="lg:col-span-2">
        <Card className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1023]/90">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-900 dark:text-white">
                {selectedChapter ? selectedChapter.title : tCommon('admin.formations.content_select_chapter_title')}
              </CardTitle>
              {selectedChapter && (
                <Badge className={getTypeColor(selectedChapter.type)}>
                  {getTypeLabel(selectedChapter.type)}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {selectedChapter ? (
              <div className="space-y-6">
                {/* Si c'est l'évaluation finale */}
                {selectedChapter.id === 'final-evaluation' && selectedChapter.evaluation ? (
                  <div className="space-y-6">
                    <div className="bg-red-50 dark:bg-red-600/10 border border-red-300 dark:border-red-600/30 rounded-lg p-4">
                      <h4 className="text-red-700 dark:text-red-400 font-semibold mb-2 flex items-center gap-2">
                        <HelpCircle className="w-5 h-5" />
                        {tCommon('admin.formations.content_final_quiz_required')}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {tCommon('admin.formations.content_final_quiz_desc')}
                      </p>
                    </div>

                    {selectedChapter.evaluation.description && (
                      <div>
                        <h4 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">{tCommon('admin.campaigns.form_description')}</h4>
                        <p className="text-gray-700 dark:text-gray-300">{selectedChapter.evaluation.description}</p>
                      </div>
                    )}

                    {/* Paramètres de l'évaluation */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-100 dark:bg-slate-800/50 rounded-lg p-4">
                        <div className="text-gray-500 dark:text-gray-400 text-xs mb-1">{tCommon('admin.formations.content_required_score')}</div>
                        <div className="text-gray-900 dark:text-white text-2xl font-bold">{selectedChapter.evaluation.passingScore}%</div>
                      </div>
                      <div className="bg-gray-100 dark:bg-slate-800/50 rounded-lg p-4">
                        <div className="text-gray-500 dark:text-gray-400 text-xs mb-1">{tCommon('admin.formations.content_time_limit')}</div>
                        <div className="text-gray-900 dark:text-white text-2xl font-bold">
                          {selectedChapter.evaluation.timeLimit ? `${selectedChapter.evaluation.timeLimit} min` : tCommon('admin.plans.unlimited')}
                        </div>
                      </div>
                      <div className="bg-gray-100 dark:bg-slate-800/50 rounded-lg p-4">
                        <div className="text-gray-500 dark:text-gray-400 text-xs mb-1">{tCommon('admin.formations.overview_max_attempts')}</div>
                        <div className="text-gray-900 dark:text-white text-2xl font-bold">{selectedChapter.evaluation.maxAttempts}</div>
                      </div>
                      <div className="bg-gray-100 dark:bg-slate-800/50 rounded-lg p-4">
                        <div className="text-gray-500 dark:text-gray-400 text-xs mb-1">{tCommon('admin.formations.content_questions_count')}</div>
                        <div className="text-gray-900 dark:text-white text-2xl font-bold">{selectedChapter.evaluation.questions.length}</div>
                      </div>
                    </div>

                    {/* Liste des questions */}
                    <div>
                      <h4 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-3">{tCommon('admin.formations.content_eval_questions')}</h4>
                      <div className="space-y-3">
                        {selectedChapter.evaluation.questions.map((question: any, index: number) => (
                          <div key={question.id} className="bg-gray-50 dark:bg-slate-800/30 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
                            <div className="flex items-start gap-3">
                              <Badge variant="outline" className="bg-blue-100 dark:bg-blue-600/20 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-400/50 shrink-0">
                                Q{index + 1}
                              </Badge>
                              <div className="flex-1 space-y-2">
                                <p className="text-gray-900 dark:text-white font-medium">{question.question}</p>
                                <div className="flex items-center gap-3 text-xs">
                                  <Badge variant="outline" className="bg-purple-100 dark:bg-purple-600/20 text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-400/50">
                                    {question.type === 'multiple_choice' ? tCommon('admin.formations.content_q_multiple_choice') :
                                     question.type === 'true_false' ? tCommon('admin.formations.content_q_true_false') : tCommon('admin.formations.content_q_short_answer')}
                                  </Badge>
                                  <span className="text-gray-500 dark:text-gray-400">{tCommon('admin.formations.content_points', { count: question.points })}</span>
                                </div>
                                {question.options && question.options.length > 0 && (
                                  <div className="mt-2 space-y-1">
                                    {question.options.map((option: string, optIndex: number) => (
                                      <div 
                                        key={optIndex} 
                                        className={`text-sm p-2 rounded ${
                                          optIndex === question.correctAnswer 
                                            ? 'bg-green-100 dark:bg-green-600/20 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-600/30' 
                                            : 'bg-gray-200 dark:bg-slate-700/30 text-gray-600 dark:text-gray-400'
                                        }`}
                                      >
                                        {String.fromCharCode(65 + optIndex)}. {option}
                                        {optIndex === question.correctAnswer && ' ✓'}
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {question.explanation && (
                                  <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 italic">
                                    💡 {question.explanation}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Affichage normal d'un chapitre */
                  <>
                    {selectedChapter.description && (
                      <div>
                        <h4 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">{tCommon('admin.campaigns.form_description')}</h4>
                        <p className="text-gray-700 dark:text-gray-300">{selectedChapter.description}</p>
                      </div>
                    )}

                    <div>
                      <h4 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-3">{tCommon('admin.formations.tab_content')}</h4>
                      <ChapterContentViewer
                        key={selectedChapter.id}
                        chapterId={selectedChapter.id}
                        content={selectedChapter.content}
                        pdfUrl={selectedChapter.pdfUrl}
                      />
                    </div>

                    <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="text-sm">
                        <span className="text-gray-500 dark:text-gray-400">{tCommon('admin.formations.content_estimated_duration')} </span>
                        <span className="text-gray-900 dark:text-white font-medium">{selectedChapter.estimatedDuration} min</span>
                      </div>
                      {selectedChapter.metadata?.videoUrl && (
                        <div className="text-sm">
                          <a
                            href={selectedChapter.metadata.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline"
                          >
                            {tCommon('admin.formations.content_watch_video')}
                          </a>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>{tCommon('admin.formations.content_select_chapter')}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}