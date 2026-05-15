"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  GraduationCap,
  BarChart3,
  LogOut,
  Shield,
  ChevronLeft,
  ChevronRight,
  UserCircle,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { label: "Mon espace", href: "/employee", icon: LayoutDashboard },
  { label: "Formations", href: "/employee/training", icon: GraduationCap },
  { label: "Mes résultats", href: "/employee/results", icon: BarChart3 },
];

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
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
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyber-green/80 to-cyber-green shadow-[0_4px_15px_rgba(37,211,102,0.3)]">
            <Shield className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight">CyberSense</span>
              <span className="text-[11px] opacity-40">Mon espace</span>
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
              <UserCircle className="h-3 w-3 text-cyber-green" />
              <p className="text-[10px] font-medium uppercase tracking-widest opacity-30">Employé</p>
            </div>
            <Badge className="mt-1 border-0 bg-cyber-green/10 text-cyber-green text-[10px]">
              Safi Congo SARL
            </Badge>
          </div>
        )}

        <nav className="flex-1 space-y-1 px-3 py-2">
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
                <p className="truncate text-[11px] opacity-40">f.sow@saficongo.com</p>
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
