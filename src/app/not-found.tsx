"use client";

import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rht-violet to-rht-violet-light shadow-[0_4px_20px_rgba(156,30,153,0.3)]">
        <Shield className="h-8 w-8 text-white" />
      </div>

      <h1 className="mt-8 text-7xl font-bold tracking-tight text-foreground">404</h1>
      <p className="mt-3 text-lg text-muted-foreground">
        {t("notFound.message")}
      </p>
      <p className="mt-1 text-sm text-muted-foreground/60">
        {t("notFound.hint")}
      </p>

      <div className="mt-8 flex gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("notFound.backHome")}
        </Link>
        <Link
          href="/login"
          className="inline-flex items-center rounded-lg bg-gradient-to-r from-rht-violet to-rht-violet-light px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          {t("notFound.login")}
        </Link>
      </div>

      <p className="mt-12 text-xs text-muted-foreground/40">
        <span className="font-normal opacity-60">Rostel</span>{" "}
        <span className="font-semibold">RoxShield</span> — {t("notFound.tagline")}
      </p>
    </div>
  );
}
