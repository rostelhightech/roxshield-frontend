"use client";

import { useState, Suspense } from "react";
import { Eye, EyeOff, Lock, Mail, ArrowLeft, CheckCircle2, Shield, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { useLogin } from "@/hooks/use-login";
import { Link } from "@tanstack/react-router";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { apiService } from "@/app/services/api.service";
import type { LoginResult } from "@/hooks/use-login";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const { t, t: tCommon } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // --- Forgot password modal state ---
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotError, setForgotError] = useState("");

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    setForgotLoading(true);
    try {
      await apiService.post("/auth/forgot-password", { email: forgotEmail });
      setForgotSent(true);
    } catch {
      setForgotError("Une erreur est survenue. Réessayez.");
    } finally {
      setForgotLoading(false);
    }
  };

  const resetForgotModal = () => {
    setForgotOpen(false);
    setTimeout(() => { setForgotSent(false); setForgotEmail(""); setForgotError(""); }, 300);
  };

  const { login, finalizeLogin, isLoading } = useLogin();

  // ── 2FA step ─────────────────────────────────────────────────
  const [twoFaState, setTwoFaState] = useState<{
    tempToken: string;
    methods: string[];
    email: string;
  } | null>(null);
  // null = sélecteur affiché si plusieurs méthodes, sinon méthode unique auto-sélectionnée
  const [selectedMethod, setSelectedMethod] = useState<'totp' | 'email' | null>(null);
  const [twoFaCode, setTwoFaCode] = useState('');
  const [twoFaLoading, setTwoFaLoading] = useState(false);
  const [twoFaError, setTwoFaError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const result: LoginResult = await login(email, password);
      if (result && 'requires2FA' in result && result.requires2FA) {
        setTwoFaState(result.data);
        // Si une seule méthode : la sélectionner automatiquement
        if (result.data.methods.length === 1) {
          setSelectedMethod(result.data.methods[0] as 'totp' | 'email');
        } else {
          setSelectedMethod(null);
        }
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Email ou mot de passe incorrect');
    }
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!twoFaState || !selectedMethod) return;
    setTwoFaError('');
    setTwoFaLoading(true);
    try {
      const res: any = await apiService.post('/auth/2fa/verify', {
        tempToken: twoFaState.tempToken,
        code: twoFaCode,
        method: selectedMethod,
      });
      if (res.success && res.data) {
        finalizeLogin(res.data.user, res.data.tokens.accessToken, res.data.tokens.refreshToken);
      }
    } catch (err: any) {
      setTwoFaError(err?.response?.data?.message || 'Code incorrect ou expiré');
    } finally {
      setTwoFaLoading(false);
    }
  };

  const backToMethodPicker = () => {
    setSelectedMethod(null);
    setTwoFaCode('');
    setTwoFaError('');
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-[#070b18]">
      {/* Left side - Image/Visual */}
      <div
 
        className="relative hidden lg:flex lg:w-1/2 items-center justify-center overflow-hidden"
      >
        {/* Background image */}
        <img
          loading="lazy"
          src="https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg?auto=compress&cs=tinysrgb&w=1280"
          alt="Cybersecurity"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Dark overlay - plus léger en mode clair */}
        <div className="absolute inset-0 bg-[#070b18]/70" />

        {/* Subtle tint */}
        <div className="absolute inset-0 bg-gradient-to-t from-rht-violet/20 via-transparent to-transparent" />

        {/* Content */}
        <div className="relative z-10 max-w-lg px-12 text-center">
          <div className="mb-8">
            <div className="relative mx-auto h-32 w-32">
              <div className="relative flex h-full w-full items-center justify-center rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-sm">
                <img src="/logowhite.png" className="h-auto w-16 text-rht-violet-light" alt="Logo" />
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white mb-4"
          >
            {tCommon('login.protect_org')}
          </h2>

          <p
            className="text-lg text-gray-300"
          >
            {tCommon('login.login_desc')}
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="relative flex w-full flex-col justify-center px-8 lg:w-1/2 lg:px-16">
        {/* Back to home link */}
        <a
          className="absolute right-6 top-6 z-20 flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-white"
        >
          {/* Light mode */}
          <img
            src="/logoblacktextblack.png"
            alt="RoxShield"
            className="h-auto w-40 block dark:hidden"
          />

          {/* Dark mode */}
          <img
            src="/logowhitetextwhite.png"
            alt="RoxShield"
            className="h-auto w-40 hidden dark:block"
          />
        </a>

        {/* Form Container */}
        <div
          className="mx-auto w-full max-w-md"
        >
          <AnimatePresence mode="wait">
            {twoFaState ? (
              /* ── Écrans 2FA ── */
              <div key="2fa">
                <div className="mb-8">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#5d2595]/10 mb-4">
                    <Shield className="h-6 w-6 text-[#b27cff]" />
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{tCommon('login.verification')}</h1>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">
                    {!selectedMethod
                      ? tCommon('login.choose_method')
                      : selectedMethod === 'totp'
                        ? tCommon('login.enter_totp')
                        : `Un code à 6 chiffres a été envoyé à ${twoFaState.email}.`}
                  </p>
                </div>

                <AnimatePresence mode="wait">
                  {/* ── Sélecteur de méthode (seulement si les deux sont dispo) ── */}
                  {!selectedMethod ? (
                    <div key="picker"
                      className="space-y-3">
                      {twoFaState.methods.includes('totp') && (
                        <button type="button" onClick={() => setSelectedMethod('totp')}
                          className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-white/10 hover:border-[#b27cff]/50 hover:bg-[#5d2595]/5 transition-all text-left group">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#5d2595]/10 group-hover:bg-[#5d2595]/20 transition-colors">
                            <Smartphone className="h-5 w-5 text-[#b27cff]" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white text-sm">Application d'authentification</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Google Authenticator, Authy…</p>
                          </div>
                        </button>
                      )}
                      {twoFaState.methods.includes('email') && (
                        <button type="button" onClick={() => setSelectedMethod('email')}
                          className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-white/10 hover:border-[#b27cff]/50 hover:bg-[#5d2595]/5 transition-all text-left group">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#5d2595]/10 group-hover:bg-[#5d2595]/20 transition-colors">
                            <Mail className="h-5 w-5 text-[#b27cff]" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white text-sm">{tCommon('user.profile.email_code')}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{twoFaState.email}</p>
                          </div>
                        </button>
                      )}
                      <p className="text-center text-sm text-gray-500 dark:text-gray-400 pt-2">
                        <button type="button" onClick={() => { setTwoFaState(null); setTwoFaCode(''); setTwoFaError(''); }}
                          className="font-medium text-rht-violet-light/80 hover:text-rht-violet-light transition-colors">
                          {tCommon('reset_password.back_to_login_btn')}
                        </button>
                      </p>
                    </div>
                  ) : (
                    /* ── Saisie du code ── */
                    <div key={`code-${selectedMethod}`}>
                      <form onSubmit={handleVerify2FA} className="space-y-5">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {selectedMethod === 'totp' ? 'Code TOTP' : tCommon('user.profile.email_code')}
                          </Label>
                          <Input
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={twoFaCode}
                            onChange={(e) => setTwoFaCode(e.target.value.replace(/\D/g, ''))}
                            placeholder="123456"
                            required
                            autoFocus
                            className="h-12 text-center text-2xl tracking-[0.5em] border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white"
                          />
                        </div>

                        {twoFaError && (
                          <div
                            className="flex items-center gap-2 rounded-lg border border-red-300 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-400">
                            {twoFaError}
                          </div>
                        )}

                        <div  className="pt-2">
                          <Button type="submit" disabled={twoFaLoading || twoFaCode.length !== 6}
                            className="relative h-12 w-full font-semibold text-white hover:opacity-90">
                            {twoFaLoading ? (
                              <span className="flex items-center justify-center gap-2">
                                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                {tCommon('login.verifying')}
                              </span>
                            ) : tCommon('login.confirm')}
                          </Button>
                        </div>

                        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                          {twoFaState.methods.length > 1 ? (
                            <button type="button" onClick={backToMethodPicker}
                              className="font-medium text-rht-violet-light/80 hover:text-rht-violet-light transition-colors">
                              {tCommon('login.choose_other_method')}
                            </button>
                          ) : (
                            <button type="button" onClick={() => { setTwoFaState(null); setTwoFaCode(''); setTwoFaError(''); }}
                              className="font-medium text-rht-violet-light/80 hover:text-rht-violet-light transition-colors">
                              {tCommon('reset_password.back_to_login_btn')}
                            </button>
                          )}
                        </p>
                      </form>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* ── Formulaire de login classique ── */
              <div key="login">
                <div className="mb-8">
                  <div
                    className="relative mb-6 inline-flex h-14 w-14"
                  />
                  <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{t("login.welcomeBack")}</h1>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">{t("login.accessSpace")}</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("login.emailLabel")}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                      <Input
                        name="email"
                        id="email"
                        autoComplete="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder={t("login.emailPlaceholder")}
                        className="h-12 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/50 pl-11 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-rht-violet focus:ring-rht-violet/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("login.passwordLabel")}</Label>
                      <button
                        type="button"
                        onClick={() => setForgotOpen(true)}
                        className="text-xs font-medium text-indigo-500 hover:text-indigo-400 transition-colors cursor-pointer"
                      >
                        {tCommon('login.forgot_password')}
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                      <Input
                        name="password"
                        id="password"
                        autoComplete="current-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="h-12 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/50 pl-11 pr-11 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-rht-violet focus:ring-rht-violet/20"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div
                      className="flex items-center gap-2 rounded-lg border border-red-300 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-400"
                    >
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="relative h-12 w-full overflow-hidden rounded-lg font-semibold text-white hover:opacity-90 transition-opacity"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          {t("login.connecting")}
                        </span>
                      ) : (
                        t("login.signIn")
                      )}
                    </Button>
                  </div>
                </form>

                <div className="mt-6 space-y-3">
                  <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                    Pas encore de compte ?{" "}
                    <Link
                      to="/register"
                      search={{} as any}
                      className="font-medium text-indigo-500 hover:text-indigo-400 transition-colors"
                    >
                      {tCommon('login.test_app')}
                    </Link>
                  </p>

                  <p className="text-center text-xs text-gray-400 dark:text-gray-500">
                    {t("login.notClient")}{" "}
                    <a href="https://roxshield.com/#tarifs" className="font-medium text-rht-violet-light/70 hover:text-rht-violet-light">
                      {t("login.viewPricing")} &rarr;
                    </a>
                  </p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
      </div>

      {/* ── Forgot Password Modal ── */}
      <Dialog open={forgotOpen} onOpenChange={resetForgotModal}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white text-lg font-semibold">
              {tCommon('login.reset_password')}
            </DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400 text-sm">
              {tCommon('login.reset_desc')}
            </DialogDescription>
          </DialogHeader>

          <AnimatePresence mode="wait">
            {forgotSent ? (
              <div
                key="sent"
              
                className="flex flex-col items-center gap-3 py-4 text-center"
              >
                <CheckCircle2 className="h-12 w-12 text-green-500" />
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {tCommon('login.if')} <strong>{forgotEmail}</strong> {tCommon('login.matches_account')}
                </p>
                <Button onClick={resetForgotModal} variant="outline" className="mt-2">
                  {tCommon('login.close')}
                </Button>
              </div>
            ) : (
              <form
                key="form"
           
                onSubmit={handleForgotPassword}
                className="space-y-4 pt-2"
              >
                <div className="space-y-2">
                  <Label htmlFor="forgot-email" className="text-sm text-gray-700 dark:text-gray-300">
                    {tCommon('login.email_address')}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="forgot-email"
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder={tCommon('login.email_placeholder')}
                      className="pl-10 h-11 bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                {forgotError && (
                  <p className="text-xs text-red-500">{forgotError}</p>
                )}

                <div className="flex gap-2 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForgotModal}
                    className="flex-1"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" /> {tCommon('admin.campaigns.back')}
                  </Button>
                  <Button
                    type="submit"
                    disabled={forgotLoading}
                    className="flex-1 font-semibold text-white"
                  >
                    {forgotLoading ? (
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : tCommon('login.send_link')}
                  </Button>
                </div>
              </form>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </div>
  );
}