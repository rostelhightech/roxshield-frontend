"use client";


import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Crosshair,
  FileBarChart,
  Settings,
  LogOut,
  Shield,
  ShieldCheck,
  KeyRound,
  Mail,
  MessageSquareLock,
  Lock,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Building2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "@/lib/i18n";
import { useApi } from "@/hooks/use-api";
import { useAuthStore } from "@/store/auth.store";
import { useSidebarStore } from "@/store/sidebar.store";
import { Link } from "@tanstack/react-router";

function getInitials(name?: string | null, email?: string | null): string {
  if (name) {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  }
  if (email) return email.slice(0, 2).toUpperCase();
  return "??";
}

export function Sidebar() {
  const pathname = window.location.pathname;
  const { t } = useTranslation();

  const { collapsed, setCollapsed } = useSidebarStore();

  const [mobileOpen, setMobileOpen] = useState(false);

  const { user } = useAuthStore();


  const userName = user?.name || user?.email || "";
  const userEmail = user?.email || "";
  // const userImage = meData?.image;

  const navItems = [
    {
      label: t("nav.dashboard"),
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: t('nav.organization'),
      href: "/dashboard/organizations",
      icon: Building2,
    },
    {
      label: t("nav.employees"),
      href: "/dashboard/employees",
      icon: Users,
    },
    {
      label: t("nav.training"),
      href: "/dashboard/training",
      icon: GraduationCap,
    },
    {
      label: t("nav.simulations"),
      href: "/dashboard/simulations",
      icon: Crosshair,
    },
    {
      label: "GRC",
      href: "/dashboard/grc",
      icon: ShieldCheck,
    },
    {
      label: t("nav.emailSecurity"),
      href: "/dashboard/email-security",
      icon: Mail,
    },
    {
      label: t("nav.passwords"),
      href: "/dashboard/passwords",
      icon: KeyRound,
    },
    {
      label: "Shadow IT",
      href: "/dashboard/shadow-it",
      icon: MessageSquareLock,
    },
    {
      label: t("nav.encryption"),
      href: "/dashboard/encryption",
      icon: Lock,
    },
    {
      label: t("nav.reports"),
      href: "/dashboard/reports",
      icon: FileBarChart,
    },
    {
      label: t("nav.settings"),
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* MOBILE HEADER */}
      <div className="fixed left-0 right-0 top-0 z-50 flex h-14 items-center gap-3 border-b border-white/[0.05] bg-[#070b18] px-4 text-gray-900 dark:text-white md:hidden">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 hover:bg-gray-50 dark:bg-white/5"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#5d2595] to-[#7b3fc0]">
            <Shield className="h-4 w-4 text-gray-900 dark:text-white" />
          </div>

          <span className="text-sm font-bold">
            <span className="font-normal opacity-60">Rox</span>
            Shield
          </span>
        </div>
      </div>

      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed left-0 top-0 z-50
          flex h-screen flex-col
          border-r border-white/[0.05]
          text-gray-900 dark:text-white
          backdrop-blur-xl
          transition-all duration-300
          ${collapsed ? "w-[72px]" : "w-[260px]"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
        style={{
          background:
            "radial-gradient(circle at top, rgba(93,37,149,.12), transparent 35%), #070b18",
        }}
      >
        {/* HEADER */}
        <div className="flex items-center gap-3 px-4 py-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#5d2595] to-[#7b3fc0] shadow-[0_4px_20px_rgba(93,37,149,0.35)]">
            <Shield className="h-5 w-5 text-gray-900 dark:text-white" />
          </div>

          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight">
                <span className="font-normal opacity-60">Rox</span>
                Shield
              </span>

              <span className="text-[11px] text-gray-900 dark:text-white/40">
                by Rostel High-Tech
              </span>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="ml-auto hidden h-7 w-7 text-gray-900 dark:text-white/40 hover:bg-gray-50 dark:bg-white/5 hover:text-gray-900 dark:text-white md:flex"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="ml-auto h-7 w-7 text-gray-900 dark:text-white/40 hover:bg-gray-50 dark:bg-white/5 hover:text-gray-900 dark:text-white md:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Separator className="bg-white/[0.05]" />

        {/* NAVIGATION */}
        <nav className="flex-1 space-y-1 px-3 py-3">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" &&
                pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3
                  rounded-xl px-3 py-2.5
                  text-sm font-medium
                  transition-all duration-200
                  ${
                    isActive
                      ? `
                        border border-[#5d2595]/30
                        bg-[#5d2595]/20
                        text-[#b27cff]
                        shadow-[0_0_20px_rgba(93,37,149,0.15)]
                      `
                      : `
                        text-gray-900 dark:text-white/50
                        hover:bg-white/[0.04]
                        hover:text-gray-900 dark:text-white/80
                      `
                  }
                  ${collapsed ? "justify-center" : ""}
                `}
              >
                <item.icon className="h-[18px] w-[18px] shrink-0" />

                {!collapsed && (
                  <span className="truncate">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <Separator className="bg-white/[0.05]" />

        {/* USER */}
        <div className="p-3">
          <div
            className={`flex items-center gap-3 rounded-xl px-3 py-2 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <Link to={"/dashboard/profile"}>
              <Avatar className="h-9 w-9 cursor-pointer transition-opacity hover:opacity-80">
                {/* {userImage && (
                  <AvatarImage
                    src={userImage}
                    alt={userName}
                  />
                )} */}

                <AvatarFallback className="bg-gradient-to-br from-[#5d2595] to-[#7b3fc0] text-xs text-gray-900 dark:text-white">
                  {getInitials(user?.name, user?.email)}
                </AvatarFallback>
              </Avatar>
            </Link>

            {!collapsed && (
              <>
                <Link
                  to={"/dashboard/profile"}
                  className="min-w-0 flex-1"
                >
                  <p className="truncate text-sm font-medium">
                    {userName}
                  </p>

                  <p className="truncate text-xs text-gray-900 dark:text-white/40">
                    {userEmail}
                  </p>
                </Link>

                <button>
                  <LogOut className="h-4 w-4 text-gray-900 dark:text-white/30 transition-all hover:text-red-400" />
                </button>
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}