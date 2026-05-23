"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/layout/sidebar";
import { Onboarding } from "@/components/onboarding";
import { PageTransition } from "@/components/page-transition";
import { AuthProvider } from "@/components/auth-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const key = "roxshield_onboarding_admin-client";
    if (!sessionStorage.getItem(key)) {
      setShowOnboarding(true);
      sessionStorage.setItem(key, "done");
    }
  }, []);

  return (
    <AuthProvider>
      <div className="flex min-h-screen">
        <AnimatePresence>
          {showOnboarding && (
            <Onboarding role="admin-client" onComplete={() => setShowOnboarding(false)} />
          )}
        </AnimatePresence>
        <Sidebar />
        <main className="flex-1 pt-14 md:ml-[260px] md:pt-0 transition-all duration-300">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </AuthProvider>
  );
}
