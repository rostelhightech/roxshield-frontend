'use client';

import { useEffect, useMemo, useState } from 'react';
import { CampaignForm, CampaignFormData } from './campaign-form';
import { useOrganizationStore } from '@/store/organization.store';
import { useGroupStore } from '@/store/group.store';
import { useTemplateStore } from '@/store/template.store';
import { useLandingPageTemplateStore } from '@/store/landing-page-template.store';
import { useSmtpProfileStore } from '@/store/smtp-profile.store';
import { useCampaignStore } from '@/store/campaign.store';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge, CustomBadge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

interface CampaignsProps {
  formOpen?: boolean;
}

export default function Campaigns({ formOpen = false }: CampaignsProps) {
  const { organizations, fetchAll: fetchOrganizations } = useOrganizationStore();
  const { groups, fetchAll: fetchGroups } = useGroupStore();
  const { templateList, fetchTemplateList } = useTemplateStore();
  const { landingPageTemplates, fetchAll: fetchLandingPageTemplates } = useLandingPageTemplateStore();
  const { smtpProfiles, fetchAll: fetchSmtpProfiles } = useSmtpProfileStore();
  const {
    campaigns,
    fetchAll: fetchCampaigns,
    isLoading: isLoadingCampaigns,
    deleteCampaign,
    archiveCampaign,
    restoreCampaign,
    createCampaign,
    launchCampaign,
  } = useCampaignStore();

  const [isFormOpen, setIsFormOpen] = useState(formOpen);
  const [formInitialValues, setFormInitialValues] = useState<CampaignFormData | null>(null);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  useEffect(() => {
    fetchOrganizations();
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
    if (!window.confirm(`Supprimer définitivement la campagne "${name}" ?`)) {
      return;
    }

    await deleteCampaign(id);
  };

  const handleArchiveCampaign = async (id: string, name: string) => {
    if (!window.confirm(`Archiver la campagne "${name}" ?`)) {
      return;
    }

    await archiveCampaign(id);
  };

  const handleLaunchCampaign = async (id: string) => {
    if (!window.confirm(`Lancer la campagne ?`)) {
        return;
    }

    await launchCampaign(id);
  };

  const handleRestoreCampaign = async (id: string, name: string) => {
    if (!window.confirm(`Désarchiver la campagne "${name}" ?`)) {
      return;
    }

    await restoreCampaign(id);
  };

  const handleDuplicateCampaign = async (campaign: typeof campaigns[number]) => {
    await createCampaign({
      organizationId: campaign.organizationId,
      name: `${campaign.name} (dupliquée)`,
      description: campaign.description ?? null,
      smtpProfileId: campaign.smtpProfileId,
      emailTemplateId: campaign.emailTemplateId,
      landingPageTemplateId: campaign.landingPageTemplateId,
      scheduledAt: campaign.scheduledAt ?? null,
      endAt: campaign.endAt ?? null,
      targets: [],
    });
    fetchCampaigns();
  };

  const handleRemixCampaign = (campaign: typeof campaigns[number]) => {
    setFormInitialValues({
      name: `Remix - ${campaign.name}`,
      description: campaign.description ?? '',
      organizationId: campaign.organizationId,
      smtpProfileId: campaign.smtpProfileId,
      emailTemplateId: campaign.emailTemplateId,
      landingPageTemplateId: campaign.landingPageTemplateId,
      scheduledAt: campaign.scheduledAt ?? '',
      endAt: campaign.endAt ?? '',
      targetGroupId: '',
      targetEmails: '',
    });
    setIsFormOpen(true);
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
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto">
        <div className="grid gap-6">

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card className="rounded-md hover:bg-[#1a1f36] cursor-pointer transition-colors duration-200 border border-white/5 bg-[#0c1023] p-4 shadow-xl">
              <div className="p-4">
                <p className="text-gray-400 text-sm">Total campagnes</p>
                <p className="text-2xl font-bold text-white">{campaignStats.total}</p>
              </div>
            </Card>
            <Card className="rounded-md hover:bg-[#1a1f36] cursor-pointer transition-colors duration-200 border border-white/5 bg-[#0c1023] p-4 shadow-xl">
              <div className="p-4">
                <p className="text-gray-400 text-sm">En cours</p>
                <p className="text-2xl font-bold text-blue-400">{campaignStats.inProgress}</p>
              </div>
            </Card>
            <Card className="rounded-md hover:bg-[#1a1f36] cursor-pointer transition-colors duration-200 border border-white/5 bg-[#0c1023] p-4 shadow-xl">
              <div className="p-4">
                <p className="text-gray-400 text-sm">Terminées</p>
                <p className="text-2xl font-bold text-green-400">{campaignStats.completed}</p>
              </div>
            </Card>
            <Card className="rounded-md hover:bg-[#1a1f36] cursor-pointer transition-colors duration-200 border border-white/5 bg-[#0c1023] p-4 shadow-xl">
              <div className="p-4">
                <p className="text-gray-400 text-sm">Brouillons</p>
                <p className="text-2xl font-bold text-gray-400">{campaignStats.draft}</p>
              </div>
            </Card>
            <Card className="rounded-md hover:bg-[#1a1f36] cursor-pointer transition-colors duration-200 border border-white/5 bg-[#0c1023] p-4 shadow-xl">
              <div className="p-4">
                <p className="text-gray-400 text-sm">Archivées</p>
                <p className="text-2xl font-bold text-orange-400">{campaignStats.archived}</p>
              </div>
            </Card>
          </div>

          {/* Card formulaire collapsible */}
          <Card className="rounded-md border border-white/10 bg-[#0c1023]/90 shadow-xl overflow-hidden">
            <CardHeader
              className="flex flex-row items-center justify-between gap-4 px-6 py-4 cursor-pointer select-none"
              onClick={() => setIsFormOpen((v) => !v)}
            >
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-md bg-violet-500/15 text-violet-300">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg text-white">Créer une nouvelle campagne</CardTitle>
                  <CardDescription className="text-sm text-gray-400">
                    Remplissez les informations pour lancer votre campagne email.
                  </CardDescription>
                </div>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isFormOpen ? 'rotate-180' : ''}`}
              />
            </CardHeader>

            <div
              className={`grid transition-all duration-300 ease-in-out ${
                isFormOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <CardContent className="px-6 pb-6 pt-2">
                  <CampaignForm
                    organizations={organizations}
                    groups={groups}
                    templates={templateList}
                    landingPageTemplates={landingPageTemplates}
                    smtpProfiles={smtpProfiles}
                    initialValues={formInitialValues ?? undefined}
                    submitLabel={formInitialValues ? 'Dupliquer / Remixer' : 'Créer la campagne'}
                    onCreated={handleOnCreated}
                    onCancel={() => {
                      setIsFormOpen(false);
                      setFormInitialValues(null);
                    }}
                  />
                </CardContent>
              </div>
            </div>
          </Card>

          {/* Card campagnes récentes */}
          <Card className="rounded-md border w-full border-white/10 bg-[#0c1023]/90 shadow-xl">
            <CardHeader className="flex px-6  w-full justify-between gap-4   pt-2">
              <div>
                <CardTitle className="text-xl text-white">Campagnes récentes</CardTitle>
                <CardDescription className="text-sm text-gray-400">
                  Suivez les campagnes créées et vérifiez leur statut.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsFormOpen((v) => !v)}>
                  <Plus className="h-3.5 w-3.5" />
                  Nouvelle campagne
                </Button>
               
              </div>
            </CardHeader>

            <CardContent className="space-y-6 p-6">
              <div className="flex w-full gap-3  justify-between">
                <Input
                  placeholder="Rechercher une campagne..."
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  className="min-w-0 max-w-[320px]"
                />
                <div className=" gap-2 flex ">
                  <div>
                    <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                      <SelectTrigger className="min-w-[120px] text-white" size="sm">
                        <SelectValue placeholder="Filtrer par statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">Tous les statuts</SelectItem>
                        <SelectItem value="DRAFT">Brouillon</SelectItem>
                        <SelectItem value="QUEUED">En file</SelectItem>
                        <SelectItem value="IN_PROGRESS">En cours</SelectItem>
                        <SelectItem value="COMPLETED">Terminée</SelectItem>
                        <SelectItem value="CANCELLED">Annulée</SelectItem>
                        <SelectItem value="ARCHIVED">Archivée</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className=" gap-2 flex">
                    <Select value={sortBy} onValueChange={handleSortByChange}>
                      <SelectTrigger className="min-w-[150px] text-white" size="sm">
                        <SelectValue placeholder="Trier par" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="createdAt">Créée le</SelectItem>
                        <SelectItem value="scheduledAt">Planifiée le</SelectItem>
                        <SelectItem value="status">Statut</SelectItem>
                        <SelectItem value="name">Nom</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={sortOrder} onValueChange={handleSortOrderChange}>
                      <SelectTrigger className="w-full text-white" size="sm">
                        <SelectValue className="text-white" placeholder="Ordre" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="desc">Décroissant</SelectItem>
                        <SelectItem value="asc">Croissant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {isLoadingCampaigns && campaigns.length === 0 ? (
                <div className="rounded-md border border-white/10 bg-white/5 p-8 text-center text-gray-400">
                  Chargement des campagnes...
                </div>
              ) : filteredCampaigns.length === 0 ? (
                <div className="grid place-items-center rounded-md border border-white/10 p-8 text-center text-gray-400">
                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-md text-violet-300">
                    <Mail className="h-7 w-7" />
                  </div>
                  <p className="text-base font-medium text-white">Aucune campagne correspondante</p>
                  <p className="mt-2 text-sm text-gray-400">Essayez une autre recherche ou ajustez vos filtres.</p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-md border border-white/10 bg-white/5">
                  <Table className="min-w-full text-white text-white border-separate border-spacing-0">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-white">Campagne</TableHead>
                        <TableHead className="text-white">Statut</TableHead>
                        <TableHead className="text-white">Organisation</TableHead>
                        <TableHead className="text-white">Planifiée</TableHead>
                        <TableHead className="text-right text-white">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCampaigns.map((campaign) => (
                        <TableRow key={campaign.id}>
                          <TableCell className="max-w-[220px] truncate pr-3">
                            <div className="text-sm font-semibold text-white">{campaign.name}</div>
                            <div className="text-xs text-gray-400 truncate">{campaign.description ?? 'Aucune description'}</div>
                          </TableCell>
                          <TableCell>
                            <CustomBadge color={getStatusVariant(campaign.status)}>{campaign.status}</CustomBadge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-white">{campaign.organization?.name ?? '—'}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-white">
                              {campaign.scheduledAt
                                ? new Date(campaign.scheduledAt).toLocaleString('fr-FR')
                                : 'Non planifiée'}
                            </div>
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Link
                              to="/dashboard/campaigns/$campaignId"
                              params={{ campaignId: campaign.id }}
                              className="inline-flex rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white transition hover:bg-white/10"
                            >
                              Détails
                            </Link>
                            {/* <Button
                              size="sm"
                              variant="outline"
                              className="text-gray-700"
                              onClick={() => handleRemixCampaign(campaign)}
                            >
                              Remixer
                            </Button> */}
                            <Button
                              size="sm"
                              className="text-gray-700"
                              variant="outline"
                              onClick={() => handleDuplicateCampaign(campaign)}
                            >
                              Dupliquer
                            </Button>
                            {campaign.status === 'ARCHIVED' ? (
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleRestoreCampaign(campaign.id, campaign.name)}
                              >
                                Désarchiver
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                className="text-gray-700"
                                variant="outline"
                                onClick={() => handleArchiveCampaign(campaign.id, campaign.name)}
                              >
                                Archiver
                              </Button>
                            )}

                           
                                {
                            ['DRAFT', 'SCHEDULED'].includes(campaign.status) && (
  <Button
    size="sm"
    variant="outline"
    className="text-green-400 border-green-400/30  hover:bg-green-400/10 hover:text-green-300"
    onClick={() => handleLaunchCampaign(campaign.id)}
    title="Lancer la campagne"
  >
    <Play className="h-3.5 w-3.5" />
  </Button>
)}
                            

                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteCampaign(campaign.id, campaign.name)}
                            >
                              Supprimer
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
    </div>
  );
}