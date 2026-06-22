import { useTranslation, type Locale } from "@/lib/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const LANGUAGES: { code: Locale; label: string; flag: string }[] = [
  { code: "fr", label: "Français",   flag: "🇫🇷" },
  { code: "en", label: "English",    flag: "🇬🇧" },
  { code: "pt", label: "Português",  flag: "🇧🇷" },
];

export function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();

  const current = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0];

  const handleChange = (code: Locale) => {
    setLocale(code);
    fetch("/api/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale: code }),
    }).catch(() => {});
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger >
        <button
          className="flex items-center justify-center w-8 h-8 rounded-sm text-gray-400 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors gap-1"
          title="Changer la langue"
        >
          <Globe size={14} />
          <span className="text-[10px] font-bold uppercase leading-none">
            {current.code}
          </span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40 bg-white dark:bg-[#0c1023] border border-gray-200 dark:border-white/10 rounded-md shadow-xl p-1">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleChange(lang.code)}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2 rounded- cursor-pointer text-sm transition-colors",
              lang.code === locale
                ? "bg-[#5d2595]/10 text-[#b27cff] font-medium"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
            )}
          >
            <span className="text-base leading-none">{lang.flag}</span>
            <span>{lang.label}</span>
            {lang.code === locale && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#b27cff]" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
