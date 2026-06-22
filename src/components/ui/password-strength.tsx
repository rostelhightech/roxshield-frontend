"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

function getStrength(password: string): { score: number; label: string; color: string } {
  if (!password) return { score: 0, label: "", color: "" };

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 1) return { score: 1, label: "Faible", color: "bg-red-500" };
  if (score <= 2) return { score: 2, label: "Moyen", color: "bg-orange-500" };
  if (score <= 3) return { score: 3, label: "Bon", color: "bg-yellow-500" };
  if (score <= 4) return { score: 4, label: "Fort", color: "bg-green-500" };
  return { score: 5, label: "Excellent", color: "bg-emerald-500" };
}

export function PasswordStrength({ password, className }: PasswordStrengthProps) {
  const strength = useMemo(() => getStrength(password), [password]);

  if (!password) return null;

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              level <= strength.score ? strength.color : "bg-muted"
            )}
          />
        ))}
      </div>
      <p className={cn(
        "text-[10px] font-medium",
        strength.score <= 1 && "text-red-500",
        strength.score === 2 && "text-orange-500",
        strength.score === 3 && "text-yellow-500",
        strength.score === 4 && "text-green-500",
        strength.score === 5 && "text-emerald-500",
      )}>
        {strength.label}
      </p>
    </div>
  );
}
