"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Filter, X, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/lib/i18n";

export interface FilterOption {
  id: string;
  label: string;
  values: { value: string; label: string; count?: number }[];
}

interface DataTableFiltersProps {
  filters: FilterOption[];
  activeFilters: Record<string, string[]>;
  onFiltersChange: (filters: Record<string, string[]>) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  totalResults?: number;
}

export function DataTableFilters({
  filters,
  activeFilters,
  onFiltersChange,
  searchValue,
  onSearchChange,
  searchPlaceholder,
  totalResults,
}: DataTableFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const { t } = useTranslation();

  const activeCount = Object.values(activeFilters).reduce((acc, v) => acc + v.length, 0);

  const toggleFilter = (filterId: string, value: string) => {
    const current = activeFilters[filterId] ?? [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFiltersChange({ ...activeFilters, [filterId]: updated });
  };

  const clearAll = () => {
    onFiltersChange({});
    onSearchChange("");
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder ?? t("filters.search")}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          variant={showFilters ? "default" : "outline"}
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">{t("filters.filters")}</span>
          {activeCount > 0 && (
            <Badge className="ml-1 h-5 w-5 rounded-full p-0 text-[10px]">{activeCount}</Badge>
          )}
        </Button>
        {(activeCount > 0 || searchValue) && (
          <Button variant="ghost" size="sm" onClick={clearAll} className="gap-1 text-muted-foreground">
            <X className="h-3 w-3" />
            {t("filters.clear")}
          </Button>
        )}
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border bg-card p-4 space-y-4">
              {filters.map((filter) => (
                <div key={filter.id}>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    {filter.label}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {filter.values.map((option) => {
                      const isActive = (activeFilters[filter.id] ?? []).includes(option.value);
                      return (
                        <Button
                          key={option.value}
                          variant={isActive ? "default" : "outline"}
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => toggleFilter(filter.id, option.value)}
                        >
                          {option.label}
                          {option.count !== undefined && (
                            <span className="ml-1 opacity-60">({option.count})</span>
                          )}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {totalResults !== undefined && (
        <p className="text-xs text-muted-foreground">
          {totalResults} {t("filters.results")}
        </p>
      )}
    </div>
  );
}
