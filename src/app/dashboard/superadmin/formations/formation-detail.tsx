'use client';

import { useEffect, useState } from 'react';
import { useParams } from '@tanstack/react-router';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardTopbar } from '@/components/layout/topbar';
import { Skeleton } from '@/components/ui/skeleton';
import { useFormationStore } from '@/store/formation.store';
import { useNavigate } from '@tanstack/react-router';

// Composants modulaires
import { FormationHeader } from './components/formation-header';
import { FormationStatsCards } from './components/formation-stats-cards';
import { FormationOverview } from './components/formation-overview';
import { FormationContent } from './components/formation-content';
import { FormationAssignment } from './components/formation-assignment';
import { FormationProgressComponent } from './components/formation-progress';
import { FormationAnalytics } from './components/formation-analytics';

export function FormationDetailPage() {
  const { formationId } = useParams({ from: '/_authenticated/dashboard/formations/$formationId' });
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const {
    selectedFormation: formation,
    formationProgress: progress,
    isLoading: loading,
    error,
    fetchById: fetchFormationById,
    fetchFormationProgress,
  } = useFormationStore();

  useEffect(() => {
    if (formationId) {
      fetchFormationById(formationId);
      fetchFormationProgress(formationId);
    }
  }, [formationId]);

  if (loading && !formation) {
    return (
      <div className="min-h-screen bg-[#050816] px-6">
        <div className="space-y-6">
          <Skeleton className="h-32 w-full bg-gray-800/50" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 bg-gray-800/50" />
            ))}
          </div>
          <Skeleton className="h-96 w-full bg-gray-800/50" />
        </div>
      </div>
    );
  }

  if (error || !formation) {
    return (
      <div className="min-h-screen bg-[#050816] px-6">
        <Card className="bg-red-900/20 border-red-700/50">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Formation non trouvée</h3>
            <p className="text-gray-400 mb-4">
              {error || 'La formation demandée n\'existe pas ou a été supprimée.'}
            </p>
            <Button onClick={() => navigate({ to: '/dashboard/formations' })} variant="outline">
              Retour aux formations
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <>
      <DashboardTopbar
        title={formation.title}
        description="Détails et statistiques de la formation"
      />
      
      <div className="min-h-screen bg-[#050816] px-6">
        {/* Header avec navigation et actions */}
        <FormationHeader formation={formation} />

        {/* Stats Cards */}
        <FormationStatsCards formation={formation} />

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-900/50 border border-slate-700/50 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 text-gray-100 hover:text-gray-400">
              Vue d'ensemble
            </TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:bg-purple-600 text-gray-100 hover:text-gray-400">
              Contenu
            </TabsTrigger>
            <TabsTrigger value="assignment" className="data-[state=active]:bg-indigo-600 text-gray-100 hover:text-gray-400">
              Assignation
            </TabsTrigger>
            <TabsTrigger value="progress" className="data-[state=active]:bg-green-600 text-gray-100 hover:text-gray-400">
              Progression utilisateurs
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-orange-600 text-gray-100 hover:text-gray-400">
              Analyses
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <FormationOverview formation={formation} />
          </TabsContent>

          <TabsContent value="content">
            <FormationContent formation={formation} />
          </TabsContent>

          <TabsContent value="assignment">
            <FormationAssignment formation={formation} progress={progress} />
          </TabsContent>

          <TabsContent value="progress">
            <FormationProgressComponent progress={progress} />
          </TabsContent>

          <TabsContent value="analytics">
            <FormationAnalytics formation={formation} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}