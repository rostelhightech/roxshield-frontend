'use client';

import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, MousePointerClick, Monitor, Smartphone, Tablet } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { DetailedTargetAnalysis } from '@/store/campaign.store';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

interface CampaignDetailedTargetsProps {
  detailedTargetAnalysis: DetailedTargetAnalysis[];
}

const getDeviceIcon = (device: string | null) => {
  if (!device) return Monitor;
  if (device === 'Mobile') return Smartphone;
  if (device === 'Tablet') return Tablet;
  return Monitor;
};

export function CampaignDetailedTargets({ detailedTargetAnalysis }: CampaignDetailedTargetsProps) {
  // Trier par nombre total d'événements (du plus actif au moins actif)
  const sortedTargets = [...detailedTargetAnalysis].sort((a, b) => b.totalEvents - a.totalEvents);
const { t: tCommon } = useTranslation('common');

  return (
<Card className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1023]/90">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">{tCommon('admin.campaigns.targets_title')}</CardTitle>
        <CardDescription className="text-gray-500 dark:text-gray-400">
          {tCommon('admin.campaigns.targets_desc')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-slate-300">Cible</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600 dark:text-slate-300">{tCommon('admin.campaigns.targets_sent')}</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600 dark:text-slate-300">Ouvert</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600 dark:text-slate-300">{tCommon('admin.campaigns.targets_clicked')}</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600 dark:text-slate-300">Temps ouverture</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600 dark:text-slate-300">Temps clic</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600 dark:text-slate-300">Appareil</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600 dark:text-slate-300">IP</th>
              </tr>
            </thead>
          <tbody>
            {sortedTargets.map((target, index) => {
              const DeviceIcon = getDeviceIcon(target.device);
              
              return (
                <motion.tr
                  key={target.targetId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-100 dark:border-slate-800/50 hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {target.firstName && target.lastName 
                          ? `${target.firstName} ${target.lastName}`
                          : target.email
                        }
                      </p>
                      {target.firstName && target.lastName && (
                        <p className="text-xs text-gray-500 dark:text-slate-400">{target.email}</p>
                      )}
                    </div>
                   </td>
                  <td className="py-3 px-4 text-center">
                    {target.emailSent ? (
                      <div className="flex flex-col items-center">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        {target.emailSentAt && (
                          <span className="text-xs text-gray-500 dark:text-slate-500 mt-1">
                            {format(new Date(target.emailSentAt), 'HH:mm', { locale: fr })}
                          </span>
                        )}
                      </div>
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-400 dark:text-slate-600" />
                    )}
                   </td>
                  <td className="py-3 px-4 text-center">
                    {target.emailOpened ? (
                      <div className="flex flex-col items-center">
                        <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        {target.emailOpenedAt && (
                          <span className="text-xs text-gray-500 dark:text-slate-500 mt-1">
                            {format(new Date(target.emailOpenedAt), 'HH:mm', { locale: fr })}
                          </span>
                        )}
                      </div>
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-400 dark:text-slate-600" />
                    )}
                   </td>
                  <td className="py-3 px-4 text-center">
                    {target.linkClicked ? (
                      <div className="flex flex-col items-center">
                        <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        {target.linkClickedAt && (
                          <span className="text-xs text-gray-500 dark:text-slate-500 mt-1">
                            {format(new Date(target.linkClickedAt), 'HH:mm', { locale: fr })}
                          </span>
                        )}
                      </div>
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-400 dark:text-slate-600" />
                    )}
                   </td>
                  <td className="py-3 px-4 text-center">
                    {target.timeToOpenMinutes !== null ? (
                      <div className="flex items-center justify-center gap-1">
                        <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm text-gray-900 dark:text-white">
                          {target.timeToOpenMinutes < 60 
                            ? `${target.timeToOpenMinutes}m`
                            : `${Math.floor(target.timeToOpenMinutes / 60)}h${target.timeToOpenMinutes % 60}m`
                          }
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400 dark:text-slate-600">-</span>
                    )}
                   </td>
                  <td className="py-3 px-4 text-center">
                    {target.timeToClickMinutes !== null ? (
                      <div className="flex items-center justify-center gap-1">
                        <MousePointerClick className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <span className="text-sm text-gray-900 dark:text-white">
                          {target.timeToClickMinutes < 60 
                            ? `${target.timeToClickMinutes}m`
                            : `${Math.floor(target.timeToClickMinutes / 60)}h${target.timeToClickMinutes % 60}m`
                          }
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400 dark:text-slate-600">-</span>
                    )}
                   </td>
                  <td className="py-3 px-4 text-center">
                    {target.device ? (
                      <div className="flex items-center justify-center gap-1">
                        <DeviceIcon className="w-4 h-4 text-gray-500 dark:text-slate-400" />
                        <span className="text-xs text-gray-500 dark:text-slate-400">{target.device}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400 dark:text-slate-600">-</span>
                    )}
                   </td>
                  <td className="py-3 px-4 text-center">
                    {target.ip ? (
                      <span className="text-xs text-gray-500 dark:text-slate-400 font-mono">{target.ip}</span>
                    ) : (
                      <span className="text-sm text-gray-400 dark:text-slate-600">-</span>
                    )}
                   </td>
                </motion.tr>
              );
            })}
          </tbody>
         </table>
      </div>

      {sortedTargets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-slate-400">Aucune donnée d'analyse disponible pour le moment.</p>
        </div>
      )}
    </CardContent>
    </Card>
  );
}
