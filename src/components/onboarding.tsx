"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Shield,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Building2,
  Users,
  Target,
  GraduationCap,
  BarChart3,
  Crown,
  Rocket,
  Sparkles,
  HeadphonesIcon,
  Settings,
  UserCircle,
  Award,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";

type OnboardingRole = "super-admin" | "admin-client" | "employee";

interface StepMeta {
  icon: React.ElementType;
  titleKey: string;
  descKey: string;
  featureKeys: string[];
  color: string;
  bgColor: string;
}

type DK = Parameters<ReturnType<typeof useTranslation>["t"]>[0];

const stepsByRole: Record<OnboardingRole, StepMeta[]> = {
  "super-admin": [
    {
      icon: Crown,
      titleKey: "onboarding.sa.step1.title",
      descKey: "onboarding.sa.step1.desc",
      featureKeys: ["onboarding.sa.step1.f1", "onboarding.sa.step1.f2", "onboarding.sa.step1.f3"],
      color: "text-rht-orange",
      bgColor: "bg-rht-orange/10",
    },
    {
      icon: Building2,
      titleKey: "onboarding.sa.step2.title",
      descKey: "onboarding.sa.step2.desc",
      featureKeys: ["onboarding.sa.step2.f1", "onboarding.sa.step2.f2", "onboarding.sa.step2.f3"],
      color: "text-rht-orange",
      bgColor: "bg-rht-orange/10",
    },
    {
      icon: HeadphonesIcon,
      titleKey: "onboarding.sa.step3.title",
      descKey: "onboarding.sa.step3.desc",
      featureKeys: ["onboarding.sa.step3.f1", "onboarding.sa.step3.f2", "onboarding.sa.step3.f3"],
      color: "text-rht-orange",
      bgColor: "bg-rht-orange/10",
    },
    {
      icon: Rocket,
      titleKey: "onboarding.sa.step4.title",
      descKey: "onboarding.sa.step4.desc",
      featureKeys: ["onboarding.sa.step4.f1", "onboarding.sa.step4.f2", "onboarding.sa.step4.f3"],
      color: "text-rht-orange",
      bgColor: "bg-rht-orange/10",
    },
  ],
  "admin-client": [
    {
      icon: Shield,
      titleKey: "onboarding.ac.step1.title",
      descKey: "onboarding.ac.step1.desc",
      featureKeys: ["onboarding.ac.step1.f1", "onboarding.ac.step1.f2", "onboarding.ac.step1.f3"],
      color: "text-rht-violet-light",
      bgColor: "bg-rht-violet/10",
    },
    {
      icon: Users,
      titleKey: "onboarding.ac.step2.title",
      descKey: "onboarding.ac.step2.desc",
      featureKeys: ["onboarding.ac.step2.f1", "onboarding.ac.step2.f2", "onboarding.ac.step2.f3"],
      color: "text-rht-violet-light",
      bgColor: "bg-rht-violet/10",
    },
    {
      icon: GraduationCap,
      titleKey: "onboarding.ac.step3.title",
      descKey: "onboarding.ac.step3.desc",
      featureKeys: ["onboarding.ac.step3.f1", "onboarding.ac.step3.f2", "onboarding.ac.step3.f3"],
      color: "text-rht-violet-light",
      bgColor: "bg-rht-violet/10",
    },
    {
      icon: Target,
      titleKey: "onboarding.ac.step4.title",
      descKey: "onboarding.ac.step4.desc",
      featureKeys: ["onboarding.ac.step4.f1", "onboarding.ac.step4.f2", "onboarding.ac.step4.f3"],
      color: "text-rht-violet-light",
      bgColor: "bg-rht-violet/10",
    },
    {
      icon: Rocket,
      titleKey: "onboarding.ac.step5.title",
      descKey: "onboarding.ac.step5.desc",
      featureKeys: ["onboarding.ac.step5.f1", "onboarding.ac.step5.f2", "onboarding.ac.step5.f3"],
      color: "text-rht-violet-light",
      bgColor: "bg-rht-violet/10",
    },
  ],
  employee: [
    {
      icon: UserCircle,
      titleKey: "onboarding.emp.step1.title",
      descKey: "onboarding.emp.step1.desc",
      featureKeys: ["onboarding.emp.step1.f1", "onboarding.emp.step1.f2", "onboarding.emp.step1.f3"],
      color: "text-cyber-green",
      bgColor: "bg-cyber-green/10",
    },
    {
      icon: GraduationCap,
      titleKey: "onboarding.emp.step2.title",
      descKey: "onboarding.emp.step2.desc",
      featureKeys: ["onboarding.emp.step2.f1", "onboarding.emp.step2.f2", "onboarding.emp.step2.f3"],
      color: "text-cyber-green",
      bgColor: "bg-cyber-green/10",
    },
    {
      icon: Award,
      titleKey: "onboarding.emp.step3.title",
      descKey: "onboarding.emp.step3.desc",
      featureKeys: ["onboarding.emp.step3.f1", "onboarding.emp.step3.f2", "onboarding.emp.step3.f3"],
      color: "text-cyber-green",
      bgColor: "bg-cyber-green/10",
    },
    {
      icon: Sparkles,
      titleKey: "onboarding.emp.step4.title",
      descKey: "onboarding.emp.step4.desc",
      featureKeys: ["onboarding.emp.step4.f1", "onboarding.emp.step4.f2", "onboarding.emp.step4.f3"],
      color: "text-cyber-green",
      bgColor: "bg-cyber-green/10",
    },
  ],
};

