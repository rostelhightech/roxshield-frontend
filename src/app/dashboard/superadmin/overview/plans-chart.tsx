import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { apiService } from "@/app/services/api.service";

interface PlanDistribution {
  name: string;
  label: string;
  count: number;
  percentage: number;
}

const PLAN_COLORS = {
  starter: '#10b981',   // vert
  business: '#f59e0b',  // orange
  enterprise: '#3b82f6', // bleu
};

export function PlansChart() {
  const [distribution, setDistribution] = useState<PlanDistribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPlansDistribution = async () => {
      try {
        const response = await apiService.get<{ success: boolean; data: PlanDistribution[] }>('/dashboard/plans-distribution');
        if ('success' in response && response.success) {
          setDistribution(response.data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la répartition des plans', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPlansDistribution();
  }, []);

  const chartData = distribution.map(plan => ({
    ...plan,
    color: PLAN_COLORS[plan.name as keyof typeof PLAN_COLORS] || '#6b7280',
  }));

  return (
    <Card className="rounded-sm border border-gray-200 dark:border-white/5 bg-white  dark:bg-[#0c1023] shadow-xs dark:shadow-xs">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-gray-900 dark:text-white">
          Répartition des plans
        </CardTitle>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
          </div>
        ) : distribution.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '4px',
                    color: '#111827',
                  }}
                  formatter={(value, name) => [`${value} organisations`, name]}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="mt-6 space-y-3">
              {distribution.map((plan, index) => (
                <div key={plan.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: chartData[index].color }}
                    ></div>
                    <span className="text-sm text-gray-700 dark:text-gray-900 dark:text-white">{plan.label}</span>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-slate-400">
                    {plan.count} ({plan.percentage}%)
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-400 dark:text-slate-400">
            Aucune donnée disponible
          </div>
        )}
      </CardContent>
    </Card>
  );
}