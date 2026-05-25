"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Shield, RotateCcw, ArrowLeft } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useTranslation();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyber-red to-rht-orange shadow-[0_4px_20px_rgba(239,68,68,0.3)]">
        <Shield className="h-8 w-8 text-white" />
      </div>

      <h1 className="mt-8 text-4xl font-bold tracking-tight text-foreground">
        {t("errorPage.title")}
      </h1>
      <p className="mt-3 text-muted-foreground">
        {t("errorPage.message")}
      </p>

      <div className="mt-8 flex gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          <RotateCcw className="h-4 w-4" />
          {t("errorPage.retry")}
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-rht-violet to-rht-violet-light px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("errorPage.home")}
        </Link>
      </div>

      <p className="mt-12 text-xs text-muted-foreground/40">
        <span className="font-normal opacity-60">Rostel</span>{" "}
        <span className="font-semibold">RoxShield</span> — {t("errorPage.tagline")}
      </p>
    </div>
  );
}
