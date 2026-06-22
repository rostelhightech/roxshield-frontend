'use client';

import { useEffect, useMemo, useState } from 'react';
import { CampaignForm } from './campaign-form';
import { useOrganizationStore } from '@/store/organization.store';
import { useGroupStore } from '@/store/group.store';
import { useTemplateStore } from '@/store/template.store';
import { useLandingPageTemplateStore } from '@/store/landing-page-template.store';
import { useSmtpProfileStore } from '@/store/smtp-profile.store';
import { Campaign, useCampaignStore } from '@/store/campaign.store';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CustomBadge } from '@/components/ui/badge';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Mail, Plus, ChevronDown, Play } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useAuthStore } from '@/store/auth.store';
import { roleEnum } from '@/constants/roleEnum';
import { Combobox } from '@/components/ui/combobox';
import { useTranslation } from 'react-i18next';

interface CampaignsProps {
  formOpen?: boolean;
}

export default function Campaigns({ formOpen = false }: CampaignsProps) {
  const { t: tCommon } = useTranslation('common');
  const { organizations } = useOrganizationStore();
  const { groups, fetchAll: fetchGroups } = useGroupStore();
  const { templateList, fetchTemplateList } = useTemplateStore();
  const { landingPageTemplates, fetchAll: fetchLandingPageTemplates } = useLandingPageTemplateStore();
  const { smtpProfiles, fetchAll: fetchSmtpProfiles } = useSmtpProfileStore();
  const {user} = useAuthStore()
  const {
    campaigns,
    fetchAll: fetchCampaigns,
    isLoading: isLoadingCampaigns,
    deleteCampaign,
    archiveCampaign,
    restoreCampaign,
    createCampaign,
    launchCampaign,
    duplicate
  } = useCampaignStore();

  const [isFormOpen, setIsFormOpen] = useState(formOpen);
  const [formInitialValues, setFormInitialValues] = useState<Campaign | null>(null);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const isNotSuperAdmin = user?.role !== roleEnum.SUPERADMIN

  // États pour les dialogs de confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [launchDialogOpen, setLaunchDialogOpen] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    fetchGroups();
    fetchTemplateList();
    fetchLandingPageTemplates();
    fetchSmtpProfiles();
    fetchCampaigns();
  }, []);

  useEffect(() => {
    setIsFormOpen(formOpen);
  }, [formOpen]);

  const filteredCampaigns = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    return [...campaigns]
      .filter((campaign) => {
        if (statusFilter !== 'ALL' && campaign.status !== statusFilter) {
          return false;
        }

        if (!normalizedSearch) {
          return true;
        }

        const haystack = [
          campaign.name,
          campaign.description ?? '',
          campaign.organization?.name ?? '',
          campaign.emailTemplate?.name ?? '',
          campaign.landingPageTemplate?.name ?? '',
        ]
          .join(' ')
          .toLowerCase();

        return haystack.includes(normalizedSearch);
      })
      .sort((a, b) => {
        const getValue = (campaign: typeof campaigns[number]) => {
          if (sortBy === 'scheduledAt') {
            return campaign.scheduledAt ?? '';
          }
          if (sortBy === 'status') {
            return campaign.status;
          }
          if (sortBy === 'name') {
            return campaign.name.toLowerCase();
          }
          return campaign.createdAt;
        };

        const left = getValue(a);
        const right = getValue(b);

        if (left < right) return sortOrder === 'asc' ? -1 : 1;
        if (left > right) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [campaigns, searchText, statusFilter, sortBy, sortOrder]);

  // Stats des campagnes
  const campaignStats = useMemo(
    () => ({
      total: campaigns.length,
      inProgress: campaigns.filter((c) => c.status === 'IN_PROGRESS').length,
      completed: campaigns.filter((c) => c.status === 'COMPLETED').length,
      draft: campaigns.filter((c) => c.status === 'DRAFT').length,
      archived: campaigns.filter((c) => c.status === 'ARCHIVED').length,
    }),
    [campaigns]
  );

  const handleStatusFilterChange = (value: string | null) => {
    setStatusFilter(value ?? 'ALL');
  };

  const handleSortByChange = (value: string | null) => {
    setSortBy(value ?? 'createdAt');
  };

  const handleSortOrderChange = (value: string | null) => {
    setSortOrder((value ?? 'desc') as 'asc' | 'desc');
  };

  const handleDeleteCampaign = async (id: string, name: string) => {
    setSelectedCampaign({ id, name });
    setDeleteDialogOpen(true);
  };

  const confirmDeleteCampaign = async () => {
    if (!selectedCampaign) return;
    await deleteCampaign(selectedCampaign.id);
    setDeleteDialogOpen(false);
    setSelectedCampaign(null);
  };

  const handleArchiveCampaign = async (id: string, name: string) => {
    setSelectedCampaign({ id, name });
    setArchiveDialogOpen(true);
  };

  const confirmArchiveCampaign = async () => {
    if (!selectedCampaign) return;
    await archiveCampaign(selectedCampaign.id);
    setArchiveDialogOpen(false);
    setSelectedCampaign(null);
  };

  const handleLaunchCampaign = async (id: string, name: string) => {
    setSelectedCampaign({ id, name });
    setLaunchDialogOpen(true);
  };

  const confirmLaunchCampaign = async () => {
    if (!selectedCampaign) return;
    await launchCampaign(selectedCampaign.id);
    setLaunchDialogOpen(false);
    setSelectedCampaign(null);
  };

  const handleRestoreCampaign = async (id: string, name: string) => {
    setSelectedCampaign({ id, name });
    setRestoreDialogOpen(true);
  };

  const confirmRestoreCampaign = async () => {
    if (!selectedCampaign) return;
    await restoreCampaign(selectedCampaign.id);
    setRestoreDialogOpen(false);
    setSelectedCampaign(null);
  };


  const handleDuplicateCampaign = async (campaign: typeof campaigns[number]) => {
    await duplicate(campaign.id);
  };



  const handleOnCreated = async () => {
    await fetchCampaigns();
    setIsFormOpen(false);
    setFormInitialValues(null);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'IN_PROGRESS':
        return 'info';
      case 'QUEUED':
        return 'warning';
      case 'DRAFT':
        return 'muted';
      case 'CANCELLED':
        return 'danger';
      case 'ARCHIVED':
        return 'muted';
      default:
        return 'muted';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050816] text-gray-900 dark:text-white">
      <div className="mx-auto">
        <div className="grid gap-6">

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card className="rounded-sm hover:bg-gray-100 dark:hover:bg-[#1a1f36] cursor-pointer transition-colors duration-200 border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0c1023] p-4 shadow-xs dark:shadow-xl">
              <div className="p-4">
                <p className="text-gray-500 dark:text-gray-400 text-sm">{tCommon('admin.campaigns.total_campaigns')}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{campaignStats.total}</p>
              </div>
            </Card>
            <Card className="rounded-sm hover:bg-gray-100 dark:hover:bg-[#1a1f36] cursor-pointer transition-colors duration-200 border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0c1023] p-4 shadow-xs dark:shadow-xl">
              <div className="p-4">
                <p className="text-gray-500 dark:text-gray-400 text-sm">{tCommon('user.formations.in_progress_status')}</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{campaignStats.inProgress}</p>
              </div>
            </Card>
            <Card className="rounded-sm hover:bg-gray-100 dark:hover:bg-[#1a1f36] cursor-pointer transition-colors duration-200 border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0c1023] p-4 shadow-xs dark:shadow-xl">
              <div className="p-4">
                <p className="text-gray-500 dark:text-gray-400 text-sm">{tCommon('user.formations.completed_status')}</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{campaignStats.completed}</p>
              </div>
            </Card>
            <Card className="rounded-sm hover:bg-gray-100 dark:hover:bg-[#1a1f36] cursor-pointer transition-colors duration-200 border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0c1023] p-4 shadow-xs dark:shadow-xl">
              <div className="p-4">
                <p className="text-gray-500 dark:text-gray-400 text-sm">{tCommon('admin.campaigns.draft')}</p>
                <p className="text-2xl font-bold text-gray-500 dark:text-gray-400">{campaignStats.draft}</p>
              </div>
            </Card>
            <Card className="rounded-sm hover:bg-gray-100 dark:hover:bg-[#1a1f36] cursor-pointer transition-colors duration-200 border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0c1023] p-4 shadow-xs dark:shadow-xl">
              <div className="p-4">
                <p className="text-gray-500 dark:text-gray-400 text-sm">{tCommon('admin.campaigns.page_archived')}</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{campaignStats.archived}</p>
              </div>
            </Card>
          </div>

          {/* Card formulaire collapsible */}
          <Card className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1023]/90 shadow-xs dark:shadow-xl overflow-hidden">
            <CardHeader
              className="flex flex-row items-center justify-between gap-4 px-6 py-4 cursor-pointer select-none"
              onClick={() => setIsFormOpen((v) => !v)}
            >
              <div className="flex items-center gap-3">
                <div className="md:grid h-10 w-10 hidden place-items-center rounded-md bg-violet-100 dark:bg-violet-500/15 text-violet-600 dark:text-violet-300">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg text-gray-900 dark:text-white">{tCommon('admin.campaigns.page_create_new')}</CardTitle>
                  <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                    {tCommon('admin.campaigns.page_create_desc')}
                  </CardDescription>
                </div>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-gray-400 dark:text-gray-400 transition-transform duration-200 ${isFormOpen ? 'rotate-180' : ''}`}
              />
            </CardHeader>

            <div
              className={`grid transition-all duration-300 ease-in-out ${
                isFormOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <CardContent className="md:px-6 px-2 pb-6 pt-2">
                  <CampaignForm
                    organizations={organizations}
                    groups={groups}
                    templates={templateList}
                    landingPageTemplates={landingPageTemplates}
                    smtpProfiles={smtpProfiles}
                    initialValues={formInitialValues ?? undefined}
                    submitLabel={formInitialValues ? tCommon('admin.campaigns.duplicate_remix') : tCommon('admin.campaigns.create_campaign')}
                    onCreated={handleOnCreated}
                    onCancel={() => {
                      setIsFormOpen(false);
                      setFormInitialValues(null);
                    }}
                    defaultOrganizationId={isNotSuperAdmin ? organizations[0]?.id : undefined}
                    hideOrganization={isNotSuperAdmin}
                  />
                </CardContent>
              </div>
            </div>
          </Card>

          {/* Card campagnes récentes */}
          <Card className="rounded-sm w-full border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1023]/90 shadow-xs dark:shadow-xl">
            <CardHeader className="flex flex-col md:flex-row px-6 w-full justify-between gap-4 pt-2">
              <div>
                <CardTitle className="text-xl text-gray-900 dark:text-white">{tCommon('admin.campaigns.page_recent')}</CardTitle>
                <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                  {tCommon('admin.campaigns.page_recent_desc')}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsFormOpen((v) => !v)}>
                  <Plus className="h-3.5 w-3.5" />
                  {tCommon('admin.campaigns.page_new')}
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 p-6">
             <div className="flex flex-col md:flex-row w-full gap-3 justify-between">
  <Input
    placeholder={tCommon('admin.campaigns.page_search_placeholder')}
    value={searchText}
    onChange={(event) => setSearchText(event.target.value)}
    className="min-w-0 max-w-[320px]"
  />
  <div className="gap-2 flex-wrap md:flex-nowrap flex space-y-2">
       <Combobox
        options={[
          { value: 'ALL', label: tCommon('admin.users.all_status')},
          { value: 'DRAFT', label: tCommon('admin.campaigns.draft') },
          { value: 'QUEUED', label: tCommon('admin.campaigns.queued') },
          { value: 'IN_PROGRESS', label: tCommon('user.formations.in_progress_status')} ,
          { value: 'COMPLETED', label: tCommon('admin.page_overview.phishing_completed')} ,
          { value: 'CANCELLED', label: tCommon('admin.demos.cancelled')} ,
          { value: 'ARCHIVED', label: tCommon('admin.campaigns.page_archived') },
        ]}
        value={statusFilter}
        onChange={handleStatusFilterChange}
        placeholder={tCommon('admin.campaigns.page_filter_status')}
        searchPlaceholder={tCommon('admin.campaigns.search_status')}
        className="w-auto text-gray-900 dark:text-white z-[1000]"
      />
       <Combobox
        options={[
          { value: 'createdAt', label: tCommon('admin.campaigns.info_created')} ,
          { value: 'scheduledAt', label: tCommon('admin.campaigns.info_scheduled') },
          { value: 'status', label: tCommon('admin.ambassadors.status_placeholder') },
          { value: 'name', label: tCommon('user.profile.last_name') },
        ]}
        value={sortBy}
        onChange={handleSortByChange}
        placeholder={tCommon('admin.campaigns.page_sort_by')}
        searchPlaceholder={tCommon('admin.templates.search_criteria')}
        className="min-w-[150px] text-gray-900 dark:text-white"
      />
      <Combobox
        options={[
          { value: 'desc', label: tCommon('admin.campaigns.sort_desc') },
          { value: 'asc', label: tCommon('admin.campaigns.sort_asc') },
        ]}
        value={sortOrder}
        onChange={handleSortOrderChange}
        placeholder={tCommon('admin.campaigns.sort_order')}
        searchPlaceholder={tCommon('admin.campaigns.search_order')}
        className="w-full text-gray-900 dark:text-white"
      />
    </div>
 </div>
              {isLoadingCampaigns && campaigns.length === 0 ? (
                <div className="rounded-md border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-8 text-center text-gray-500 dark:text-gray-400">
                  {tCommon('admin.campaigns.page_loading')}
                </div>
              ) : filteredCampaigns.length === 0 ? (
                <div className="grid place-items-center rounded-md border border-gray-200 dark:border-white/10 p-8 text-center text-gray-500 dark:text-gray-400">
                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-md text-violet-600 dark:text-violet-300">
                    <Mail className="h-7 w-7" />
                  </div>
                  <p className="text-base font-medium text-gray-900 dark:text-white">{tCommon('admin.campaigns.page_no_results')}</p>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{tCommon('admin.campaigns.page_no_results_desc')}</p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-md border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5">
                  <Table className="min-w-full text-gray-900 dark:text-white border-separate border-spacing-0">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-gray-600 dark:text-white">{tCommon('admin.campaigns.page_table_campaign')}</TableHead>
                        <TableHead className="text-gray-600 dark:text-white">{tCommon('admin.ambassadors.status_placeholder')}</TableHead>
                        <TableHead className="text-gray-600 dark:text-white">{tCommon('admin.grc.org_name')}</TableHead>
                        <TableHead className="text-gray-600 dark:text-white">{tCommon('admin.demos.scheduled')}</TableHead>
                        <TableHead className="text-right text-gray-600 dark:text-white">{tCommon('admin.ambassadors.table_actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCampaigns.map((campaign) => (
                        <TableRow key={campaign.id}>
                          <TableCell className="max-w-[220px] truncate pr-3">
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">{campaign.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{campaign.description ?? tCommon('admin.campaigns.no_description')}</div>
                          </TableCell>
                          <TableCell>
                            <CustomBadge color={getStatusVariant(campaign.status)}>{campaign.status}</CustomBadge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-gray-900 dark:text-white">{campaign.organization?.name ?? '—'}</div>
                          </TableCell>
                          <TableCell>
  <div className="text-sm text-gray-900 dark:text-white">
    {campaign.scheduledAt ? (
      new Date(campaign.scheduledAt).toLocaleString('fr-FR')
    ) : campaign?.startedAt ? (
      <span className="flex items-center gap-1">
        {new Date(campaign?.startedAt).toLocaleString('fr-FR')}
        <span className="text-xs text-gray-500 dark:text-gray-400">{tCommon('admin.campaigns.page_immediate')}</span>
      </span>
    ) : (
      tCommon('admin.campaigns.info_not_scheduled')
    )}
  </div>
</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Link
                              to="/dashboard/campaigns/$campaignId"
                              params={{ campaignId: campaign.id }}
                              className="inline-flex rounded-md border border-gray-300 dark:border-white/10 bg-gray-100 dark:bg-white/5 px-2 py-1 text-xs text-gray-700 dark:text-white transition hover:bg-gray-200 dark:hover:bg-white/10"
                            >
                              {tCommon('admin.campaigns.page_details')}
                            </Link>
                            <Button
                              size="sm"
                              className="text-gray-700 dark:text-gray-300"
                              variant="outline"
                              onClick={() => handleDuplicateCampaign(campaign)}
                            >
                              {tCommon('admin.campaigns.duplicate')}
                            </Button>
                            {campaign.status === 'ARCHIVED' ? (
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleRestoreCampaign(campaign.id, campaign.name)}
                              >
                                {tCommon('admin.campaigns.page_unarchive')}
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                className="text-gray-700 dark:text-gray-300"
                                variant="outline"
                                onClick={() => handleArchiveCampaign(campaign.id, campaign.name)}
                              >
                                {tCommon('admin.campaigns.archive')}
                              </Button>
                            )}

                            {['DRAFT', 'SCHEDULED'].includes(campaign.status) && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-green-600 dark:text-green-400 border-green-300 dark:border-green-400/30 hover:bg-green-50 dark:hover:bg-green-400/10 hover:text-green-700 dark:hover:text-green-300"
                                onClick={() => handleLaunchCampaign(campaign.id, campaign.name)}
                                title={tCommon('admin.campaigns.page_launch_title')}
                              >
                                <Play className="h-3.5 w-3.5" />
                              </Button>
                            )}

                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteCampaign(campaign.id, campaign.name)}
                            >
                              {tCommon('admin.ambassadors.delete')}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>

      {/* Dialogs de confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 rounded-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-white">{tCommon('admin.campaigns.page_delete_confirm_title')}</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
              {tCommon('admin.campaigns.page_delete_confirm_desc')} <span className="font-semibold text-gray-900 dark:text-white">"{selectedCampaign?.name}"</span> {tCommon('admin.campaigns.page_delete_confirm_desc2')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className='bg-white dark:bg-gray-900'>
            <AlertDialogCancel className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-white">
              {tCommon('user.formations.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteCampaign}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {tCommon('admin.ambassadors.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={archiveDialogOpen} onOpenChange={setArchiveDialogOpen}>
        <AlertDialogContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 rounded-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-white">{tCommon('admin.campaigns.page_archive_confirm_title')}</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
              {tCommon('admin.campaigns.page_archive_confirm_desc')} <span className="font-semibold text-gray-900 dark:text-white">"{selectedCampaign?.name}"</span> {tCommon('admin.campaigns.page_archive_confirm_desc2')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className='bg-white dark:bg-gray-900'>
            <AlertDialogCancel className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-white">
              {tCommon('user.formations.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmArchiveCampaign}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              {tCommon('admin.campaigns.archive')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={launchDialogOpen} onOpenChange={setLaunchDialogOpen}>
        <AlertDialogContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 rounded-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-white">{tCommon('admin.campaigns.page_launch_confirm_title')}</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
              {tCommon('admin.campaigns.page_launch_confirm_desc')} <span className="font-semibold text-gray-900 dark:text-white">"{selectedCampaign?.name}"</span> {tCommon('admin.campaigns.page_launch_confirm_desc2')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className='bg-white dark:bg-gray-900'>
            <AlertDialogCancel className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-white">
              {tCommon('user.formations.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmLaunchCampaign}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {tCommon('admin.campaigns.launch')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
        <AlertDialogContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 rounded-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-white">{tCommon('admin.campaigns.page_restore_confirm_title')}</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
              {tCommon('admin.campaigns.page_restore_confirm_desc')} <span className="font-semibold text-gray-900 dark:text-white">"{selectedCampaign?.name}"</span> ? {tCommon('admin.campaigns.restore_active')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className='bg-white dark:bg-gray-900'>
            <AlertDialogCancel className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-white">
              {tCommon('user.formations.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRestoreCampaign}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {tCommon('admin.campaigns.restore')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}