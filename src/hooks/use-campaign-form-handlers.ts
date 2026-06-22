import { buildFormDefaults } from '@/lib/campaign-form.utils';
import { type Campaign } from '@/store/campaign.store';
import { useState } from 'react';

export function useCampaignFormHandlers(currentCampaign: Campaign | null) {
  const [formMode, setFormMode] = useState<'edit' | 'remix' | null>(null);
  const [formInitialValues, setFormInitialValues] = useState<Campaign | null>(null);

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