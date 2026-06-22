
import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Shield, Eye, EyeOff, Lock, Mail, Crown, Building2, UserCircle, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/lib/i18n";


export function HexagonIcon() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" fill="none">
      <motion.path
        d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z"
        stroke="url(#hexGrad)"
        strokeWidth="1.5"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      <motion.path
        d="M50 15 L82 33 L82 67 L50 85 L18 67 L18 33 Z"
        stroke="url(#hexGrad)"
        strokeWidth="0.5"
        fill="rgba(156,30,153,0.05)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.5 }}
        transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
      />
      <defs>
        <linearGradient id="hexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9c1e99" />
          <stop offset="100%" stopColor="#c428c0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
