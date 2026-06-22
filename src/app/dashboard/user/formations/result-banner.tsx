'use client';

import { CheckCircle2, XCircle, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface ResultBannerProps {
  status: 'success' | 'failure';
  score?: number | null;
  passingScore?: number | null;
  hasFinalEvaluation: boolean;
  onViewCertificate?: () => void;
}

export function ResultBanner({ status, score, passingScore, hasFinalEvaluation, onViewCertificate }: ResultBannerProps) {
  const { t: tCommon } = useTranslation('common');
  const isSuccess = status === 'success';

  return (
    <div
      className={cn(
        'rounded-sm border -mt-8 p-3 mb-4 flex items-center justify-between gap-3',
        isSuccess
          ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10'
          : 'border-red-200 bg-red-50 dark:border-red-500/20 dark:bg-red-500/10'
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
            isSuccess ? 'bg-emerald-500' : 'bg-red-500'
          )}
        >
          {isSuccess ? (
            <CheckCircle2 className="h-4 w-4 text-white" />
          ) : (
            <XCircle className="h-4 w-4 text-white" />
          )}
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {isSuccess ? 'Formation réussie !' : 'Formation échouée'}
          </p>
          {hasFinalEvaluation && score != null && passingScore != null ? (
            <p className="text-xs text-gray-600 dark:text-gray-300 truncate">
              {tCommon('user.formations.score_label')} <span className={cn('font-semibold', isSuccess ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400')}>
                {score}%
              </span>
              {' / '}{passingScore}% requis
            </p>
          ) : (
            <p className="text-xs text-gray-600 dark:text-gray-300 truncate">
              {tCommon('user.formations.chapters_completed')}
            </p>
          )}
        </div>
      </div>

      {isSuccess && (
        <Button
          onClick={onViewCertificate}
          variant="outline"
          size="sm"
          className="shrink-0 bg-white dark:bg-white/10 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white h-8 px-3 text-xs"
        >
          <Award className="h-3.5 w-3.5 mr-1.5" />
          Certificat
        </Button>
      )}
    </div>
  );
}