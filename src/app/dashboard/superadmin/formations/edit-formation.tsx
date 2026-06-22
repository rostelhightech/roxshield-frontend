'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { DashboardTopbar } from '@/components/layout/topbar';
import { useAuthStore } from '@/store/auth.store';
import { useFormationStore } from '@/store/formation.store';
import { Skeleton } from '@/components/ui/skeleton';
import type { FormationData } from '@/types/formation.types';

// Réutiliser les composants de create-formation
import { 
  InfoStep,
  ModulesStep,
  EvaluationStep
} from './create-formation';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export function EditFormationPage() {
  const { t: tCommon } = useTranslation('common');
  const navigate = useNavigate();
  const searchParams = useSearch({ from: '/_authenticated/dashboard/formations/formation-edit' });
  const formationId = (searchParams as any)?.id as string;
  
  const { user } = useAuthStore();
  const { selectedFormation, updateFormation, fetchById, isLoading } = useFormationStore();

  const [currentStep, setCurrentStep] = useState<'info' | 'modules' | 'evaluation'>('info');
  const [formData, setFormData] = useState<FormationData | null>(null);

  // Charger la formation à éditer
  useEffect(() => {
    if (formationId) {
      fetchById(formationId);
    }
  }, [formationId, fetchById]);

 

  // Initialiser le formulaire avec les données de la formation
  useEffect(() => {
    if (selectedFormation && !formData) {
      setFormData({
        title: selectedFormation.title,
        description: selectedFormation.description || '',
        status: selectedFormation.status,
        estimatedDuration: selectedFormation.estimatedDuration,
        isRequired: selectedFormation.isRequired,
        passingScore: selectedFormation.passingScore,
        allowRetries: selectedFormation.allowRetries,
        maxAttempts: selectedFormation.maxAttempts,
        organizationId: selectedFormation.organizationId,
        targetAudience: selectedFormation.targetAudience,
        modules: selectedFormation.modules?.map(m => ({
          ...m,
          chapters: m.chapters || []
        })) || [],
        //@ts-expect-error 
        finalEvaluation: selectedFormation.finalEvaluation ? {
          title: selectedFormation.finalEvaluation.title,
          description: selectedFormation.finalEvaluation.description || '',
          type: 'FORMATION' as const,
          questions: selectedFormation.finalEvaluation.questions || [],
          passingScore: selectedFormation.finalEvaluation.passingScore,
          timeLimit: selectedFormation.finalEvaluation.timeLimit,
          allowRetries: selectedFormation.finalEvaluation.allowRetries,
          maxAttempts: selectedFormation.finalEvaluation.maxAttempts,
          showCorrectAnswers: selectedFormation.finalEvaluation.showCorrectAnswers,
          randomizeQuestions: false,
          randomizeOptions: false,
        } : undefined,
      });
    }
  }, [selectedFormation, formData]);

  const handleSave = async (shouldPublish: boolean = false) => {
    if (!formData || !formationId) return;

    try {
      if (!formData.title || !formData.organizationId) {
        toast.error('Le titre et l\'organisation sont requis');
        return;
      }

      if (formData.modules.length === 0) {
        toast.error('Ajoutez au moins un module');
        return;
      }

      const invalidModule = formData.modules.find((m) => m.chapters.length === 0);
      if (invalidModule) {
        toast.error(`Le module "${invalidModule.title}" doit avoir au moins un chapitre`);
        return;
      }

      const payload = {
        title: formData.title,
        description: formData.description,
        estimatedDuration: formData.estimatedDuration,
        isRequired: formData.isRequired,
        passingScore: formData.passingScore,
        allowRetries: formData.allowRetries,
        maxAttempts: formData.maxAttempts,
        targetAudience: formData.targetAudience,
        organizationId: formData.organizationId,
        status: shouldPublish ? ('PUBLISHED' as const) : formData.status,
        modules: formData.modules.map((module) => ({
          title: module.title,
          description: module.description,
          order: module.order,
          estimatedDuration: module.estimatedDuration,
          chapters: module.chapters.map((chapter) => ({
            title: chapter.title,
            description: chapter.description,
            content: chapter.content,
            order: chapter.order,
            type: chapter.type,
            estimatedDuration: chapter.estimatedDuration,
            metadata: chapter.metadata,
          })),
        })),
        // ✅ Ajouter l'évaluation finale au payload
        finalEvaluation: formData.finalEvaluation && formData.finalEvaluation.questions.length > 0 ? {
          title: formData.finalEvaluation.title,
          description: formData.finalEvaluation.description,
          questions: formData.finalEvaluation.questions,
          passingScore: formData.finalEvaluation.passingScore,
          timeLimit: formData.finalEvaluation.timeLimit,
          allowRetries: formData.finalEvaluation.allowRetries,
          maxAttempts: formData.finalEvaluation.maxAttempts,
          showCorrectAnswers: formData.finalEvaluation.showCorrectAnswers,
        } : undefined,
      };

      await updateFormation(formationId, payload as any);
      toast.success('Formation mise à jour avec succès');
      navigate({ to: `/dashboard/formations/${formationId}` });
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
      console.error(error);
    }
  };

  if (isLoading || !formData) {
    return (
      <>
        <DashboardTopbar title={tCommon('admin.overview.risk_by_dept_loading')} description="Chargement de la formation" />
        <div className="min-h-screen bg-gray-50 dark:bg-[#050816] px-6">
          <Skeleton className="h-12 w-full mb-6 bg-gray-800/50" />
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full bg-gray-800/50" />
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardTopbar
        title={tCommon('admin.formations.edit_title')}
        description={tCommon('admin.formations.edit_desc')}
      />
      <div className="min-h-screen bg-gray-50 dark:bg-[#050816] px-6 pb-12">
        {/* Header avec boutons de navigation */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate({ to: `/dashboard/formations/${formationId}` })}
            className="text-slate-400 hover:text-gray-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {tCommon('admin.formations.edit_back')}
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => handleSave(false)} className="text-gray-600">
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder
            </Button>
            <Button onClick={() => handleSave(true)}>
              <Save className="w-4 h-4 mr-2" />
              {tCommon('admin.formations.edit_save_publish')}
            </Button>
          </div>
        </div>

        {/* Onglets de navigation */}
        <Tabs value={currentStep} onValueChange={(value: any) => setCurrentStep(value)} className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 bg-gray-300 dark:bg-slate-800/50">
            <TabsTrigger value="info" className="data-[state=active]:bg-orange-600 text-gray-900 dark:text-white hover:text-gray-500">
              Informations
            </TabsTrigger>
            <TabsTrigger value="modules" className="data-[state=active]:bg-orange-600 text-gray-900 dark:text-white hover:text-gray-500">
              Modules & Chapitres
            </TabsTrigger>
            <TabsTrigger value="evaluation" className="data-[state=active]:bg-orange-600 text-gray-900 dark:text-white hover:text-gray-500">
              {tCommon('admin.formations.content_final_quiz')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            {formData && <InfoStep formData={formData} setFormData={setFormData as any} onNext={() => setCurrentStep('modules')} />}
          </TabsContent>

          <TabsContent value="modules">
            {formData && (
              <ModulesStep
                formData={formData}
                setFormData={setFormData as any}
                onNext={() => setCurrentStep('evaluation')}
                onPrev={() => setCurrentStep('info')}
              />
            )}
          </TabsContent>

          <TabsContent value="evaluation">
            {formData && (
              <EvaluationStep
                formData={formData}
                setFormData={setFormData as any}
                onSave={() => handleSave(false)}
                onPublish={() => handleSave(true)}
                onPrev={() => setCurrentStep('modules')}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
