import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useEffect } from "react";
import { useDashboardStore } from "@/store/dashboard.store";
import { Mail } from "lucide-react";
import { cn } from "@/lib/utils";

export function RecentPhishingSimulations() {
  const { adminPhishingSimulations, fetchAdminPhishingSimulations, isLoading } = useDashboardStore();

  useEffect(() => {
    fetchAdminPhishingSimulations();
  }, [fetchAdminPhishingSimulations]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'interne':
        return <Badge className="bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-500/30">interne</Badge>;
      case 'mobile_money':
        return <Badge className="bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-500/30">mobile_money</Badge>;
      case 'banque':
        return <Badge className="bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 border-cyan-300 dark:border-cyan-500/30">banque</Badge>;
      default:
        return <Badge className="bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400 border-gray-300 dark:border-gray-500/30">{status}</Badge>;
    }
  };

  const getClickRate = (clicked: number, total: number) => {
    return total > 0 ? Math.round((clicked / total) * 100) : 0;
  };

  const getSignalRate = (signaled: number, total: number) => {
    return total > 0 ? Math.round((signaled / total) * 100) : 0;
  };

  if (isLoading) {
    return (
      <Card className="rounded-sm border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0c1023] shadow-sm dark:shadow-xl">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Dernières simulations de phishing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mb-2"></div>
                <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded mb-2"></div>
                <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded"></div>
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
        <CardTitle className="text-gray-900 dark:text-white">Dernières simulations de phishing</CardTitle>
      </CardHeader>
      <CardContent>
        {!adminPhishingSimulations || adminPhishingSimulations.length === 0 ? (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
            <Mail className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Aucune simulation récente</p>
          </div>
        ) : (
          <div className="space-y-6">
            {adminPhishingSimulations.map((simulation, index) => {
              const clickRate = getClickRate(simulation.clicked, simulation.totalTargets);
              const signalRate = getSignalRate(simulation.signaled, simulation.totalTargets);

              return (
                <div key={index} className="pb-6 border-b border-gray-200 dark:border-white/5 last:border-0 last:pb-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-gray-900 dark:text-white font-medium mb-1">{simulation.name}</h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>Terminée</span>
                        <span>•</span>
                        <span>{simulation.duration}</span>
                      </div>
                    </div>
                    {getStatusBadge(simulation.category)}
                  </div>

                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    <span className="text-gray-900 dark:text-white font-medium">Taux de clic</span>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <Progress 
                      value={clickRate} 
                      className="flex-1 h-2"
                      indicatorClassName={cn(
                        clickRate >= 50 ? "bg-red-500" :
                        clickRate >= 30 ? "bg-orange-500" :
                        "bg-pink-500"
                      )}
                    />
                    <span className={cn(
                      "text-sm font-semibold min-w-[60px] text-right",
                      clickRate >= 50 ? "text-red-600 dark:text-red-400" :
                      clickRate >= 30 ? "text-orange-600 dark:text-orange-400" :
                      "text-pink-600 dark:text-pink-400"
                    )}>
                      {clickRate}% ont cliqué
                    </span>
                  </div>

                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    <span className="text-gray-900 dark:text-white font-medium">Taux de signalement</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress 
                      value={signalRate} 
                      className="flex-1 h-2"
                      indicatorClassName="bg-green-500"
                    />
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400 min-w-[60px] text-right">
                      {signalRate}% ont signalé
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}