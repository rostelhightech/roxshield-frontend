'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Target, Clock, MousePointerClick } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { DetailedTargetAnalysis } from '@/store/campaign.store';

interface CampaignAdvancedKPIsProps {
  detailedTargetAnalysis: DetailedTargetAnalysis[];
  totalTargets: number;
}

export function CampaignAdvancedKPIs({ detailedTargetAnalysis, totalTargets }: CampaignAdvancedKPIsProps) {
  // Calculs des KPIs avancés
  const openedTargets = detailedTargetAnalysis.filter(t => t.emailOpened);
  const clickedTargets = detailedTargetAnalysis.filter(t => t.linkClicked);

  // Taux d'ouverture unique
  const uniqueOpenRate = totalTargets > 0 
    ? Math.round((openedTargets.length / totalTargets) * 100) 
    : 0;

  // Taux de clic sur ouverture (CTR)
  const clickThroughRate = openedTargets.length > 0
    ? Math.round((clickedTargets.length / openedTargets.length) * 100)
    : 0;

  // Temps moyen avant première ouverture
  const openTimes = detailedTargetAnalysis
    .filter(t => t.timeToOpenMinutes !== null)
    .map(t => t.timeToOpenMinutes as number);
  
  const avgTimeToOpen = openTimes.length > 0
    ? Math.round(openTimes.reduce((sum, time) => sum + time, 0) / openTimes.length)
    : 0;

  // Temps moyen entre ouverture et clic
  const clickTimes = detailedTargetAnalysis
    .filter(t => t.timeToClickMinutes !== null)
    .map(t => t.timeToClickMinutes as number);
  
  const avgTimeToClick = clickTimes.length > 0
    ? Math.round(clickTimes.reduce((sum, time) => sum + time, 0) / clickTimes.length)
    : 0;

  // Taux d'engagement global (au moins une action)
  const engagedTargets = detailedTargetAnalysis.filter(
    t => t.emailOpened || t.linkClicked
  );
  const engagementRate = totalTargets > 0
    ? Math.round((engagedTargets.length / totalTargets) * 100)
    : 0;

  const kpis = [
    {
      icon: Target,
      label: 'Taux d\'ouverture unique',
      value: `${uniqueOpenRate}%`,
      description: `${openedTargets.length} ouvertures uniques`,
      color: '#3b82f6',
    },
    {
      icon: MousePointerClick,
      label: 'Taux de clic / Ouverture',
      value: `${clickThroughRate}%`,
      description: `${clickedTargets.length} clics sur ${openedTargets.length} ouvertures`,
      color: '#8b5cf6',
    },
    {
      icon: Clock,
      label: 'Temps moyen d\'ouverture',
      value: avgTimeToOpen < 60 
        ? `${avgTimeToOpen}m`
        : `${Math.floor(avgTimeToOpen / 60)}h${avgTimeToOpen % 60}m`,
      description: 'Depuis l\'envoi',
      color: '#f59e0b',
    },
    {
      icon: MousePointerClick,
      label: 'Temps moyen de clic',
      value: avgTimeToClick < 60 
        ? `${avgTimeToClick}m`
        : `${Math.floor(avgTimeToClick / 60)}h${avgTimeToClick % 60}m`,
      description: 'Depuis l\'ouverture',
      color: '#ec4899',
    },
    {
      icon: TrendingUp,
      label: 'Taux d\'engagement global',
      value: `${engagementRate}%`,
      description: `${engagedTargets.length} cibles actives`,
      color: '#06b6d4',
    },
  ];

  return (
    <Card className="rounded-md border border-white/10 bg-white  dark:bg-[#0c1023]/90  ">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          KPIs Avancés
        </CardTitle>
        <CardDescription>
          Indicateurs de performance détaillés de la campagne
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {kpis?.map((kpi, index) => {
            const Icon = kpi.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-sm hover:bg-gray-100 dark:bg-[#1a1f36] cursor-pointer transition-colors duration-200 border border-white/5 bg-gray-50   p-6  "
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="rounded-sm p-3"
                    style={{ backgroundColor: `${kpi.color}20` }}
                  >
                    <Icon className="h-6 w-6" style={{ color: kpi.color }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-zinc-400">{kpi.label}</p>
                    <h2 className="text-2xl font-bold text-zinc-600 dark:text-gray-900 dark:text-white">{kpi.value}</h2>
                    <p className="text-xs text-zinc-500">{kpi.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
