import { useEffect } from 'react';
import { useAmbassadorStore } from '@/store/ambassador.store';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, DollarSign, Building2 } from 'lucide-react';

interface AmbassadorStatsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ambassadorId: string;
}

export function AmbassadorStatsDialog({
  open,
  onOpenChange,
  ambassadorId,
}: AmbassadorStatsDialogProps) {
  const { ambassadorStats, fetchAmbassadorStats, isLoading } = useAmbassadorStore();

  useEffect(() => {
    if (open && ambassadorId) {
      fetchAmbassadorStats(ambassadorId);
    }
  }, [open, ambassadorId, fetchAmbassadorStats]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-[#070b18] border border-gray-200 dark:border-white/[0.08] text-gray-900 dark:text-white sm:max-w-3xl max-h-[90vh] overflow-y-auto px-0 pb-0">
        {/* Header */}
        <div className="px-7 pb-0">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white text-lg font-medium">
              Statistiques de l'ambassadeur
            </DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400 text-sm">
              {ambassadorStats
                ? `${ambassadorStats.ambassador.firstName} ${ambassadorStats.ambassador.lastName}`
                : 'Chargement...'}
            </DialogDescription>
          </DialogHeader>
          <div className="h-px bg-gray-200 dark:bg-white/[0.08] mt-5" />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] text-gray-500 dark:text-gray-400" />
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Chargement des statistiques...</p>
            </div>
          </div>
        ) : ambassadorStats ? (
          <div className="px-7 pb-7 flex flex-col gap-6">
            {/* Stats grid */}
            <div className="grid grid-cols-4 gap-2.5">
              {[
                {
                  label: 'Total parrainages',
                  value: ambassadorStats.stats.totalReferrals,
                  icon: <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />,
                },
                {
                  label: 'Parrainages actifs',
                  value: ambassadorStats.stats.activeReferrals,
                  icon: <Building2 className="h-4 w-4 text-green-600 dark:text-green-400" />,
                },
                {
                  label: 'Taux de succès',
                  value: `${ambassadorStats.stats.successRate}%`,
                  icon: <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />,
                },
                {
                  label: 'Revenu potentiel',
                  value: (
                    <span>
                      {ambassadorStats.stats.totalRevenue.toLocaleString()}{' '}
                      <span className="text-xs text-gray-500 font-normal">FCFA</span>
                    </span>
                  ),
                  icon: <DollarSign className="h-4 w-4 text-orange-600 dark:text-orange-400" />,
                },
              ].map(({ label, value, icon }) => (
                <div
                  key={label}
                  className="bg-gray-100 dark:bg-slate-800/50 border border-gray-300 dark:border-slate-600 rounded-xl p-4 flex flex-col gap-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight">{label}</span>
                    {icon}
                  </div>
                  <div className="text-[22px] font-medium text-gray-900 dark:text-white leading-none">{value}</div>
                </div>
              ))}
            </div>

            {/* Organisations */}
            <div>
              <h3 className="text-[15px] font-medium text-gray-900 dark:text-white mb-3">
                Organisations parrainées{' '}
                <span className="text-gray-500 font-normal">
                  ({ambassadorStats.referredOrganizations.length})
                </span>
              </h3>

              {ambassadorStats.referredOrganizations.length === 0 ? (
                <div className="rounded-xl border border-gray-200 dark:border-white/[0.08] bg-gray-100 dark:bg-slate-800/50 p-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                  Aucune organisation parrainée pour le moment
                </div>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {ambassadorStats.referredOrganizations.map((org) => (
                    <div
                      key={org.id}
                      className="flex items-center justify-between rounded-xl border border-gray-200 dark:border-white/[0.08] bg-gray-100 dark:bg-slate-800/50 px-4 py-3 gap-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{org.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                          {org.city}, {org.country} • {org.currentEmployees} employés
                        </p>
                      </div>
                      {org.isActive ? (
                        <Badge className="bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-300 dark:border-green-500/25 text-[11px] font-medium rounded-full px-2.5">
                          Active
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-200 dark:bg-slate-600/40 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-slate-600 text-[11px] font-medium rounded-full px-2.5">
                          Inactive
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-gray-500 dark:text-gray-400 text-sm">
            Erreur lors du chargement des statistiques
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}