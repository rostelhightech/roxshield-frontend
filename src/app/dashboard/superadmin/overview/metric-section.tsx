import { useEffect, useState } from "react";
import { MetricProgress } from "./metric-progress";
import { apiService } from "@/app/services/api.service";
import { useTranslation } from 'react-i18next';

interface KeyMetrics {
  churnRate: number;
  formationsCompleted: number;
  averageRiskScore: number;
}

export function MetricsSection() {
  const { t: tCommon } = useTranslation('common');
  const [metrics, setMetrics] = useState<KeyMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadKeyMetrics = async () => {
      try {
        const response = await apiService.get<{ success: boolean; data: KeyMetrics }>('/dashboard/key-metrics');
        if ('success' in response && response.success) {
          setMetrics(response.data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des métriques clés', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadKeyMetrics();
  }, []);

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-gray-200 dark:border-white/5 bg-white  dark:bg-[#0c1023] p-6 shadow-lg dark:shadow-xl">
        <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-gray-900 dark:text-white">{tCommon('admin.page_overview.key_metrics')}</h2>
        <div className="space-y-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded mb-2"></div>
              <div className="h-2 bg-gray-100 dark:bg-slate-800 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-gray-200 dark:border-white/5 bg-white  dark:bg-[#0c1023] p-6 shadow-xs dark:shadow-xl">
      <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-gray-900 dark:text-white">
        {tCommon('admin.page_overview.key_metrics')}
      </h2>

      <div className="space-y-8">
        <MetricProgress
          title={tCommon('admin.page_overview.churn_rate')}
          value={metrics?.churnRate || 0}
        />

        <MetricProgress
          title={tCommon('admin.page_overview.stats_trainings')}
          value={metrics?.formationsCompleted || 0}
        />

        <MetricProgress
          title={tCommon('admin.page_overview.stats_avg_risk')}
          value={metrics?.averageRiskScore || 0}
        />
      </div>
    </div>
  );
}