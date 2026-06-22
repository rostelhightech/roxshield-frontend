import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";
import { useDashboardStore } from "@/store/dashboard.store";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export function HighRiskEmployees() {
  const { t: tCommon } = useTranslation('common');
  const { adminHighRiskEmployees, fetchAdminHighRiskEmployees, isLoading } = useDashboardStore();

  useEffect(() => {
    fetchAdminHighRiskEmployees();
  }, []);

  const getRiskColor = (riskScore: number) => {
    if (riskScore >= 70) return "text-red-600 dark:text-red-400";
    if (riskScore >= 50) return "text-orange-600 dark:text-orange-400";
    return "text-yellow-600 dark:text-yellow-400";
  };

  const getRiskBadgeColor = (riskScore: number) => {
    if (riskScore >= 70) return "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border-red-300 dark:border-red-500/30";
    if (riskScore >= 50) return "bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-300 dark:border-orange-500/30";
    return "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-300 dark:border-yellow-500/30";
  };

  const getRiskCircleColor = (riskScore: number) => {
    if (riskScore >= 70) return "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400";
    if (riskScore >= 50) return "bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400";
    return "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400";
  };

  if (isLoading) {
    return (
      <Card className="rounded-sm border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0c1023] shadow-sm dark:shadow-xl">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">{tCommon('admin.page_overview.high_risk_title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                  <div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-24"></div>
                  </div>
                </div>
                <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-16"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-sm border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0c1023] shadow-sm dark:shadow-xl">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">{tCommon('admin.page_overview.high_risk_title')}</CardTitle>
      </CardHeader>
      <CardContent>
        {!adminHighRiskEmployees || adminHighRiskEmployees.length === 0 ? (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
            <AlertTriangle className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">{tCommon('admin.page_overview.high_risk_empty')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {adminHighRiskEmployees.map((employee, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm",
                    getRiskCircleColor(employee.riskScore)
                  )}>
                    {employee.initials}
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium text-sm">{employee.name}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">{employee.department} — {employee.position}</p>
                    <p className="text-gray-400 dark:text-gray-500 text-xs">{employee.formationsCompleted} {tCommon('admin.page_overview.stats_trainings')?.toLowerCase()}</p>
                  </div>
                </div>
                
                <Badge className={getRiskBadgeColor(employee.riskScore)}>
                  {employee.riskScore}% {tCommon('admin.page_overview.risk_label', 'risque')}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}