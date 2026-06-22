"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

const routeLabels: Record<string, string> = {
  dashboard: "nav.dashboard",
  employees: "nav.employees",
  training: "nav.training",
  simulations: "nav.simulations",
  reports: "nav.reports",
  settings: "nav.settings",
  profile: "nav.profile",
  setup: "nav.setup",
  employee: "nav.mySpace",
  badges: "nav.badges",
  leaderboard: "nav.leaderboard",
  results: "nav.results",
  admin: "Admin",
  organizations: "Organizations",
  support: "Support",
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const segments = pathname.split("/").filter(Boolean);

  // Don't show on root pages
  if (segments.length <= 1) return null;

  const crumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const dictKey = routeLabels[segment];
    const label = dictKey
      ? dictKey.startsWith("nav.") || dictKey.startsWith("common.")
        ? t(dictKey as any)
        : dictKey
      : segment.charAt(0).toUpperCase() + segment.slice(1);
    const isLast = index === segments.length - 1;

    return { href, label, isLast, segment };
  });

  return (
    <nav className="flex items-center gap-1 text-xs text-muted-foreground">
      {crumbs.map((crumb, i) => (
        <span key={crumb.href} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="h-3 w-3" />}
          {crumb.isLast ? (
            <span className="font-medium text-foreground">{crumb.label}</span>
          ) : (
            <Link
              href={crumb.href}
              className="transition-colors hover:text-foreground"
            >
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
