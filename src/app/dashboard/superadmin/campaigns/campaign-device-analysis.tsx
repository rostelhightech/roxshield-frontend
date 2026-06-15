'use client';

import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Smartphone, Monitor, Globe, Cpu } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { UserAgentAnalysis } from '@/store/campaign.store';

interface CampaignDeviceAnalysisProps {
  userAgentAnalysis: UserAgentAnalysis;
}

const DEVICE_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#64748b'];
const BROWSER_COLORS = ['#f59e0b', '#10b981', '#06b6d4', '#ef4444', '#8b5cf6'];
const OS_COLORS = ['#3b82f6', '#64748b', '#f97316', '#22c55e', '#a855f7'];

export function CampaignDeviceAnalysis({ userAgentAnalysis }: CampaignDeviceAnalysisProps) {
  const { deviceData, browserData, osData } = userAgentAnalysis;

  const totalDevices = deviceData.reduce((sum, item) => sum + item.value, 0);
  const primaryDevice = deviceData.reduce((max, curr) => 
    curr.value > max.value ? curr : max
  , deviceData[0]);

  return (
   <div className="space-y-6">
      {/* Stats principales */}
      <div className="grid gap-4 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-sm hover:bg-gray-100 dark:hover:bg-[#1a1f36] cursor-pointer transition-colors duration-200 border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0c1023] p-6"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-sm bg-blue-100 dark:bg-blue-500/20 p-3">
              <Monitor className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-zinc-400">Appareil principal</p>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{primaryDevice?.name || 'N/A'}</h2>
              <p className="text-xs text-gray-400 dark:text-zinc-500">
                {primaryDevice ? Math.round((primaryDevice.value / totalDevices) * 100) : 0}% du trafic
              </p>
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
            <div className="rounded-sm bg-purple-100 dark:bg-purple-500/20 p-3">
              <Globe className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-zinc-400">Navigateurs</p>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{browserData.length}</h2>
              <p className="text-xs text-gray-400 dark:text-zinc-500">types détectés</p>
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
            <div className="rounded-sm bg-pink-100 dark:bg-pink-500/20 p-3">
              <Cpu className="h-6 w-6 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-zinc-400">Systèmes d'exploitation</p>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{osData.length}</h2>
              <p className="text-xs text-gray-400 dark:text-zinc-500">plateformes utilisées</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Graphiques */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Devices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="rounded-sm border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0c1023]/90">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Appareils
              </CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">Répartition par type d'appareil</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={DEVICE_COLORS[index % DEVICE_COLORS.length]} />
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
        </motion.div>

        {/* Browsers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="rounded-sm border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0c1023]/90">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                Navigateurs
              </CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">Répartition par navigateur</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={browserData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {browserData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={BROWSER_COLORS[index % BROWSER_COLORS.length]} />
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
        </motion.div>

        {/* OS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="rounded-sm border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0c1023]/90">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                OS
              </CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">Répartition par système d'exploitation</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={osData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {osData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={OS_COLORS[index % OS_COLORS.length]} />
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
        </motion.div>
      </div>
    </div>
  );
}
