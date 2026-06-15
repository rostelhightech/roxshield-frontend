import { LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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
  iconColor = "#ea580c",
  isLoading = false,
}: Props) {
  if (isLoading) {
    return (
      <div className="rounded-sm border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0c1023] p-6 shadow-sm dark:shadow-xl">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-sm bg-gray-200 dark:bg-gray-800" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 bg-gray-200 dark:bg-gray-800" />
            <Skeleton className="h-6 w-16 bg-gray-200 dark:bg-gray-800" />
            <Skeleton className="h-3 w-32 bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-sm hover:bg-gray-100 dark:hover:bg-[#1a1f36] cursor-pointer transition-colors duration-200 border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0c1023] p-6 shadow-sm dark:shadow-xl">
      <div className="flex items-center gap-4">
        <div 
          className="rounded-sm p-3" 
          style={{ backgroundColor: `${iconColor}20` }}
        >
          <Icon className="h-6 w-6" style={{ color: iconColor }} />
        </div>

        <div>
          <p className="text-sm text-gray-500 dark:text-zinc-400">{title}</p>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h2>
          <p className="text-xs text-gray-400 dark:text-zinc-500">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}