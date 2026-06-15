'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams } from '@tanstack/react-router';
import { useCampaignStore } from '@/store/campaign.store';
import { useOrganizationStore } from '@/store/organization.store';
import { useGroupStore } from '@/store/group.store';
import { useTemplateStore } from '@/store/template.store';
import { useLandingPageTemplateStore } from '@/store/landing-page-template.store';
import { useSmtpProfileStore } from '@/store/smtp-profile.store';
import { DashboardTopbar } from '@/components/layout/topbar';
import { CampaignDetailSkeleton } from './campaign-detail-skeleton';
import { CampaignNotFound } from './campaign-not-found';
import { CampaignActionsBar } from './campaign-actions-bar';
import { CampaignFormModal } from './campaign-form-modal';
import { CampaignInfoCard } from './campaign-info-card';
import { CampaignStatsCard } from './campaign-stats-card';
import { CampaignTargetsCard } from './campaign-targets-card';
import { CampaignTrackingCard } from './campaign-tracking-card';
import { CampaignChartsSection } from './campaign-charts-section';
import { CampaignTargetsList } from './campaign-targets-list';
import { CampaignTimeline } from './campaign-timeline';
import { CampaignTimeAnalysis } from './campaign-time-analysis';
import { CampaignDeviceAnalysis } from './campaign-device-analysis';
import { CampaignDetailedTargets } from './campaign-detailed-targets';
import { CampaignNoInteractionTargets } from './campaign-no-interaction-targets';
import { CampaignTemplatePreview } from './campaign-template-preview';
import { CampaignAdvancedKPIs } from './campaign-advanced-kpis';
import { useCampaignFormHandlers } from '@/hooks/use-campaign-form-handlers';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Users, Clock, Monitor, FileText, Mail } from 'lucide-react';


