"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslation } from "@/lib/i18n";
import { Keyboard } from "lucide-react";

interface Shortcut {
  keys: string[];
  description: string;
}

export function KeyboardShortcuts() {
  const [open, setOpen] = useState(false);
  const { t, locale } = useTranslation();

  const shortcuts: { section: string; items: Shortcut[] }[] = [
    {
      section: locale === "en" ? "Navigation" : "Navigation",
      items: [
        { keys: ["⌘", "K"], description: locale === "en" ? "Open command palette" : "Ouvrir la palette de commandes" },
        { keys: ["?"], description: locale === "en" ? "Show keyboard shortcuts" : "Afficher les raccourcis clavier" },
      ],
    },
    {
      section: locale === "en" ? "Actions" : "Actions",
      items: [
        { keys: ["G", "D"], description: locale === "en" ? "Go to Dashboard" : "Aller au Dashboard" },
        { keys: ["G", "E"], description: locale === "en" ? "Go to Employees" : "Aller aux Employés" },
        { keys: ["G", "S"], description: locale === "en" ? "Go to Simulations" : "Aller aux Simulations" },
        { keys: ["G", "R"], description: locale === "en" ? "Go to Reports" : "Aller aux Rapports" },
        { keys: ["G", "P"], description: locale === "en" ? "Go to Settings" : "Aller aux Paramètres" },
      ],
    },
    {
      section: locale === "en" ? "Interface" : "Interface",
      items: [
        { keys: ["Esc"], description: locale === "en" ? "Close dialog / panel" : "Fermer une modale / panneau" },
      ],
    },
  ];

  useEffect(() => {
    let gPressed = false;
    let gTimeout: ReturnType<typeof setTimeout>;

    function handleKeyDown(e: KeyboardEvent) {
      // Don't trigger in inputs
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) return;

      // ? key to show shortcuts
      if (e.key === "?" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setOpen((prev) => !prev);
        return;
      }

      // G + key navigation
      if (e.key === "g" && !e.metaKey && !e.ctrlKey) {
        gPressed = true;
        clearTimeout(gTimeout);
        gTimeout = setTimeout(() => { gPressed = false; }, 1000);
        return;
      }

      if (gPressed) {
        gPressed = false;
        const routes: Record<string, string> = {
          d: "/dashboard",
          e: "/dashboard/employees",
          s: "/dashboard/simulations",
          r: "/dashboard/reports",
          p: "/dashboard/settings",
        };
        const route = routes[e.key];
        if (route) {
          e.preventDefault();
          window.location.href = route;
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      clearTimeout(gTimeout);
    };
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-4 w-4" />
            {locale === "en" ? "Keyboard Shortcuts" : "Raccourcis clavier"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {shortcuts.map((group) => (
            <div key={group.section}>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                {group.section}
              </p>
              <div className="space-y-2">
                {group.items.map((shortcut) => (
                  <div key={shortcut.description} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{shortcut.description}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key) => (
                        <kbd
                          key={key}
                          className="flex h-6 min-w-[24px] items-center justify-center rounded border bg-muted px-1.5 text-[11px] font-medium"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-2 rounded-lg bg-accent/50 p-3 text-center text-xs text-muted-foreground">
          {locale === "en"
            ? "Press ? anywhere to toggle this panel"
            : "Appuyez sur ? n'importe où pour afficher ce panneau"}
        </div>
      </DialogContent>
    </Dialog>
  );
}
