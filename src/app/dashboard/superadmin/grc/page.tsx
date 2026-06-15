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
  campaignsByOrg: Record<string, number>;
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
        const metricsResponse = await apiService.get<{ success: boolean; data: RiskMetrics }>('/grc/metrics');
        if ('success' in metricsResponse && metricsResponse.success) {
          setMetrics(metricsResponse.data);
        }

        const orgsResponse = await apiService.get<Organization[] | { data: Organization[] }>('/organizations');
        const orgsData = Array.isArray(orgsResponse) ? orgsResponse : (orgsResponse as { data: Organization[] }).data;
        setOrganizations(Array.isArray(orgsData) ? orgsData : []);

        const usersResponse = await apiService.get<{ success: boolean; data: UserAtRisk[] }>('/grc/users-at-risk');
        if ('success' in usersResponse && usersResponse.success) {
          setUsersAtRisk(usersResponse.data);
        }

        const trendsResponse = await apiService.get<{ success: boolean; data: RiskTrend[] }>('/grc/risk-trends');
        if ('success' in trendsResponse && trendsResponse.success) {
          setRiskTrends(trendsResponse.data);
        }

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
          <p className="text-gray-500 dark:text-slate-400">Chargement des données...</p>
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
            className="rounded-sm hover:bg-gray-100 dark:hover:bg-[#1a1f36] cursor-pointer transition-colors duration-200 border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0c1023] p-6"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-sm bg-blue-100 dark:bg-blue-500/20 p-3">
                <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-zinc-400">Organisations</p>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{metrics?.totalOrganizations || 0}</h2>
                <p className="text-xs text-gray-400 dark:text-zinc-500">Sous surveillance</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-sm hover:bg-gray-100 dark:hover:bg-[#1a1f36] cursor-pointer transition-colors duration-200 border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0c1023] p-6"
          >
            <div className="flex items-center gap-4">
              <div 
                className="rounded-sm p-3"
                style={{ backgroundColor: `${getRiskColor(metrics?.averageRiskScore || 0)}20` }}
              >
                <Shield className="h-6 w-6" style={{ color: getRiskColor(metrics?.averageRiskScore || 0) }} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-zinc-400">Score de risque moyen</p>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{metrics?.averageRiskScore || 0}%</h2>
                <p className="text-xs text-gray-400 dark:text-zinc-500">{getRiskLabel(metrics?.averageRiskScore || 0)}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-sm hover:bg-gray-100 dark:hover:bg-[#1a1f36] cursor-pointer transition-colors duration-200 border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0c1023] p-6"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-sm bg-red-100 dark:bg-red-500/20 p-3">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-zinc-400">Organisations à risque élevé</p>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{metrics?.highRiskOrgs || 0}</h2>
                <p className="text-xs text-gray-400 dark:text-zinc-500">Action requise</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-sm hover:bg-gray-100 dark:hover:bg-[#1a1f36] cursor-pointer transition-colors duration-200 border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0c1023] p-6"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-sm bg-purple-100 dark:bg-purple-500/20 p-3">
                <Target className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-zinc-400">Campagnes réalisées</p>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{metrics?.totalCampaigns || 0}</h2>
                <p className="text-xs text-gray-400 dark:text-zinc-500">Tests de sensibilisation</p>
              </div>
            </div>
          </motion.div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-gray-100 dark:bg-slate-900/50 gap-4 border border-gray-200 dark:border-slate-700/50 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-700 dark:text-gray-100 hover:text-gray-900 dark:hover:text-gray-400">
              <Activity className="w-4 h-4" />
              Vue d'ensemble
            </TabsTrigger>
            <TabsTrigger value="organizations" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-700 dark:text-gray-100 hover:text-gray-900 dark:hover:text-gray-400">
              <Building2 className="w-4 h-4" />
              Organisations
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white text-gray-700 dark:text-gray-100 hover:text-gray-900 dark:hover:text-gray-400">
              <Users className="w-4 h-4" />
              Utilisateurs à risque
            </TabsTrigger>
            <TabsTrigger value="compliance" className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-gray-700 dark:text-gray-100 hover:text-gray-900 dark:hover:text-gray-400">
              <CheckCircle className="w-4 h-4" />
              Conformité
            </TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            {/* Alertes à risque élevé */}
            {alerts.length > 0 && (
              <Card className="rounded-sm border border-red-300 dark:border-red-500/30 bg-white dark:bg-[#0c1023]/90">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                    <Bell className="w-5 h-5 text-red-600 dark:text-red-400" />
                    Alertes critiques ({alerts.filter(a => a.severity === 'HIGH').length})
                  </CardTitle>
                  <CardDescription className="text-gray-500 dark:text-gray-400">Actions urgentes requises</CardDescription>
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
                            ? 'bg-red-50 dark:bg-red-500/10 border-red-300 dark:border-red-500/30' 
                            : 'bg-orange-50 dark:bg-orange-500/10 border-orange-300 dark:border-orange-500/30'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <AlertTriangle 
                            className={`w-5 h-5 mt-0.5 ${
                              alert.severity === 'HIGH' ? 'text-red-600 dark:text-red-400' : 'text-orange-600 dark:text-orange-400'
                            }`} 
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{alert.title}</p>
                            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">{alert.message}</p>
                          </div>
                          <span 
                            className={`text-xs px-2 py-1 rounded-full ${
                              alert.severity === 'HIGH' 
                                ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400' 
                                : 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400'
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
                <Card className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1023]/90 lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">Évolution des risques (6 derniers mois)</CardTitle>
                    <CardDescription className="text-gray-500 dark:text-gray-400">Tendances des taux d'ouverture et de clic</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={riskTrends}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb dark:stroke-#334155" />
                        <XAxis 
                          dataKey="month" 
                          stroke="#6b7280 dark:stroke-#94a3b8"
                          tick={{ fill: '#6b7280' }}
                        />
                        <YAxis 
                          stroke="#6b7280"
                          tick={{ fill: '#6b7280' }}
                          label={{ value: 'Taux (%)', angle: -90, position: 'insideLeft', fill: '#6b7280' }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            color: '#111827',
                          }}
                          formatter={(value) => `${value}%`}
                        />
                        <Legend 
                          wrapperStyle={{ color: '#6b7280' }}
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
              <Card className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1023]/90">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Distribution des risques</CardTitle>
                  <CardDescription className="text-gray-500 dark:text-gray-400">Répartition des organisations par niveau de risque</CardDescription>
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
                          backgroundColor: '#ffffff',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          color: '#111827',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Top organisations à risque */}
              <Card className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1023]/90">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Top organisations à risque</CardTitle>
                  <CardDescription className="text-gray-500 dark:text-gray-400">Organisations avec les scores de risque les plus élevés</CardDescription>
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
                          className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/50"
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-2xl font-bold text-gray-400 dark:text-slate-500">#{index + 1}</div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{org.name}</p>
                              <p className="text-xs text-gray-500 dark:text-slate-400">
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
                            <p className="text-xs text-gray-500 dark:text-slate-500">{getRiskLabel(org.riskScore)}</p>
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
            <Card className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1023]/90">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Toutes les organisations</CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">Score de risque et métriques par organisation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-slate-700">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-slate-300">Organisation</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-600 dark:text-slate-300">Score de risque</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-600 dark:text-slate-300">Employés</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-600 dark:text-slate-300">Campagnes</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-600 dark:text-slate-300">Formations</th>
                      </tr>
                    </thead>
                    <tbody>
                      {organizations.map((org, index) => (
                        <motion.tr
                          key={org.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-gray-100 dark:border-slate-800/50 hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors"
                        >
                          <td className="py-3 px-4">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{org.name}</p>
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
                          <td className="py-3 px-4 text-center text-gray-700 dark:text-white">{org.currentEmployees}</td>
                          <td className="py-3 px-4 text-center text-gray-700 dark:text-white">{metrics?.campaignsByOrg?.[org.id] || 0}</td>
                          <td className="py-3 px-4 text-center text-gray-700 dark:text-white">{org.totalFormations}</td>
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
            <Card className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1023]/90">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Utilisateurs à risque</CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">Utilisateurs ayant interagi avec les campagnes de phishing</CardDescription>
              </CardHeader>
              <CardContent>
                {usersAtRisk.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-slate-400">Aucun utilisateur à risque identifié pour le moment.</p>
                    <p className="text-xs text-gray-400 dark:text-slate-500 mt-2">
                      Les données seront disponibles après l'exécution de campagnes de sensibilisation.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-slate-700">
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-slate-300">Utilisateur</th>
                          <th className="text-center py-3 px-4 text-sm font-medium text-gray-600 dark:text-slate-300">Poste</th>
                          <th className="text-center py-3 px-4 text-sm font-medium text-gray-600 dark:text-slate-300">Organisation</th>
                          <th className="text-center py-3 px-4 text-sm font-medium text-gray-600 dark:text-slate-300">Clics</th>
                          <th className="text-center py-3 px-4 text-sm font-medium text-gray-600 dark:text-slate-300">Ouvertures</th>
                          <th className="text-center py-3 px-4 text-sm font-medium text-gray-600 dark:text-slate-300">Niveau de risque</th>
                         </tr>
                      </thead>
                      <tbody>
                        {usersAtRisk.map((user) => (
                          <motion.tr 
                            key={user.id} 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="border-b border-gray-100 dark:border-slate-800/50 hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors"
                          >
                            <td className="py-3 px-4">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {user.firstName} {user.lastName}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-slate-400">{user.email}</p>
                             </td>
                            <td className="py-3 px-4 text-center text-gray-600 dark:text-slate-300 text-sm">
                              {user.position || 'N/A'}
                             </td>
                            <td className="py-3 px-4 text-center text-gray-700 dark:text-white text-sm">{user.organizationName}</td>
                            <td className="py-3 px-4 text-center">
                              <span className="text-lg font-bold text-red-600 dark:text-red-400">{user.clickCount}</span>
                             </td>
                            <td className="py-3 px-4 text-center">
                              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{user.openCount}</span>
                             </td>
                            <td className="py-3 px-4 text-center">
                              <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                                user.riskLevel === 'HIGH' ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-500/30' :
                                user.riskLevel === 'MEDIUM' ? 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 border border-orange-300 dark:border-orange-500/30' :
                                'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-500/30'
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
              <Card className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1023]/90">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Formations complétées</CardTitle>
                  <CardDescription className="text-gray-500 dark:text-gray-400">Taux de complétion des formations de sensibilisation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <div className="text-6xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                      {metrics?.totalOrganizations ? 
                        Math.round((organizations.reduce((sum, org) => sum + org.totalFormations, 0) / (metrics.totalUsers || 1)) * 100) 
                        : 0}%
                    </div>
                    <p className="text-gray-500 dark:text-slate-400">Taux de complétion moyen</p>
                    <p className="text-xs text-gray-400 dark:text-slate-500 mt-2">
                      Basé sur {organizations.reduce((sum, org) => sum + org.totalFormations, 0)} formations complétées
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1023]/90">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Recommandations</CardTitle>
                  <CardDescription className="text-gray-500 dark:text-gray-400">Actions prioritaires à entreprendre</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {metrics && metrics.highRiskOrgs > 0 && (
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
                        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Organisations à risque élevé</p>
                          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                            {metrics.highRiskOrgs} organisation(s) nécessite(nt) une attention immédiate
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20">
                      <Target className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Lancer de nouvelles campagnes</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                          Testez régulièrement la vigilance de vos employés
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Former les utilisateurs</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
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