"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full border border-white/[0.08]">
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9 rounded-full border border-border transition-all duration-300 hover:border-rht-violet/30 hover:shadow-[0_0_12px_rgba(156,30,153,0.15)]"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 text-rht-orange transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon className="h-4 w-4 text-rht-violet transition-transform duration-300" />
      )}
    </Button>
  );
}
