'use client';

import { useState } from 'react';
import { ShieldCheck, ChevronDown, CheckCircle2, Trophy, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface Chapter {
  id?: string;
  title: string;
  estimatedDuration?: number;
}

interface Module {
  id: string;
  title: string;
  chapters?: Chapter[];
}

interface FormationSidebarProps {
  formationTitle: string;
  formationDescription?: string;
  modules: Module[];
  completedChapters: Set<string>;
  totalChapters: number;
  progressPercentage: number;
  currentModuleIndex: number;
  currentChapterIndex: number;
  isFormationCompleted: boolean;
  onJumpToChapter: (moduleIndex: number, chapterIndex: number) => void;
  onDownloadCertificate?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function FormationSidebar({
  formationTitle,
  formationDescription,
  modules,
  completedChapters,
  totalChapters,
  progressPercentage,
  currentModuleIndex,
  currentChapterIndex,
  isFormationCompleted,
  onJumpToChapter,
  onDownloadCertificate,
  isCollapsed = false,
  onToggleCollapse,
}: FormationSidebarProps) {
  const [collapsedModules, setCollapsedModules] = useState<Set<number>>(new Set());
  const { t: tCommon } = useTranslation('common');

  const toggleModule = (index: number) => {
    setCollapsedModules((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <>
      {/* Version cachée (petit bouton flottant) */}
      {isCollapsed && (
        <button
          onClick={onToggleCollapse}
          className="fixed left-4 top-1/2 -translate-y-1/2 z-50 flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition-all hover:scale-105"
          style={{ backgroundColor: '#5d2595' }}
        >
          <ChevronRight className="h-5 w-5 text-white" />
        </button>
      )}

      {/* Sidebar principale */}
      <div
        className={cn(
          'w-full lg:w-72 shrink-0 space-y-4 transition-all duration-300 ease-in-out',
          isCollapsed && 'hidden lg:hidden'
        )}
      >
        {/* Bouton pour masquer la sidebar (visible uniquement sur grand écran) */}
        <div className="hidden lg:flex justify-end">
          <button
            onClick={onToggleCollapse}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            {tCommon('user.formations.hide_sidebar')}
          </button>
        </div>

        {/* En-tête : titre de la formation */}
        <div className="flex items-center gap-2.5 px-1">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: '#5d259515' }}>
            <ShieldCheck className="h-4.5 w-4.5" style={{ color: '#5d2595' }} />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{formationTitle}</h2>
            {formationDescription && (
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{formationDescription}</p>
            )}
          </div>
        </div>

        {/* Carte progression */}
        <div className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.02] p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Progression</p>
          <p className="text-3xl font-bold mb-3" style={{ color: '#5d2595' }}>
            {Math.round(progressPercentage)}%
          </p>
          <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${progressPercentage}%`, backgroundColor: '#5d2595' }}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {completedChapters.size} / {totalChapters} chapitres terminés
          </p>
        </div>

        {/* Contenu de la formation (accordéon) */}
        <div className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.02] overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-white/5">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">{tCommon('user.formations.content_title')}</span>
          </div>

          <div className="p-2 space-y-1 max-h-[calc(100vh-420px)] overflow-y-auto">
            {modules.map((module, modIndex) => {
              const isCollapsedModule = collapsedModules.has(modIndex);
              return (
                <div key={module.id} className="space-y-1">
                  <button
                    onClick={() => toggleModule(modIndex)}
                    className="w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-sm transition-colors"
                    style={{ 
                      backgroundColor: '#5d259510',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#5d259520';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#5d259510';
                    }}
                  >
                    <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{module.title}</span>
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 text-gray-400 shrink-0 transition-transform',
                        isCollapsedModule && '-rotate-90'
                      )}
                    />
                  </button>

                  {!isCollapsedModule &&
                    module.chapters?.map((chapter, chapIndex) => {
                      const isActive = modIndex === currentModuleIndex && chapIndex === currentChapterIndex;
                      const isCompleted = completedChapters.has(chapter.id || '');
                      return (
                        <button
                          key={chapter.id}
                          onClick={() => onJumpToChapter(modIndex, chapIndex)}
                          className={cn(
                            'w-full text-left pl-3 pr-2.5 py-2 rounded-sm text-sm flex items-center gap-2 transition-colors',
                            isActive
                              ? 'border-l-2 text-gray-900 dark:text-white'
                              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                          )}
                          style={isActive ? { 
                            borderColor: '#5d2595',
                            backgroundColor: '#5d259510'
                          } : undefined}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" style={{ color: '#5d2595' }} />
                          ) : (
                            <span className="h-3.5 w-3.5 shrink-0" />
                          )}
                          <span className="flex-1 truncate">{chapter.title}</span>
                          {chapter.estimatedDuration != null && (
                            <span className="text-xs text-gray-400 shrink-0">{chapter.estimatedDuration} min</span>
                          )}
                        </button>
                      );
                    })}
                </div>
              );
            })}
          </div>
        </div>

        {/* Carte félicitations */}
        {isFormationCompleted && (
          <div className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.02] p-5 text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full" style={{ backgroundColor: '#5d259515' }}>
              <Trophy className="h-6 w-6" style={{ color: '#5d2595' }} />
            </div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{tCommon('user.formations.congrats')}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{tCommon('user.formations.completed_desc')}</p>
            <Button
              onClick={onDownloadCertificate}
              className="w-full flex items-center justify-center gap-2 rounded-sm text-white text-sm font-medium py-2.5 transition-colors hover:opacity-90"
              style={{ backgroundColor: '#5d2595' }}
            >
              <Download className="h-4 w-4" />
              {tCommon('user.formations.download_certificate')}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}