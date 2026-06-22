import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";
import { useDashboardStore } from "@/store/dashboard.store";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useTranslation } from "react-i18next";

const COLORS = ['#ea580c', '#f59e0b', '#dc2626', '#10b981', '#f97316', '#eab308', '#f59e0b'];

export function RiskByDepartment() {
  const { adminRiskByDepartment, fetchAdminRiskByDepartment, isLoading } = useDashboardStore();
const { t: tCommon } = useTranslation('common');
  useEffect(() => {
    fetchAdminRiskByDepartment();
  }, [ ]);

  if (isLoading) {
    return (
      <Card className="rounded-sm border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0c1023] shadow-sm dark:shadow-xl">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">{tCommon('admin.page_overview.risk_by_dept_title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">{tCommon('admin.page_overview.risk_by_dept_loading')}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-sm border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0c1023] shadow-sm dark:shadow-xl">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">{tCommon('admin.page_overview.risk_by_group_title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            className="text-gray-900 dark:text-white"
            data={adminRiskByDepartment}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb dark:stroke-#374151" horizontal={false} />
            <XAxis type="number" stroke="#6b7280 dark:stroke-#9ca3af" style={{ fontSize: '12px' }} />
            <YAxis 
              type="category" 
              dataKey="name" 
              stroke="#6b7280 dark:stroke-#9ca3af"
              className="text-gray-900 dark:text-white"
              style={{ fontSize: '12px' }}
              width={100}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                color: '#111827',
              }}
            />
            <Bar dataKey="riskScore" radius={[0, 8, 8, 0]}>
              {adminRiskByDepartment?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="text-gray-900 dark:text-white" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}