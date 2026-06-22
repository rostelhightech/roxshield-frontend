'use client';

import { useEffect, useRef, useState, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { DashboardTopbar } from "@/components/layout/topbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User as UserIcon, Lock, Globe, Save, Camera, Trash2, Upload, Shield, Smartphone, Mail, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { useSettingsStore } from "@/store/settings.store";
import { useForm } from "react-hook-form";
import type { UpdateProfileInput, UpdatePasswordInput } from "@/store/settings.store";
import { useUserStore } from "@/store/user.store";
import { useOrganizationStore } from "@/store/organization.store";
import { useAuthStore } from "@/store/auth.store";
import { apiService } from "@/app/services/api.service";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute("/_authenticated/dashboard/settings")({
  component: SettingsPage,
});

// ── Types 2FA ─────────────────────────────────────────────────────
type TwoFaStatus = { totp: boolean; email: boolean };
type TotpStep = 'idle' | 'qr' | 'done';

function TwoFaSection() {
  const { t: tCommon } = useTranslation('common');
  const { user } = useAuthStore();
  const [twoFa, setTwoFa] = useState<TwoFaStatus | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);

  // TOTP
  const [totpStep, setTotpStep] = useState<TotpStep>('idle');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [totpLoading, setTotpLoading] = useState(false);

  // Email
  const [emailLoading, setEmailLoading] = useState(false);

  // Disable
  const [disablingMethod, setDisablingMethod] = useState<'totp' | 'email' | null>(null);

  const load2FaStatus = async () => {
    setLoadingStatus(true);
    try {
      const res: any = await apiService.get('/auth/2fa/status');
      setTwoFa(res.data);
    } catch { /* apiService gère le toast */ }
    finally { setLoadingStatus(false); }
  };

  useEffect(() => { load2FaStatus(); }, []);

  const startTotpSetup = async () => {
    setTotpLoading(true);
    try {
      const res: any = await apiService.get('/auth/2fa/setup-totp');
      setQrDataUrl(res.data.qrDataUrl);
      setTotpStep('qr');
    } catch { /* apiService gère le toast */ }
    finally { setTotpLoading(false); }
  };

  const confirmTotp = async () => {
    setTotpLoading(true);
    try {
      await apiService.post('/auth/2fa/enable-totp', { code: totpCode });
      setTotpStep('done');
      await load2FaStatus();
    } catch { /* apiService gère le toast */ }
    finally { setTotpLoading(false); }
  };

  const enableEmailOtp = async () => {
    setEmailLoading(true);
    try {
      await apiService.post('/auth/2fa/enable-email', {});
      await load2FaStatus();
    } catch { /* apiService gère le toast */ }
    finally { setEmailLoading(false); }
  };

  const disable2Fa = async (method: 'totp' | 'email') => {
    setDisablingMethod(method);
    try {
      await apiService.post('/auth/2fa/disable', { method });
      if (method === 'totp') { setTotpStep('idle'); setTotpCode(''); setQrDataUrl(''); }
      await load2FaStatus();
    } catch { /* apiService gère le toast */ }
    finally { setDisablingMethod(null); }
  };

  const anyActive = twoFa?.totp || twoFa?.email;

  return (
    <Card className="rounded-sm border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0c1023]">
      <CardHeader className="border-b border-gray-100 dark:border-gray-800/40">
        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white text-lg">
          <Shield className="w-5 h-5 text-[#b27cff]" />
          {tCommon('user.profile.2fa_title')}
        </CardTitle>
        <CardDescription className="text-gray-500 dark:text-gray-400">
          {tCommon('user.profile.2fa_desc')}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-5">
        {loadingStatus ? (
          <div className="flex items-center gap-2 text-gray-400 text-sm py-2">
            <Loader2 className="w-4 h-4 animate-spin" /> {tCommon('user.profile.loading')}
          </div>
        ) : (
          <>
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
                  {tCommon('user.profile.email_code_desc')} <strong>{user?.email}</strong> {tCommon('user.profile.email_code_desc2')}
                </p>
                {twoFa?.email ? (
                  <Button size="sm" variant="outline" disabled={disablingMethod === 'email'}
                    onClick={() => disable2Fa('email')}
                    className="w-full border-red-300 dark:border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20">
                    {disablingMethod === 'email' ? <Loader2 className="w-4 h-4 animate-spin" /> : tCommon('user.profile.disable')}
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
  );
}

const languages = [
  { label: "Français", value: "fr" },
  { label: "English", value: "en" },
  { label: "Português", value: "pt" },
];

export default function SettingsPage() {
  const {
    isLoading,
    isUploadingAvatar,
    fetchProfile,
    updatePassword,
    updateLanguage,
    uploadAvatar,
    deleteAvatar,
    user: profile,
  } = useSettingsStore();
  const { updateUser,isLoading: isLoadingUser } = useUserStore();
  const { user: currentUser } = useAuthStore();
  const { organizations } = useOrganizationStore();

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview local immédiat
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    const ok = await uploadAvatar(file);
    if (ok) {
       await fetchProfile();
    } else {
      toast.error(`❌ ${tCommon('user.profile.upload_error')}`);
      setAvatarPreview(null);
    }
    // Reset input pour permettre le re-upload du même fichier
    e.target.value = '';
  };

  const handleDeleteAvatar = async () => {
    const ok = await deleteAvatar();
    if (ok) {
       setAvatarPreview(null);
    } else {
      toast.error(`❌ ${tCommon('user.profile.delete_error')}`);
    }
  };

  const currentAvatar = avatarPreview ?? profile?.avatarUrl ?? null;
  const initials = profile
    ? `${profile.firstName?.charAt(0) ?? ''}${profile.lastName?.charAt(0) ?? ''}`.toUpperCase()
    : '?';

  const profileForm = useForm<UpdateProfileInput>({
    defaultValues: { firstName: "", lastName: "", email: "", phone: "" },
  });

  const passwordForm = useForm<UpdatePasswordInput>({
    defaultValues: { current: "", new: "", confirm: "" },
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  // 👇 Utiliser les données du profil depuis le store settings
  useEffect(() => {
    if (profile) {
      profileForm.reset({
        firstName: profile?.firstName ?? "",
        lastName: profile?.lastName ?? "",
        email: profile?.email ?? "",
        phone: profile?.phone ?? "",
      });
    }
  }, [profile]);

  const handleProfileSave = profileForm.handleSubmit(async (data) => {
    if (!currentUser?.id) {
      toast.error(`❌ ${tCommon('user.profile.user_not_loaded')}`);
      return;
    }

    let phone = data.phone;
    if (phone && !phone.startsWith('+')) {
      phone = '+' + phone;
    }

    await updateUser(currentUser.id, { ...data, phone });
    
    // Rafraîchir le profil après mise à jour
    await fetchProfile();
  });

  const handlePasswordSave = passwordForm.handleSubmit(async (data) => {
    if (data.new !== data.confirm) {
      toast.error(`❌ ${tCommon('user.profile.passwords_mismatch')}`);
      return;
    }
    const ok = await updatePassword(data);
    if (ok) {
      passwordForm.reset();
    } else {
      toast.error(`❌ ${tCommon('user.profile.update_error')}`);
    }
  });

  const handleLanguageChange = async (lang: string) => {
    const ok = await updateLanguage(lang);

  };

  const {t: tCommon} = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050816]">
      <DashboardTopbar
        title={tCommon('nav.topbar.settings_title')}
        description={tCommon('user.profile.settings_desc')}
      />

      <div className="mx-auto py-6 space-y-6 px-2 sm:px-6">
        <div className="space-y-6">
          {/* SECTION 0 — Photo de profil */}
          <Card className="rounded-sm border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0c1023]">
            <CardHeader className="border-b border-gray-100 dark:border-gray-800/40">
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white text-lg">
                <Camera className="w-5 h-5 text-[#b27cff]" />
                {tCommon('user.profile.profile_picture')}
              </CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                {tCommon('user.profile.accepted_formats')}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center gap-6">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#b27cff]/40 bg-gray-100 dark:bg-[#131930] flex items-center justify-center">
                    {currentAvatar ? (
                      <img
                        src={currentAvatar}
                        alt={tCommon('user.profile.profile_picture')}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-semibold text-[#b27cff]">{initials}</span>
                    )}
                  </div>
                  {isUploadingAvatar && (
                    <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarFileChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isUploadingAvatar}
                    onClick={() => avatarInputRef.current?.click()}
                    className="border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#131930] cursor-pointer"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {isUploadingAvatar ? tCommon('user.profile.uploading') : tCommon('user.profile.change_photo')}
                  </Button>

                  {currentAvatar && !isUploadingAvatar && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleDeleteAvatar}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {tCommon('admin.ambassadors.delete')}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SECTION 1 — Informations du compte */}
          <Card className="rounded-sm border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0c1023]">
            <CardHeader className="border-b border-gray-100 dark:border-gray-800/40">
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white text-lg">
                <UserIcon className="w-5 h-5 text-[#b27cff]" />
                {tCommon('user.profile.account_info')}
              </CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                {tCommon('user.profile.edit_personal_info')}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleProfileSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-gray-700 dark:text-gray-300">{tCommon('user.profile.first_name')}</Label>
                    <Input
                      id="firstName"
                      {...profileForm.register("firstName", { required: true })}
                      className="bg-gray-50 dark:bg-[#131930] border-gray-200 dark:border-white/10 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-gray-700 dark:text-gray-300">{tCommon('user.profile.last_name')}</Label>
                    <Input
                      id="lastName"
                      {...profileForm.register("lastName", { required: true })}
                      className="bg-gray-50 dark:bg-[#131930] border-gray-200 dark:border-white/10 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">{tCommon('login.email_address')}</Label>
                  <Input
                    id="email"
                    type="email"
                    {...profileForm.register("email", { required: true })}
                    className="bg-gray-50 dark:bg-[#131930] border-gray-200 dark:border-white/10 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">
                    {tCommon('admin.ambassadors.table_phone')} <span className="text-xs text-gray-500 dark:text-gray-400">(avec indicatif pays, ex: +221)</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+221 77 123 45 67"
                    {...profileForm.register("phone")}
                    className="bg-gray-50 dark:bg-[#131930] border-gray-200 dark:border-white/10 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-gray-200 hover:bg-gray-300 dark:bg-slate-600 dark:hover:bg-slate-700 text-gray-900 dark:text-white cursor-pointer transition-all duration-300"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isLoadingUser ? tCommon('user.profile.updating') : tCommon('user.profile.save')}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* SECTION 2 — Sécurité */}
          <Card className="rounded-sm border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0c1023]">
            <CardHeader className="border-b border-gray-100 dark:border-gray-800/40">
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white text-lg">
                <Lock className="w-5 h-5 text-[#b27cff]" />
                {tCommon('admin.organizations.security')}
              </CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                {tCommon('user.profile.password_security_desc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handlePasswordSave} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current" className="text-gray-700 dark:text-gray-300">{tCommon('user.profile.current_password')}</Label>
                  <Input
                    id="current"
                    type="password"
                    {...passwordForm.register("current", { required: true })}
                    className="bg-gray-50 dark:bg-[#131930] border-gray-200 dark:border-white/10 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new" className="text-gray-700 dark:text-gray-300">{tCommon('reset_password.new_password')}</Label>
                    <Input
                      id="new"
                      type="password"
                      {...passwordForm.register("new", { required: true })}
                      className="bg-gray-50 dark:bg-[#131930] border-gray-200 dark:border-white/10 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm" className="text-gray-700 dark:text-gray-300">{tCommon('reset_password.confirm_password')}</Label>
                    <Input
                      id="confirm"
                      type="password"
                      {...passwordForm.register("confirm", { required: true })}
                      className="bg-gray-50 dark:bg-[#131930] border-gray-200 dark:border-white/10 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-gray-200 hover:bg-gray-300 dark:bg-slate-600 dark:hover:bg-slate-700 text-gray-900 dark:text-white cursor-pointer transition-all duration-300"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? tCommon('user.profile.updating') : tCommon('user.profile.save')}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* SECTION 3 — Double authentification */}
          <TwoFaSection />

          {/* SECTION 4 — Préférences langue */}
          {/* <Card className="rounded-sm border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0c1023]">
            <CardHeader className="border-b border-gray-100 dark:border-gray-800/40">
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white text-lg">
                <Globe className="w-5 h-5 text-[#b27cff]" />
                {tCommon('user.profile.regional_prefs')}
              </CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                {tCommon('user.profile.language_desc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">{tCommon('user.profile.app_language')}</Label>
                <select
                  value={organizations[0]?.lang ?? "fr"}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  disabled={isLoading}
                  className="h-9 w-full sm:w-[250px] rounded-md border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#131930] px-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50"
                >
                  {languages.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card> */}
        </div>
      </div>
    </div>
  );
}