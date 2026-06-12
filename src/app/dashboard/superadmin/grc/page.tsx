'use client';

import { useEffect, useState } from 'react';
import { DashboardTopbar } from '@/components/layout/topbar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Users, 
  Building2,
  Target,
  Activity,
  Bell
} from 'lucide-react';
import { apiService } from '@/app/services/api.service';
import { motion } from 'framer-motion';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Organization {
  id: string;
  name: string;
  riskScore: number;
  totalCampaigns: number;
  totalFormations: number;
  currentEmployees: number;
}

interface RiskMetrics {
  totalOrganizations: number;
  averageRiskScore: number;
  highRiskOrgs: number;
  mediumRiskOrgs: number;
  lowRiskOrgs: number;
  totalUsers: number;
  totalCampaigns: number;
  averageClickRate: number;
  averageOpenRate: number;
  totalClicks: number;
  totalOpens: number;
  totalTargets: number;
  campaignsByOrg: Record<string, number>; // Nombre de campagnes par organisation
}

interface UserAtRisk {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  position: string | null;
  organizationName: string;
  clickCount: number;
  openCount: number;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
}

interface RiskTrend {
  month: string;
  totalCampaigns: number;
  totalClicks: number;
  totalOpens: number;
  totalTargets: number;
  clickRate: number;
  openRate: number;
}

interface HighRiskAlert {
  id: string;
  type: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  message: string;
  entityId: string;
  entityType: string;
  createdAt: Date;
  isRead: boolean;
}

const COLORS = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#10b981',
};

