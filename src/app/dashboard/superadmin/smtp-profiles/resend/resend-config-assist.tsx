// components/smtp/ResendConfigurationAssistant.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';

export function ResendConfigurationAssistant() {
  const { t: tCommon } = useTranslation('common');
  const [searchQuery, setSearchQuery] = useState('Resend API key configuration');

  const handleSearch = () => {
    const query = encodeURIComponent(searchQuery);
    window.open(`https://www.google.com/search?q=${query}`, '_blank');
  };

  const handleResendDocs = () => {
    window.open('https://resend.com/docs', '_blank');
  };

  const handleApiKeys = () => {
    window.open('https://resend.com/api-keys', '_blank');
  };

  return (
    <div className="bg-[#5d2595]/10 dark:bg-slate-800/20  border-blue-200 dark:border-blue-800 rounded-sm p-4 space-y-4">
      <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300">
        {tCommon('admin.smtp.resend.find_api_key')}
      </h3>

      <div className="space-y-3">
        <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-sm p-3 space-y-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {tCommon('admin.smtp.resend.steps_title')}
          </p>
          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <li>{tCommon('admin.smtp.resend.step1')}</li>
            <li>{tCommon('admin.smtp.resend.step2')} <span className="font-medium">Settings</span> → <span className="font-medium">API Keys</span></li>
            <li>{tCommon('admin.smtp.resend.step3')} <span className="font-medium">Create API Key</span></li>
            <li>{tCommon('admin.smtp.resend.step4')}</li>
            <li>Copiez la clé générée (elle ne sera affichée qu'une seule fois)</li>
          </ol>
        </div>

        <div className="flex flex-col gap-2">
          <div>
            <Label className="text-sm text-blue-700 dark:text-blue-300">
              {tCommon('admin.smtp.resend.search_google')}
            </Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={tCommon('common.topbar.search')}
                className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700"
              />
              <Button 
                onClick={handleSearch}
                variant="outline"
                size="sm"
                className="bg-white dark:bg-gray-800"
              >
                {tCommon('common.topbar.search_title')}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={handleApiKeys}
            variant="outline"
            size="sm"
            className="flex-1 bg-white dark:bg-gray-800"
          >
             {tCommon('admin.smtp.resend.manage_keys')}
          </Button>
          <Button 
            onClick={handleResendDocs}
            variant="outline"
            size="sm"
            className="flex-1 bg-white dark:bg-gray-800"
          >
             Documentation Resend
          </Button>
        </div>
      </div>
    </div>
  );
}