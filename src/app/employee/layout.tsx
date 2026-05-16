"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Onboarding } from "@/components/onboarding";
import { PageTransition } from "@/components/page-transition";
import {
  LayoutDashboard,
  GraduationCap,
  BarChart3,
  Award,
  LogOut,
  Shield,
  ChevronLeft,
  ChevronRight,
  UserCircle,
  Menu,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { label: "Mon espace", href: "/employee", icon: LayoutDashboard },
  { label: "Formations", href: "/employee/training", icon: GraduationCap },
  { label: "Mes résultats", href: "/employee/results", icon: BarChart3 },
  { label: "Badges", href: "/employee/badges", icon: Award },
];

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const key = "cybersense_onboarding_employee";
    if (!sessionStorage.getItem(key)) {
      setShowOnboarding(true);
      sessionStorage.setItem(key, "done");
    }
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-screen">
      <AnimatePresence>
        {showOnboarding && (
          <Onboarding role="employee" onComplete={() => setShowOnboarding(false)} />
        )}
      </AnimatePresence>

      {/* Mobile header */}
      <div className="fixed left-0 right-0 top-0 z-50 flex h-14 items-center gap-3 border-b border-sidebar-border bg-sidebar px-4 text-sidebar-foreground md:hidden">
        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setMobileOpen(true)}>
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-cyber-green/80 to-cyber-green">
            <Shield className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-sm font-bold"><span className="font-normal opacity-60">Rostel</span> CyberSense</span>
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300
          ${collapsed ? "w-[70px]" : "w-[260px]"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0`}
      >
        <div className="flex items-center gap-3 px-4 py-5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyber-green/80 to-cyber-green shadow-[0_4px_15px_rgba(37,211,102,0.3)]">
            <Shield className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight"><span className="font-normal opacity-60">Rostel</span> CyberSense</span>
              <span className="text-[11px] opacity-40">Mon espace</span>
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
            <div className="flex items-center gap-2">
              <UserCircle className="h-3 w-3 text-cyber-green" />
              <p className="text-[10px] font-medium uppercase tracking-widest opacity-30">Employé</p>
            </div>
            <Badge className="mt-1 border-0 bg-cyber-green/10 text-cyber-green text-[10px]">
              Safi Sénégal SARL
            </Badge>
          </div>
        )}

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/employee" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-cyber-green/15 text-cyber-green shadow-[0_2px_8px_rgba(37,211,102,0.1)]"
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
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="bg-gradient-to-br from-cyber-green/80 to-cyber-green text-[11px] text-white">
                FS
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium">Fatou Sow</p>
                <p className="truncate text-[11px] opacity-40">f.sow@safisenegal.com</p>
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

      <main className={`flex-1 pt-14 md:pt-0 transition-all duration-300 ${collapsed ? "md:ml-[70px]" : "md:ml-[260px]"}`}>
        <PageTransition>{children}</PageTransition>
      </main>
    </div>
  );
}
