'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Users, Clock, Target } from 'lucide-react';
import { useFormationStore, type Formation } from '@/store/formation.store';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from 'react-i18next';

interface FormationAnalyticsProps {
  formation: Formation;
}

export function FormationAnalytics({ formation }: FormationAnalyticsProps) {
  const { t: tCommon } = useTranslation('common');
  const { analytics, fetchFormationAnalytics } = useFormationStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (formation?.id) {
      setIsLoading(true);
      fetchFormationAnalytics(formation.id).finally(() => setIsLoading(false));
    }
  }, [formation?.id]);

  const completionRate = formation.stats?.totalUsers && formation.stats.totalUsers > 0
    ? Math.round((formation.stats.completedUsers / formation.stats.totalUsers) * 100)
    : 0;

  if (isLoading || !analytics) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1023]/90">
            <CardHeader>
              <Skeleton className="h-6 w-48 bg-gray-200 dark:bg-gray-700/50" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full bg-gray-200 dark:bg-gray-700/50" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const { weeklyProgress, departmentStats, timeDistribution, trend } = analytics;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1023]/90">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">{tCommon('admin.formations.analytics_title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">{tCommon('admin.formations.analytics_success_rate')}</span>
            <span className="text-gray-900 dark:text-white">{completionRate}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">{tCommon('admin.formations.analytics_avg_score')}</span>
            <span className="text-gray-900 dark:text-white">{Math.round(formation.stats?.averageScore || 0)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">{tCommon('admin.formations.analytics_avg_time')}</span>
            <span className="text-gray-900 dark:text-white">
              {(() => {
                const seconds = Math.round(formation.stats?.averageTimeSpent || 0);
                const minutes = Math.floor(seconds / 60);
                const remainingSeconds = seconds % 60;
                if (minutes === 0) {
                  return `${seconds}s`;
                } else if (remainingSeconds === 0) {
                  return `${minutes} min`;
                } else {
                  return `${minutes}min ${remainingSeconds}s`;
                }
              })()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">{tCommon('user.formations.in_progress_status')}</span>
            <span className="text-gray-900 dark:text-white">{formation.stats?.inProgressUsers || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">{tCommon('admin.formations.analytics_total_enrolled')}</span>
            <span className="text-gray-900 dark:text-white">{formation.stats?.totalUsers || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">{tCommon('admin.formations.analytics_completed')}</span>
            <span className="text-gray-900 dark:text-white">{formation.stats?.completedUsers || 0}</span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1023]/90">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            {tCommon('admin.formations.analytics_weekly_trends')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Trend indicator */}
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800/30 rounded-lg">
              <div className="flex items-center gap-2">
                {trend.isPositive ? (
                  <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                )}
                <span className="text-gray-900 dark:text-white text-sm">{tCommon('admin.formations.analytics_this_week')}</span>
              </div>
              <div className="text-right">
                <span className={`font-medium ${trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {trend.isPositive ? '+' : ''}{tCommon('admin.formations.analytics_completions_count', { count: trend.value })}
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {trend.isPositive ? '+' : ''}{tCommon('admin.formations.analytics_vs_last_week', { pct: trend.percentage })}
                </p>
              </div>
            </div>

            {/* Weekly progress chart */}
            <div className="space-y-3">
              <h4 className="text-gray-900 dark:text-white text-sm font-medium">{tCommon('admin.formations.analytics_4week')}</h4>
              {weeklyProgress.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">{tCommon('admin.formations.analytics_no_data')}</p>
              ) : (
                weeklyProgress.map((week, index) => (
                  <div key={week.week} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">{week.week}</span>
                      <span className="text-gray-900 dark:text-white">{week.completed}/{week.started}</span>
                    </div>
                    <div className="flex gap-1">
                      <Progress 
                        value={week.started > 0 ? (week.completed / week.started) * 100 : 0} 
                        className="h-2 flex-1" 
                      />
                      <span className="text-xs text-gray-500 dark:text-gray-400 w-10">
                        {week.started > 0 ? Math.round((week.completed / week.started) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques par département */}
      <Card className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1023]/90">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5" />
            {tCommon('admin.formations.analytics_by_group')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {departmentStats.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">{tCommon('admin.formations.analytics_no_dept')}</p>
            ) : (
              departmentStats.map((dept) => (
                <div key={dept.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-900 dark:text-white text-sm font-medium">{dept.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 dark:text-gray-400 text-xs">{dept.completed}/{dept.total}</span>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          dept.rate >= 80 ? 'text-green-600 dark:text-green-400 border-green-400/50' :
                          dept.rate >= 60 ? 'text-orange-600 dark:text-orange-400 border-orange-400/50' :
                          'text-red-600 dark:text-red-400 border-red-400/50'
                        }`}
                      >
                        {dept.rate}%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={dept.rate} className="h-2" />
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Répartition du temps */}
      <Card className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1023]/90">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5" />
            {tCommon('admin.formations.analytics_completion_time')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {timeDistribution.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">{tCommon('admin.formations.analytics_no_time')}</p>
            ) : (
              <>
                {timeDistribution.map((time) => (
                  <div key={time.range} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-900 dark:text-white text-sm">{time.range}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 dark:text-gray-400 text-xs">{tCommon('admin.formations.analytics_users_count', { count: time.count })}</span>
                        <span className="text-gray-900 dark:text-white text-sm font-medium">{time.percentage}%</span>
                      </div>
                    </div>
                    <Progress value={time.percentage} className="h-2" />
                  </div>
                ))}
                
                <div className="mt-4 p-3 bg-gray-50 dark:bg-slate-800/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-gray-900 dark:text-white text-sm font-medium">{tCommon('admin.formations.analytics_optimal_time')}</span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">
                    {timeDistribution.length > 0
                      ? tCommon('admin.formations.analytics_optimal_time_desc', { range: timeDistribution[0].range, duration: formation.estimatedDuration })
                      : tCommon('admin.formations.analytics_estimated_duration', { duration: formation.estimatedDuration })
                    }
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}