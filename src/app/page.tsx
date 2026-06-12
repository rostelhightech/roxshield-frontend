"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/ui/combobox";
import { PhoneInput } from "@/components/ui/phone-input";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { COUNTRIES } from "@/lib/constants";
import { Footer } from "@/components/footer";
import { FadeIn, StaggerContainer, StaggerItem, GlowCard } from "@/components/motion";
import { AnimatedCounter } from "@/components/animated-counter";
import { useTranslation } from "@/lib/i18n";
import { motion } from "framer-motion";
import {
  Shield,
  Crosshair,
  GraduationCap,
  BarChart3,
  Brain,
  Globe,
  ArrowRight,
  CheckCircle,
  Users,
  Building2,
  Send,
  Menu,
  X,
  ShieldCheck,
  Mail,
  Lock,
} from "lucide-react";

const featureIcons = [Crosshair, GraduationCap, BarChart3, Brain, Users, Globe, ShieldCheck, Mail, Lock];

const statValues = ["90%", "5 min", "-60%", "6"];

export default function LandingPage() {
  const { t, locale } = useTranslation();
  const [devisOpen, setDevisOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [devisSent, setDevisSent] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [devisPhone, setDevisPhone] = useState("");
  const [devisCountry, setDevisCountry] = useState("");

  const countryOpts = COUNTRIES.map((c) => ({
    value: c.name,
    label: c.name,
    icon: c.flag,
    sub: c.dial,
  }));

  const features = featureIcons.map((icon, i) => ({
    icon,
    title: t(`landing.feat${i + 1}.title` as any),
    description: t(`landing.feat${i + 1}.desc` as any),
  }));

  const stats = statValues.map((value, i) => ({
    value,
    label: t(`landing.stat${i + 1}` as any),
  }));

  const plans = [
    {
      name: "Starter",
      price: "7 500 FCFA",
      priceNote: t("landing.plan.perUser"),
      description: t("landing.plan.starter.desc"),
      features: [t("landing.plan.starter.f1"), t("landing.plan.starter.f2"), t("landing.plan.starter.f3"), t("landing.plan.starter.f4")],
    },
    {
      name: "Business",
      price: "12 000 FCFA",
      priceNote: t("landing.plan.perUser"),
      description: t("landing.plan.business.desc"),
      popular: true,
      features: [t("landing.plan.business.f1"), t("landing.plan.business.f2"), t("landing.plan.business.f3"), t("landing.plan.business.f4"), t("landing.plan.business.f5")],
    },
    {
      name: "Enterprise",
      price: t("landing.plan.enterprise.price"),
      priceNote: "",
      description: t("landing.plan.enterprise.desc"),
      features: [t("landing.plan.enterprise.f1"), t("landing.plan.enterprise.f2"), t("landing.plan.enterprise.f3"), t("landing.plan.enterprise.f4"), t("landing.plan.enterprise.f5")],
    },
  ];

  const openDevis = (planName: string) => {
    setSelectedPlan(planName);
    setDevisSent(false);
    setDevisOpen(true);
  };

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Header */}
    

     

     
    
    </div>
  );
}
