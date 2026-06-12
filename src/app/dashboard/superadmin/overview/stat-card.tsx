import { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  title: string;
  value: string;
  subtitle: string;
iconColor?: string;
isLoading?: boolean;
}

export function StatCard({
  icon: Icon,
  title,
  value,
  subtitle,
  iconColor = "#5d2595",
  isLoading = false,
}: Props) {
  return (
    <div className="rounded-xl hover:bg-[#1a1f36] cursor-pointer transition-colors duration-200 border border-white/5 bg-[#0c1023] p-6 shadow-xl">
      <div className="flex items-center gap-4">
        <div className="rounded-sm bg-[#5d2595]/20 p-3">
          <Icon className="h-6 w-6" style={{ color: "white" }} />
        </div>

        <div>
          <p className="text-sm text-zinc-400">{title}</p>

          <h2 className="text-sm font-bold">{isLoading ? "Chargement..." : value}</h2>

          <p className="text-sm text-zinc-500">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}