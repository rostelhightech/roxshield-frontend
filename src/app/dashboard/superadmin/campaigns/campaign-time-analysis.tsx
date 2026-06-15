'use client';

import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Clock, TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { TimeAnalysis } from '@/store/campaign.store';

interface CampaignTimeAnalysisProps {
  timeAnalysis: TimeAnalysis;
}

export function CampaignTimeAnalysis({ timeAnalysis }: CampaignTimeAnalysisProps) {
  const { hourlyAnalysis, dailyAnalysis } = timeAnalysis;

  // Trouver les heures de pic
  const peakHour = hourlyAnalysis.reduce((max, curr) => 
    (curr.opens + curr.clicks) > (max.opens + max.clicks) ? curr : max
  );

  // Trouver le jour de pic
  const peakDay = dailyAnalysis.reduce((max, curr) => 
    (curr.opens + curr.clicks) > (max.opens + max.clicks) ? curr : max
  );

  return (
  <div className="space-y-6">
      {/* Stats de pic */}
      <div className="grid gap-4 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-sm hover:bg-gray-100 dark:hover:bg-[#1a1f36] cursor-pointer transition-colors duration-200 border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0c1023] p-6 shadow-sm dark:shadow-xl"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-sm bg-blue-100 dark:bg-blue-500/20 p-3">
              <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-zinc-400">Heure de pic</p>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{peakHour.hour}h - {peakHour.hour + 1}h</h2>
              <p className="text-xs text-gray-400 dark:text-zinc-500">
                {peakHour.opens + peakHour.clicks} interactions
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-sm hover:bg-gray-100 dark:hover:bg-[#1a1f36] cursor-pointer transition-colors duration-200 border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0c1023] p-6 shadow-sm dark:shadow-xl"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-sm bg-purple-100 dark:bg-purple-500/20 p-3">
              <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-zinc-400">Jour de pic</p>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{peakDay.day}</h2>
              <p className="text-xs text-gray-400 dark:text-zinc-500">
                {peakDay.opens + peakDay.clicks} interactions
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Graphique par heure */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="rounded-md border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1023]/90 shadow-sm dark:shadow-xl">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Activité par heure</CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">Distribution des ouvertures et clics sur 24h</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={hourlyAnalysis}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb dark:stroke-#334155" />
                <XAxis 
                  dataKey="hour" 
                  stroke="#6b7280 dark:stroke-#94a3b8"
                  tick={{ fill: '#6b7280' }}
                  label={{ value: 'Heure', position: 'insideBottom', offset: -5, fill: '#6b7280' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    color: '#111827',
                  }}
                />
                <Legend 
                  wrapperStyle={{ color: '#6b7280' }}
                  formatter={(value) => value === 'opens' ? 'Ouvertures' : 'Clics'}
                />
                <Line 
                  type="monotone" 
                  dataKey="opens" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="clicks" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  dot={{ fill: '#8b5cf6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Graphique par jour */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="rounded-md border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1023]/90 shadow-sm dark:shadow-xl">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Activité par jour de la semaine</CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">Tendances hebdomadaires d'engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyAnalysis}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb dark:stroke-#334155" />
                <XAxis 
                  dataKey="day" 
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    color: '#111827',
                  }}
                />
                <Legend 
                  wrapperStyle={{ color: '#6b7280' }}
                  formatter={(value) => value === 'opens' ? 'Ouvertures' : 'Clics'}
                />
                <Bar dataKey="opens" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                <Bar dataKey="clicks" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
