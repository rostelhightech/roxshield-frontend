// components/smtp/tabs/ResendTab.tsx
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useOrganizationStore } from '@/store/organization.store';
import { useSmtpProfileStore } from '@/store/smtp-profile.store';
import { Combobox } from '@/components/ui/combobox';
import { ResendConfigurationAssistant } from './resend-config-assist';
import { SmtpProfileForm } from '../smtp/smtp-profile-form';
import { SmtpProfileList } from '../smtp/smtp-list';
import { ResendProfileForm } from './resend-profil-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';


const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export function ResendTab() {
  const { t: tCommon } = useTranslation('common');
  const { organizations } = useOrganizationStore();
  const {
    filteredProfiles,
    currentSmtpProfile,
    fetchAll,
    fetchById,
    deleteSmtpProfile,
    setCurrentSmtpProfile,
    isLoading,
    isSendingTestEmail,
    sendTestEmail,
  } = useSmtpProfileStore();

  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'name' | 'organization'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false);
  const [testRecipient, setTestRecipient] = useState('');
  const [testSubject, setTestSubject] = useState('');
  const [testText, setTestText] = useState('');
  const [testError, setTestError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<string | null>(null);
  const [showAssistant, setShowAssistant] = useState(false);

  useEffect(() => {
    // Filtrer uniquement les profils Resend
    fetchAll();
  }, []);

  const filteredResendProfiles = filteredProfiles.filter(p => p.provider === 'resend');

  const sortedProfiles = filteredResendProfiles.sort((a, b) => {
    const getValue = (item: typeof filteredResendProfiles[number]) => {
      if (sortBy === 'organization') {
        return item.organization?.name ?? '';
      }
      return (item as any)[sortBy] ?? '';
    };

    const valueA = String(getValue(a)).toLowerCase();
    const valueB = String(getValue(b)).toLowerCase();

    if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const handleDelete = async (id: string) => {
    setProfileToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!profileToDelete) return;
    
    await deleteSmtpProfile(profileToDelete, currentSmtpProfile?.isDefault);
    if (currentSmtpProfile?.id === profileToDelete) {
      setCurrentSmtpProfile(null);
    }
    
    setDeleteDialogOpen(false);
    setProfileToDelete(null);
  };

  const handleSendTestEmail = async () => {
    if (!currentSmtpProfile) {
        toast.error(tCommon('admin.smtp.resend.error_no_profile'))
        return
    }

    if (!testRecipient.trim()) {
      setTestError(tCommon('admin.smtp.resend.error_recipient_required'));
      return;
    }

    if (!isValidEmail(testRecipient)) {
      setTestError(tCommon('admin.smtp.resend.error_email_invalid'));
      return;
    }

    setTestError('');

    try {
       await sendTestEmail(currentSmtpProfile.id, {
        to: testRecipient.trim(),
        subject: testSubject || `Test Resend - ${currentSmtpProfile.name}`,
        text: testText,
        isDefault: currentSmtpProfile.isDefault
      });
      setIsTestDialogOpen(false);
      setTestRecipient('');
      setTestSubject(`Test Resend - ${currentSmtpProfile.name}`);
      setTestText(tCommon('admin.smtp.resend.test_default_text'));
    } catch {
      setTestError(tCommon('admin.smtp.resend.error_send_failed'));
    }
  };

  useEffect(() => {
    if (currentSmtpProfile) {
      setTestSubject(`Test Resend - ${currentSmtpProfile.name}`);
      setTestText(tCommon('admin.smtp.resend.test_default_text'));
      setTestError('');
    }
  }, [currentSmtpProfile]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="bg-white dark:bg-[#0c1023] rounded-sm p-6 border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{tCommon('admin.smtp.resend.profiles_title')}</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAssistant(!showAssistant)}
          >
            {showAssistant ? tCommon('admin.smtp.resend.close_assistant') : tCommon('admin.smtp.resend.find_api_key_btn')}
          </Button>
        </div>

        {showAssistant && (
          <div className="mb-6">
            <ResendConfigurationAssistant />
          </div>
        )}

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={tCommon('admin.smtp.resend.search_placeholder_list')}
            className="min-w-0 flex-1 bg-white dark:bg-white/5 border-gray-300 dark:border-white/10"
          />

          <div className="flex items-center gap-2">
            <Combobox
              options={[
                { value: 'createdAt', label: tCommon('admin.campaigns.tracking_date') },
                { value: 'name', label: tCommon('user.profile.last_name') },
                { value: 'organization', label: tCommon('admin.grc.org_name')},
              ]}
              value={sortBy}
              onChange={(value) => setSortBy(value as typeof sortBy)}
              placeholder={tCommon('admin.campaigns.page_sort_by')}
              searchPlaceholder={tCommon('admin.templates.search_criteria')}
              className="bg-white dark:bg-gray-800/50 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white mt-0 min-w-[150px]"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => setSortOrder((order) => (order === 'asc' ? 'desc' : 'asc'))}
            >
              {sortOrder === 'asc' ? 'Asc' : 'Desc'}
            </Button>
          </div>
        </div>

        <SmtpProfileList
          show={'resend'}
          profiles={sortedProfiles}
          isLoading={isLoading}
          onSelect={fetchById}
          onDelete={handleDelete}
          selectedId={currentSmtpProfile?.id}
        />
      </section>

      <section className="bg-white  dark:bg-[#0c1023] rounded-sm p-6 border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none">
        {currentSmtpProfile && (
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {tCommon('admin.smtp.resend.selected_profile')} <span className="text-gray-900 dark:text-white">{currentSmtpProfile.name}</span>
            </p>
            <Button size="sm"  onClick={() => setIsTestDialogOpen(true)}>
              {tCommon('admin.smtp.resend.send_test')}
            </Button>
          </div>
        )}

        <ResendProfileForm
          organizations={organizations}
          profile={currentSmtpProfile}
          onCancel={() => setCurrentSmtpProfile(null)}
        />

        <Dialog open={isTestDialogOpen} onOpenChange={setIsTestDialogOpen}>
          <DialogContent className="sm:max-w-lg bg-white dark:bg-[#0c1023] border border-gray-200 dark:border-white/10">
            <DialogHeader>
              <DialogTitle className="text-gray-900 dark:text-white">{tCommon('admin.smtp.resend.test_dialog_title')}</DialogTitle>
              <DialogDescription className="text-gray-500 dark:text-gray-400">
                {tCommon('admin.smtp.resend.test_dialog_desc')}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="testRecipient" className="text-gray-700 dark:text-gray-300">{tCommon('admin.smtp.resend.recipient_label')}</Label>
                <Input
                  id="testRecipient"
                  value={testRecipient}
                  onChange={(e) => {
                    const value = e.target.value;
                    setTestRecipient(value);
                    if (!value.trim()) {
                      setTestError(tCommon('admin.smtp.resend.error_recipient_required'));
                    } else if (!isValidEmail(value)) {
                      setTestError(tCommon('admin.smtp.resend.error_email_invalid'));
                    } else {
                      setTestError('');
                    }
                  }}
                  placeholder="destinataire@example.com"
                  className="mt-1 bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <Label htmlFor="testSubject" className="text-gray-700 dark:text-gray-300">{tCommon('admin.templates.subject')}</Label>
                <Input
                  id="testSubject"
                  value={testSubject}
                  onChange={(e) => setTestSubject(e.target.value)}
                  className="mt-1 bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <Label htmlFor="testText" className="text-gray-700 dark:text-gray-300">{tCommon('admin.demos.detail_message')}</Label>
                <Textarea
                  id="testText"
                  value={testText}
                  onChange={(e) => setTestText(e.target.value)}
                  rows={5}
                  className="mt-1 bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              {testError && <p className="text-sm text-red-600 dark:text-red-400">{testError}</p>}
            </div>

            <DialogFooter className="border-t border-gray-200 dark:border-white/10 pt-4 bg-white dark:bg-[#0c1023]">
              <div className="flex w-full items-center justify-end gap-2">
                <DialogClose>
                  <Button variant="outline">{tCommon('user.formations.cancel')}</Button>
                </DialogClose>
                <Button
                  onClick={handleSendTestEmail}
                  disabled={isSendingTestEmail || !testRecipient.trim() || !isValidEmail(testRecipient)}
                >
                  {isSendingTestEmail ? tCommon('admin.smtp.resend.sending') : tCommon('admin.smtp.resend.send')}
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-gray-900 dark:text-white">{tCommon('admin.smtp.resend.delete_confirm_title')}</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                {tCommon('admin.smtp.resend.delete_confirm_desc')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className='bg-white dark:bg-gray-900'>
              <AlertDialogCancel className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-white">
                {tCommon('user.formations.cancel')}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {tCommon('admin.ambassadors.delete')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>
    </div>
  );
}