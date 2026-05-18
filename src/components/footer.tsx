"use client";

import Link from "next/link";
import { Shield } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export function Footer() {
  const { locale } = useTranslation();

  return (
    <footer className="border-t bg-secondary/50 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row">
        <Link href="/" className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-rht-violet-light" />
          <span className="font-bold">
            <span className="font-normal opacity-60">Rox</span>Shield
          </span>
        </Link>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/about"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            {locale === "en" ? "About" : "A propos"}
          </Link>
          <Link
            href="/pricing"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            {locale === "en" ? "Pricing" : "Tarifs"}
          </Link>
          <Link
            href="/demo"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            {locale === "en" ? "Demo" : "Demo"}
          </Link>
          <Link
            href="/contact"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Contact
          </Link>
          <Link
            href="/legal"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            {locale === "en" ? "Legal" : "Mentions legales"}
          </Link>
        </div>
        <div className="flex flex-col items-center gap-1 sm:items-end">
          <a
            href="https://www.rostelhightech.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-rht-violet-light hover:underline"
          >
            www.rostelhightech.com
          </a>
          <p className="text-[11px] text-muted-foreground">
            &copy; 2026 Rostel High-Tech.{" "}
            {locale === "en" ? "All rights reserved." : "Tous droits reserves."}
          </p>
        </div>
      </div>
    </footer>
  );
}
