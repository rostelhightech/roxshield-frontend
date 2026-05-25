"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
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
} from "lucide-react";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "@/lib/i18n";
import { useApi } from "@/hooks/use-api";

function getInitials(name?: string | null, email?: string | null): string {
  if (name) {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  }
  if (email) return email.slice(0, 2).toUpperCase();
  return "??";
}

export function Sidebar() {
  const pathname = usePathname();
  const { t, locale } = useTranslation();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: meData } = useApi<{ image: string | null; organization: { name: string } | null }>("/api/me");
  const user = session?.user;
  const userName = user?.name || user?.email || "";
  const userEmail = user?.email || "";
  const orgName = meData?.organization?.name || (user as any)?.organizationName || "Organisation";
  const userImage = meData?.image;

  const navItems = [
    { label: t("nav.dashboard"), href: "/dashboard", icon: LayoutDashboard },
    { label: t("nav.employees"), href: "/dashboard/employees", icon: Users },
    { label: t("nav.training"), href: "/dashboard/training", icon: GraduationCap },
    { label: t("nav.simulations"), href: "/dashboard/simulations", icon: Crosshair },
    { label: "GRC", href: "/dashboard/grc", icon: ShieldCheck },
    { label: t("nav.emailSecurity"), href: "/dashboard/email-security", icon: Mail },
    { label: t("nav.passwords"), href: "/dashboard/passwords", icon: KeyRound },
    { label: "Shadow IT", href: "/dashboard/shadow-it", icon: MessageSquareLock },
    { label: t("nav.encryption"), href: "/dashboard/encryption", icon: Lock },
    { label: t("nav.reports"), href: "/dashboard/reports", icon: FileBarChart },
    { label: t("nav.settings"), href: "/dashboard/settings", icon: Settings },
  ];

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile hamburger */}
      <div className="fixed left-0 right-0 top-0 z-50 flex h-14 items-center gap-3 border-b border-sidebar-border bg-sidebar px-4 text-sidebar-foreground md:hidden">
        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setMobileOpen(true)}>
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-rht-violet to-rht-violet-light">
            <Shield className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-sm font-bold"><span className="font-normal opacity-60">Rox</span>Shield</span>
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300
          ${collapsed ? "w-[70px]" : "w-[260px]"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0`}
      >
        <div className="flex items-center gap-3 px-4 py-5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rht-violet to-rht-violet-light shadow-[0_4px_15px_rgba(156,30,153,0.3)]">
            <Shield className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight"><span className="font-normal opacity-60">Rox</span>Shield</span>
              <span className="text-[11px] opacity-40">by Rostel High-Tech</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto h-7 w-7 opacity-40 hover:bg-sidebar-accent hover:opacity-100 hidden md:flex"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto h-7 w-7 opacity-40 hover:bg-sidebar-accent hover:opacity-100 md:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Separator className="bg-sidebar-border" />

        {!collapsed && (
          <div className="px-4 py-3">
            <p className="text-[10px] font-medium uppercase tracking-widest opacity-30">{t("nav.organization")}</p>
            <p className="mt-0.5 text-sm font-medium">{orgName}</p>
          </div>
        )}

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-rht-violet/15 text-rht-violet-light shadow-[0_2px_8px_rgba(156,30,153,0.1)]"
                    : "opacity-50 hover:bg-sidebar-accent hover:opacity-80"
                } ${collapsed ? "justify-center" : ""}`}
              >
                <item.icon className="h-[18px] w-[18px] shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <Separator className="bg-sidebar-border" />

        <div className="p-3">
          <div className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${collapsed ? "justify-center" : ""}`}>
            <Link href="/dashboard/profile">
              <Avatar className="h-8 w-8 shrink-0 cursor-pointer transition-opacity hover:opacity-80">
                {userImage && <AvatarImage src={userImage} alt={userName} />}
                <AvatarFallback className="bg-gradient-to-br from-rht-violet to-rht-violet-light text-[11px] text-white">
                  {getInitials(user?.name, user?.email)}
                </AvatarFallback>
              </Avatar>
            </Link>
            {!collapsed && (
              <Link href="/dashboard/profile" className="flex-1 overflow-hidden transition-opacity hover:opacity-80">
                <p className="truncate text-sm font-medium">{userName}</p>
                <p className="truncate text-[11px] opacity-40">{userEmail}</p>
              </Link>
            )}
            {!collapsed && (
              <button onClick={() => signOut({ callbackUrl: "/login" })}>
                <LogOut className="h-4 w-4 shrink-0 opacity-30 transition-opacity hover:opacity-100" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
