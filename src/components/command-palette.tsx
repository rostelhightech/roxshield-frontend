"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Crosshair,
  FileBarChart,
  Settings,
  UserCircle,
  Trophy,
  Award,
  BarChart3,
  Shield,
  Search,
  ArrowRight,
} from "lucide-react";

interface CommandItem {
  id: string;
  label: string;
  href: string;
  icon: React.ElementType;
  section: string;
  keywords?: string[];
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const { t } = useTranslation();

  const items: CommandItem[] = useMemo(
    () => [
      // Admin Client
      { id: "dashboard", label: t("nav.dashboard"), href: "/dashboard", icon: LayoutDashboard, section: t("command.sectionAdmin"), keywords: ["accueil", "home", "vue"] },
      { id: "employees", label: t("nav.employees"), href: "/dashboard/employees", icon: Users, section: t("command.sectionAdmin"), keywords: ["team", "equipe", "utilisateurs"] },
      { id: "training", label: t("nav.training"), href: "/dashboard/training", icon: GraduationCap, section: t("command.sectionAdmin"), keywords: ["modules", "cours", "apprendre"] },
      { id: "simulations", label: t("nav.simulations"), href: "/dashboard/simulations", icon: Crosshair, section: t("command.sectionAdmin"), keywords: ["phishing", "campagne", "test"] },
      { id: "reports", label: t("nav.reports"), href: "/dashboard/reports", icon: FileBarChart, section: t("command.sectionAdmin"), keywords: ["analytics", "statistiques", "données"] },
      { id: "settings", label: t("nav.settings"), href: "/dashboard/settings", icon: Settings, section: t("command.sectionAdmin"), keywords: ["config", "organisation", "paramètres"] },
      { id: "profile", label: t("nav.profile"), href: "/dashboard/profile", icon: UserCircle, section: t("command.sectionAdmin"), keywords: ["compte", "account", "mon profil"] },
      // Employee
      { id: "emp-space", label: t("nav.mySpace"), href: "/employee", icon: Shield, section: t("command.sectionEmployee"), keywords: ["espace", "tableau de bord"] },
      { id: "emp-training", label: t("nav.training"), href: "/employee/training", icon: GraduationCap, section: t("command.sectionEmployee"), keywords: ["cours", "modules"] },
      { id: "emp-results", label: t("nav.results"), href: "/employee/results", icon: BarChart3, section: t("command.sectionEmployee"), keywords: ["scores", "performances"] },
      { id: "emp-badges", label: t("nav.badges"), href: "/employee/badges", icon: Award, section: t("command.sectionEmployee"), keywords: ["récompenses", "rewards"] },
      { id: "emp-leaderboard", label: t("nav.leaderboard"), href: "/employee/leaderboard", icon: Trophy, section: t("command.sectionEmployee"), keywords: ["classement", "ranking", "position"] },
    ],
    [t]
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.section.toLowerCase().includes(q) ||
        item.keywords?.some((k) => k.includes(q))
    );
  }, [query, items]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const navigate = useCallback(
    (href: string) => {
      setOpen(false);
      setQuery("");
      router.push(href);
    },
    [router]
  );

  // Keyboard shortcut Cmd+K / Ctrl+K
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Arrow navigation
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => (i + 1) % filtered.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => (i - 1 + filtered.length) % filtered.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          navigate(filtered[selectedIndex].href);
        }
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, filtered, selectedIndex, navigate]);

  // Group items by section
  const grouped = useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    filtered.forEach((item) => {
      const arr = map.get(item.section) || [];
      arr.push(item);
      map.set(item.section, arr);
    });
    return map;
  }, [filtered]);

  let flatIndex = -1;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-[480px]">
        <div className="flex items-center border-b px-4">
          <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            placeholder={t("notifications.search")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            autoFocus
          />
          <kbd className="ml-2 hidden rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline">
            ESC
          </kbd>
        </div>

        <div className="max-h-[320px] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              {t("command.noResults")}
            </div>
          ) : (
            Array.from(grouped.entries()).map(([section, sectionItems]) => (
              <div key={section} className="mb-2">
                <p className="mb-1 px-2 text-[10px] font-medium uppercase tracking-widest text-muted-foreground/60">
                  {section}
                </p>
                {sectionItems.map((item) => {
                  flatIndex++;
                  const idx = flatIndex;
                  const isSelected = idx === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      onClick={() => navigate(item.href)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                        isSelected
                          ? "bg-rht-violet/10 text-rht-violet-light"
                          : "text-foreground hover:bg-accent"
                      }`}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span className="flex-1 text-left">{item.label}</span>
                      {isSelected && (
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="flex items-center justify-between border-t px-4 py-2 text-[10px] text-muted-foreground">
          <span>↑↓ {t("command.navigate")}</span>
          <span>↵ {t("command.open")}</span>
          <span>esc {t("command.close")}</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
