'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Users, CheckCircle, Target, Clock } from 'lucide-react';
import type { Formation } from '@/store/formation.store';

interface FormationStatsCardsProps {
  formation: Formation;
}

export function FormationStatsCards({ formation }: FormationStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="rounded-md border border-white/10 bg-[#0c1023]/90 shadow-xl">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total inscrits</p>
              <p className="text-2xl font-bold text-white">{formation.stats?.totalUsers || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="rounded-md border border-white/10 bg-[#0c1023]/90 shadow-xl">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/20">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Complétés</p>
              <p className="text-2xl font-bold text-white">{formation.stats?.completedUsers || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="rounded-md border border-white/10 bg-[#0c1023]/90 shadow-xl">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500/20">
              <Target className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Score moyen</p>
              <p className="text-2xl font-bold text-white">{Math.round(formation.stats?.averageScore || 0)}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="rounded-md border border-white/10 bg-[#0c1023]/90 shadow-xl">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <Clock className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Temps moyen</p>
              <p className="text-2xl font-bold text-white">
                {(() => {
                  const seconds = Math.round(formation.stats?.averageTimeSpent || 0);
                  const minutes = Math.floor(seconds / 60);
                  const remainingSeconds = seconds % 60;
                  if (minutes === 0) {
                    return `${seconds}s`;
                  } else if (remainingSeconds === 0) {
                    return `${minutes}min`;
                  } else {
                    return `${minutes}min`;
                  }
                })()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}