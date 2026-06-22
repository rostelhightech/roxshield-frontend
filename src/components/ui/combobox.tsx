"use client";

import { useState, useRef, useEffect, useId, useCallback } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { ChevronDown, Search, Check } from "lucide-react";
import { useTranslation } from 'react-i18next';

interface ComboboxOption {
  value: string;
  label: string;
  icon?: string;
  sub?: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  allowCustom?: boolean;
  className?: string;
  disabled?: boolean;
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  searchPlaceholder = "Search...",
  allowCustom = false,
  className,
  disabled,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const { t: tCommon } = useTranslation('common');

  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const filtered = options.filter(
    (o) =>
      o.label.toLowerCase().includes(search.toLowerCase()) ||
      o.value.toLowerCase().includes(search.toLowerCase()) ||
      (o.sub && o.sub.toLowerCase().includes(search.toLowerCase()))
  );

  const selected = options.find((o) => o.value === value);

  // Calcule la position du dropdown en fonction du bouton trigger
  const updateDropdownPosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const dropdownHeight = 260; // max-height approximative

    const openUpward = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;

    setDropdownStyle({
      position: "fixed",
      width: rect.width,
      left: rect.left,
      ...(openUpward
        ? { bottom: window.innerHeight - rect.top + 4 }
        : { top: rect.bottom + 4 }),
      zIndex: 9999,
    });
  }, []);

  const selectOption = useCallback(
    (val: string) => {
      onChange(val);
      setOpen(false);
      setSearch("");
      setHighlightIndex(-1);
    },
    [onChange]
  );

  // Ferme si clic en dehors
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      const dropdownEl = document.getElementById(`portal-${listboxId}`);
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        dropdownEl &&
        !dropdownEl.contains(target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, listboxId]);

  // Recalcule la position au scroll/resize
  useEffect(() => {
    if (!open) return;
    updateDropdownPosition();
    window.addEventListener("scroll", updateDropdownPosition, true);
    window.addEventListener("resize", updateDropdownPosition);
    return () => {
      window.removeEventListener("scroll", updateDropdownPosition, true);
      window.removeEventListener("resize", updateDropdownPosition);
    };
  }, [open, updateDropdownPosition]);

  // Focus l'input à l'ouverture
  useEffect(() => {
    if (open && inputRef.current) {
        inputRef.current.focus({ preventScroll: true }); // ← ajouter ça

    }
    if (!open) {
      setHighlightIndex(-1);
    }
  }, [open]);

  useEffect(() => {
    setHighlightIndex(-1);
  }, [search]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!open) {
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
          e.preventDefault();
          setOpen(true);
          setSearch("");
        }
        return;
      }

      switch (e.key) {
        case "Escape":
          e.preventDefault();
          setOpen(false);
          break;
        case "ArrowDown":
          e.preventDefault();
          setHighlightIndex((prev) => {
            const next = prev < filtered.length - 1 ? prev + 1 : 0;
            const el = listRef.current?.children[next] as HTMLElement | undefined;
            el?.scrollIntoView({ block: "nearest" });
            return next;
          });
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightIndex((prev) => {
            const next = prev > 0 ? prev - 1 : filtered.length - 1;
            const el = listRef.current?.children[next] as HTMLElement | undefined;
            el?.scrollIntoView({ block: "nearest" });
            return next;
          });
          break;
        case "Enter":
          e.preventDefault();
          if (highlightIndex >= 0 && highlightIndex < filtered.length) {
            selectOption(filtered[highlightIndex].value);
          } else if (allowCustom && search && filtered.length === 0) {
            selectOption(search);
          }
          break;
      }
    },
    [open, filtered, highlightIndex, allowCustom, search, selectOption]
  );

  const dropdown = open ? (
    <div
      id={`portal-${listboxId}`}
      style={dropdownStyle}
      className="rounded-sm border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#0c1023] shadow-lg animate-in fade-in-0 zoom-in-95"
    >
      {/* Barre de recherche */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-white/[0.08] px-3 py-2">
        <Search className="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400" />
        <input
          ref={inputRef}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          // placeholder={searchPlaceholder}
          className="flex-1 bg-transparent text-sm text-gray-900 dark:text-white outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
          role="combobox"
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-activedescendant={
            highlightIndex >= 0 ? `${listboxId}-${highlightIndex}` : undefined
          }
        />
      </div>

      {/* Liste des options */}
      <div
        ref={listRef}
        id={listboxId}
        role="listbox"
        className="max-h-[220px] overflow-y-auto p-1"
      >
        {filtered.length === 0 ? (
          <div className="px-3 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
            {allowCustom && search ? (
              <button
                type="button"
                onClick={() => selectOption(search)}
                className="text-rht-violet-light hover:underline"
              >
                Utiliser &quot;{search}&quot;
              </button>
            ) : (
              tCommon('common.combobox.no_results')
            )}
          </div>
        ) : (
          filtered.map((option, index) => (
            <button
              key={option.value}
              id={`${listboxId}-${index}`}
              type="button"
              role="option"
              aria-selected={value === option.value}
              onClick={() => selectOption(option.value)}
              className={cn(
                "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-gray-900 dark:text-white transition-colors hover:bg-gray-100 dark:hover:bg-slate-800",
                value === option.value && "bg-gray-100 dark:bg-slate-800",
                highlightIndex === index &&
                  "bg-gray-200 dark:bg-slate-700 ring-1 ring-gray-300 dark:ring-white/10"
              )}
            >
              {option.icon && <span className="text-base">{option.icon}</span>}
              <span className="flex-1 text-left">{option.label}</span>
              {option.sub && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {option.sub}
                </span>
              )}
              {value === option.value && (
                <Check className="h-4 w-4 text-rht-violet-light" />
              )}
            </button>
          ))
        )}
      </div>
    </div>
  ) : null;

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      onKeyDown={handleKeyDown}
    >
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        onClick={() => {
          setOpen((prev) => !prev);
          setSearch("");
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        className={cn(
          "flex h-9 w-full items-center justify-between rounded-sm border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 px-3 py-1 text-sm shadow-xs transition-colors",
          "hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          !value && "text-gray-500",
          value && "text-gray-900 dark:text-white"
        )}
      >
        <span className="flex items-center gap-2 truncate">
          {selected?.icon && <span>{selected.icon}</span>}
          {selected?.label || value || placeholder}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 opacity-50 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {/* Rendu via portal → échappe tout overflow:hidden et z-index des parents */}
      {typeof window !== "undefined" &&
        createPortal(dropdown, document.body)}
    </div>
  );
}