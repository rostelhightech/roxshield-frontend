import { useEffect, useState } from "react";
import { AlertTriangle, Bell, X } from "lucide-react";
import { apiService } from "@/app/services/api.service";
import { motion, AnimatePresence } from "framer-motion";

interface Alert {
  id: string;
  type: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  message: string;
  entityId: string;
  entityType: string;
  createdAt: Date;
  isRead: boolean;
}

export function AlertsSection() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const response = await apiService.get<{ success: boolean; data: Alert[] }>('/grc/high-risk-alerts');
        if ('success' in response && response.success) {
          // Ne garder que les alertes critiques (HIGH)
          const criticalAlerts = response.data.filter(alert => alert.severity === 'HIGH').slice(0, 3);
          setAlerts(criticalAlerts);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des alertes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAlerts();
  }, []);

  const handleDismiss = (alertId: string) => {
    setDismissedAlerts(prev => [...prev, alertId]);
  };

  const visibleAlerts = alerts.filter(alert => !dismissedAlerts.includes(alert.id));

  if (isLoading || visibleAlerts.length === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-3"
      >
        {visibleAlerts.map((alert, index) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: index * 0.1 }}
            className="relative rounded-lg border border-red-300 dark:border-red-500/30 bg-red-100 dark:bg-red-500/5 p-4"
          >
            <button
              onClick={() => handleDismiss(alert.id)}
              className="absolute right-2 top-2 text-red-400/60 hover:text-red-500 dark:text-red-400/60 dark:hover:text-red-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="flex items-start gap-3 pr-8">
              <div className="rounded-sm bg-red-100 dark:bg-red-500/20 p-2 mt-0.5">
                <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Bell className="w-4 h-4 text-red-600 dark:text-red-400" />
                  <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 font-medium">
                    CRITIQUE
                  </span>
                </div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-900 dark:text-white mb-1">
                  {alert.title}
                </h4>
                <p className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed">
                  {alert.message}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}