"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { COUNTRIES } from "@/lib/constants";
import { useTranslation } from 'react-i18next';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
}

function parsePhone(phone: string) {
  if (!phone) return { countryCode: "SN", dial: "+221", number: "" };
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

  const { t: tCommon } = useTranslation('common');
  const currentCountry = COUNTRIES.find((c) => c.code === countryCode);
  const dial = currentCountry?.dial || "+221";

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    setCountryCode(code);
    const newDial = COUNTRIES.find((c) => c.code === code)?.dial || "+221";
    onChange(number ? `${newDial} ${number}` : "");
  };

  const handleNumberChange = (num: string) => {
    const cleaned = num.replace(/[^\d\s]/g, "");
    setNumber(cleaned);
    onChange(cleaned ? `${dial} ${cleaned}` : "");
  };

  return (
    <div className={cn("flex items-center gap-0", className)}>
      {/* Sélecteur pays natif */}
      <select
        value={countryCode}
        onChange={handleCountryChange}
        disabled={disabled}
        aria-label="Indicatif pays"
        className={cn(
          "h-9 rounded-l-md rounded-r-none border border-r-0 border-input bg-transparent",
          "px-2 py-1 text-sm transition-colors appearance-none cursor-pointer",
          "focus:outline-none focus:ring-1 focus:ring-ring",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "text-foreground"
        )}
      >
        {[...COUNTRIES]
  .sort((a, b) => parseInt(a.dial.replace("+", "")) - parseInt(b.dial.replace("+", "")))
  .map((c) => (
    <option key={c.code} value={c.code}>
      {c.flag} {c.dial}
    </option>
  ))}
      </select>

      {/* Numéro */}
      <input
        type="tel"
        value={number}
        onChange={(e) => handleNumberChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        aria-label={tCommon('common.phone_input.aria_label')}
        autoComplete="tel-national"
        className={cn(
          "flex h-9 min-w-0 flex-1 rounded-r-md rounded-l-none border border-input bg-transparent",
          "px-3 py-1 text-sm shadow-xs transition-colors",
          "placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring",
          "disabled:cursor-not-allowed disabled:opacity-50"
        )}
      />
    </div>
  );
}