const roleTheme: Record<OnboardingRole, { gradient: string; buttonBg: string; progressColor: string }> = {
  "super-admin": {
    gradient: "from-rht-orange to-rht-orange-light",
    buttonBg: "bg-linear-to-r from-rht-orange to-rht-orange-light",
    progressColor: "rht-orange",
  },
  "admin-client": {
    gradient: "from-rht-violet to-rht-violet-light",
    buttonBg: "bg-linear-to-r from-rht-violet to-rht-violet-light",
    progressColor: "rht-violet",
  },
  employee: {
    gradient: "from-cyber-green/80 to-cyber-green",
    buttonBg: "bg-linear-to-r from-cyber-green/90 to-cyber-green",
    progressColor: "cyber-green",
  },
};

export function Onboarding({
  role,
  onComplete,
}: {
  role: OnboardingRole;
  onComplete: () => void;
}) {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const steps = stepsByRole[role];
  const theme = roleTheme[role];
  const isLast = step === steps.length - 1;
  const current = steps[step];
  const Icon = current.icon;
  const progress = ((step + 1) / steps.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
    >
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ opacity: [0.05, 0.15, 0.05], scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
          className={`absolute -left-48 -top-48 h-[500px] w-[500px] rounded-full bg-gradient-to-br ${theme.gradient} blur-[150px]`}
        />
        <motion.div
          animate={{ opacity: [0.03, 0.1, 0.03], scale: [1, 1.15, 1] }}
          transition={{ duration: 10, repeat: Infinity, delay: 3 }}
          className={`absolute -bottom-48 -right-48 h-[500px] w-[500px] rounded-full bg-gradient-to-br ${theme.gradient} blur-[150px]`}
        />
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg px-4"
      >
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${theme.buttonBg}`}>
              <Shield className="h-4 w-4 text-gray-900 dark:text-white" />
            </div>
            <span className="text-sm font-bold">RoxShield</span>
          </div>
          <button
            onClick={onComplete}
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("onboarding.skip")}
          </button>
        </div>

        <div className="mb-4">
          <Progress value={progress} className="h-1.5" />
          <p className="mt-1.5 text-right text-[10px] text-muted-foreground">
            {step + 1}/{steps.length}
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="rounded-2xl border bg-card p-8">
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.4, delay: 0.1, type: "spring" }}
                className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl ${current.bgColor}`}
              >
                <Icon className={`h-10 w-10 ${current.color}`} />
              </motion.div>

              <h2 className="text-center text-xl font-bold">{t(current.titleKey as DK)}</h2>
              <p className="mt-2 text-center text-sm text-muted-foreground leading-relaxed">
                {t(current.descKey as DK)}
              </p>

              <div className="mt-6 space-y-3">
                {current.featureKeys.map((fKey, i) => (
                  <motion.div
                    key={fKey}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex items-center gap-3 rounded-xl border p-3"
                  >
                    <CheckCircle className={`h-4 w-4 shrink-0 ${current.color}`} />
                    <span className="text-sm">{t(fKey as DK)}</span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 flex items-center justify-between gap-3">
                {step > 0 ? (
                  <Button
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                    className="gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    {t("onboarding.previous")}
                  </Button>
                ) : (
                  <div />
                )}

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={isLast ? onComplete : () => setStep(step + 1)}
                    className={`gap-2 ${theme.buttonBg} text-gray-900 dark:text-white hover:opacity-90`}
                  >
                    {isLast ? (
                      <>
                        {t("onboarding.start")}
                        <Rocket className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        {t("onboarding.next")}
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-4 flex justify-center gap-2">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step ? `w-6 ${theme.buttonBg}` : "w-2 bg-muted-foreground/20"
              }`}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
