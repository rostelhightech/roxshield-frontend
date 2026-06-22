'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DashboardTopbar } from '@/components/layout/topbar';
import { useAuthStore } from '@/store/auth.store';
import { useSettingsStore } from '@/store/settings.store';
import {
  Mail, Briefcase, Calendar, Shield, Camera,
  Upload, Trash2, Smartphone, KeyRound, CheckCircle2,
  AlertTriangle, Loader2, User,
} from 'lucide-react';
import { ChangePasswordDialog } from '@/components/change-password-dialog';
import { apiService } from '@/app/services/api.service';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

// ── Types ────────────────────────────────────────────────────────
type TwoFaStatus = { totp: boolean; email: boolean };
type TotpStep = 'idle' | 'qr' | 'verify' | 'done';

// ── Onglets ──────────────────────────────────────────────────────


export default function UserProfilePage() {
  const { t: tCommon } = useTranslation('common');
  const { user } = useAuthStore();
  const { user: profile, fetchProfile, uploadAvatar, deleteAvatar, isUploadingAvatar } = useSettingsStore();
  const [tab, setTab] = useState<'profile' | 'security'>('profile');
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const TABS = [
  { id: 'profile', label: tCommon('user.profile.tab_profile'), icon: User },
  { id: 'security', label: tCommon('admin.organizations.security'), icon: Shield },
] as const;

  useEffect(() => { fetchProfile(); }, []);

  const currentAvatar = avatarPreview ?? profile?.avatarUrl ?? null;
  const initials = user
    ? `${user.firstName?.charAt(0) ?? ''}${user.lastName?.charAt(0) ?? ''}`.toUpperCase()
    : '?';

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
    const ok = await uploadAvatar(file);
    if (ok) { await fetchProfile(); }
    else { setAvatarPreview(null); }
    e.target.value = '';
  };

  const handleDeleteAvatar = async () => {
    const ok = await deleteAvatar();
    if (ok) { setAvatarPreview(null); }
  };

  if (!user) return null;

  return (
    <>
      <DashboardTopbar title={tCommon('nav.topbar.profile_title')} description={tCommon('nav.topbar.profile_desc')} />

      <div className="min-h-screen bg-gray-50 dark:bg-[#050816] px-6 pb-12">
        {/* Tabs */}
        <div className="flex gap-1 pt-6 pb-2 border-b border-gray-200 dark:border-white/10 mb-6">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors',
                tab === id
                  ? 'text-[#b27cff] border-b-2 border-[#b27cff] bg-transparent'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === 'profile' ? (
            <motion.div key="profile" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-6">
              {/* Photo de profil */}
              <Card className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1023]/90">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Camera className="w-5 h-5 text-[#b27cff]" /> {tCommon('user.profile.profile_picture')}
                  </CardTitle>
                  <CardDescription className="text-gray-500 dark:text-gray-400">
                    {tCommon('user.profile.accepted_formats')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6">
                    <div className="relative shrink-0">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#b27cff]/40 bg-gray-100 dark:bg-[#131930] flex items-center justify-center">
                        {currentAvatar ? (
                          <img src={currentAvatar} alt="Photo" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-2xl font-semibold text-[#b27cff]">{initials}</span>
                        )}
                      </div>
                      {isUploadingAvatar && (
                        <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                          <Loader2 className="w-5 h-5 text-white animate-spin" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarFileChange} />
                      <Button type="button" variant="outline" size="sm" disabled={isUploadingAvatar}
                        onClick={() => avatarInputRef.current?.click()}
                        className="border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300">
                        <Upload className="w-4 h-4 mr-2" />
                        {isUploadingAvatar ? tCommon('user.profile.upload_short') : tCommon('user.profile.change_photo')}
                      </Button>
                      {currentAvatar && !isUploadingAvatar && (
                        <Button type="button" variant="ghost" size="sm" onClick={handleDeleteAvatar}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20">
                          <Trash2 className="w-4 h-4 mr-2" /> {tCommon('admin.ambassadors.delete')}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Infos personnelles */}
              <Card className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1023]/90">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">{tCommon('user.profile.personal_info')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-gray-700 dark:text-white">{tCommon('user.profile.first_name')}</Label>
                      <Input value={user.firstName} disabled className="bg-white dark:bg-slate-800/50 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700 dark:text-white">{tCommon('user.profile.last_name')}</Label>
                      <Input value={user.lastName} disabled className="bg-white dark:bg-slate-800/50 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-white flex items-center gap-2"><Mail className="w-4 h-4" /> {tCommon('user.profile.email')}</Label>
                    <Input value={user.email} disabled className="bg-white dark:bg-slate-800/50 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white" />
                  </div>
                  {user.position && (
                    <div className="space-y-2">
                      <Label className="text-gray-700 dark:text-white flex items-center gap-2"><Briefcase className="w-4 h-4" /> {tCommon('admin.users.position_label')}</Label>
                      <Input value={user.position} disabled className="bg-white dark:bg-slate-800/50 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white" />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Infos compte */}
              <Card className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1023]/90">
                <CardHeader><CardTitle className="text-gray-900 dark:text-white">{tCommon('user.profile.account_info')}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <div>
                        <p className="text-gray-900 dark:text-white font-medium">{tCommon('user.profile.role')}</p>
                        <p className="text-sm text-gray-500 dark:text-slate-400">{tCommon('user.profile.access_level')}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 text-sm font-medium">
                      {user.role === 'superadmin' ? tCommon('user.profile.role_super') : user.role === 'admin' ? tCommon('user.profile.role_admin') : tCommon('admin.grc.user_name')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <div>
                        <p className="text-gray-900 dark:text-white font-medium">{tCommon('user.profile.member_since')}</p>
                        <p className="text-sm text-gray-500 dark:text-slate-400">{tCommon('user.profile.created_date')}</p>
                      </div>
                    </div>
                    <span className="text-gray-900 dark:text-white">
                      {new Date(user?.createdAt as string).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div key="security" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-6">
              <SecurityTab onChangePassword={() => setIsChangePasswordOpen(true)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ChangePasswordDialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen} />
    </>
  );
}

// ── Onglet Sécurité ──────────────────────────────────────────────
function SecurityTab({ onChangePassword }: { onChangePassword: () => void }) {
  const [twoFa, setTwoFa] = useState<TwoFaStatus | null>(null);
  const [loading, setLoading] = useState(true);

  // TOTP setup flow
  const [totpStep, setTotpStep] = useState<TotpStep>('idle');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [totpLoading, setTotpLoading] = useState(false);

  // Email OTP
  const [emailLoading, setEmailLoading] = useState(false);

  // Disable (par méthode)
  const [disablingMethod, setDisablingMethod] = useState<'totp' | 'email' | null>(null);

  const load2FaStatus = async () => {
    setLoading(true);
    try {
      const res: any = await apiService.get('/auth/2fa/status');
      setTwoFa(res.data);
    } catch { /* apiService handles the toast */ }
    finally { setLoading(false); }
  };

  useEffect(() => { load2FaStatus(); }, []);

  // ── TOTP ────────────────────────────────────────────────────
  const startTotpSetup = async () => {
    setTotpLoading(true);
    try {
      const res: any = await apiService.get('/auth/2fa/setup-totp');
      setQrDataUrl(res.data.qrDataUrl);
      setTotpStep('qr');
    } catch { /* apiService handles the toast */ }
    finally { setTotpLoading(false); }
  };

  const confirmTotp = async () => {
    setTotpLoading(true);
    try {
      await apiService.post('/auth/2fa/enable-totp', { code: totpCode });
      setTotpStep('done');
      await load2FaStatus();
    } catch { /* apiService handles the toast */ }
    finally { setTotpLoading(false); }
  };

  // ── Email OTP ────────────────────────────────────────────────
  const enableEmailOtp = async () => {
    setEmailLoading(true);
    try {
      await apiService.post('/auth/2fa/enable-email', {});
      await load2FaStatus();
    } catch { /* apiService handles the toast */ }
    finally { setEmailLoading(false); }
  };

  // ── Disable par méthode ──────────────────────────────────────
  const disable2Fa = async (method: 'totp' | 'email') => {
    setDisablingMethod(method);
    try {
      await apiService.post('/auth/2fa/disable', { method });
      if (method === 'totp') { setTotpStep('idle'); setTotpCode(''); setQrDataUrl(''); }
      await load2FaStatus();
    } catch { /* apiService handles the toast */ }
    finally { setDisablingMethod(null); }
  };

  const {t: tCommon} = useTranslation('common');

  const anyActive = twoFa?.totp || twoFa?.email;

  return (
    <div className="space-y-6">
      {/* Mot de passe */}
      <Card className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1023]/90">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <KeyRound className="w-5 h-5 text-[#b27cff]" /> {tCommon('user.profile.password')}
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            {tCommon('user.profile.password_desc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={onChangePassword}
            className="border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300">
            {tCommon('user.profile.change_password')}
          </Button>
        </CardContent>
      </Card>

      {/* 2FA */}
      <Card className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1023]/90">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Shield className="w-5 h-5 text-[#b27cff]" /> {tCommon('user.profile.2fa_title')}
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            {tCommon('user.profile.2fa_desc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {loading ? (
            <div className="flex items-center gap-2 text-gray-400 text-sm py-4">
              <Loader2 className="w-4 h-4 animate-spin" /> {tCommon('user.profile.loading')}
            </div>
          ) : (
            <>
              {/* Bannière globale */}
              {!anyActive && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <p className="text-sm text-amber-800 dark:text-amber-300">
                    {tCommon('user.profile.2fa_no_method')}
                  </p>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                {/* ── Carte TOTP ── */}
                <div className={cn(
                  'p-4 rounded-lg border space-y-3 transition-colors',
                  twoFa?.totp
                    ? 'border-green-300 dark:border-green-500/30 bg-green-50/50 dark:bg-green-500/5'
                    : 'border-gray-200 dark:border-white/10'
                )}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-5 h-5 text-[#b27cff]" />
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{tCommon('user.profile.totp_app')}</p>
                    </div>
                    {twoFa?.totp && (
                      <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {tCommon('common.active')}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {tCommon('user.profile.totp_desc')}
                  </p>

                  {twoFa?.totp ? (
                    <Button size="sm" variant="outline" disabled={disablingMethod === 'totp'}
                      onClick={() => disable2Fa('totp')}
                      className="w-full border-red-300 dark:border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20">
                      {disablingMethod === 'totp' ? <Loader2 className="w-4 h-4 animate-spin" /> : tCommon('user.profile.disable')}
                    </Button>
                  ) : (
                    <AnimatePresence mode="wait">
                      {totpStep === 'idle' && (
                        <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          <Button size="sm" onClick={startTotpSetup} disabled={totpLoading}
                            className="w-full font-medium text-white">
                            {totpLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : tCommon('user.profile.configure')}
                          </Button>
                        </motion.div>
                      )}
                      {totpStep === 'qr' && (
                        <motion.div key="qr" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {tCommon('user.profile.totp_scan_qr')}
                          </p>
                          <div className="flex justify-center">
                            <img src={qrDataUrl} alt="QR TOTP" className="w-36 h-36 rounded-lg border border-gray-200 dark:border-white/10" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs text-gray-700 dark:text-gray-300">{tCommon('user.profile.verification_code')}</Label>
                            <Input
                              placeholder="123456"
                              maxLength={6}
                              value={totpCode}
                              onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                              className="text-center text-lg tracking-widest h-10 border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => { setTotpStep('idle'); setTotpCode(''); }}
                              className="flex-1 border-gray-200 dark:border-white/10">
                              {tCommon('user.formations.cancel')}
                            </Button>
                            <Button size="sm" onClick={confirmTotp} disabled={totpLoading || totpCode.length !== 6}
                              className="flex-1 font-medium text-white">
                              {totpLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : tCommon('login.confirm')}
                            </Button>
                          </div>
                        </motion.div>
                      )}
                      {totpStep === 'done' && (
                        <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
                          <CheckCircle2 className="w-4 h-4" /> {tCommon('user.profile.enabled_success')}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>

                {/* ── Carte Email OTP ── */}
                <div className={cn(
                  'p-4 rounded-lg border space-y-3 transition-colors',
                  twoFa?.email
                    ? 'border-green-300 dark:border-green-500/30 bg-green-50/50 dark:bg-green-500/5'
                    : 'border-gray-200 dark:border-white/10'
                )}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="w-5 h-5 text-[#b27cff]" />
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{tCommon('user.profile.email_code')}</p>
                    </div>
                    {twoFa?.email && (
                      <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {tCommon('common.active')}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {tCommon('user.profile.email_code_desc')} <strong>{useAuthStore.getState().user?.email}</strong> {tCommon('user.profile.email_code_desc2')}
                  </p>
                  {twoFa?.email ? (
                    <Button size="sm" variant="outline" disabled={disablingMethod === 'email'}
                      onClick={() => disable2Fa('email')}
                      className="w-full border-red-300 dark:border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20">
                      {disablingMethod === 'email' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Désactiver'}
                    </Button>
                  ) : (
                    <Button size="sm" onClick={enableEmailOtp} disabled={emailLoading}
                      className="w-full font-medium text-white">
                      {emailLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : tCommon('user.profile.enable')}
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
