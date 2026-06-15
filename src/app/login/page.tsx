"use client";

import { useState, Suspense } from "react";
import { Shield, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { HexagonIcon } from "../ui/HexagonIcon";
import { useLogin } from "@/hooks/use-login";
import { Link } from "@tanstack/react-router";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const { t } = useTranslation();

  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { login,isLoading } = useLogin();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    await login(email, password);
    
 
    

  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-[#070b18]">
      {/* Left side - Image/Visual */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative hidden lg:flex lg:w-1/2 items-center justify-center overflow-hidden"
      >
        {/* Background image */}
        <img
          src="https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg?auto=compress&cs=tinysrgb&w=1280"
          alt="Cybersecurity"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Dark overlay - plus léger en mode clair */}
        <div className="absolute inset-0  bg-[#070b18]/70" />

        {/* Subtle tint */}
        <div className="absolute inset-0 bg-gradient-to-t from-rht-violet/20 via-transparent to-transparent" />

        {/* Content */}
        <div className="relative z-10 max-w-lg px-12 text-center">
          <motion.div className="mb-8">
            <div className="relative mx-auto h-32 w-32">
              <div className="relative flex h-full w-full items-center justify-center rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-sm">
                <Shield className="h-16 w-16 text-rht-violet-light" />
              </div>
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-3xl font-bold text-white mb-4"
          >
            Protégez votre organisation
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-lg text-gray-300"
          >
            Sensibilisez vos équipes aux risques de cybersécurité avec des campagnes de phishing simulées et des formations interactives.
          </motion.p>
        </div>
      </motion.div>

      {/* Right side - Form */}
      <div className="relative flex w-full flex-col justify-center px-8 lg:w-1/2 lg:px-16">
        {/* Back to home link */}
        <motion.a
          href="https://roxshield.com"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute right-6 top-6 z-20 flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-white"
        >
          <Shield className="h-4 w-4" />
          <span><span className="font-normal opacity-60">Rox</span>Shield</span>
        </motion.a>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto w-full max-w-md"
        >
          <div className="mb-8">
            <motion.div
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative mb-6 inline-flex h-14 w-14"
            >
              <HexagonIcon />
              <Shield className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-rht-violet-light" />
            </motion.div>
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
              <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("login.passwordLabel")}</Label>
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
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-lg border border-red-300 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-400"
              >
                <span>{error}</span>
              </motion.div>
            )}

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="pt-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="relative h-12 w-full overflow-hidden rounded-lg  font-semibold text-white hover:opacity-90 transition-opacity"
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
            </motion.div>
          </form>

          <div className="mt-6 space-y-3">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Pas encore de compte ?{" "}
               <Link
  to="/register"
  search={{} as any}
  className="font-medium text-indigo-500 hover:text-indigo-400 transition-colors"
>
  Tester notre application
</Link>
            </p>

            <p className="text-center text-xs text-gray-400 dark:text-gray-500">
              {t("login.notClient")}{" "}
              <a href="/pricing" className="font-medium text-rht-violet-light/70 hover:text-rht-violet-light">
                {t("login.viewPricing")} &rarr;
              </a>
            </p>
          </div>
        </motion.div>

        {/* Footer */}
 
      </div>
    </div>
  );
}