export default function CampaignDetailPage() {
  const { campaignId } = useParams({ 
    from: '/_authenticated/dashboard/campaigns/$campaignId' 
  });
  
  // Tous les hooks doivent être appelés dans le même ordre à chaque rendu
  const [showCharts, setShowCharts] = useState(false);
  
  const { 
    currentCampaign, 
    fetchById, 
    isLoading, 
    updateCampaign, 
    createCampaign, 
    archiveCampaign, 
    restoreCampaign, 
    launchCampaign,
    timeline,
    timeAnalysis,
    userAgentAnalysis,
    targetsWithoutInteraction,
    detailedTargetAnalysis,
    fetchTimeline,
    fetchTimeAnalysis,
    fetchUserAgentAnalysis,
    fetchTargetsWithoutInteraction,
    fetchDetailedTargetAnalysis,
  } = useCampaignStore();
  
  const { organizations } = useOrganizationStore();
  const { groups, fetchAll: fetchGroups } = useGroupStore();
  const { templateList, fetchTemplateList } = useTemplateStore();
  const { landingPageTemplates, fetchAll: fetchLandingPageTemplates } = useLandingPageTemplateStore();
  const { smtpProfiles, fetchAll: fetchSmtpProfiles } = useSmtpProfileStore();
  
  const { formMode, formInitialValues, handleEdit, handleRemix, handleFormCancel, handleFormSuccess } = useCampaignFormHandlers(currentCampaign);
  
  // Calculs mémorisés
  const targetStatusData = useMemo(
    () => {
      if (!currentCampaign) return [];
      const sentTargets = currentCampaign.targets.filter((target) => target.status === 'SENT').length;
      const pendingTargets = currentCampaign.targets.filter((target) => target.status === 'PENDING').length;
      const failedTargets = currentCampaign.targets.filter((target) => target.status === 'FAILED').length;
      
      return [
        { name: 'Envoyés', value: sentTargets, color: '#10b981' },
        { name: 'En attente', value: pendingTargets, color: '#f59e0b' },
        { name: 'Échecs', value: failedTargets, color: '#ef4444' },
      ];
    },
    [currentCampaign]
  );

  const trackingEventsData = useMemo(() => {
    if (!currentCampaign) return [];
    const events = currentCampaign.trackingEvents;
    const typeCount = events?.reduce(
      (acc, event) => {
        acc[event.type] = (acc[event.type] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
    return Object.entries(typeCount || {}).map(([type, count]) => ({
      name: type.replace(/_/g, ' ').toLowerCase(),
      count,
    }));
  }, [currentCampaign]);

  useEffect(() => {
    if (campaignId) {
      fetchById(campaignId);
      fetchTimeline(campaignId);
      fetchTimeAnalysis(campaignId);
      fetchUserAgentAnalysis(campaignId);
      fetchTargetsWithoutInteraction(campaignId);
      fetchDetailedTargetAnalysis(campaignId);
    }
  }, [campaignId, fetchById, fetchTimeline, fetchTimeAnalysis, fetchUserAgentAnalysis, fetchTargetsWithoutInteraction, fetchDetailedTargetAnalysis]);


  // Délai de 1.5s avant d'afficher les graphiques
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCharts(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, [currentCampaign?.id]);

  const handleRelaunchCampaign = async () => {
    if (!currentCampaign) return;
    await launchCampaign(currentCampaign.id);
  };

  const handleRestoreCampaign = async () => {
    if (!currentCampaign) return;
    await restoreCampaign(currentCampaign.id);
    await fetchById(currentCampaign.id);
  };

  const handleArchiveCampaign = async () => {
    if (!currentCampaign) return;
    await archiveCampaign(currentCampaign.id);
    await fetchById(currentCampaign.id);
  };

  const handleDuplicateCampaign = async () => {
    if (!currentCampaign) return;
    const targets = currentCampaign.targets.map((target) =>
      target.groupId ? { groupId: target.groupId } : { email: target.email }
    );

    await createCampaign({
      organizationId: currentCampaign.organizationId,
      name: `${currentCampaign.name} (dupliquée)`,
      description: currentCampaign.description ?? null,
      smtpProfileId: currentCampaign.smtpProfileId,
      emailTemplateId: currentCampaign.emailTemplateId,
      landingPageTemplateId: currentCampaign.landingPageTemplateId,
      scheduledAt: currentCampaign.scheduledAt ?? null,
      endAt: currentCampaign.endAt ?? null,
      targets,
    });
  };

  const handleUpdateCampaign = async (data: any) => {
    if (!currentCampaign) return;
    await updateCampaign(currentCampaign.id, {
      name: data.name,
      description: data.description || null,
      smtpProfileId: data.smtpProfileId,
      emailTemplateId: data.emailTemplateId,
      landingPageTemplateId: data.landingPageTemplateId,
      scheduledAt: data.scheduledAt || null,
      endAt: data.endAt || null,
    });
  };

  const handleCreateRemix = async (data: any) => {
    await createCampaign({
      organizationId: data.organizationId,
      name: data.name,
      description: data.description || null,
      smtpProfileId: data.smtpProfileId,
      emailTemplateId: data.emailTemplateId,
      landingPageTemplateId: data.landingPageTemplateId,
      scheduledAt: data.scheduledAt || null,
      endAt: data.endAt || null,
      targets: data.targetGroupId
        ? [{ groupId: data.targetGroupId }]
        : (data.targetEmails ?? '')
            .split(/\r?\n/)
            .map((email: string) => email.trim())
            .filter(Boolean)
            .map((email: string) => ({ email })),
    });
  };

  if (isLoading && !currentCampaign) {
    return <CampaignDetailSkeleton />;
  }

  if (!currentCampaign) {
    return <CampaignNotFound />;
  }

  const totalTargets = currentCampaign.targets.length;
  const sentTargets = currentCampaign.targets.filter((target) => target.status === 'SENT').length;
  const failedTargets = currentCampaign.targets.filter((target) => target.status === 'FAILED').length;
  const pendingTargets = currentCampaign.targets.filter((target) => target.status === 'PENDING').length;

  return (
   <div className="min-h-screen bg-gray-50   dark:bg-[#050816] text-gray-900 dark:text-white">
      <DashboardTopbar
        title={currentCampaign.name}
        description="Détails complets de la campagne, y compris cibles et événements de tracking."
      />
      
      <div className="mx-auto  mt-4">
        <CampaignActionsBar
          campaign={currentCampaign}
          onEdit={handleEdit}
          onRemix={handleRemix}
          onDuplicate={handleDuplicateCampaign}
          onArchive={handleArchiveCampaign}
          onRestore={handleRestoreCampaign}
          onRelaunch={handleRelaunchCampaign}
        />

        <CampaignFormModal
          isOpen={!!formMode}
          mode={formMode}
          initialValues={formInitialValues}
          organizations={organizations}
          groups={groups}
          templates={templateList}
          landingPageTemplates={landingPageTemplates}
          smtpProfiles={smtpProfiles}
          onCancel={handleFormCancel}
          onSuccess={handleFormSuccess}
          onSubmitEdit={handleUpdateCampaign}
          onSubmitRemix={handleCreateRemix}
        />

        <div className="pt-6">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-gray-100 dark:bg-slate-900/50 gap-4 border border-gray-200 dark:border-slate-700/50 p-1">
              <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-700 dark:text-gray-100 hover:text-gray-900 dark:hover:text-gray-400">
                <BarChart3 className="w-4 h-4" />
                Vue d'ensemble
              </TabsTrigger>
              <TabsTrigger value="analysis" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-700 dark:text-gray-100 hover:text-gray-900 dark:hover:text-gray-400">
                <Monitor className="w-4 h-4" />
                Analyses
              </TabsTrigger>
              <TabsTrigger value="targets" className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-gray-700 dark:text-gray-100 hover:text-gray-900 dark:hover:text-gray-400">
                <Users className="w-4 h-4" />
                Cibles
              </TabsTrigger>
              <TabsTrigger value="timeline" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white text-gray-700 dark:text-gray-100 hover:text-gray-900 dark:hover:text-gray-400">
                <Clock className="w-4 h-4" />
                Timeline
              </TabsTrigger>
              <TabsTrigger value="templates" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white text-gray-700 dark:text-gray-100 hover:text-gray-900 dark:hover:text-gray-400">
                <Mail className="w-4 h-4" />
                Templates
              </TabsTrigger>
            </TabsList>

            {/* Vue d'ensemble */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
                <div className="space-y-6">
                  <CampaignInfoCard campaign={currentCampaign} />
                  <CampaignStatsCard
                    totalTargets={totalTargets}
                    sentTargets={sentTargets}
                    openedCount={currentCampaign.trackingEvents.filter(e => e.type === 'EMAIL_OPENED').length}
                    clickedCount={currentCampaign.trackingEvents.filter(e => e.type === 'LINK_CLICKED').length}
                  />
                </div>

                <div className="space-y-6">
                  <CampaignTargetsCard
                    pendingTargets={pendingTargets}
                    failedTargets={failedTargets}
                    eventCounts={{
                      EMAIL_SENT: currentCampaign.trackingEvents.filter(e => e.type === 'EMAIL_SENT').length,
                      EMAIL_OPENED: currentCampaign.trackingEvents.filter(e => e.type === 'EMAIL_OPENED').length,
                      LINK_CLICKED: currentCampaign.trackingEvents.filter(e => e.type === 'LINK_CLICKED').length,
                    }}
                  />
                  <CampaignTrackingCard trackingEvents={currentCampaign.trackingEvents} />
                </div>
              </div>

              <CampaignChartsSection
                showCharts={showCharts}
                targetStatusData={targetStatusData}
                trackingEventsData={trackingEventsData}
              />
            </TabsContent>

            {/* Analyses avancées */}
            <TabsContent value="analysis" className="space-y-6">
              {detailedTargetAnalysis.length > 0 && (
                <CampaignAdvancedKPIs 
                  detailedTargetAnalysis={detailedTargetAnalysis}
                  totalTargets={totalTargets}
                />
              )}
              
              {timeAnalysis && (
                <CampaignTimeAnalysis timeAnalysis={timeAnalysis} />
              )}
              
              {userAgentAnalysis && (
                <CampaignDeviceAnalysis userAgentAnalysis={userAgentAnalysis} />
              )}
            </TabsContent>

            {/* Cibles */}
            <TabsContent value="targets" className="space-y-6">
              <CampaignNoInteractionTargets targetsWithoutInteraction={targetsWithoutInteraction} />
              
              {detailedTargetAnalysis.length > 0 && (
                <CampaignDetailedTargets detailedTargetAnalysis={detailedTargetAnalysis} />
              )}
              
              <CampaignTargetsList campaign={currentCampaign} />
            </TabsContent>

            {/* Timeline */}
            <TabsContent value="timeline" className="space-y-6">
              {timeline.length > 0 && (
                <CampaignTimeline timeline={timeline} />
              )}
            </TabsContent>

            {/* Templates */}
            <TabsContent value="templates" className="space-y-6">
              <CampaignTemplatePreview campaign={currentCampaign} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}