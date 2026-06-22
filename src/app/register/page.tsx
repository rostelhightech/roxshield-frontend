"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/ui/combobox";
import { PhoneInput } from "@/components/ui/phone-input";
import { useTranslation } from "react-i18next";
import { COUNTRIES, SECTORS } from "@/lib/constants";
import { useDemoStore } from "@/store/demo.store";
import {
  Send,
  CheckCircle,
  Clock,
  Sparkles,
  Users,
  Target,
  BarChart3,
} from "lucide-react";
import { Link, useSearch } from "@tanstack/react-router";

// Types
interface RegisterFormState {
  name: string;
  email: string;
  company: string;
  phone: string;
  size: string;
  country: string;
  sector: string;
  needs: string;
}

interface RegisterSearchParams {
  ref?: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  company?: string;
  phone?: string;
  size?: string;
  country?: string;
}

type SubmitState = 'idle' | 'loading' | 'success' | 'error';

// Constants
const COMPANY_SIZES = [
  { value: "1-20", label: "1 – 20" },
  { value: "21-50", label: "21 – 50" },
  { value: "51-200", label: "51 – 200" },
  { value: "201-500", label: "201 – 500" },
  { value: "500+", label: "500+" },
];

export default function RegisterPage() {
  const { t: tCommon } = useTranslation('common');
  const { createDemoRequest, isLoading } = useDemoStore();
  const search = useSearch({ from: "/register" }) as RegisterSearchParams;

  // Form state
  const [form, setForm] = useState<RegisterFormState>({
    name: "",
    email: "",
    company: "",
    phone: "",
    size: "",
    country: "",
    sector: "",
    needs: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitState, setSubmitState] = useState<SubmitState>('idle');

  // Memoized options
  const countryOptions = useMemo(() => 
    COUNTRIES.map((c) => ({
      value: c.name,
      label: c.name,
      icon: c.flag,
      sub: c.dial,
    })), []
  );

  const sectorOptions = useMemo(() => 
    SECTORS.map((s) => ({
      value: s,
      label: s,
    })), []
  );

  const features = useMemo(() => [
    {
      icon: Target,
      labelKey: "register.feature.phishing",
      subKey: "register.feature.phishing_desc",
    },
    {
      icon: Users,
      labelKey: "register.feature.users",
      subKey: "register.feature.users_desc",
    },
    {
      icon: BarChart3,
      labelKey: "register.feature.reports",
      subKey: "register.feature.reports_desc",
    },
  ], []);

  // Handle ambassador referral
  useEffect(() => {
    if (search?.ref) {
      localStorage.setItem("ambassadorRef", search.ref);
    }
  }, [search]);

  // Validation
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!form.name.trim()) {
      newErrors.name = tCommon('register.error_name_required');
    }

    if (!form.email.trim()) {
      newErrors.email = tCommon('register.error_email_required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = tCommon('register.error_email_invalid');
    }

    if (!form.company.trim()) {
      newErrors.company = tCommon('register.error_company_required');
    }

    if (!form.phone.trim()) {
      newErrors.phone = tCommon('register.error_phone_required');
    }

    if (!form.size) {
      newErrors.size = tCommon('register.error_size_required');
    }

    if (!form.country) {
      newErrors.country = tCommon('register.error_country_required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form, tCommon]);

  // Handle form field changes
  const handleFieldChange = useCallback((
    field: keyof RegisterFormState,
    value: string
  ) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user types
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  // Submit handler
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to first error
      const firstError = document.querySelector('[aria-invalid="true"]');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setSubmitState('loading');
    const ambassadorRef = localStorage.getItem("ambassadorRef");

    try {
      const success = await createDemoRequest({
        name: form.company,
        adminName: form.name,
        adminEmail: form.email,
        adminPhone: form.phone,
        companySize: form.size,
        country: form.country,
        sector: form.sector || undefined,
        message: form.needs || undefined,
        type: "enterprise",
        referredByAmbassadorId: ambassadorRef || undefined,
      });

      if (success) {
        setSubmitState('success');
        localStorage.removeItem("ambassadorRef");
      } else {
        setSubmitState('error');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitState('error');
    }
  }, [form, createDemoRequest, validateForm]);

  // Reset form
  const handleReset = useCallback(() => {
    setSubmitState('idle');
    setForm({
      name: "",
      email: "",
      company: "",
      phone: "",
      size: "",
      country: "",
      sector: "",
      needs: "",
    });
    setErrors({});
  }, []);

  // Success state
  if (submitState === 'success') {
    return (
      <div className="flex min-h-screen bg-white dark:bg-[#070b18]">
        <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between overflow-hidden p-12">
          <img
            src={process.env.NEXT_PUBLIC_HERO_IMAGE || "https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg?auto=compress&cs=tinysrgb&w=1280"}
            alt="Cybersecurity"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[#070b18]/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-rht-violet/20 via-transparent to-transparent" />
          <div className="relative z-10 flex items-center gap-2">
            <img className="h-auto w-14" src="/logowhite.png" alt="RoxShield" />
          </div>
        </div>

        <div className="relative flex w-full flex-col lg:w-1/2 overflow-y-auto">
          <div className="mx-auto w-full max-w-xl flex-1 flex flex-col justify-center px-6 py-10 lg:py-16">
            <div className="py-16 text-center">
              <div className="mb-4">
                <CheckCircle className="mx-auto h-14 w-14 text-cyber-green" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {tCommon('register.email_sent')}
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {tCommon('register.credentials_sent')}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                {tCommon('register.check_spam')}
              </p>
              <div className="mt-6 space-x-2">
                <Link to="/login">
                  <Button variant="outline">
                    {tCommon('register.go_to_login')} →
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  onClick={handleReset}
                >
                  {tCommon('common.back')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (submitState === 'error') {
    return (
      <div className="flex min-h-screen bg-white dark:bg-[#070b18]">
        <div className="mx-auto w-full max-w-xl flex-1 flex flex-col justify-center px-6 py-10">
          <div className="text-center">
            <div className="mb-4">
              <div className="mx-auto h-14 w-14 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <span className="text-3xl">⚠️</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {tCommon('register.error_title')}
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {tCommon('register.error_message')}
            </p>
            <Button
              className="mt-6"
              onClick={handleReset}
            >
              {tCommon('common.retry')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Form rendering
  return (
    <div className="flex min-h-screen bg-white dark:bg-[#070b18]">
      {/* Left Column - Hero Section */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between overflow-hidden p-12">
        <img
          src={process.env.NEXT_PUBLIC_HERO_IMAGE || "https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg?auto=compress&cs=tinysrgb&w=1280"}
          alt="Cybersecurity background"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[#070b18]/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-rht-violet/20 via-transparent to-transparent" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2">
          <img className="h-auto w-14" src="/logowhite.png" alt="RoxShield" />
        </div>

        <div className="relative z-10 max-w-sm">
          <h2 className="text-3xl font-bold text-white mb-3" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}>
            {tCommon('register.try_free_title')}
          </h2>

          <p className="text-gray-300 text-base mb-8">
            {tCommon('register.trial_desc')}
          </p>

          <div className="space-y-4">
            {features.map(({ icon: Icon, labelKey, subKey }) => (
              <div key={labelKey} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white">
                  <Icon className="h-4 w-4 text-black" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
                    {tCommon(labelKey)}
                  </p>
                  <p className="text-xs text-gray-400">{tCommon(subKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 rounded-md border border-white/10 bg-black/30 backdrop-blur-sm p-4">
          <p className="text-sm italic text-gray-300">
            &ldquo;{tCommon('register.trial_activated')}&rdquo;
          </p>
          <p className="mt-2 text-xs font-medium text-white">
            — Herdy Rostel Youlou, CEO Rostel High-Tech
          </p>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="relative flex w-full flex-col lg:w-1/2 overflow-y-auto">
        {/* Mobile Logo */}
        <div className="flex items-center justify-between px-6 pt-6 lg:hidden">
          <img
            src="/logoblacktextblack.png"
            alt="RoxShield"
            className="h-auto w-32 dark:hidden"
          />
          <img
            src="/logowhitetextwhite.png"
            alt="RoxShield"
            className="h-auto w-32 hidden dark:block"
          />
        </div>

        {/* Desktop Logo Link */}
        <a
          href="https://roxshield.com"
          className="absolute right-6 top-6 z-20 hidden lg:flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-white"
        >
          <img
            src="/logoblacktextblack.png"
            alt="RoxShield"
            className="h-auto w-32 dark:hidden"
          />
          <img
            src="/logowhitetextwhite.png"
            alt="RoxShield"
            className="h-auto w-32 hidden dark:block"
          />
        </a>

        <div className="mx-auto w-full max-w-xl flex-1 flex flex-col justify-center px-6 py-10 lg:py-16">
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                {tCommon('register.start_free')}
              </h1>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                {tCommon('register.trial_free')}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-5 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-rht-violet" />
                  <span>{tCommon('register.days_free')}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-rht-orange" />
                  <span>{tCommon('register.no_commitment')}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 w-full" noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {tCommon('register.full_name')} *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={form.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    placeholder={tCommon('register.name_placeholder')}
                    required
                    autoComplete="given-name"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    className={`h-[37px] border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 ${
                      errors.name ? 'border-red-500 dark:border-red-500 focus:ring-red-500' : ''
                    }`}
                  />
                  {errors.name && (
                    <p id="name-error" className="text-sm text-red-500">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {tCommon('register.email_label')} *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    placeholder={tCommon('register.email_placeholder')}
                    required
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className={`h-[37px] border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 ${
                      errors.email ? 'border-red-500 dark:border-red-500 focus:ring-red-500' : ''
                    }`}
                  />
                  {errors.email && (
                    <p id="email-error" className="text-sm text-red-500">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {tCommon('register.company_label')} *
                  </Label>
                  <Input
                    id="company"
                    type="text"
                    value={form.company}
                    onChange={(e) => handleFieldChange('company', e.target.value)}
                    placeholder={tCommon('register.company_placeholder')}
                    required
                    autoComplete="organization"
                    aria-invalid={!!errors.company}
                    aria-describedby={errors.company ? "company-error" : undefined}
                    className={`h-[37px] border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 ${
                      errors.company ? 'border-red-500 dark:border-red-500 focus:ring-red-500' : ''
                    }`}
                  />
                  {errors.company && (
                    <p id="company-error" className="text-sm text-red-500">
                      {errors.company}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {tCommon('register.phone_label')} *
                  </Label>
                  <PhoneInput
                    value={form.phone}
                    onChange={(value) => handleFieldChange('phone', value)}
                    placeholder={tCommon('register.phone_placeholder')}
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? "phone-error" : undefined}
                    className={`h-[37px] border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white ${
                      errors.phone ? 'border-red-500 dark:border-red-500' : ''
                    }`}
                  />
                  {errors.phone && (
                    <p id="phone-error" className="text-sm text-red-500">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="size" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {tCommon('register.team_size')} *
                  </Label>
                  <select
                    id="size"
                    value={form.size}
                    onChange={(e) => handleFieldChange('size', e.target.value)}
                    required
                    aria-invalid={!!errors.size}
                    aria-describedby={errors.size ? "size-error" : undefined}
                    className={`h-[37px] w-full rounded-md border ${
                      errors.size ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-700'
                    } bg-white dark:bg-gray-800/50 px-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rht-violet/20 focus:border-rht-violet`}
                  >
                    <option value="">—</option>
                    {COMPANY_SIZES.map((size) => (
                      <option key={size.value} value={size.value}>
                        {size.label}
                      </option>
                    ))}
                  </select>
                  {errors.size && (
                    <p id="size-error" className="text-sm text-red-500">
                      {errors.size}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {tCommon('register.country_label')} *
                  </Label>
                  <Combobox
                    options={countryOptions}
                    value={form.country}
                    onChange={(value) => handleFieldChange('country', value)}
                    placeholder={tCommon('common.combobox.select')}
                    searchPlaceholder={tCommon('register.search_country')}
                    aria-invalid={!!errors.country}
                    aria-describedby={errors.country ? "country-error" : undefined}
                    className={`border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white ${
                      errors.country ? 'border-red-500 dark:border-red-500' : ''
                    }`}
                  />
                  {errors.country && (
                    <p id="country-error" className="text-sm text-red-500">
                      {errors.country}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sector" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {tCommon('register.sector_label')}
                </Label>
                <Combobox
                  options={sectorOptions}
                  value={form.sector}
                  onChange={(value) => handleFieldChange('sector', value)}
                  placeholder={tCommon('register.sector_placeholder')}
                  searchPlaceholder={tCommon('common.topbar.search')}
                  allowCustom
                  className="border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="needs" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {tCommon('register.challenge_label')}{" "}
                  <span className="text-gray-400">{tCommon('register.optional')}</span>
                </Label>
                <textarea
                  id="needs"
                  value={form.needs}
                  onChange={(e) => handleFieldChange('needs', e.target.value)}
                  rows={3}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/50 px-3 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-rht-violet/20 focus:border-rht-violet"
                  placeholder={tCommon('register.challenge_question')}
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isLoading || submitState === 'loading'}
                  className="relative h-12 w-full overflow-hidden rounded-md font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50 "
                >
                  {isLoading || submitState === 'loading' ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      {tCommon('register.sending')}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Send className="h-4 w-4" />
                      {tCommon('register.start_trial_btn')}
                    </span>
                  )}
                </Button>
              </div>

              <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                {tCommon('register.footer_note')}
              </p>

              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                {tCommon('register.have_account')}{" "}
                <Link
                  to="/login"
                  className="font-medium text-[#6366f1] hover:text-[#818cf8] transition-colors"
                >
                  {tCommon('register.sign_in')}
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}