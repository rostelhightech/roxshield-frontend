"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export interface TourStep {
  title: string;
  description: string;
  target?: string; // CSS selector
}

interface ProductTourProps {
  steps: TourStep[];
  storageKey: string;
  onComplete?: () => void;
}

export function ProductTour({ steps, storageKey, onComplete }: ProductTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const dismissed = localStorage.getItem(`tour_${storageKey}`);
    if (!dismissed) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [storageKey]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleDismiss();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem(`tour_${storageKey}`, "done");
    onComplete?.();
  };

  if (!visible) return null;

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[180] bg-black/40 backdrop-blur-sm"
            onClick={handleDismiss}
          />

          {/* Tour card */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed left-1/2 top-1/2 z-[181] w-[90vw] max-w-[400px] -translate-x-1/2 -translate-y-1/2"
          >
            <Card className="border-primary/20 shadow-2xl">
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-[11px] font-medium text-muted-foreground">
                      {currentStep + 1} / {steps.length}
                    </span>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleDismiss}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Content */}
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>

                {/* Progress dots */}
                <div className="mt-5 flex justify-center gap-1.5">
                  {steps.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 rounded-full transition-all ${
                        i === currentStep ? "w-6 bg-primary" : "w-1.5 bg-muted"
                      }`}
                    />
                  ))}
                </div>

                {/* Actions */}
                <div className="mt-5 flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePrev}
                    disabled={currentStep === 0}
                    className="gap-1"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    {t("tour.back")}
                  </Button>
                  <Button size="sm" onClick={handleNext} className="gap-1">
                    {isLast ? t("tour.done") : t("tour.next")}
                    {!isLast && <ArrowRight className="h-3 w-3" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
