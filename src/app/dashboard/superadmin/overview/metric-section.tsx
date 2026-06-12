import { useEffect, useState } from "react";
import { MetricProgress } from "./metric-progress";
import { apiService } from "@/app/services/api.service";

interface KeyMetrics {
  churnRate: number;
  formationsCompleted: number;
  averageRiskScore: number;
}

export function MetricsSection() {
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
      <div className="rounded-3xl border border-white/5 bg-[#0c1023] p-6">
        <h2 className="mb-6 text-lg font-semibold">Métriques clés</h2>
        <div className="space-y-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-slate-700 rounded mb-2"></div>
              <div className="h-2 bg-slate-800 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/5 bg-[#0c1023] p-6">
      <h2 className="mb-6 text-lg font-semibold">
        Métriques clés
      </h2>

      <div className="space-y-8">
        <MetricProgress
          title="Taux de churn"
          value={metrics?.churnRate || 0}
        />

        <MetricProgress
          title="Formations complétées"
          value={metrics?.formationsCompleted || 0}
        />

        <MetricProgress
          title="Score de risque moyen"
          value={metrics?.averageRiskScore || 0}
        />
      </div>
    </div>
  );
}