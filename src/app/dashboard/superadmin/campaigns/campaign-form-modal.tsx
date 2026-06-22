'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { CampaignForm } from './campaign-form';
import { useTranslation } from 'react-i18next';
import { Campaign } from '@/store/campaign.store';

interface CampaignFormModalProps {
  isOpen: boolean;
  mode: 'edit' | 'remix' | null;
  initialValues: any;
  organizations: any[];
  groups: any[];
  templates: any[];
  landingPageTemplates: any[];
  smtpProfiles: any[];
  onCancel: () => void;
  onSuccess: () => void;
  onSubmitEdit: (data: Campaign) => Promise<void>;
  onSubmitRemix: (data: Campaign) => Promise<void>;
}

export function CampaignFormModal({
  isOpen,
  mode,
  initialValues,
  organizations,
  groups,
  templates,
  landingPageTemplates,
  smtpProfiles,
  onCancel,
  onSuccess,
  onSubmitEdit,
  onSubmitRemix,
}: CampaignFormModalProps) {

    const { t: tCommon } = useTranslation('common');

  if (!isOpen) return null;

  return (
    <Card className="rounded-md border border-gray-200 dark:border-white/10 bg-white   dark:bg-[#0c1023]/90 shadow-sm dark:shadow-xl mt-6">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-gray-900 dark:text-white">
          {mode === 'edit' ? 'Modifier la campagne' : 'Remixer la campagne'}
        </CardTitle>
        <CardDescription className="text-gray-500 dark:text-gray-400">
          {mode === 'edit'
            ? tCommon('admin.campaigns.form_edit_title')
            : tCommon('admin.campaigns.form_copy_title')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CampaignForm
          organizations={organizations}
          groups={groups}
          templates={templates}
          landingPageTemplates={landingPageTemplates}
          smtpProfiles={smtpProfiles}
          initialValues={initialValues ?? undefined}
          submitLabel={mode === 'edit' ? 'Enregistrer les modifications' : 'Créer le remix'}
          onCreated={onSuccess}
          onCancel={onCancel}
          onSubmitAction={async (data: Campaign) => {
            if (mode === 'edit') {
              await onSubmitEdit(data);
            } else {
              await onSubmitRemix(data);
            }
          }}
        />
      </CardContent>
    </Card>
  );
}