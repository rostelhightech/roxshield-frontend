// components/smtp/SmtpProfiles.tsx
'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResendTab } from './resend/resend-tab';
import { SmtpTab } from './smtp/smtp-tab';


export default function SmtpProfiles() {
  const [activeTab, setActiveTab] = useState<'smtp' | 'resend'>('smtp');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050816]">
      <div className="mx-auto">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'smtp' | 'resend')}>
          <TabsList className="mb-6 bg-white dark:bg-[#0c1023] border border-gray-200 dark:border-white/5 p-1 rounded-sm">
            <TabsTrigger 
              value="smtp"
              className="data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-white/10"
            >
              SMTP
            </TabsTrigger>
            <TabsTrigger 
              value="resend"
              className="data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-white/10"
            >
              Resend
            </TabsTrigger>
          </TabsList>

          <TabsContent value="smtp">
            <SmtpTab />
          </TabsContent>

          <TabsContent value="resend">
            <ResendTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}