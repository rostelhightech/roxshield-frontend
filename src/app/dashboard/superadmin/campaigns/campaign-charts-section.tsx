'use client';

import { memo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from 'react-i18next';

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
        contentStyle={{ 
          backgroundColor: '#ffffff', 
          border: '1px solid #e5e7eb',
          borderRadius: '8px'
        }}
        labelStyle={{ color: '#111827' }}
      />
      <Legend wrapperStyle={{ color: '#111827' }} />
    </PieChart>
  </ResponsiveContainer>
));

const TrackingEventsChart = memo(({ data }: { data: any[] }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
      <XAxis dataKey="name" stroke="#6b7280" />
      <YAxis stroke="#6b7280" />
      <Tooltip
        contentStyle={{ 
          backgroundColor: '#ffffff', 
          border: '1px solid #e5e7eb',
          borderRadius: '8px'
        }}
        labelStyle={{ color: '#111827' }}
      />
      <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
));

const StatsSkeleton = memo(() => (
  <div className="space-y-3">
    <Skeleton className="h-[300px] w-full bg-gray-200 dark:bg-gray-700" />
    <Skeleton className="h-8 w-1/3 bg-gray-200 dark:bg-gray-700" />
  </div>
));

export function CampaignChartsSection({ showCharts, targetStatusData, trackingEventsData }: CampaignChartsSectionProps) {

  const { t: tCommon } = useTranslation('common');
  

  return (
    <div className="grid grid-cols-2 gap-6 mt-6 bg-gray-100 dark:bg-slate-900 px-2">
      <div className="border-t border-gray-200 dark:border-white/10 pt-6">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-900 dark:text-white mb-4">{tCommon('admin.campaigns.tracking_events')}</h4>
        {!showCharts ? <StatsSkeleton /> : <TrackingEventsChart data={trackingEventsData} />}
      </div>

      <div className="border-t border-gray-200 dark:border-white/10 pt-6">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-900 dark:text-white mb-4">{tCommon('admin.campaigns.target_distribution')}</h4>
        {!showCharts ? <StatsSkeleton /> : <TargetStatusChart data={targetStatusData} />}
      </div>
    </div>
  );
}