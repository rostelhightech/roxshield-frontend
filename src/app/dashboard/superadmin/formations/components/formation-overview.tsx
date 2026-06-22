'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { Formation } from '@/store/formation.store';
import { useTranslation } from 'react-i18next';

interface FormationOverviewProps {
  formation: Formation;
}

export function FormationOverview({ formation }: FormationOverviewProps) {
  const { t: tCommon } = useTranslation('common');
  const completionRate = formation.stats?.totalUsers && formation.stats.totalUsers > 0
    ? Math.round((formation.stats.completedUsers / formation.stats.totalUsers) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="rounded-md border border-white/10 bg-white  dark:bg-[#0c1023]/90 ">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">{tCommon('admin.formations.overview_completion_rate')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">{tCommon('admin.formations.overview_global_progress')}</span>
              <span className="text-gray-900 dark:text-white">{completionRate}%</span>
            </div>
            <Progress value={completionRate} className="h-2" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{tCommon('admin.formations.overview_completed_count', { count: formation.stats?.completedUsers || 0 })}</span>
              <span>{tCommon('admin.formations.enrolled_count', { count: formation.stats?.totalUsers || 0 })}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-md border border-white/10 bg-white  dark:bg-[#0c1023]/90  ">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">{tCommon('admin.campaigns.form_general_title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-400">{tCommon('admin.formations.overview_structure')}</span>
            <span className="text-gray-900 dark:text-white">
              {tCommon('admin.formations.overview_structure_value', {
                modules: formation.modules?.length || 0,
                chapters: formation.modules?.reduce((total, mod) => total + (mod.chapters?.length || 0), 0) || 0,
              })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">{tCommon('admin.formations.overview_estimated_duration')}</span>
            <span className="text-gray-900 dark:text-white">{tCommon('admin.formations.header_duration_minutes', { count: formation.estimatedDuration })}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">{tCommon('admin.formations.content_required_score')}</span>
            <span className="text-gray-900 dark:text-white">{formation.passingScore}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">{tCommon('admin.formations.overview_max_attempts')}</span>
            <span className="text-gray-900 dark:text-white">{formation.allowRetries ? formation.maxAttempts : '1'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">{tCommon('admin.formations.overview_mandatory')}</span>
            <span className="text-gray-900 dark:text-white">{formation.isRequired ? tCommon('admin.plans.yes') : tCommon('admin.plans.no')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">{tCommon('admin.ambassadors.table_created')}</span>
            <span className="text-gray-900 dark:text-white">{new Date(formation.createdAt).toLocaleDateString('fr-FR')}</span>
          </div>
          {formation.publishedAt && (
            <div className="flex justify-between">
              <span className="text-gray-400">{tCommon('admin.formations.overview_published')}</span>
              <span className="text-gray-900 dark:text-white">{new Date(formation.publishedAt).toLocaleDateString('fr-FR')}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}