'use client';

import { ArrowLeft, Clock, Award, FileText, Video, MousePointerClick, HelpCircle, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ChapterHeaderProps {
  moduleNumber: number;
  chapterType: string;
  chapterTitle?: string;
  chapterDescription?: string;
  estimatedDuration?: number;
  passingScore?: number;
  pageCount?: number;
  onQuit: () => void;
}

const TYPE_CONFIG: Record<string, { icon: typeof FileText; label: string }> = {
  DOCUMENT: { icon: FileText, label: 'Document' },
  VIDEO: { icon: Video, label: 'Vidéo' },
  INTERACTIVE: { icon: MousePointerClick, label: 'Interactif' },
  QUIZ: { icon: HelpCircle, label: 'Quiz' },
  WEBINAR: { icon: Radio, label: 'Webinaire' },
};

export function ChapterHeader({
  moduleNumber,
  chapterType,
  chapterTitle,
  chapterDescription,
  estimatedDuration,
  passingScore,
  pageCount,
  onQuit,
}: ChapterHeaderProps) {
  const config = TYPE_CONFIG[chapterType] ?? TYPE_CONFIG.DOCUMENT;
  const Icon = config.icon;

  return (
    <div className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.02] p-4">
      <div className="flex items-start gap-4">
        {/* Icône compacte */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400">
          <Icon className="h-5 w-5" strokeWidth={1.5} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300">
                M{moduleNumber}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {config.label}
              </span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={onQuit}
              className="h-7 px-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1" />
              <span className="text-xs">Quitter</span>
            </Button>
          </div>

          <h2 className="text-base font-semibold text-gray-900 dark:text-white truncate">
            {chapterTitle}
          </h2>
          
          {chapterDescription && (
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
              {chapterDescription}
            </p>
          )}

          <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500 mt-1.5 flex-wrap">
            {estimatedDuration != null && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {estimatedDuration}min
              </span>
            )}
            {passingScore != null && (
              <>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <span className="flex items-center gap-1">
                  <Award className="h-3 w-3" />
                  {passingScore}%
                </span>
              </>
            )}
            {pageCount != null && (
              <>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <span className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  {pageCount}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}