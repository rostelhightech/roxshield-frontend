import { CampaignFormData } from '@/app/dashboard/superadmin/campaigns/campaign-form';
import { buildFormDefaults } from '@/lib/campaign-form.utils';
import { useState } from 'react';

export function useCampaignFormHandlers(currentCampaign: any) {
  const [formMode, setFormMode] = useState<'edit' | 'remix' | null>(null);
  const [formInitialValues, setFormInitialValues] = useState<CampaignFormData | null>(null);

  const handleEdit = () => {
    if (!currentCampaign) return;
    setFormMode('edit');
    setFormInitialValues(buildFormDefaults(currentCampaign));
  };

  const handleRemix = () => {
    if (!currentCampaign) return;
    setFormMode('remix');
    setFormInitialValues({
      ...buildFormDefaults(currentCampaign),
      name: `Remix - ${currentCampaign.name}`,
    });
  };

  const handleFormCancel = () => {
    setFormMode(null);
    setFormInitialValues(null);
  };

  const handleFormSuccess = () => {
    setFormMode(null);
    setFormInitialValues(null);
  };

  return {
    formMode,
    formInitialValues,
    handleEdit,
    handleRemix,
    handleFormCancel,
    handleFormSuccess,
  };
}