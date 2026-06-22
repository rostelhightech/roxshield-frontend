'use client';

import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Route } from '@/routes/_authenticated/dashboard/organizations/$organizationId';
import { 
  ArrowLeft, 
  Building2, 
  Users, 
  Target, 
  Shield, 
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Mail,
  MousePointer
} from 'lucide-react';
import { DashboardTopbar } from "@/components/layout/topbar";
 import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiService } from '@/app/services/api.service';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuthStore } from '@/store/auth.store';
import { roleEnum } from '@/constants/roleEnum';
import { useTranslation } from 'react-i18next';

interface OrganizationDetails {
  organization: {
    id: string;
    name: string;
    sector: string;
    city: string;
    country: string;
    type: 'enterprise' | 'campus';
    isActive: boolean;
    currentEmployees: number;
    totalFormations: number;
    totalCampaigns: number;
    riskScore: number;
    adminName: string;
    adminEmail: string;
    createdAt: string;
    plan: {
      name: string;
      label: string;
      pricePerUser: number;
    };
    users: Array<{
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      position: string;
      isActive: boolean;
      groupId: string;
    }>;
    groups: Array<{
      id: string;
      name: string;
      description: string;
    }>;
  };
  campaignStats: {
    total: number;
    completed: number;
    inProgress: number;
    draft: number;
  };
  employeeStats: {
    total: number;
    active: number;
    inactive: number;
    byGroup: Record<string, number>;
  };
  securityStats: {
    totalTargets: number;
    totalClicks: number;
    totalOpens: number;
    clickRate: number;
    openRate: number;
    riskScore: number;
  };
  recentCampaigns: Array<{
    id: string;
    name: string;
    status: string;
    createdAt: string;
  }>;
}

