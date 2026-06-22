"use client";

import {
  LayoutDashboard, Users, GraduationCap, Crosshair, FileBarChart,
  Settings, LogOut, ShieldCheck, Mail, ChevronLeft, ChevronRight, Menu, X, Building2,
  Sheet, BookOpen,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "@/lib/i18n";
import { useAuthStore } from "@/store/auth.store";
import { useSidebarStore } from "@/store/sidebar.store";

function getInitials(name?: string | null, email?: string | null): string {
  if (name) return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  if (email) return email.slice(0, 2).toUpperCase();
  return "??";
}

interface NavItem {
  label: string;
  to: string;
  icon: React.ElementType;
}

export function AdminSidebar() {
  const { t, t: tCommon } = useTranslation();
  const { collapsed, setCollapsed } = useSidebarStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, clearAuth } = useAuthStore();

  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const userName = user?.name || user?.email || "";
  const userEmail = user?.email || "";

  const navItems: NavItem[] = [
    { label: tCommon('nav.topbar.overview_title'),          to: "/dashboard/overview",               icon: LayoutDashboard },
    { label: tCommon('nav.topbar.campaigns_title'),         to: "/dashboard/campaigns",              icon: Crosshair },
    { label: tCommon('nav.topbar.formations_title'),        to: "/dashboard/formations",             icon: BookOpen },
    { label: tCommon('nav.topbar.organizations_title'),     to: "/dashboard/organizations",          icon: Building2 },
    { label: tCommon('nav.topbar.users_title'),             to: "/dashboard/users",                  icon: Users },
    { label: tCommon('nav.topbar.groups_title'),            to: "/dashboard/groups",                 icon: GraduationCap },
    { label: tCommon('nav.topbar.templates_title'),         to: "/dashboard/templates",              icon: Sheet },
    { label: tCommon('nav.topbar.landing_templates_title'), to: "/dashboard/landing-page-templates", icon: FileBarChart },
    { label: tCommon('nav.topbar.smtp_title'),              to: "/dashboard/smtp-profiles",          icon: Mail },
    { label: tCommon('nav.topbar.plan_title'),              to: "/dashboard/plan",                   icon: FileBarChart },
    { label: tCommon('nav.topbar.grc_title'),               to: "/dashboard/grc",                    icon: ShieldCheck },
    { label: tCommon('nav.topbar.settings_title'),          to: "/dashboard/settings",               icon: Settings },
  ];

  useEffect(() => {
    setMobileOpen(false);
  }, [currentPath]);

  const handleLogout = async () => {
    await clearAuth();
  };

  return (
    <div>
      {/* MOBILE HEADER */}
      <div className="fixed left-0 right-0 top-0 z-50 flex h-14 items-center gap-3 border-b border-gray-200 dark:border-white/[0.05] bg-white dark:bg-[#070b18] px-4 text-gray-900 dark:text-white md:hidden">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 hover:bg-gray-100 dark:hover:bg-white/10 dark:bg-white/5"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg ">
            <img src="/logowhite.png" className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-bold text-gray-900 dark:text-white">
            <span className="font-normal opacity-60">Rox</span>Shield
          </span>
        </div>
      </div>

      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 dark:bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed left-0 top-0 z-50
          flex h-screen flex-col
          bg-white dark:bg-[#070b18]
          border-r border-gray-200 dark:border-white/[0.05]
          text-gray-900 dark:text-white
          transition-all duration-300
          ${collapsed ? "w-[72px]" : "w-[260px]"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* HEADER */}
        <div className="flex items-center gap-3 px-4 py-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ">
            <img src="/logowhite.png" className=" text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-gray-900 dark:text-white">
                <span className="font-normal opacity-60">Rox</span>Shield
              </span>
              <span className="text-[11px] text-gray-400 dark:text-white/40">by Rostel High-Tech</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto hidden h-7 w-7 text-gray-400 dark:text-white/40 hover:bg-gray-100 dark:hover:bg-white/10 dark:bg-white/5 hover:text-gray-900 dark:hover:text-white md:flex"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto h-7 w-7 text-gray-400 dark:text-white/40 hover:bg-gray-100 dark:hover:bg-white/10 dark:bg-white/5 hover:text-gray-900 dark:hover:text-white md:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Separator className="bg-gray-200 dark:bg-white/[0.05]" />

        {/* NAVIGATION */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3">
          {navItems.map((item) => {
            const isActive = currentPath === item.to || currentPath.startsWith(item.to + "/");
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`
                  flex w-full items-center gap-3
                  rounded-sm px-3 py-2.5
                  text-sm font-medium
                  transition-all duration-200
                  ${isActive
                    ? "bg-[#5d2595]/10 dark:bg-[#5d2595]/20 text-[#5d2595] dark:text-[#b27cff] border border-[#5d2595]/20"
                    : "text-gray-500 dark:text-white/50 hover:bg-gray-100 dark:hover:bg-white/[0.04] hover:text-gray-900 dark:hover:text-white/80 border border-transparent"
                  }
                  ${collapsed ? "justify-center" : ""}
                `}
              >
                <item.icon className="h-[18px] w-[18px] shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <Separator className="bg-gray-200 dark:bg-white/[0.05]" />

        {/* USER */}
        <div className="p-3">
          <div className={`flex items-center gap-3 rounded-sm px-3 py-2 ${collapsed ? "justify-center" : ""}`}>
            <div className="shrink-0">
              <Avatar className="h-9 w-9 cursor-pointer transition-opacity hover:opacity-80">
                <AvatarFallback className="bg-[#5d2595] text-xs text-white">
                  {getInitials(user?.name, user?.email)}
                </AvatarFallback>
              </Avatar>
            </div>
            {!collapsed && (
              <>
                <div className="min-w-0 flex-1 text-left">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{userName}</p>
                  <p className="truncate text-xs text-gray-500 dark:text-white/40">{userEmail}</p>
                </div>
                <button onClick={handleLogout} aria-label={tCommon('user.sidebar.logout')}>
                  <LogOut className="h-4 w-4 text-gray-400 dark:text-white/30 transition-all hover:text-red-500 dark:hover:text-red-400" />
                </button>
              </>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}