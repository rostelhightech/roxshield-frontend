'use client';

import { motion } from 'framer-motion';
import { 
  Clock, 
  CheckCircle, 
  PlayCircle, 
  Archive, 
  Edit, 
  Rocket 
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { TimelineEvent } from '@/store/campaign.store';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CampaignTimelineProps {
  timeline: TimelineEvent[];
}

const iconMap: Record<string, any> = {
  CREATED: Clock,
  UPDATED: Edit,
  QUEUED: Rocket,
  STARTED: PlayCircle,
  COMPLETED: CheckCircle,
  ARCHIVED: Archive,
};

const colorMap: Record<string, string> = {
  CREATED: '#3b82f6',
  UPDATED: '#f59e0b',
  QUEUED: '#8b5cf6',
  STARTED: '#10b981',
  COMPLETED: '#22c55e',
  ARCHIVED: '#64748b',
};

export function CampaignTimeline({ timeline }: CampaignTimelineProps) {
  return (
    <Card className="rounded-md border border-white/10 bg-[#0c1023]/90 shadow-xl">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-400" />
          Timeline de la campagne
        </CardTitle>
        <CardDescription>
          Historique complet des événements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Ligne verticale */}
          <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500/50 to-transparent" />

          <div className="space-y-6">
            {timeline.map((event, index) => {
              const Icon = iconMap[event.type] || Clock;
              const color = colorMap[event.type] || '#64748b';

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative flex items-start gap-4"
                >
                  {/* Icon */}
                  <div 
                    className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full shadow-lg"
                    style={{ backgroundColor: `${color}40` }}
                  >
                    <Icon className="w-4 h-4" style={{ color }} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-white">
                        {event.description}
                      </p>
                      <time className="text-xs text-zinc-400">
                        {format(new Date(event.date), 'PPp', { locale: fr })}
                      </time>
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">
                      {format(new Date(event.date), 'EEEE', { locale: fr })}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