export function OrganizationDetailPage() {
  const { t: tCommon } = useTranslation('common');
  const params = Route.useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState<OrganizationDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const {user} = useAuthStore()
  const isNotSuperAdmin = user?.role !== roleEnum.SUPERADMIN

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const response = await apiService.get<{ success: boolean; data: OrganizationDetails }>(`/dashboard/organizations/${params.organizationId}`);
        if ('success' in response && response.success) {
          setDetails(response.data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des détails:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.organizationId) {
      loadDetails();
    }
  }, [params.organizationId]);

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-500/10';
    if (score >= 30) return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-500/10';
    return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-500/10';
  };

  const getRiskLabel = (score: number) => {
    if (score >= 70) return tCommon('common.eleve');
    if (score >= 30) return tCommon('common.moyen');
    return tCommon('common.faible');
  };

  if (isLoading) {
    return (
      <>
        <DashboardTopbar
          title={tCommon('admin.page_overview.risk_by_dept_loading')}
          description={tCommon('admin.organizations.detail_desc')}
        />
        <div className="min-h-screen bg-gray-50 dark:bg-[#050816] p-6">
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
          </div>
        </div>
      </>
    );
  }

  if (!details) {
    return (
      <>
        <DashboardTopbar
          title={tCommon('admin.organizations.not_found')}
          description={tCommon('admin.organizations.detail_desc')}
        />
        {
          !isNotSuperAdmin &&  <div className="min-h-screen bg-gray-50 dark:bg-[#050816] p-6">
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-slate-400">{tCommon('admin.organizations.not_found')}</p>
            <Button onClick={() => navigate({ to: '/dashboard/organizations' })} className="mt-4 hover:text-gray-100 text-gray-900 dark:text-white">
              {tCommon('admin.organizations.back')}
            </Button>
          </div>
        </div>
        }
       
      </>
    );
  }

  const { organization, campaignStats, employeeStats, securityStats, recentCampaigns } = details;

  // Données pour les graphiques
  const employeeByGroupData = Object.entries(employeeStats.byGroup).map(([name, count]) => ({
    name,
    count,
  }));

  const campaignStatusData = [
    { name: 'Complétées', value: campaignStats.completed, color: '#10b981' },
    { name: tCommon('user.formations.in_progress_status'), value: campaignStats.inProgress, color: '#f59e0b' },
    { name: 'Brouillons', value: campaignStats.draft, color: '#6b7280' },
  ];

  return (
    <>
      <DashboardTopbar
        title={`${organization.name}`}
        description={tCommon('nav.topbar.organizations_desc_admin')}
      />
      <div className="min-h-screen bg-gray-50 dark:bg-[#050816] p-2 md:p-6">
      {/* Header */}
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
  <div className="flex items-center gap-4 min-w-0">
    {!isNotSuperAdmin && (
      <Button
        variant="ghost"
        onClick={() => navigate({ to: '/dashboard/organizations' })}
        className="text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-gray-700 shrink-0"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        <span className="hidden sm:inline">{tCommon('admin.organizations.back')}</span>
      </Button>
    )}

    <div className="h-6 w-px bg-gray-300 dark:bg-slate-700 shrink-0 hidden sm:block" />

    <div className="min-w-0">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white break-words">
        {organization.name}
      </h1>
      <p className="text-sm sm:text-base text-gray-500 dark:text-slate-400 break-words">
        {organization.city}{organization.country ? `, ${organization.country}` : ''} • {organization.sector}
      </p>
    </div>
  </div>

  <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:ml-auto">
    <Badge
      className={organization.isActive ? 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400'}
    >
      {organization.isActive ? tCommon('common.active') : tCommon('common.inactive')}
    </Badge>
    <Badge className="bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400">
      {organization.plan.label}
    </Badge>
    <Badge className={getRiskColor(organization.riskScore)}>
      {tCommon('common.risk')} {getRiskLabel(organization.riskScore)} ({organization.riskScore}%)
    </Badge>
  </div>
</div>

      {/* KPIs rapides */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1023] p-6"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-sm bg-blue-100 dark:bg-blue-500/20 p-3">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-zinc-400">{tCommon('admin.grc.org_employees')}</p>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{employeeStats.total}</h2>
              <p className="text-xs text-gray-400 dark:text-zinc-500">{employeeStats.active} {tCommon('common.active')}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1023] p-6"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-sm bg-purple-100 dark:bg-purple-500/20 p-3">
              <Target className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-zinc-400">{tCommon('nav.topbar.campaigns_title')}</p>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{campaignStats.total}</h2>
              <p className="text-xs text-gray-400 dark:text-zinc-500">{tCommon('admin.organizations.completed_count', { count: campaignStats.completed })}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1023] p-6"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-sm bg-orange-100 dark:bg-orange-500/20 p-3">
              <MousePointer className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-zinc-400">{tCommon('admin.page_overview.phishing_click_rate')}</p>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{securityStats.clickRate}%</h2>
              <p className="text-xs text-gray-400 dark:text-zinc-500">{securityStats.totalClicks} clics</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1023] p-6"
        >
          <div className="flex items-center gap-4">
            <div 
              className="rounded-sm p-3"
              style={{ backgroundColor: `${organization.riskScore >= 70 ? '#ef4444' : organization.riskScore >= 30 ? '#f59e0b' : '#10b981'}20` }}
            >
              <Shield className="h-6 w-6" style={{ color: organization.riskScore >= 70 ? '#ef4444' : organization.riskScore >= 30 ? '#f59e0b' : '#10b981' }} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-zinc-400">{tCommon('admin.organizations.risk_score')}</p>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{organization.riskScore}%</h2>
              <p className="text-xs text-gray-400 dark:text-zinc-500">{getRiskLabel(organization.riskScore)}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tabs de détails */}
      <Tabs defaultValue="overview" className="space-y-6">
    <div className="w-full overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
  <TabsList className="flex w-max sm:w-full gap-2 sm:gap-4 bg-gray-100 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700/50 p-1">
    <TabsTrigger
      value="overview"
      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-700 dark:text-gray-100 hover:text-gray-900 dark:hover:text-gray-400 whitespace-nowrap text-sm sm:text-base"
    >
      <Activity className="w-4 h-4 mr-1.5 sm:mr-2" />
      {tCommon('admin.organizations.tab_overview')}
    </TabsTrigger>
    <TabsTrigger
      value="employees"
      className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-700 dark:text-gray-100 hover:text-gray-900 dark:hover:text-gray-400 whitespace-nowrap text-sm sm:text-base"
    >
      <Users className="w-4 h-4 mr-1.5 sm:mr-2" />
      {tCommon('admin.grc.org_employees')}
    </TabsTrigger>
    <TabsTrigger
      value="campaigns"
      className="data-[state=active]:bg-orange-600 data-[state=active]:text-white text-gray-700 dark:text-gray-100 hover:text-gray-900 dark:hover:text-gray-400 whitespace-nowrap text-sm sm:text-base"
    >
      <Target className="w-4 h-4 mr-1.5 sm:mr-2" />
      {tCommon('admin.organizations.tab_campaigns')}
    </TabsTrigger>
    <TabsTrigger
      value="security"
      className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-700 dark:text-gray-100 hover:text-gray-900 dark:hover:text-gray-400 whitespace-nowrap text-sm sm:text-base"
    >
      <Shield className="w-4 h-4 mr-1.5 sm:mr-2" />
      {tCommon('admin.organizations.security')}
    </TabsTrigger>
  </TabsList>
