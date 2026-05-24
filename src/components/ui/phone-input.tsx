"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { COUNTRIES } from "@/lib/constants";
import { Combobox } from "./combobox";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
}

/** Parse a phone string into { countryCode, dial, number } */
function parsePhone(phone: string) {
  if (!phone) return { countryCode: "SN", dial: "+221", number: "" };

  // Try to match a known dial code at the start
  const sorted = [...COUNTRIES].sort((a, b) => b.dial.length - a.dial.length);
  for (const c of sorted) {
    if (phone.startsWith(c.dial)) {
      return { countryCode: c.code, dial: c.dial, number: phone.slice(c.dial.length).trim() };
    }
  }

  return { countryCode: "SN", dial: "+221", number: phone.replace(/^\+?\d{1,3}\s?/, "") };
}

export function PhoneInput({
  value,
  onChange,
  className,
  disabled,
  placeholder = "77 000 00 00",
}: PhoneInputProps) {
  const parsed = useMemo(() => parsePhone(value), [value]);
  const [countryCode, setCountryCode] = useState(parsed.countryCode);
  const [number, setNumber] = useState(parsed.number);

  const countryOptions = useMemo(
    () =>
      COUNTRIES.map((c) => ({
        value: c.code,
        label: `${c.flag} ${c.dial}`,
        sub: c.name,
      })),
    []
  );

  const currentCountry = COUNTRIES.find((c) => c.code === countryCode);
  const dial = currentCountry?.dial || "+221";

  const handleCountryChange = (code: string) => {
    setCountryCode(code);
    const newDial = COUNTRIES.find((c) => c.code === code)?.dial || "+221";
    onChange(number ? `${newDial} ${number}` : "");
  };

  const handleNumberChange = (num: string) => {
    // Only allow digits and spaces
    const cleaned = num.replace(/[^\d\s]/g, "");
    setNumber(cleaned);
    onChange(cleaned ? `${dial} ${cleaned}` : "");
  };

  return (
    <div className={cn("flex gap-2", className)}>
      <Combobox
        options={countryOptions}
        value={countryCode}
        onChange={handleCountryChange}
        placeholder="Pays"
        searchPlaceholder="Rechercher un pays..."
        className="w-[140px] shrink-0"
        disabled={disabled}
      />
      <input
        type="tel"
        value={number}
        onChange={(e) => handleNumberChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors",
          "placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring",
          "disabled:cursor-not-allowed disabled:opacity-50"
        )}
      />
    </div>
  );
}
