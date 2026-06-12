'use client';

import { useEffect, useMemo, useState } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOrganizationStore } from '@/store/organization.store';
import { useSmtpProfileStore } from '@/store/smtp-profile.store';
import { SmtpProfileForm } from './smtp-profile-form';

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export default function SmtpProfiles() {
  const { organizations, fetchAll: fetchOrganizations } = useOrganizationStore();
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
  const [testText, setTestText] = useState('Ceci est un e-mail de test envoyé depuis le profil SMTP.');
  const [testError, setTestError] = useState('');

  useEffect(() => {
    fetchOrganizations();
    fetchAll();
  }, [fetchAll, fetchOrganizations]);

  const sortedProfiles = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();
    const profiles = filteredProfiles.filter((profile) => {
      if (!normalizedSearch) return true;
      return [
        profile.name,
        profile.id,
        profile.host,
        profile.fromAddress,
        profile.organization?.name ?? '',
      ].some((value) => value?.toLowerCase().includes(normalizedSearch));
    });

    return profiles.sort((a, b) => {
      const getValue = (item: typeof profiles[number]) => {
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
  }, [filteredProfiles, search, sortBy, sortOrder]);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Supprimer ce profil SMTP ?');
    if (!confirmed) return;

    await deleteSmtpProfile(id);
    if (currentSmtpProfile?.id === id) {
      setCurrentSmtpProfile(null);
    }
  };

  const handleSendTestEmail = async () => {
    if (!currentSmtpProfile) return;

    if (!testRecipient.trim()) {
      setTestError('Le destinataire est requis');
      return;
    }

    if (!isValidEmail(testRecipient)) {
      setTestError('L’adresse email n’est pas valide');
      return;
    }

    setTestError('');

    try {
      await sendTestEmail(currentSmtpProfile.id, {
        to: testRecipient.trim(),
        subject: testSubject || `Test SMTP - ${currentSmtpProfile.name}`,
        text: testText,
      });
      setIsTestDialogOpen(false);
      setTestRecipient('');
      setTestSubject(`Test SMTP - ${currentSmtpProfile.name}`);
      setTestText('Ceci est un e-mail de test envoyé depuis le profil SMTP.');
    } catch {
      setTestError('Impossible d’envoyer l’e-mail de test.');
    }
  };

  useEffect(() => {
    if (currentSmtpProfile) {
      setTestSubject(`Test SMTP - ${currentSmtpProfile.name}`);
      setTestText('Ceci est un e-mail de test envoyé depuis le profil SMTP.');
      setTestError('');
    }
  }, [currentSmtpProfile]);

  return (
    <div className="min-h-screen bg-[#050816]">
      <div className="mx-auto">
        <div className="grid gap-6 lg:grid-cols-[minmax(320px,360px)_minmax(0,1fr)]">
          <section className="bg-[#0c1023] rounded-md p-6 border border-white/5 shadow-lg">
            <div className="mb-6">
              <h1 className="text-xl font-semibold text-white">Profils SMTP</h1>
              <p className="text-sm text-gray-400">Gérez les configurations SMTP par organisation et synchronisez-les avec Gophish.</p>
            </div>

            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Rechercher par nom, organisation, hôte ou adresse"
                className="min-w-0 flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-500"
              />

              <div className="flex items-center gap-2">
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
                  <SelectTrigger className="bg-gray-800/50 border border-white/10 text-white mt-0">
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-200 border-gray-700">
                    <SelectItem value="createdAt">Date</SelectItem>
                    <SelectItem value="name">Nom</SelectItem>
                    <SelectItem value="organization">Organisation</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  className="text-gray-700"
                  onClick={() => setSortOrder((order) => (order === 'asc' ? 'desc' : 'asc'))}
                >
                  {sortOrder === 'asc' ? 'Asc' : 'Desc'}
                </Button>
              </div>
            </div>

            {isLoading && sortedProfiles.length === 0 ? (
              <p className="text-sm text-gray-400">Chargement des profils SMTP...</p>
            ) : sortedProfiles.length === 0 ? (
              <p className="text-sm text-gray-400">Aucun profil SMTP trouvé.</p>
            ) : (
              <div className="space-y-3">
                {sortedProfiles.map((profile) => {
                  const isSelected = profile.id === currentSmtpProfile?.id;
                  return (
                    <div
                    onClick={() => fetchById(profile.id)}
  key={profile.id}
  className={`rounded-md border p-4 transition ${
    isSelected ? 'border-sky-400 bg-sky-400/10' : 'border-white/10 bg-white/5'
  }`}
>
  <div className="flex flex-col gap-3">

    {/* Infos */}
    <div className="flex min-w-0 items-center gap-2">
      {isSelected && <span className="h-2 w-2 shrink-0 rounded-full bg-sky-400" />}
      <p className="truncate text-sm font-medium text-white">{profile.name}</p>
    </div>

    <div className="flex flex-wrap gap-x-4 gap-y-1">
      <p className="text-xs text-gray-400">
        <span className="text-gray-500">Organisation :</span> {profile.organization?.name ?? 'Inconnue'}
      </p>
      <p className="text-xs text-gray-400">
        <span className="text-gray-500">Expéditeur :</span> {profile.fromName ?? profile.fromAddress}
      </p>
      <p className="text-xs text-gray-400">
        <span className="text-gray-500">Hôte :</span> {profile.host}
      </p>
    </div>

    {/* Actions */}
    <div className="flex items-center gap-2 pt-1">
      <Button
        size="sm"
        variant={isSelected ? 'secondary' : 'outline'}
        className="text-gray-700"
        onClick={() => fetchById(profile.id)}
      >
        {isSelected ? 'Sélectionné' : 'Détails'}
      </Button>
      <Button size="sm" variant="destructive" onClick={() => handleDelete(profile.id)}>
        Supprimer
      </Button>
    </div>

  </div>
</div>
                  );
                })}
              </div>
            )}
          </section>

          <section className="bg-[#0c1023] rounded-md p-6 border border-white/5 shadow-lg">
  {currentSmtpProfile && (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-gray-400">
        Profil sélectionné : <span className="text-white">{currentSmtpProfile.name}</span>
      </p>
      <Button size="sm" variant="secondary" onClick={() => setIsTestDialogOpen(true)}>
        Envoyer un e-mail de test
      </Button>
    </div>
  )}

  <SmtpProfileForm
    organizations={organizations}
    profile={currentSmtpProfile}
    onCancel={() => setCurrentSmtpProfile(null)}
  />

  <Dialog open={isTestDialogOpen} onOpenChange={setIsTestDialogOpen}>
    <DialogContent className="sm:max-w-lg bg-[#0c1023] border border-white/10">
      <DialogHeader>
        <DialogTitle>Envoyer un e-mail de test</DialogTitle>
        <DialogDescription className="text-gray-400">
          Envoyer un e-mail de test à l'adresse indiquée en utilisant le profil SMTP sélectionné.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4">
        <div>
          <Label htmlFor="testRecipient" className="text-gray-300">Destinataire</Label>
          <Input
            id="testRecipient"
            value={testRecipient}
            onChange={(e) => {
              const value = e.target.value;
              setTestRecipient(value);
              if (!value.trim()) {
                setTestError('Le destinataire est requis');
              } else if (!isValidEmail(value)) {
                setTestError('L’adresse email n’est pas valide');
              } else {
                setTestError('');
              }
            }}
            placeholder="destinataire@example.com"
            className="mt-1 bg-gray-800/50 border-gray-700 text-white"
          />
        </div>
        <div>
          <Label htmlFor="testSubject" className="text-gray-300">Sujet</Label>
          <Input
            id="testSubject"
            value={testSubject}
            onChange={(e) => setTestSubject(e.target.value)}
            className="mt-1 bg-gray-800/50 border-gray-700 text-white"
          />
        </div>
        <div>
          <Label htmlFor="testText" className="text-gray-300">Message</Label>
          <Textarea
            id="testText"
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            rows={5}
            className="mt-1 bg-gray-800/50 border-gray-700 text-white"
          />
        </div>
        {testError && <p className="text-sm text-red-400">{testError}</p>}
      </div>

      <DialogFooter className="border-t border-white/10 pt-4 bg-[#0c1023]">
        <div className="flex w-full items-center justify-end gap-2">
          <DialogClose >
            <Button variant="outline">Annuler</Button>
          </DialogClose>
          <Button
            onClick={handleSendTestEmail}
            disabled={isSendingTestEmail || !testRecipient.trim() || !isValidEmail(testRecipient)}
          >
            {isSendingTestEmail ? 'Envoi...' : 'Envoyer'}
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</section>
        </div>
      </div>
    </div>
  );
}
