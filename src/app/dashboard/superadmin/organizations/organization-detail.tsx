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
    if (score >= 70) return 'Élevé';
    if (score >= 30) return 'Moyen';
    return 'Faible';
  };

  if (isLoading) {
    return (
      <>
        <DashboardTopbar
          title="Chargement..."
          description="Vue détaillée de l'organisation"
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
          title="Organisation non trouvée"
          description="Vue détaillée de l'organisation"
        />
        {
          !isNotSuperAdmin &&  <div className="min-h-screen bg-gray-50 dark:bg-[#050816] p-6">
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-slate-400">Organisation non trouvée</p>
            <Button onClick={() => navigate({ to: '/dashboard/organizations' })} className="mt-4 hover:text-gray-100 text-gray-900 dark:text-white">
              Retour aux organisations
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
    { name: 'En cours', value: campaignStats.inProgress, color: '#f59e0b' },
    { name: 'Brouillons', value: campaignStats.draft, color: '#6b7280' },
  ];

  return (
    <>
      <DashboardTopbar
        title={`${organization.name}`}
        description="Vue détaillée de l'organisation et de ses métriques"
      />
      <div className="min-h-screen bg-gray-50 dark:bg-[#050816] p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        {
          !isNotSuperAdmin &&  <Button
          variant="ghost"
          onClick={() => navigate({ to: '/dashboard/organizations' })}
          className="text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-gray-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux organisations
        </Button>
        }
       
        <div className="h-6 w-px bg-gray-300 dark:bg-slate-700" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{organization.name}</h1>
          <p className="text-gray-500 dark:text-slate-400">
            {organization.city}{organization.country ? `, ${organization.country}` : ''} • {organization.sector}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Badge 
            className={organization.isActive ? 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400'}
          >
            {organization.isActive ? 'Actif' : 'Inactif'}
          </Badge>
          <Badge className="bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400">
            {organization.plan.label}
          </Badge>
          <Badge className={getRiskColor(organization.riskScore)}>
            Risque {getRiskLabel(organization.riskScore)} ({organization.riskScore}%)
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
              <p className="text-sm text-gray-500 dark:text-zinc-400">Employés</p>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{employeeStats.total}</h2>
              <p className="text-xs text-gray-400 dark:text-zinc-500">{employeeStats.active} actifs</p>
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
              <p className="text-sm text-gray-500 dark:text-zinc-400">Campagnes</p>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{campaignStats.total}</h2>
              <p className="text-xs text-gray-400 dark:text-zinc-500">{campaignStats.completed} complétées</p>
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
              <p className="text-sm text-gray-500 dark:text-zinc-400">Taux de clic</p>
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
              <p className="text-sm text-gray-500 dark:text-zinc-400">Score de risque</p>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{organization.riskScore}%</h2>
              <p className="text-xs text-gray-400 dark:text-zinc-500">{getRiskLabel(organization.riskScore)}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tabs de détails */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-gray-100 dark:bg-slate-900/50 gap-4 border border-gray-200 dark:border-slate-700/50 p-1">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-700 dark:text-gray-100 hover:text-gray-900 dark:hover:text-gray-400">
            <Activity className="w-4 h-4" />
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="employees" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-700 dark:text-gray-100 hover:text-gray-900 dark:hover:text-gray-400">
            <Users className="w-4 h-4" />
            Employés
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white text-gray-700 dark:text-gray-100 hover:text-gray-900 dark:hover:text-gray-400">
            <Target className="w-4 h-4" />
            Campagnes
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-700 dark:text-gray-100 hover:text-gray-900 dark:hover:text-gray-400">
            <Shield className="w-4 h-4" />
            Sécurité
          </TabsTrigger>
        </TabsList>

        {/* Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Informations de base */}
            <Card className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1023]/90">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Informations générales</CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">Détails de l'organisation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-slate-400">Type d'organisation</p>
                  <p className="text-gray-900 dark:text-white capitalize">{organization.type === 'enterprise' ? 'Entreprise' : 'Campus'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-slate-400">Plan d'abonnement</p>
                  <p className="text-gray-900 dark:text-white">{organization.plan.label} - {organization.plan.pricePerUser.toLocaleString()} FCFA/utilisateur/mois</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-slate-400">Administrateur</p>
                  <p className="text-gray-900 dark:text-white">{organization.adminName}</p>
                  <p className="text-sm text-gray-500 dark:text-slate-400">{organization.adminEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-slate-400">Date de création</p>
                  <p className="text-gray-900 dark:text-white">{new Date(organization.createdAt).toLocaleDateString('fr-FR')}</p>
                </div>
              </CardContent>
            </Card>

            {/* Répartition des campagnes */}
            <Card className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1023]/90">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Statut des campagnes</CardTitle>
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
                    <p className="text-gray-500 dark:text-slate-400">Aucune campagne pour le moment</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Employés - Tableau des groupes */}
        <TabsContent value="employees" className="space-y-6">
          <div className="grid gap-6">
            {/* Statistiques générales des employés */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1023]/90">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-500/20">
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
                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-500/20">
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
                    <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-500/20">
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
                  <CardTitle className="text-gray-900 dark:text-white">Employés par groupe</CardTitle>
                  <CardDescription className="text-gray-500 dark:text-gray-400">Répartition des {employeeStats.total} employés</CardDescription>
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
                      <p className="text-gray-500 dark:text-slate-400">Aucun groupe d'employés défini</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Liste des groupes */}
            <Card className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1023]/90">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Groupes ({organization.groups.length})</CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">Liste des groupes de cette organisation</CardDescription>
              </CardHeader>
              <CardContent>
                {organization.groups.length > 0 ? (
                  <div className="space-y-4">
                    {organization.groups.map((group) => {
                      const groupUsers = organization.users.filter(user => user.groupId === group.id);
                      
                      return (
                        <div key={group.id} className="p-4 rounded-lg bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/50">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white">{group.name}</h4>
                              <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">{group.description}</p>
                            </div>
                            <span className="text-xs bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-full">
                              {groupUsers.length} employé(s)
                            </span>
                          </div>
                          
                          {groupUsers.length > 0 ? (
                            <div className="space-y-2">
                              <h5 className="text-xs font-medium text-gray-600 dark:text-slate-300 mb-2">Membres :</h5>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {groupUsers.map((user) => (
                                  <div key={user.id} className="flex items-center gap-2 p-2 rounded bg-gray-200 dark:bg-slate-700/30">
                                    <div className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
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
                            <p className="text-xs text-gray-500 dark:text-slate-500 italic">Aucun membre dans ce groupe</p>
                          )}
                        </div>
                      );
                    })}
                    
                    {/* Utilisateurs sans groupe */}
                    {(() => {
                      const usersWithoutGroup = organization.users.filter(user => !user.groupId);
                      return usersWithoutGroup.length > 0 ? (
                        <div className="p-4 rounded-lg bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/50 border-dashed">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="text-sm font-medium text-gray-600 dark:text-slate-300">Sans groupe</h4>
                              <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">Employés non assignés à un groupe</p>
                            </div>
                            <span className="text-xs bg-gray-100 dark:bg-gray-500/20 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full">
                              {usersWithoutGroup.length} employé(s)
                            </span>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {usersWithoutGroup.map((user) => (
                                <div key={user.id} className="flex items-center gap-2 p-2 rounded bg-gray-200 dark:bg-slate-700/30">
                                  <div className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
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
                    <p className="text-gray-500 dark:text-slate-400">Aucun groupe créé</p>
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
              <CardTitle className="text-gray-900 dark:text-white">Campagnes récentes</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">Dernières campagnes de sensibilisation</CardDescription>
            </CardHeader>
            <CardContent>
              {recentCampaigns.length > 0 ? (
                <div className="space-y-3">
                  {recentCampaigns.map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/50">
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
                         campaign.status === 'IN_PROGRESS' ? 'En cours' : 'Brouillon'}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Target className="w-12 h-12 text-gray-400 dark:text-slate-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-slate-400">Aucune campagne pour cette organisation</p>
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
                <CardTitle className="text-gray-900 dark:text-white">Métriques de sécurité</CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">Performance lors des tests de phishing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
                    <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{securityStats.totalTargets}</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">Emails envoyés</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
                    <Activity className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{securityStats.openRate}%</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">Taux d'ouverture</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
                    <MousePointer className="w-8 h-8 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{securityStats.clickRate}%</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">Taux de clic</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
                    <Shield 
                      className="w-8 h-8 mx-auto mb-2" 
                      style={{ color: organization.riskScore >= 70 ? '#ef4444' : organization.riskScore >= 30 ? '#f59e0b' : '#10b981' }}
                    />
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{organization.riskScore}%</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">Score de risque</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommandations */}
            <Card className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1023]/90">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Recommandations</CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">Actions pour améliorer la sécurité</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {securityStats.clickRate > 30 && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Taux de clic élevé</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                        Plus de 30% des employés cliquent sur les liens suspects
                      </p>
                    </div>
                  </div>
                )}
                
                {organization.totalFormations < employeeStats.total && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20">
                    <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Formations insuffisantes</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                        Certains employés n'ont pas suivi de formation
                      </p>
                    </div>
                  </div>
                )}

                {organization.riskScore < 30 && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Bon niveau de sécurité</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                        Continue les bonnes pratiques de sensibilisation
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