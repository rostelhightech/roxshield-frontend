// components/smtp/SmtpProfileList.tsx
'use client';

import { Button } from '@/components/ui/button';
import { SmtpProfile, SmtpProvider } from '@/store/smtp-profile.store';
import { useTranslation } from 'react-i18next';

interface SmtpProfileListProps {
  profiles: SmtpProfile[];
  isLoading: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string, isDefault:boolean) => void;
  selectedId?: string;
  show: SmtpProvider
}

export function SmtpProfileList({ 
  profiles, 
  isLoading, 
  onSelect, 
  onDelete, 
  selectedId ,
  show
}: SmtpProfileListProps) {
    const { t: tCommon } = useTranslation('common');

  if (isLoading && profiles.length === 0) {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {tCommon('admin.smtp.smtp.loading_profiles')}
      </p>
    );
  }

  if (profiles.length === 0) {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {tCommon('admin.smtp.smtp.no_profiles')}
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {profiles?.filter((profile) => profile.provider === show).map((profile) => {
        const isSelected = profile.id === selectedId;
        return (
          <div
            key={profile.id}
            className={`rounded-sm border p-4 transition cursor-pointer ${
              isSelected 
                ? 'border-sky-400 bg-sky-400/10' 
                : 'border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10'
            }`}
            onClick={() => onSelect(profile.id)}
          >
            <div className="flex flex-col gap-3">
              <div className="flex min-w-0 items-center gap-2">
                {isSelected && <span className="h-2 w-2 shrink-0 rounded-full bg-sky-400" />}
                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                  {profile.name}
                </p>
                {profile.provider && (
                  <span className="ml-auto text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    {profile.provider}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  <span className="text-gray-600 dark:text-gray-500">{tCommon('admin.smtp.smtp.organization_label')}</span> {profile.organization?.name ?? 'RoxShield (Default)'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  <span className="text-gray-600 dark:text-gray-500">{tCommon('admin.smtp.smtp.sender_label')}</span> {profile.fromName ?? profile.fromAddress}
                </p>
                {profile.host && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    <span className="text-gray-600 dark:text-gray-500">{tCommon('admin.smtp.smtp.host')}</span> {profile.host}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Button
                  size="sm"
                  variant={isSelected ? 'secondary' : 'outline'}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(profile.id);
                  }}
                >
                  {isSelected ? 'Sélectionné' : tCommon('admin.campaigns.page_details')}
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(profile.id, profile.isDefault);
                  }}
                >
                  {tCommon('admin.ambassadors.delete')}
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}