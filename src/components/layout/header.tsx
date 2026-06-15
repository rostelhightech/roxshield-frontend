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
  Info,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useTranslation } from "@/lib/i18n";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { motion, AnimatePresence } from "framer-motion";
import { useApi } from "@/hooks/use-api";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string | null;
  isRead: boolean;
  createdAt: string;
}

interface NotifResponse {
  notifications: Notification[];
  unreadCount: number;
}

const typeConfig: Record<string, { icon: typeof Bell; color: string; bg: string }> = {
  alert: { icon: AlertTriangle, color: "text-cyber-red", bg: "bg-cyber-red/10" },
  training: { icon: GraduationCap, color: "text-cyber-green", bg: "bg-cyber-green/10" },
  campaign: { icon: Target, color: "text-rht-orange", bg: "bg-rht-orange/10" },
  security: { icon: Shield, color: "text-rht-violet-light", bg: "bg-rht-violet/10" },
  success: { icon: CheckCircle, color: "text-cyber-green", bg: "bg-cyber-green/10" },
  info: { icon: Info, color: "text-rht-violet-light", bg: "bg-rht-violet/10" },
};

function timeAgo(dateStr: string, locale: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return locale === "en" ? "Just now" : "À l'instant";
  if (mins < 60) return locale === "en" ? `${mins}m ago` : `Il y a ${mins}min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return locale === "en" ? `${hours}h ago` : `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  return locale === "en" ? `${days}d ago` : `Il y a ${days}j`;
}

function translateNotif(raw: string, params: string | null, t: (key: any) => string): string {
  const translated = t(raw as any);
  // If key was found in dictionary (doesn't return itself), it's a template key
  if (translated !== raw) return translated;
  return raw;
}

function translateNotifMsg(title: string, params: string | null, t: (key: any) => string): string | null {
  const msgKey = `${title}.msg` as any;
  const template = t(msgKey);
  if (template === msgKey) return params; // Not a known template, return raw
  if (!params) return template.replace(/\s*\{0\}/g, "").replace(/\s*\{1\}/g, "").replace(/\s*\{2\}/g, "");
  const parts = params.split("|");
  let result = template;
  // Handle special training_completed score interpolation
  if (title === "notif.training_completed" && parts[1]) {
    const scoreTemplate = t("notif.training_completed.score" as any);
    result = result.replace("{1}", scoreTemplate.replace("{0}", parts[1]));
  }
  parts.forEach((part: string, i: number) => {
    result = result.replace(`{${i}}`, part);
  });
  return result;
}

export function Header({ title }: { title: string }) {
  const { t, locale } = useTranslation();
  const { data: notifData, refetch } = useApi<NotifResponse>("/api/notifications");
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const notifications = notifData?.notifications || [];
  const unreadCount = notifData?.unreadCount || 0;

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

  const markAllRead = async () => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAllRead: true }),
    });
    await refetch();
  };

  const markRead = async (id: string) => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notificationId: id }),
    });
    await refetch();
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
              <Badge className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rht-orange p-0 text-[10px] text-gray-900 dark:text-white">
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
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center">
                      <Bell className="mx-auto mb-2 h-6 w-6 text-muted-foreground/30" />
                      <p className="text-sm text-muted-foreground">{t("notifications.none")}</p>
                    </div>
                  ) : (
                    notifications.map((notif, i) => {
                      const config = typeConfig[notif.type] || typeConfig.info;
                      const Icon = config.icon;
                      return (
                        <motion.div
                          key={notif.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04 }}
                          className={`flex gap-3 border-b px-4 py-3 transition-colors last:border-0 hover:bg-accent cursor-pointer ${
                            !notif.isRead ? "bg-rht-violet/5" : ""
                          }`}
                          onClick={() => !notif.isRead && markRead(notif.id)}
                        >
                          <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${config.bg}`}>
                            <Icon className={`h-4 w-4 ${config.color}`} />
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <div className="flex items-start justify-between gap-2">
                              <p className={`text-sm ${!notif.isRead ? "font-semibold" : "font-medium text-muted-foreground"}`}>
                                {translateNotif(notif.title, notif.message, t)}
                              </p>
                              {!notif.isRead && (
                                <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-rht-orange" />
                              )}
                            </div>
                            {notif.message && (
                              <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                                {translateNotifMsg(notif.title, notif.message, t)}
                              </p>
                            )}
                            <p className="mt-1 text-[10px] text-muted-foreground/60">
                              {timeAgo(notif.createdAt, locale)}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
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
