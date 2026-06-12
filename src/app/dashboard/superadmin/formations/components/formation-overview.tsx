'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { Formation } from '@/store/formation.store';

interface FormationOverviewProps {
  formation: Formation;
}

export function FormationOverview({ formation }: FormationOverviewProps) {
  const completionRate = formation.stats?.totalUsers && formation.stats.totalUsers > 0
    ? Math.round((formation.stats.completedUsers / formation.stats.totalUsers) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="rounded-md border border-white/10 bg-[#0c1023]/90 shadow-xl">
        <CardHeader>
          <CardTitle className="text-white">Taux de complétion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Progression globale</span>
              <span className="text-white">{completionRate}%</span>
            </div>
            <Progress value={completionRate} className="h-2" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{formation.stats?.completedUsers || 0} complétés</span>
              <span>{formation.stats?.totalUsers || 0} inscrits</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-md border border-white/10 bg-[#0c1023]/90 shadow-xl">
        <CardHeader>
          <CardTitle className="text-white">Informations générales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-400">Structure</span>
            <span className="text-white">
              {formation.modules?.length || 0} module(s), {' '}
              {formation.modules?.reduce((total, mod) => total + (mod.chapters?.length || 0), 0) || 0} chapitre(s)
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Durée estimée</span>
            <span className="text-white">{formation.estimatedDuration} minutes</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Score requis</span>
            <span className="text-white">{formation.passingScore}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Tentatives max</span>
            <span className="text-white">{formation.allowRetries ? formation.maxAttempts : '1'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Formation obligatoire</span>
            <span className="text-white">{formation.isRequired ? 'Oui' : 'Non'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Créé le</span>
            <span className="text-white">{new Date(formation.createdAt).toLocaleDateString('fr-FR')}</span>
          </div>
          {formation.publishedAt && (
            <div className="flex justify-between">
              <span className="text-gray-400">Publié le</span>
              <span className="text-white">{new Date(formation.publishedAt).toLocaleDateString('fr-FR')}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}