export default function GrcPage() {
  const [metrics, setMetrics] = useState<RiskMetrics | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [usersAtRisk, setUsersAtRisk] = useState<UserAtRisk[]>([]);
  const [riskTrends, setRiskTrends] = useState<RiskTrend[]>([]);
  const [alerts, setAlerts] = useState<HighRiskAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadGRCData = async () => {
      setIsLoading(true);
      try {
        // Charger les métriques depuis le backend
        const metricsResponse = await apiService.get<{ success: boolean; data: RiskMetrics }>('/grc/metrics');
        if ('success' in metricsResponse && metricsResponse.success) {
          setMetrics(metricsResponse.data);
        }

        // Charger les organisations
        const orgsResponse = await apiService.get<Organization[] | { data: Organization[] }>('/organizations');
        const orgsData = Array.isArray(orgsResponse) ? orgsResponse : (orgsResponse as { data: Organization[] }).data;
        setOrganizations(Array.isArray(orgsData) ? orgsData : []);

        // Charger les utilisateurs à risque
        const usersResponse = await apiService.get<{ success: boolean; data: UserAtRisk[] }>('/grc/users-at-risk');
        if ('success' in usersResponse && usersResponse.success) {
          setUsersAtRisk(usersResponse.data);
        }

        // Charger les tendances temporelles
        const trendsResponse = await apiService.get<{ success: boolean; data: RiskTrend[] }>('/grc/risk-trends');
        if ('success' in trendsResponse && trendsResponse.success) {
          setRiskTrends(trendsResponse.data);
        }

        // Charger les alertes
        const alertsResponse = await apiService.get<{ success: boolean; data: HighRiskAlert[] }>('/grc/high-risk-alerts');
        if ('success' in alertsResponse && alertsResponse.success) {
          setAlerts(alertsResponse.data);
        }
        
      } catch (error) {
        console.error('Erreur lors du chargement des données GRC', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadGRCData();
  }, []);


  const getRiskColor = (score: number) => {
    if (score >= 70) return COLORS.high;
    if (score >= 30) return COLORS.medium;
    return COLORS.low;
  };

  const getRiskLabel = (score: number) => {
    if (score >= 70) return 'Élevé';
    if (score >= 30) return 'Moyen';
    return 'Faible';
  };

  const riskDistributionData = metrics ? [
    { name: 'Risque élevé', value: metrics.highRiskOrgs, color: COLORS.high },
    { name: 'Risque moyen', value: metrics.mediumRiskOrgs, color: COLORS.medium },
    { name: 'Risque faible', value: metrics.lowRiskOrgs, color: COLORS.low },
  ] : [];

  if (isLoading) {
    return (
      <>
        <DashboardTopbar title="GRC" description="Gouvernance, Risques et Conformité" />
        <div className="flex items-center justify-center h-96">
          <p className="text-slate-400">Chargement des données...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardTopbar title="GRC" description="Gouvernance, Risques et Conformité" />
      
      <div className="mx-auto px-4 py-6">
        {/* KPIs globaux */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl hover:bg-[#1a1f36] cursor-pointer transition-colors duration-200 border border-white/5 bg-[#0c1023] p-6 shadow-xl"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-sm bg-blue-500/20 p-3">
                <Building2 className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Organisations</p>
                <h2 className="text-2xl font-bold text-white">{metrics?.totalOrganizations || 0}</h2>
                <p className="text-xs text-zinc-500">Sous surveillance</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl hover:bg-[#1a1f36] cursor-pointer transition-colors duration-200 border border-white/5 bg-[#0c1023] p-6 shadow-xl"
          >
            <div className="flex items-center gap-4">
              <div 
                className="rounded-sm p-3"
                style={{ backgroundColor: `${getRiskColor(metrics?.averageRiskScore || 0)}20` }}
              >
                <Shield className="h-6 w-6" style={{ color: getRiskColor(metrics?.averageRiskScore || 0) }} />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Score de risque moyen</p>
                <h2 className="text-2xl font-bold text-white">{metrics?.averageRiskScore || 0}%</h2>
                <p className="text-xs text-zinc-500">{getRiskLabel(metrics?.averageRiskScore || 0)}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl hover:bg-[#1a1f36] cursor-pointer transition-colors duration-200 border border-white/5 bg-[#0c1023] p-6 shadow-xl"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-sm bg-red-500/20 p-3">
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Organisations à risque élevé</p>
                <h2 className="text-2xl font-bold text-white">{metrics?.highRiskOrgs || 0}</h2>
                <p className="text-xs text-zinc-500">Action requise</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl hover:bg-[#1a1f36] cursor-pointer transition-colors duration-200 border border-white/5 bg-[#0c1023] p-6 shadow-xl"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-sm bg-purple-500/20 p-3">
                <Target className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Campagnes réalisées</p>
                <h2 className="text-2xl font-bold text-white">{metrics?.totalCampaigns || 0}</h2>
                <p className="text-xs text-zinc-500">Tests de sensibilisation</p>
              </div>
            </div>
          </motion.div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-slate-900/50 gap-4 border border-slate-700/50 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 text-gray-100 hover:text-gray-400">
              <Activity className="w-4 h-4" />
              Vue d'ensemble
            </TabsTrigger>
            <TabsTrigger value="organizations" className="data-[state=active]:bg-purple-600 text-gray-100 hover:text-gray-400">
              <Building2 className="w-4 h-4" />
              Organisations
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-orange-600 text-gray-100 hover:text-gray-400">
              <Users className="w-4 h-4" />
              Utilisateurs à risque
            </TabsTrigger>
            <TabsTrigger value="compliance" className="data-[state=active]:bg-green-600 text-gray-100 hover:text-gray-400">
              <CheckCircle className="w-4 h-4" />
              Conformité
            </TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            {/* Alertes à risque élevé */}
            {alerts.length > 0 && (
              <Card className="rounded-md border border-red-500/30 bg-[#0c1023]/90 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Bell className="w-5 h-5 text-red-400" />
                    Alertes critiques ({alerts.filter(a => a.severity === 'HIGH').length})
                  </CardTitle>
                  <CardDescription>Actions urgentes requises</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {alerts.slice(0, 10).map((alert, idx) => (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`p-3 rounded-lg border ${
                          alert.severity === 'HIGH' 
                            ? 'bg-red-500/10 border-red-500/30' 
                            : 'bg-orange-500/10 border-orange-500/30'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <AlertTriangle 
                            className={`w-5 h-5 mt-0.5 ${
                              alert.severity === 'HIGH' ? 'text-red-400' : 'text-orange-400'
                            }`} 
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-white">{alert.title}</p>
                            <p className="text-xs text-slate-400 mt-1">{alert.message}</p>
                          </div>
                          <span 
                            className={`text-xs px-2 py-1 rounded-full ${
                              alert.severity === 'HIGH' 
                                ? 'bg-red-500/20 text-red-400' 
                                : 'bg-orange-500/20 text-orange-400'
                            }`}
                          >
                            {alert.severity}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Tendances temporelles */}
              {riskTrends.length > 0 && (
                <Card className="rounded-md border border-white/10 bg-[#0c1023]/90 shadow-xl lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-white">Évolution des risques (6 derniers mois)</CardTitle>
                    <CardDescription>Tendances des taux d'ouverture et de clic</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={riskTrends}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis 
                          dataKey="month" 
                          stroke="#94a3b8"
                          tick={{ fill: '#94a3b8' }}
                        />
                        <YAxis 
                          stroke="#94a3b8"
                          tick={{ fill: '#94a3b8' }}
                          label={{ value: 'Taux (%)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1e293b',
                            border: '1px solid #334155',
                            borderRadius: '8px',
                            color: '#fff',
                          }}
                          formatter={(value) => `${value}%`}
                        />
                        <Legend 
                          wrapperStyle={{ color: '#94a3b8' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="clickRate" 
                          stroke="#ef4444" 
                          strokeWidth={2}
                          name="Taux de clic"
                          dot={{ fill: '#ef4444', r: 4 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="openRate" 
                          stroke="#3b82f6" 
                          strokeWidth={2}
                          name="Taux d'ouverture"
                          dot={{ fill: '#3b82f6', r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}

              {/* Distribution des risques */}
              <Card className="rounded-md border border-white/10 bg-[#0c1023]/90 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white">Distribution des risques</CardTitle>
                  <CardDescription>Répartition des organisations par niveau de risque</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={riskDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${entry.value}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {riskDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1e293b',
                          border: '1px solid #334155',
                          borderRadius: '8px',
                          color: '#fff',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Top organisations à risque */}
              <Card className="rounded-md border border-white/10 bg-[#0c1023]/90 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white">Top organisations à risque</CardTitle>
                  <CardDescription>Organisations avec les scores de risque les plus élevés</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {organizations
                      .sort((a, b) => b.riskScore - a.riskScore)
                      .slice(0, 5)
                      .map((org, index) => (
                        <motion.div
                          key={org.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50"
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-2xl font-bold text-slate-500">#{index + 1}</div>
                            <div>
                              <p className="text-sm font-medium text-white">{org.name}</p>
                              <p className="text-xs text-slate-400">
                                {org.currentEmployees} employés • {metrics?.campaignsByOrg?.[org.id] || 0} campagnes
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div 
                              className="text-2xl font-bold"
                              style={{ color: getRiskColor(org.riskScore) }}
                            >
                              {org.riskScore}%
                            </div>
                            <p className="text-xs text-slate-500">{getRiskLabel(org.riskScore)}</p>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Organisations */}
          <TabsContent value="organizations" className="space-y-6">
            <Card className="rounded-md border border-white/10 bg-[#0c1023]/90 shadow-xl">
              <CardHeader>
                <CardTitle className="text-white">Toutes les organisations</CardTitle>
                <CardDescription>Score de risque et métriques par organisation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">Organisation</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-slate-300">Score de risque</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-slate-300">Employés</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-slate-300">Campagnes</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-slate-300">Formations</th>
                      </tr>
                    </thead>
                    <tbody>
                      {organizations.map((org, index) => (
                        <motion.tr
                          key={org.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                        >
                          <td className="py-3 px-4">
                            <p className="text-sm font-medium text-white">{org.name}</p>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <div 
                                className="text-lg font-bold"
                                style={{ color: getRiskColor(org.riskScore) }}
                              >
                                {org.riskScore}%
                              </div>
                              <span 
                                className="text-xs px-2 py-1 rounded-full"
                                style={{ 
                                  backgroundColor: `${getRiskColor(org.riskScore)}20`,
                                  color: getRiskColor(org.riskScore)
                                }}
                              >
                                {getRiskLabel(org.riskScore)}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center text-white">{org.currentEmployees}</td>
                          <td className="py-3 px-4 text-center text-white">{metrics?.campaignsByOrg?.[org.id] || 0}</td>
                          <td className="py-3 px-4 text-center text-white">{org.totalFormations}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Utilisateurs à risque */}
          <TabsContent value="users" className="space-y-6">
            <Card className="rounded-md border border-white/10 bg-[#0c1023]/90 shadow-xl">
              <CardHeader>
                <CardTitle className="text-white">Utilisateurs à risque</CardTitle>
                <CardDescription>Utilisateurs ayant interagi avec les campagnes de phishing</CardDescription>
              </CardHeader>
              <CardContent>
                {usersAtRisk.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                    <p className="text-slate-400">Aucun utilisateur à risque identifié pour le moment.</p>
                    <p className="text-xs text-slate-500 mt-2">
                      Les données seront disponibles après l'exécution de campagnes de sensibilisation.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-700">
                          <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">Utilisateur</th>
                          <th className="text-center py-3 px-4 text-sm font-medium text-slate-300">Poste</th>
                          <th className="text-center py-3 px-4 text-sm font-medium text-slate-300">Organisation</th>
                          <th className="text-center py-3 px-4 text-sm font-medium text-slate-300">Clics</th>
                          <th className="text-center py-3 px-4 text-sm font-medium text-slate-300">Ouvertures</th>
                          <th className="text-center py-3 px-4 text-sm font-medium text-slate-300">Niveau de risque</th>
                        </tr>
                      </thead>
                      <tbody>
                        {usersAtRisk.map((user) => (
                          <motion.tr 
                            key={user.id} 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                          >
                            <td className="py-3 px-4">
                              <p className="text-sm font-medium text-white">
                                {user.firstName} {user.lastName}
                              </p>
                              <p className="text-xs text-slate-400">{user.email}</p>
                            </td>
                            <td className="py-3 px-4 text-center text-slate-300 text-sm">
                              {user.position || 'N/A'}
                            </td>
                            <td className="py-3 px-4 text-center text-white text-sm">{user.organizationName}</td>
                            <td className="py-3 px-4 text-center">
                              <span className="text-lg font-bold text-red-400">{user.clickCount}</span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className="text-lg font-bold text-blue-400">{user.openCount}</span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                                user.riskLevel === 'HIGH' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                user.riskLevel === 'MEDIUM' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                                'bg-green-500/20 text-green-400 border border-green-500/30'
                              }`}>
                                {user.riskLevel === 'HIGH' ? 'Élevé' : user.riskLevel === 'MEDIUM' ? 'Moyen' : 'Faible'}
                              </span>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Conformité */}
          <TabsContent value="compliance" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="rounded-md border border-white/10 bg-[#0c1023]/90 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white">Formations complétées</CardTitle>
                  <CardDescription>Taux de complétion des formations de sensibilisation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <div className="text-6xl font-bold text-blue-400 mb-2">
                      {metrics?.totalOrganizations ? 
                        Math.round((organizations.reduce((sum, org) => sum + org.totalFormations, 0) / (metrics.totalUsers || 1)) * 100) 
                        : 0}%
                    </div>
                    <p className="text-slate-400">Taux de complétion moyen</p>
                    <p className="text-xs text-slate-500 mt-2">
                      Basé sur {organizations.reduce((sum, org) => sum + org.totalFormations, 0)} formations complétées
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-md border border-white/10 bg-[#0c1023]/90 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white">Recommandations</CardTitle>
                  <CardDescription>Actions prioritaires à entreprendre</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {metrics && metrics.highRiskOrgs > 0 && (
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                        <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-white">Organisations à risque élevé</p>
                          <p className="text-xs text-slate-400 mt-1">
                            {metrics.highRiskOrgs} organisation(s) nécessite(nt) une attention immédiate
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <Target className="w-5 h-5 text-blue-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-white">Lancer de nouvelles campagnes</p>
                        <p className="text-xs text-slate-400 mt-1">
                          Testez régulièrement la vigilance de vos employés
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-white">Former les utilisateurs</p>
                        <p className="text-xs text-slate-400 mt-1">
                          Planifiez des sessions de sensibilisation à la cybersécurité
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
