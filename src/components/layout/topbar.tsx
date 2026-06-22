import { roleEnum } from "@/constants/roleEnum";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useAuthStore } from "@/store/auth.store";
import { useOrganizationStore } from "@/store/organization.store";
import { Bell, Search, Users, Mail, BookOpen, Building2, Users2, FileText, Sun, Moon, Shield, CheckCircle2, AlertTriangle, X, CheckCheck } from "lucide-react";
import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useTheme } from "@/contexts/theme.context";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useUserStore } from "@/store/user.store";
import { useCampaignStore } from "@/store/campaign.store";
import { useFormationStore } from "@/store/formation.store";
import { useGroupStore } from "@/store/group.store";
import { useSettingsStore } from "@/store/settings.store";
import { useNotificationStore, type AppNotification } from "@/store/notification.store";
import { cn } from "@/lib/utils";
import { apiService } from "@/app/services/api.service";
import { useTranslation } from 'react-i18next';

export function DashboardTopbar({ title, description }: { title?: string; description?: string }) {
  const { t: tCommon } = useTranslation('common');
  const { user } = useAuthStore();
  const { user: profile } = useSettingsStore();
  const { organizations } = useOrganizationStore();
  const { users } = useUserStore();
  const { campaigns } = useCampaignStore();
  const { formations, myFormations } = useFormationStore();
  const { groups } = useGroupStore();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [open, setOpen] = useState(false);
  const { init: initNotifications, destroy: destroyNotifications } = useNotificationStore();

  const isNotSuperAdmin = user?.role !== roleEnum.SUPERADMIN;
  const orgName = isNotSuperAdmin ? organizations[0]?.name : null;

  const initials = user?.name
    ? user.name.charAt(0) + (user.name.split(" ")[1]?.charAt(0) ?? "")
    : "AR";

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Init socket notifications une seule fois
  useEffect(() => {
    initNotifications();
    return () => destroyNotifications();
  }, []);

  const searchItems = useMemo(() => {
    const items = [];

    if (user?.role === roleEnum.SUPERADMIN) {
      items.push(
        { type: "page", icon: Users, title: tCommon('nav.topbar.users_title'), url: "/dashboard/users" },
        { type: "page", icon: Mail, title: tCommon('nav.topbar.campaigns_title'), url: "/dashboard/campaigns" },
        { type: "page", icon: BookOpen, title: tCommon('nav.topbar.formations_title'), url: "/dashboard/formations" },
        { type: "page", icon: Building2, title: tCommon('nav.topbar.organizations_title'), url: "/dashboard/organizations" },
        { type: "page", icon: Users2, title: tCommon('nav.topbar.groups_title'), url: "/dashboard/groups" },
        { type: "page", icon: FileText, title: tCommon('nav.topbar.templates_title'), url: "/dashboard/templates" }
      );
    } else if (user?.role === roleEnum.ADMIN) {
      items.push(
        { type: "page", icon: Mail, title: tCommon('nav.topbar.campaigns_title'), url: "/dashboard/campaigns" },
        { type: "page", icon: BookOpen, title: tCommon('nav.topbar.formations_title'), url: "/dashboard/formations" },
        { type: "page", icon: Users, title: tCommon('nav.topbar.users_title'), url: "/dashboard/users" }
      );
    } else if (user?.role === roleEnum.USER) {
      items.push(
        { type: "page", icon: BookOpen, title: tCommon('nav.topbar.formations_user_title'), url: "/dashboard/user/formations" },
        { type: "page", icon: FileText, title: tCommon('nav.topbar.evaluations_title'), url: "/dashboard/user/evaluations" },
        { type: "page", icon: Users, title: tCommon('nav.topbar.profile_title'), url: "/dashboard/user/profile" }
      );
    }

    if (user?.role !== roleEnum.USER) {
      users.slice(0, 10).forEach((u) => {
        items.push({
          type: "user", icon: Users,
          title: `${u.firstName} ${u.lastName}`,
          subtitle: u.email,
          url: `/dashboard/users`,
        });
      });
    }

    if (user?.role === roleEnum.SUPERADMIN || user?.role === roleEnum.ADMIN) {
      campaigns.slice(0, 10).forEach((c) => {
        items.push({
          type: "campaign", icon: Mail,
          title: c.name,
          subtitle: `Status: ${c.status}`,
          url: `/dashboard/campaigns`,
        });
      });
    }

    // Admins/superadmin : formations globales ; users : leurs formations personnelles
    if (user?.role === roleEnum.USER) {
      myFormations.slice(0, 10).forEach((f) => {
        items.push({
          type: "formation", icon: BookOpen,
          title: f.title,
          subtitle: f.description,
          url: `/dashboard/user/formation-view?id=${f.id}`,
        });
      });
    } else {
      formations.slice(0, 10).forEach((f) => {
        items.push({
          type: "formation", icon: BookOpen,
          title: f.title,
          subtitle: f.description,
          url: `/dashboard/formations/${f.id}`,
        });
      });
    }

    if (user?.role !== roleEnum.USER) {
      groups.slice(0, 10).forEach((g) => {
        items.push({
          type: "group", icon: Users2,
          title: g.name,
          subtitle: g.description || tCommon('nav.topbar.members_count', { count: g.users?.length || 0 }),
          url: `/dashboard/groups`,
        });
      });
    }

    return items;
  }, [users, campaigns, formations, myFormations, groups, user?.role, tCommon]);

  return (
    <>
      <div className="flex rounded-sm items-center justify-between gap-2 px-3 sm:px-6 py-3 border-b border-gray-100 dark:border-white/5 bg-white dark:bg-slate-900">
        {/* Gauche — titre + description */}
        <div className="min-w-0 flex-1">
          <h1 className="text-md font-medium text-gray-900 dark:text-white leading-snug truncate">
            {title || (isNotSuperAdmin && orgName ? orgName : "RoxShield")}
          </h1>
          <p className="hidden sm:block text-sm text-gray-400 dark:text-zinc-500 mt-0.5 leading-none truncate">
            {description || tCommon('nav.topbar.default_desc')}
          </p>
        </div>

        {/* Droite — actions */}
        <div className="flex items-center gap-2 sm:gap-1.5 shrink-0">
          {/* Recherche — barre complète dès sm, icône seule en dessous */}
          <button
            onClick={() => setOpen(true)}
            className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 min-w-[200px] rounded-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            <Search size={13} className="text-gray-400 dark:text-zinc-500 shrink-0" />
            <span className="text-md text-gray-400 dark:text-zinc-500 flex-1 text-left">{tCommon('common.topbar.search')}</span>
            <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 font-mono text-[10px] text-gray-400 dark:text-zinc-500">
              <span>⌘</span>K
            </kbd>
          </button>

          <button
            onClick={() => setOpen(true)}
            title={tCommon('common.topbar.search_title')}
            className="sm:hidden flex items-center justify-center w-8 h-8 rounded-sm text-gray-400 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            <Search size={15} />
          </button>

          {/* Séparateur */}
          <div className="w-px h-5 bg-gray-200 dark:bg-white/5 mx-0.5 sm:mx-1" />

          {/* Thème */}
          <button
            onClick={toggleTheme}
            title={theme === "dark" ? tCommon('nav.topbar.light_mode') : tCommon('nav.topbar.dark_mode')}
            className="flex items-center justify-center w-8 h-8 rounded-sm text-gray-400 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Langue */}
          <LanguageSwitcher />

          {/* Notifications */}
          <NotificationBell />

          {/* Séparateur */}
          <div className="w-px h-5 bg-gray-200 dark:bg-white/5 mx-0.5 sm:mx-1" />

          {/* User pill */}
          <button className="flex items-center gap-1.5 sm:gap-2 pl-1 pr-1.5 sm:pr-2.5 py-1 rounded-full border border-gray-200 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors cursor-pointer">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#5d2595] text-[10px] font-medium text-white shrink-0 overflow-hidden">
              {profile?.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={tCommon('user.profile.profile_picture')}
                  className="w-full h-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <div className="hidden md:block text-left leading-none">
              <p className="text-[12px] font-medium text-gray-900 dark:text-white">{user?.name ?? tCommon('admin.grc.user_name')}</p>
              <p className="text-[11px] text-gray-400 dark:text-zinc-500 mt-0.5">{orgName ?? user?.role}</p>
            </div>
           </button>
        </div>
      </div>

      {/* Command palette */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="overflow-hidden p-0 shadow-lg bg-white dark:bg-gray-900 rounded-sm w-[95vw] sm:w-full">
          <Command className="bg-white dark:bg-gray-900">
            <CommandInput
              placeholder={tCommon('common.topbar.search_placeholder')}
              className="border-b border-gray-100 dark:border-gray-800 text-gray-900 dark:text-gray-100"
            />
            <CommandList className="bg-white dark:bg-gray-900">
              <CommandEmpty className="text-gray-400 dark:text-gray-500 text-sm py-6 text-center">
                {tCommon('common.topbar.no_results')}
              </CommandEmpty>

              {(["page", "user", "campaign", "formation", "group"] as const).map((type) => {
                const filtered = searchItems.filter((item) => item.type === type);
                if (!filtered.length) return null;

                const labels: Record<string, string> = {
                  page: tCommon('nav.topbar.label_pages'),
                  user: tCommon('nav.topbar.users_title'),
                  campaign: tCommon('nav.topbar.label_campaigns'),
                  formation: tCommon('nav.topbar.label_formations'),
                  group: tCommon('nav.topbar.label_groups'),
                };

                return (
                  <CommandGroup
                    key={type}
                    heading={labels[type]}
                    className="text-gray-400 dark:text-gray-500 text-xs"
                  >
                    {filtered.map((item, index) => (
                      <CommandItem
                        key={`${type}-${index}`}
                        onSelect={() => {
                          navigate({ to: item.url as any });
                          setOpen(false);
                        }}
                        className="text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                      >
                        <item.icon className="mr-2 h-4 w-4 text-gray-400 dark:text-gray-500 shrink-0" />
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm">{item.title}</span>
                        {(item as { subtitle?: string }).subtitle && (
  <span className="text-xs text-gray-400 dark:text-gray-500 truncate">
    {(item as { subtitle?: string }).subtitle}
  </span>
)}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                );
              })}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ── Icône par type de notification ──────────────────────────────
function NotifIcon({ type, color }: { type: AppNotification['type']; color?: string | null }) {
  const cls = "w-4 h-4 shrink-0";
  const c = color ?? '#b27cff';
  switch (type) {
    case 'FORMATION':    return <BookOpen className={cls} style={{ color: c }} />;
    case 'CAMPAIGN':     return <Mail className={cls} style={{ color: c }} />;
    case 'EVALUATION':   return <FileText className={cls} style={{ color: c }} />;
    case 'SECURITY':     return <Shield className={cls} style={{ color: c }} />;
    case 'ANNOUNCEMENT': return <Bell className={cls} style={{ color: c }} />;
    default:             return <Bell className={cls} style={{ color: c }} />;
  }
}

// ── Temps relatif simple ─────────────────────────────────────────
function relativeTime(iso: string, tCommon: (key: string, opts?: Record<string, unknown>) => string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return tCommon('nav.topbar.just_now');
  if (m < 60) return tCommon('nav.topbar.minutes_ago', { count: m });
  const h = Math.floor(m / 60);
  if (h < 24) return tCommon('nav.topbar.hours_ago', { count: h });
  return tCommon('nav.topbar.days_ago', { count: Math.floor(h / 24) });
}

// ── Bell avec dropdown notifications ─────────────────────────────
function NotificationBell() {
  const navigate = useNavigate();
  const { notifications, unreadCount, isConnected, markAsRead, markAllAsRead, removeLocal } = useNotificationStore();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const {t: tCommon} = useTranslation('common');

  // Fermer en cliquant à l'extérieur
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        btnRef.current && !btnRef.current.contains(e.target as Node)
      ) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleNotifClick = (n: AppNotification) => {
    markAsRead(n.id);
    if (n.metadata?.link) navigate({ to: n.metadata.link as any });
    setOpen(false);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await apiService.delete(`/notifications/${id}`);
      removeLocal(id);
    } catch { /* apiService gère */ }
  };

  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={() => setOpen((v) => !v)}
        title={isConnected ? tCommon('nav.topbar.notif_connected') : tCommon('nav.topbar.notif_disconnected')}
        className="relative flex items-center justify-center w-8 h-8 rounded-sm text-gray-400 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
      >
        <Bell size={15} />
        {/* Badge non-lu */}
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[14px] h-[14px] px-[3px] flex items-center justify-center rounded-full bg-[#5d2595] text-[9px] font-bold text-white ring-2 ring-white dark:ring-slate-900 leading-none">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
        {/* Indicateur de connexion socket (coin bas-gauche) */}
        <span
          className={cn(
            'absolute bottom-1 left-1 w-1.5 h-1.5 rounded-full ring-1 ring-white dark:ring-slate-900 transition-colors duration-500',
            isConnected ? 'bg-emerald-400' : 'bg-gray-400 dark:bg-zinc-600'
          )}
        />
      </button>

      {open && (
        <div
          ref={panelRef}
          className="fixed sm:absolute left-2 right-2 sm:left-auto sm:right-0 top-14 sm:top-10 z-50 w-auto sm:w-[360px] max-h-[70vh] sm:max-h-[480px] flex flex-col rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1023] shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-gray-100 dark:border-white/5 shrink-0">
            <div className="flex items-center gap-2 min-w-0 flex-wrap">
              <Bell className="w-4 h-4 text-[#b27cff] shrink-0" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">{tCommon('nav.topbar.notifications_heading')}</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-[#5d2595]/10 text-[#b27cff] text-[10px] font-semibold shrink-0">
                  {tCommon('nav.topbar.unread_badge', { count: unreadCount })}
                </span>
              )}
              {/* Status socket */}
              <span
                title={isConnected ? tCommon('nav.topbar.realtime_active') : tCommon('nav.topbar.realtime_disconnected')}
                className={cn(
                  'w-1.5 h-1.5 rounded-full transition-colors duration-500 shrink-0',
                  isConnected ? 'bg-emerald-400' : 'bg-gray-300 dark:bg-zinc-600'
                )}
              />
            </div>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsRead()}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#b27cff] transition-colors shrink-0 whitespace-nowrap"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                {tCommon('common.topbar.read_all')}
              </button>
            )}
          </div>

          {/* Liste */}
          <div className="overflow-y-auto flex-1 divide-y divide-gray-50 dark:divide-white/5">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Bell className="w-8 h-8 text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-sm text-gray-400 dark:text-gray-500">{tCommon('common.topbar.no_notifications')}</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleNotifClick(n)}
                  className={cn(
                    'group flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors',
                    n.isRead
                      ? 'hover:bg-gray-50 dark:hover:bg-white/5'
                      : 'bg-[#5d2595]/5 hover:bg-[#5d2595]/8'
                  )}
                >
                  {/* Icône */}
                  <div className={cn(
                    'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-sm',
                    n.isRead ? 'bg-gray-100 dark:bg-white/5' : 'bg-[#5d2595]/10'
                  )}>
                    <NotifIcon type={n.type} color={n.metadata?.color} />
                  </div>

                  {/* Contenu */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn(
                        'text-sm leading-snug break-words',
                        n.isRead ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white font-medium'
                      )}>
                        {n.title}
                      </p>
                      <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                        {!n.isRead && <span className="w-1.5 h-1.5 rounded-full bg-[#5d2595]" />}
                        {!n.isSystem && (
                          <button
                            onClick={(e) => handleDelete(e, n.id)}
                            className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                      {n.message}
                    </p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-1">
                      {relativeTime(n.createdAt, tCommon)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}