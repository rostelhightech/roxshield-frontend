"use client";

import { SessionProvider } from "next-auth/react";
import { SessionTimeout } from "@/components/session-timeout";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <SessionTimeout />
    </SessionProvider>
  );
}
