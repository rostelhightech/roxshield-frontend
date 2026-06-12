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
          className="rounded-xl hover:bg-[#1a1f36] cursor-pointer transition-colors duration-200 border border-white/5 bg-[#0c1023] p-6 shadow-xl"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-sm bg-blue-500/20 p-3">
              <Clock className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">Heure de pic</p>
              <h2 className="text-2xl font-bold text-white">{peakHour.hour}h - {peakHour.hour + 1}h</h2>
              <p className="text-xs text-zinc-500">
                {peakHour.opens + peakHour.clicks} interactions
              </p>
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
            <div className="rounded-sm bg-purple-500/20 p-3">
              <TrendingUp className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">Jour de pic</p>
              <h2 className="text-2xl font-bold text-white">{peakDay.day}</h2>
              <p className="text-xs text-zinc-500">
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
        <Card className="rounded-md border border-white/10 bg-[#0c1023]/90 shadow-xl">
          <CardHeader>
            <CardTitle className="text-white">Activité par heure</CardTitle>
            <CardDescription>Distribution des ouvertures et clics sur 24h</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={hourlyAnalysis}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="hour" 
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8' }}
                  label={{ value: 'Heure', position: 'insideBottom', offset: -5, fill: '#94a3b8' }}
                />
                <YAxis 
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Legend 
                  wrapperStyle={{ color: '#94a3b8' }}
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
        <Card className="rounded-md border border-white/10 bg-[#0c1023]/90 shadow-xl">
          <CardHeader>
            <CardTitle className="text-white">Activité par jour de la semaine</CardTitle>
            <CardDescription>Tendances hebdomadaires d'engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyAnalysis}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="day" 
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8' }}
                />
                <YAxis 
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Legend 
                  wrapperStyle={{ color: '#94a3b8' }}
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
