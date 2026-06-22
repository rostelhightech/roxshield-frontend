"use client";

import { useState, Suspense } from "react";
import { Lock, Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { useSearch, useNavigate } from "@tanstack/react-router";
import { apiService } from "@/app/services/api.service";
import { useTranslation } from 'react-i18next';

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const search = useSearch({ from: "/reset-password" }) as { token?: string };
  const navigate = useNavigate();
  const token = search.token ?? "";

  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const { t: tCommon } = useTranslation('common');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (newPassword.length < 8) {
      setErrorMsg("Le mot de passe doit faire au moins 8 caractères.");
      return;
    }
    if (newPassword !== confirm) {
      setErrorMsg("Les mots de passe ne correspondent pas.");
      return;
    }

    setIsLoading(true);
    try {
      await apiService.post("/auth/reset-password", { token, newPassword });
      setStatus("success");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Lien invalide ou expiré.";
      setErrorMsg(msg);
      setStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-[#070b18]">
      {/* Left visual — identique à la login page */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative hidden lg:flex lg:w-1/2 items-center justify-center overflow-hidden"
      >
        <img
          src="https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg?auto=compress&cs=tinysrgb&w=1280"
          alt="Cybersecurity"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[#070b18]/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-rht-violet/20 via-transparent to-transparent" />
        <div className="relative z-10 max-w-lg px-12 text-center">
          <div className="relative mx-auto mb-8 h-32 w-32">
            <div className="relative flex h-full w-full items-center justify-center rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-sm">
              <img src="/logowhite.png" className="h-auto w-16" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">{tCommon('reset_password.new_password')}</h2>
          <p className="text-lg text-gray-300">
            {tCommon('reset_password.new_password_desc')}
          </p>
        </div>
      </motion.div>

      {/* Right — form */}
      <div className="relative flex w-full flex-col justify-center px-8 lg:w-1/2 lg:px-16">
        {/* Logo mobile */}
        <motion.a
          href="https://roxshield.com"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute right-6 top-6 z-20"
        >
          <img src="/logoblacktextblack.png" alt="RoxShield" className="h-auto w-40 block dark:hidden" />
          <img src="/logowhitetextwhite.png" alt="RoxShield" className="h-auto w-40 hidden dark:block" />
        </motion.a>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto w-full max-w-md"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              {tCommon('login.reset_password')}
            </h1>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              {tCommon('reset_password.subtitle')}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-4 py-8 text-center"
              >
                <CheckCircle2 className="h-16 w-16 text-green-500" />
                <div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{tCommon('reset_password.updated')}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {tCommon('reset_password.updated_desc')}
                  </p>
                </div>
                <Button
                  onClick={() => navigate({ to: "/login" })}
                  className="mt-2 font-semibold text-white"
                >
                  Se connecter
                </Button>
              </motion.div>
            ) : status === "error" && !errorMsg ? (
              <motion.div
                key="expired"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-4 py-8 text-center"
              >
                <XCircle className="h-16 w-16 text-red-500" />
                <div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{tCommon('reset_password.invalid_link')}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {tCommon('reset_password.invalid_link_desc')}
                  </p>
                </div>
                <Button
                  onClick={() => navigate({ to: "/login" })}
                  variant="outline"
                  className="mt-2"
                >
                  {tCommon('reset_password.back_to_login')}
                </Button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {!token && (
                  <div className="flex items-center gap-2 rounded-lg border border-amber-300 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
                    {tCommon('reset_password.invalid_token')}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {tCommon('reset_password.new_password')}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                    <Input
                      id="new-password"
                      type={showNew ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-12 pl-11 pr-11 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      {showNew ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400">{tCommon('reset_password.min_chars')}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {tCommon('reset_password.confirm_password')}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                    <Input
                      id="confirm-password"
                      type={showConfirm ? "text" : "password"}
                      required
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="••••••••"
                      className="h-12 pl-11 pr-11 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 rounded-lg border border-red-300 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-400"
                  >
                    {errorMsg}
                  </motion.div>
                )}

                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="pt-2">
                  <Button
                    type="submit"
                    disabled={isLoading || !token}
                    className="relative h-12 w-full font-semibold text-white hover:opacity-90 transition-opacity"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        {tCommon('reset_password.updating')}
                      </span>
                    ) : tCommon('login.reset_password')}
                  </Button>
                </motion.div>

                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                  <button
                    type="button"
                    onClick={() => navigate({ to: "/login" })}
                    className="font-medium text-rht-violet-light/80 hover:text-rht-violet-light transition-colors"
                  >
                    {tCommon('reset_password.back_to_login_btn')}
                  </button>
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
