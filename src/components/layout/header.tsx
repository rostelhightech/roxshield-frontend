"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bell,
  Search,
  AlertTriangle,
  CheckCircle,
  GraduationCap,
  Target,
  Shield,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useTranslation } from "@/lib/i18n";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { motion, AnimatePresence } from "framer-motion";

export function Header({ title }: { title: string }) {
  const { t, locale } = useTranslation();

  const notifications = [
    {
      id: 1,
      icon: AlertTriangle,
      iconColor: "text-cyber-red",
      iconBg: "bg-cyber-red/10",
      title: t("header.notif1.title" as any),
      description: t("header.notif1.desc" as any),
      time: locale === "en" ? "2h ago" : "Il y a 2h",
      unread: true,
    },
    {
      id: 2,
      icon: GraduationCap,
      iconColor: "text-cyber-green",
      iconBg: "bg-cyber-green/10",
      title: t("header.notif2.title" as any),
      description: t("header.notif2.desc" as any),
      time: locale === "en" ? "5h ago" : "Il y a 5h",
      unread: true,
    },
    {
      id: 3,
      icon: Target,
      iconColor: "text-rht-orange",
      iconBg: "bg-rht-orange/10",
      title: t("header.notif3.title" as any),
      description: t("header.notif3.desc" as any),
      time: locale === "en" ? "Yesterday" : "Hier",
      unread: true,
    },
    {
      id: 4,
      icon: Shield,
      iconColor: "text-rht-violet-light",
      iconBg: "bg-rht-violet/10",
      title: locale === "en" ? "Risk score decreasing" : "Score de risque en baisse",
      description: locale === "en" ? "Your organization's average score dropped from 48% to 42%." : "Le score moyen de votre organisation est passé de 48% à 42%.",
      time: locale === "en" ? "2d ago" : "Il y a 2j",
      unread: false,
    },
    {
      id: 5,
      icon: CheckCircle,
      iconColor: "text-cyber-green",
      iconBg: "bg-cyber-green/10",
      title: locale === "en" ? "Monthly report ready" : "Rapport mensuel prêt",
      description: locale === "en" ? "The May 2026 report is available for download." : "Le rapport de Mai 2026 est disponible au téléchargement.",
      time: locale === "en" ? "3d ago" : "Il y a 3j",
      unread: false,
    },
  ];
  const [open, setOpen] = useState(false);
  const [readIds, setReadIds] = useState<number[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => n.unread && !readIds.includes(n.id)).length;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const handleOpen = () => {
    setOpen(!open);
  };

  const markAllRead = () => {
    setReadIds(notifications.map((n) => n.id));
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-col justify-center">
        <h1 className="text-lg font-semibold tracking-tight leading-tight">{title}</h1>
        <Breadcrumbs />
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
          className="hidden h-9 items-center gap-2 rounded-lg border bg-background px-3 text-sm text-muted-foreground transition-colors hover:bg-accent md:flex"
        >
          <Search className="h-4 w-4" />
          <span>{t("notifications.search")}</span>
          <kbd className="ml-4 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium">⌘K</kbd>
        </button>

        <div className="relative" ref={panelRef}>
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9"
            onClick={handleOpen}
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <Badge className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rht-orange p-0 text-[10px] text-white">
                {unreadCount}
              </Badge>
            )}
          </Button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 z-50 w-[360px] rounded-xl border bg-popover shadow-xl"
              >
                <div className="flex items-center justify-between border-b px-4 py-3">
                  <h3 className="text-sm font-semibold">{t("notifications.title")}</h3>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-xs text-rht-violet-light hover:underline"
                      >
                        {t("notifications.markAllRead")}
                      </button>
                    )}
                    <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.map((notif, i) => {
                    const isUnread = notif.unread && !readIds.includes(notif.id);
                    return (
                      <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className={`flex gap-3 border-b px-4 py-3 transition-colors last:border-0 hover:bg-accent ${
                          isUnread ? "bg-rht-violet/5" : ""
                        }`}
                        onClick={() => setReadIds((prev) => [...prev, notif.id])}
                      >
                        <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${notif.iconBg}`}>
                          <notif.icon className={`h-4 w-4 ${notif.iconColor}`} />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`text-sm ${isUnread ? "font-semibold" : "font-medium text-muted-foreground"}`}>
                              {notif.title}
                            </p>
                            {isUnread && (
                              <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-rht-orange" />
                            )}
                          </div>
                          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                            {notif.description}
                          </p>
                          <p className="mt-1 text-[10px] text-muted-foreground/60">{notif.time}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="border-t px-4 py-2.5 text-center">
                  <button className="text-xs text-rht-violet-light hover:underline">
                    {t("notifications.viewAll")}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <LanguageSwitcher />
        <ThemeToggle />
      </div>
    </header>
  );
}