</div>
 
        {/* Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Informations de base */}
            <Card className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1023]/90">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">{tCommon('admin.campaigns.form_general_title')}</CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">{tCommon('admin.organizations.org_details')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-slate-400">{tCommon('admin.organizations.org_type')}</p>
                  <p className="text-gray-900 dark:text-white capitalize">{organization.type === 'enterprise' ? tCommon('admin.organizations.org_type_enterprise') : tCommon('admin.organizations.org_type_campus')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-slate-400">{tCommon('admin.organizations.subscription_plan')}</p>
                  <p className="text-gray-900 dark:text-white">{organization.plan.label} - {organization.plan.pricePerUser.toLocaleString()} {tCommon('admin.organizations.price_per_user_month')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-slate-400">{tCommon('admin.organizations.administrator')}</p>
                  <p className="text-gray-900 dark:text-white">{organization.adminName}</p>
                  <p className="text-sm text-gray-500 dark:text-slate-400">{organization.adminEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-slate-400">{tCommon('admin.organizations.created_date')}</p>
                  <p className="text-gray-900 dark:text-white">{new Date(organization.createdAt).toLocaleDateString('fr-FR')}</p>
                </div>
              </CardContent>
            </Card>

            {/* Répartition des campagnes */}
            <Card className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1023]/90">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">{tCommon('admin.organizations.campaigns_status')}</CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">Répartition par statut</CardDescription>
              </CardHeader>
              <CardContent>
                {campaignStats.total > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={campaignStatusData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={(entry) => `${entry.name}: ${entry.value}`}
                      >
                        {campaignStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          color: '#111827',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-8">
                    <Target className="w-12 h-12 text-gray-400 dark:text-slate-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-slate-400">{tCommon('admin.organizations.no_campaigns')}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Employés - Tableau des groupes */}
        <TabsContent value="employees" className="space-y-6">
          <div className="grid gap-6">
             <div className="grid gap-4 md:grid-cols-3">
              <Card className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1023]/90">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-sm bg-blue-100 dark:bg-blue-500/20">
                      <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-slate-400">Total</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{employeeStats.total}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1023]/90">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-sm bg-green-100 dark:bg-green-500/20">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-slate-400">Actifs</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{employeeStats.active}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1023]/90">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-sm bg-gray-100 dark:bg-gray-500/20">
                      <Users className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-slate-400">Groupes</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{organization.groups.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Répartition par groupe */}
              <Card className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1023]/90">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">{tCommon('admin.organizations.employees_by_group')}</CardTitle>
                  <CardDescription className="text-gray-500 dark:text-gray-400">{tCommon('admin.organizations.employees_distribution', { count: employeeStats.total })}</CardDescription>
                </CardHeader>
                <CardContent>
                  {employeeByGroupData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={employeeByGroupData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb dark:stroke-#334155" />
                        <XAxis dataKey="name" stroke="#6b7280 dark:stroke-#94a3b8" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            color: '#111827',
                          }}
                        />
                        <Bar dataKey="count" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-gray-400 dark:text-slate-600 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-slate-400">{tCommon('admin.organizations.no_employee_groups')}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Liste des groupes */}
        <Card className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1023]/90">
  <CardHeader>
    <CardTitle className="text-gray-900 dark:text-white">Groupes ({organization.groups.length})</CardTitle>
    <CardDescription className="text-gray-500 dark:text-gray-400">{tCommon('admin.organizations.groups_list')}</CardDescription>
  </CardHeader>
  <CardContent>
    {organization.groups.length > 0 ? (
      <div className="space-y-4">
        {organization.groups.map((group) => {
          const groupUsers = organization.users.filter(user => user.groupId === group.id);

          return (
            <div key={group.id} className="p-4 rounded-sm bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                <div className="min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white break-words">{group.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 break-words">{group.description}</p>
                </div>
                <span className="text-xs bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-full shrink-0 self-start sm:self-auto">
                  {tCommon('admin.organizations.employees_count', { count: groupUsers.length })}
                </span>
              </div>

              {groupUsers.length > 0 ? (
                <div className="space-y-2">
                  <h5 className="text-xs font-medium text-gray-600 dark:text-slate-300 mb-2">{tCommon('admin.groups.table_members')} :</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {groupUsers.map((user) => (
                      <div key={user.id} className="flex items-center gap-2 p-2 rounded bg-gray-200 dark:bg-slate-700/30">
                        <div className={`w-2 h-2 rounded-full shrink-0 ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-slate-400 truncate">{user.email}</p>
                          {user.position && (
                            <p className="text-xs text-gray-400 dark:text-slate-500 truncate">{user.position}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-500 dark:text-slate-500 italic">{tCommon('admin.organizations.no_members')}</p>
              )}
            </div>
          );
        })}

        {/* Utilisateurs sans groupe */}
        {(() => {
          const usersWithoutGroup = organization.users.filter(user => !user.groupId);
          return usersWithoutGroup.length > 0 ? (
            <div className="p-4 rounded-sm bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/50 border-dashed">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                <div className="min-w-0">
                  <h4 className="text-sm font-medium text-gray-600 dark:text-slate-300 break-words">{tCommon('admin.organizations.no_group')}</h4>
                  <p className="text-xs text-gray-500 dark:text-slate-500 mt-1 break-words">{tCommon('admin.organizations.no_group_desc')}</p>
                </div>
                <span className="text-xs bg-gray-100 dark:bg-gray-500/20 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full shrink-0 self-start sm:self-auto">
                  {tCommon('admin.organizations.employees_count', { count: usersWithoutGroup.length })}
                </span>
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {usersWithoutGroup.map((user) => (
                    <div key={user.id} className="flex items-center gap-2 p-2 rounded bg-gray-200 dark:bg-slate-700/30">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-slate-400 truncate">{user.email}</p>
                        {user.position && (
                          <p className="text-xs text-gray-400 dark:text-slate-500 truncate">{user.position}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null;
        })()}
      </div>
    ) : (
      <div className="text-center py-8">
        <Building2 className="w-12 h-12 text-gray-400 dark:text-slate-600 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-slate-400">{tCommon('admin.organizations.no_groups')}</p>
      </div>
    )}
  </CardContent>
</Card>
          </div>
        </TabsContent>

        {/* Campagnes */}
        <TabsContent value="campaigns" className="space-y-6">
          <Card className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1023]/90">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">{tCommon('admin.campaigns.page_recent')}</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">{tCommon('admin.organizations.recent_campaigns_desc')}</CardDescription>
            </CardHeader>
            <CardContent>
              {recentCampaigns.length > 0 ? (
                <div className="space-y-3">
                  {recentCampaigns.map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between p-4 rounded-sm bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/50">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">{campaign.name}</h4>
                        <p className="text-xs text-gray-500 dark:text-slate-400">
                          Créée le {new Date(campaign.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <Badge className={
                        campaign.status === 'COMPLETED' ? 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400' :
                        campaign.status === 'IN_PROGRESS' ? 'bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400' :
                        'bg-gray-100 dark:bg-gray-500/10 text-gray-600 dark:text-gray-400'
                      }>
                        {campaign.status === 'COMPLETED' ? 'Complétée' :
                         campaign.status === 'IN_PROGRESS' ? tCommon('user.formations.in_progress_status') : 'Brouillon'}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Target className="w-12 h-12 text-gray-400 dark:text-slate-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-slate-400">{tCommon('admin.organizations.no_campaigns_org')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sécurité */}
        <TabsContent value="security" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Métriques de sécurité */}
            <Card className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1023]/90">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">{tCommon('admin.organizations.security_metrics')}</CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">{tCommon('admin.organizations.security_metrics_desc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 dark:bg-slate-800/50 rounded-sm">
                    <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{securityStats.totalTargets}</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">{tCommon('admin.organizations.emails_sent')}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-slate-800/50 rounded-sm">
                    <Activity className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{securityStats.openRate}%</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">{tCommon('admin.organizations.open_rate')}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-slate-800/50 rounded-sm">
                    <MousePointer className="w-8 h-8 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{securityStats.clickRate}%</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">{tCommon('admin.page_overview.phishing_click_rate')}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-slate-800/50 rounded-sm">
                    <Shield 
                      className="w-8 h-8 mx-auto mb-2" 
                      style={{ color: organization.riskScore >= 70 ? '#ef4444' : organization.riskScore >= 30 ? '#f59e0b' : '#10b981' }}
                    />
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{organization.riskScore}%</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">{tCommon('admin.organizations.risk_score')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommandations */}
            <Card className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1023]/90">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">{tCommon('admin.grc.recommendations')}</CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">{tCommon('admin.organizations.security_actions')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {securityStats.clickRate > 30 && (
                  <div className="flex items-start gap-3 p-3 rounded-sm bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{tCommon('admin.organizations.high_click_rate')}</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                        {tCommon('admin.organizations.high_click_rate_desc')}
                      </p>
                    </div>
                  </div>
                )}
                
                {organization.totalFormations < employeeStats.total && (
                  <div className="flex items-start gap-3 p-3 rounded-sm bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20">
                    <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{tCommon('admin.organizations.insufficient_trainings')}</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                        {tCommon('admin.organizations.insufficient_trainings_desc')}
                      </p>
                    </div>
                  </div>
                )}

                {organization.riskScore < 30 && (
                  <div className="flex items-start gap-3 p-3 rounded-sm bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{tCommon('admin.organizations.good_security')}</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                        {tCommon('admin.organizations.good_security_desc')}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
    </>
  );
}