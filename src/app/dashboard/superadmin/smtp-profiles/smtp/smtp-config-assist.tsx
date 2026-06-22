'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Combobox } from '@/components/ui/combobox';
import { useTranslation } from 'react-i18next';

const SMTP_PROVIDERS = [
  { value: 'gmail', label: 'Gmail' },
  { value: 'outlook', label: 'Outlook / Microsoft 365'},
  { value: 'yahoo', label: 'Yahoo Mail'},
  { value: 'zoho', label: 'Zoho Mail'},
  { value: 'sendgrid', label: 'SendGrid'},
  { value: 'mailgun', label: 'Mailgun'},
  { value: 'postmark', label: 'Postmark'},
  { value: 'amazon_ses', label: 'Amazon SES'},
  { value: 'mailjet', label: 'Mailjet'},
  { value: 'brevo', label: 'Brevo (ex-Sendinblue)'},
  { value: 'sparkpost', label: 'SparkPost'},
  { value: 'mandrill', label: 'Mandrill (Mailchimp)'},
  { value: 'icloud', label: 'iCloud Mail'},
  { value: 'gmx', label: 'GMX Mail'},
  { value: 'protonmail', label: 'Proton Mail Bridge'},
  { value: 'ovh', label: 'OVH Mail'},
  { value: 'infomaniak', label: 'Infomaniak'},
  { value: 'ionos', label: 'IONOS (1&1)'},
  { value: 'godaddy', label: 'GoDaddy'},
  { value: 'bluehost', label: 'Bluehost'},
  { value: 'other', label: '__other__' },
];

const PROVIDER_CONFIGS: Record<string, { host: string; port: number; secure: boolean }> = {
  gmail:       { host: 'smtp.gmail.com',                        port: 587, secure: false },
  outlook:     { host: 'smtp.office365.com',                    port: 587, secure: false },
  yahoo:       { host: 'smtp.mail.yahoo.com',                   port: 587, secure: false },
  zoho:        { host: 'smtp.zoho.com',                         port: 587, secure: false },
  sendgrid:    { host: 'smtp.sendgrid.net',                     port: 587, secure: false },
  mailgun:     { host: 'smtp.mailgun.org',                      port: 587, secure: false },
  postmark:    { host: 'smtp.postmarkapp.com',                  port: 587, secure: false },
  amazon_ses:  { host: 'email-smtp.us-east-1.amazonaws.com',   port: 587, secure: false },
  mailjet:     { host: 'in-v3.mailjet.com',                    port: 587, secure: false },
  brevo:       { host: 'smtp-relay.brevo.com',                  port: 587, secure: false },
  sparkpost:   { host: 'smtp.sparkpostmail.com',                port: 587, secure: false },
  mandrill:    { host: 'smtp.mandrillapp.com',                  port: 587, secure: false },
  icloud:      { host: 'smtp.mail.me.com',                      port: 587, secure: false },
  gmx:         { host: 'mail.gmx.com',                          port: 587, secure: false },
  protonmail:  { host: '127.0.0.1',                             port: 1025, secure: false },
  ovh:         { host: 'ssl0.ovh.net',                          port: 587, secure: false },
  infomaniak:  { host: 'mail.infomaniak.com',                   port: 587, secure: false },
  ionos:       { host: 'smtp.ionos.com',                        port: 587, secure: false },
  godaddy:     { host: 'smtpout.secureserver.net',              port: 587, secure: false },
  bluehost:    { host: 'mail.bluehost.com',                     port: 587, secure: false },
};

interface ManualConfig {
  host: string;
  port: string;
}

export function SmtpConfigurationAssistant() {
  const { t: tCommon } = useTranslation('common');
  const [provider, setProvider] = useState<string>('');

  const smtpProviders = useMemo(() =>
    SMTP_PROVIDERS.map((p) =>
      p.value === 'other' ? { ...p, label: tCommon('admin.smtp.smtp.other_provider') } : p
    ),
    [tCommon]
  );
  const [manualConfig, setManualConfig] = useState<ManualConfig>({ host: '', port: '587' });

  const isOther = provider === 'other';
  const selectedConfig = provider && !isOther ? PROVIDER_CONFIGS[provider] : null;

  const handleProviderSelect = (value: string) => {
    setProvider(value);
  };

  const handleSearch = () => {
    if (!provider || isOther) return;
    const providerName = SMTP_PROVIDERS.find((p) => p.value === provider)?.label || '';
    window.open(`https://www.google.com/search?q=${encodeURIComponent(`${providerName} SMTP configuration`)}`, '_blank');
  };

  return (
    <div className="bg-[#5d2595]/10 dark:bg-slate-800/20 rounded-sm p-4 space-y-4">
      <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300">
        {tCommon('admin.smtp.smtp.find_smtp_config_title')}
      </h3>

      <div className="space-y-3">
        <div>
          <Label className="text-sm text-blue-700 dark:text-blue-300">
            {tCommon('admin.smtp.smtp.select_provider')}
          </Label>
          <Combobox
            options={smtpProviders}
            value={provider}
            onChange={handleProviderSelect}
            placeholder={tCommon('admin.smtp.smtp.provider_placeholder')}
            searchPlaceholder={tCommon('admin.smtp.smtp.search_provider')}
            className="mt-1 bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700"
          />
        </div>

        {/* Config pré-remplie */}
        {selectedConfig && (
          <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-sm p-3 space-y-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {tCommon('admin.smtp.smtp.typical_config')}
            </p>
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <p><span className="font-medium">{tCommon('admin.smtp.smtp.host')}</span> {selectedConfig.host}</p>
              <p><span className="font-medium">Port :</span> {selectedConfig.port}</p>
              <p><span className="font-medium">{tCommon('admin.smtp.smtp.secure')}</span> {selectedConfig.secure ? tCommon('admin.smtp.smtp.secure_yes') : tCommon('admin.smtp.smtp.secure_no')}</p>
            </div>
          </div>
        )}

        {/* Config manuelle si "Autre" */}
        {isOther && (
          <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-sm p-3 space-y-3">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {tCommon('admin.smtp.smtp.manual_config')}
            </p>
            <div className="space-y-2">
              <div>
                <Label className="text-xs text-gray-600 dark:text-gray-400">{tCommon('admin.smtp.smtp.smtp_host')}</Label>
                <Input
                  value={manualConfig.host}
                  onChange={(e) => setManualConfig((prev) => ({ ...prev, host: e.target.value }))}
                  placeholder="ex: smtp.mondomaine.com"
                  className="mt-1 h-8 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-600 dark:text-gray-400">Port</Label>
                <Input
                  value={manualConfig.port}
                  onChange={(e) => setManualConfig((prev) => ({ ...prev, port: e.target.value }))}
                  placeholder="587"
                  type="number"
                  className="mt-1 h-8 text-sm"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {provider && !isOther && (
            <Button
              onClick={handleSearch}
              variant="outline"
              size="sm"
              className="flex-1 bg-white dark:bg-gray-800"
            >
              {tCommon('admin.smtp.smtp.search_config')}
            </Button>
          )}
          <Button
            onClick={() => window.open('https://www.google.com/search?q=SMTP+configuration+guide', '_blank')}
            variant="outline"
            size="sm"
            className="flex-1 bg-white dark:bg-gray-800"
          >
            {tCommon('admin.smtp.smtp.general_guide')}
          </Button>
        </div>
      </div>
    </div>
  );
}