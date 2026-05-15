"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Building2,
  HeadphonesIcon,
  LogOut,
  Shield,
  ChevronLeft,
  ChevronRight,
  Crown,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { label: "Vue d'ensemble", href: "/admin", icon: LayoutDashboard },
  { label: "Organisations", href: "/admin/organizations", icon: Building2 },
  { label: "Support", href: "/admin/support", icon: HeadphonesIcon },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen">
      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300 ${
          collapsed ? "w-[70px]" : "w-[260px]"
        }`}
      >
        <div className="flex items-center gap-3 px-4 py-5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rht-orange to-rht-orange-light shadow-[0_4px_15px_rgba(250,153,14,0.3)]">
            <Shield className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight">CyberSense</span>
              <span className="text-[11px] opacity-40">Super Admin</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto h-7 w-7 opacity-40 hover:bg-sidebar-accent hover:opacity-100"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        <Separator className="bg-sidebar-border" />

        {!collapsed && (
          <div className="px-4 py-3">
            <div className="flex items-center gap-2">
              <Crown className="h-3 w-3 text-rht-orange" />
              <p className="text-[10px] font-medium uppercase tracking-widest opacity-30">Rostel High-Tech</p>
            </div>
            <Badge className="mt-1 border-0 bg-rht-orange/10 text-rht-orange text-[10px]">
              Plateforme CyberSense
            </Badge>
          </div>
        )}

        <nav className="flex-1 space-y-1 px-3 py-2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-rht-orange/15 text-rht-orange shadow-[0_2px_8px_rgba(250,153,14,0.1)]"
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

        {!collapsed && (
          <div className="px-4 py-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-sidebar-foreground/40 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground/70"
            >
              <Building2 className="h-3.5 w-3.5" />
              Vue client (Safi Congo)
            </Link>
          </div>
        )}

        <div className="p-3">
          <div className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${collapsed ? "justify-center" : ""}`}>
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="bg-gradient-to-br from-rht-orange to-rht-orange-light text-[11px] text-white">
                HY
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium">Herdy Youlou</p>
                <p className="truncate text-[11px] opacity-40">admin@rostelhightech.com</p>
              </div>
            )}
            {!collapsed && (
              <Link href="/login">
                <LogOut className="h-4 w-4 shrink-0 opacity-30 transition-opacity hover:opacity-100" />
              </Link>
            )}
          </div>
        </div>
      </aside>

      <main className={`flex-1 transition-all duration-300 ${collapsed ? "ml-[70px]" : "ml-[260px]"}`}>
        {children}
      </main>
    </div>
  );
}
