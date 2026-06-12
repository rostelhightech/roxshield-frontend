'use client';

import { memo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

interface CampaignChartsSectionProps {
  showCharts: boolean;
  targetStatusData: Array<{ name: string; value: number; color: string }>;
  trackingEventsData: Array<{ name: string; count: number }>;
}

const TargetStatusChart = memo(({ data }: { data: any[] }) => (
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={100}
        paddingAngle={2}
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      <Tooltip
        formatter={(value) => value}
        contentStyle={{ backgroundColor: '#1a1f35', border: '1px solid #ffffff1a' }}
        labelStyle={{ color: '#fff' }}
      />
      <Legend wrapperStyle={{ color: '#fff' }} />
    </PieChart>
  </ResponsiveContainer>
));

const TrackingEventsChart = memo(({ data }: { data: any[] }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff1a" />
      <XAxis dataKey="name" stroke="#9ca3af" />
      <YAxis stroke="#9ca3af" />
      <Tooltip
        contentStyle={{ backgroundColor: '#1a1f35', border: '1px solid #ffffff1a' }}
        labelStyle={{ color: '#fff' }}
      />
      <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
));

const StatsSkeleton = memo(() => (
  <div className="space-y-3">
    <Skeleton className="h-[300px] w-full" />
    <Skeleton className="h-8 w-1/3" />
  </div>
));

export function CampaignChartsSection({ showCharts, targetStatusData, trackingEventsData }: CampaignChartsSectionProps) {
  return (
    <div className="grid grid-cols-2 gap-6 mt-6">
      <div className="border-t border-white/10 pt-6">
        <h4 className="text-sm font-semibold text-white mb-4">Événements de tracking</h4>
        {!showCharts ? <StatsSkeleton /> : <TrackingEventsChart data={trackingEventsData} />}
      </div>

      <div className="border-t border-white/10 pt-6">
        <h4 className="text-sm font-semibold text-white mb-4">Distribution des cibles</h4>
        {!showCharts ? <StatsSkeleton /> : <TargetStatusChart data={targetStatusData} />}
      </div>
    </div>
  );
}