import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";
import { useDashboardStore } from "@/store/dashboard.store";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function RiskChart() {
  const { adminRiskEvolution, fetchAdminRiskEvolution, isLoading } = useDashboardStore();

  useEffect(() => {
    fetchAdminRiskEvolution();
  }, [fetchAdminRiskEvolution]);

  if (isLoading) {
    return (
      <Card className="rounded-sm border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0c1023] shadow-sm dark:shadow-xl">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Évolution du risque humain</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">Chargement...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-sm border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0c1023] shadow-sm dark:shadow-xl">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">Évolution du risque humain</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={adminRiskEvolution}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb dark:stroke-#374151" />
            <XAxis 
              dataKey="department" 
              stroke="#6b7280 dark:stroke-#9ca3af" 
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#6b7280 dark:stroke-#9ca3af" 
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                color: '#111827',
              }}
            />
            <Area
              type="monotone"
              dataKey="riskScore"
              stroke="#a855f7"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRisk)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}