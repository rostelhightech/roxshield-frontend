"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock, LogOut } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const TIMEOUT_MS = 15 * 60 * 1000;
const WARNING_MS = 2 * 60 * 1000;

export function SessionTimeout() {
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(120);
  const { locale } = useTranslation();
  const pathname = usePathname();
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  const warningRef = useRef<ReturnType<typeof setTimeout>>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval>>(null);

  const isAuthArea = pathname.startsWith("/dashboard") || pathname.startsWith("/employee") || pathname.startsWith("/admin");

  const clearAllTimers = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
  }, []);

  const resetTimers = useCallback(() => {
    if (!isAuthArea) return;

    setShowWarning(false);
    setCountdown(120);
    clearAllTimers();

    warningRef.current = setTimeout(() => {
      setShowWarning(true);
      setCountdown(120);
      countdownRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            signOut({ callbackUrl: "/login?reason=timeout" });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, TIMEOUT_MS - WARNING_MS);

    timeoutRef.current = setTimeout(() => {
      signOut({ callbackUrl: "/login?reason=timeout" });
    }, TIMEOUT_MS);
  }, [isAuthArea, clearAllTimers]);

  const handleStayConnected = () => {
    setShowWarning(false);
    clearAllTimers();
    resetTimers();
  };

  const handleLogout = () => {
    clearAllTimers();
    signOut({ callbackUrl: "/login" });
  };

  useEffect(() => {
    if (!isAuthArea) return;

    const events = ["mousedown", "keydown", "scroll", "touchstart"];
    const resetOnActivity = () => {
      if (!showWarning) resetTimers();
    };

    events.forEach((event) => document.addEventListener(event, resetOnActivity, { passive: true }));
    resetTimers();

    return () => {
      events.forEach((event) => document.removeEventListener(event, resetOnActivity));
      clearAllTimers();
    };
  }, [isAuthArea, resetTimers, showWarning, clearAllTimers]);

  if (!isAuthArea) return null;

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  return (
    <Dialog open={showWarning} onOpenChange={(open) => { if (!open) handleStayConnected(); }}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Clock className="h-5 w-5" />
            {locale === "en" ? "Session Expiring" : "Session expirante"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <p className="text-sm text-muted-foreground">
            {locale === "en"
              ? "Your session will expire due to inactivity."
              : "Votre session va expirer pour cause d'inactivité."}
          </p>

          <div className="flex items-center justify-center rounded-xl bg-destructive/10 py-4">
            <span className="text-3xl font-bold tabular-nums text-destructive">
              {minutes}:{seconds.toString().padStart(2, "0")}
            </span>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 gap-2" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              {locale === "en" ? "Log out" : "Déconnexion"}
            </Button>
            <Button className="flex-1" onClick={handleStayConnected}>
              {locale === "en" ? "Stay connected" : "Rester connecté"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
