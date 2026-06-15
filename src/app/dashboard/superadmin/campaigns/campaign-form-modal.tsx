'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { CampaignForm, CampaignFormData } from './campaign-form';

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
  onSubmitEdit: (data: CampaignFormData) => Promise<void>;
  onSubmitRemix: (data: CampaignFormData) => Promise<void>;
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
  if (!isOpen) return null;

  return (
    <Card className="rounded-md border border-gray-200 dark:border-white/10 bg-white   dark:bg-[#0c1023]/90 shadow-sm dark:shadow-xl mt-6">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-gray-900 dark:text-white">
          {mode === 'edit' ? 'Modifier la campagne' : 'Remixer la campagne'}
        </CardTitle>
        <CardDescription className="text-gray-500 dark:text-gray-400">
          {mode === 'edit'
            ? 'Modifiez les paramètres de la campagne et enregistrez vos changements.'
            : 'Copiez cette campagne pour la personnaliser puis la relancer.'}
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
          onSubmitAction={async (data: CampaignFormData) => {
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