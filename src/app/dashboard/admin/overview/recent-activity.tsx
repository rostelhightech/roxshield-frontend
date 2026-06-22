import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";
import { useDashboardStore } from "@/store/dashboard.store";
import { CheckCircle2, UserPlus, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export function RecentActivity() {
  const { adminRecentActivity, fetchAdminRecentActivity, isLoading } = useDashboardStore();
const { t: tCommon } = useTranslation('common');
  useEffect(() => {
    fetchAdminRecentActivity();
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'formation_completed':
        return <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case 'user_connected':
        return <UserPlus className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500 dark:text-gray-400" />;
    }
  };

  const formatTime = (time: string) => {
    const now = new Date();
    const activityTime = new Date(time);
    const diffMs = now.getTime() - activityTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    return `Il y a ${diffDays}j`;
  };

  if (isLoading) {
    return (
      <Card className="rounded-sm border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0c1023] shadow-sm dark:shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-900 dark:text-white">{tCommon('admin.page_overview.recent_activity_title')}</CardTitle>
            <span className="text-xs text-gray-500 dark:text-gray-400">{tCommon('admin.page_overview.recent_activity_count')}</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-sm border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0c1023] shadow-sm dark:shadow-xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-gray-900 dark:text-white">{tCommon('admin.page_overview.recent_activity_title')}</CardTitle>
          <span className="text-xs text-gray-500 dark:text-gray-400">{tCommon('admin.page_overview.recent_activity_count')}</span>
        </div>
      </CardHeader>
      <CardContent>
        {!adminRecentActivity || adminRecentActivity.length === 0 ? (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
            <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">{tCommon('admin.page_overview.recent_activity_empty')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {adminRecentActivity.slice(0, 10).map((activity, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-start gap-3 pb-4",
                  index !== adminRecentActivity.length - 1 && "border-b border-gray-200 dark:border-white/5"
                )}
              >
                <div className="mt-0.5">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 dark:text-white text-sm">
                    <span className="font-medium">{activity.userName}</span> —{' '}
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {formatTime(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}