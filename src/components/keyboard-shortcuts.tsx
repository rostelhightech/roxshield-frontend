"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslation } from "@/lib/i18n";
import { Keyboard } from "lucide-react";

interface Shortcut {
  keys: string[];
  descKey: string;
}

interface ShortcutGroup {
  sectionKey: string;
  items: Shortcut[];
}

type DK = Parameters<ReturnType<typeof useTranslation>["t"]>[0];

const shortcutsMeta: ShortcutGroup[] = [
  {
    sectionKey: "shortcuts.navigation",
    items: [
      { keys: ["⌘", "K"], descKey: "shortcuts.openPalette" },
      { keys: ["?"], descKey: "shortcuts.showShortcuts" },
    ],
  },
  {
    sectionKey: "shortcuts.actions",
    items: [
      { keys: ["G", "D"], descKey: "shortcuts.gotoDashboard" },
      { keys: ["G", "E"], descKey: "shortcuts.gotoEmployees" },
      { keys: ["G", "S"], descKey: "shortcuts.gotoSimulations" },
      { keys: ["G", "R"], descKey: "shortcuts.gotoReports" },
      { keys: ["G", "P"], descKey: "shortcuts.gotoSettings" },
    ],
  },
  {
    sectionKey: "shortcuts.interface",
    items: [
      { keys: ["Esc"], descKey: "shortcuts.closeDialog" },
    ],
  },
];

export function KeyboardShortcuts() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

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
            {t("shortcuts.title")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {shortcutsMeta.map((group) => (
            <div key={group.sectionKey}>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                {t(group.sectionKey as DK)}
              </p>
              <div className="space-y-2">
                {group.items.map((shortcut) => (
                  <div key={shortcut.descKey} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t(shortcut.descKey as DK)}</span>
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
          {t("shortcuts.hint")}
        </div>
      </DialogContent>
    </Dialog>
  );
}
