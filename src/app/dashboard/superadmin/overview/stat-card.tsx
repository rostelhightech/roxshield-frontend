import { LucideIcon } from "lucide-react";
import { useTranslation } from 'react-i18next';

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
    const { t: tCommon } = useTranslation('common');

  return (
    <div className="rounded-sm hover:bg-gray-100 dark:hover:bg-[#1a1f36] cursor-pointer transition-colors duration-200 border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0c1023] p-6 shadow-xs dark:shadow-xl">
      <div className="flex items-center gap-4">
        <div 
          className="rounded-sm p-3"
          style={{ backgroundColor: `${iconColor}20` }}
        >
          <Icon 
            className="h-6 w-6" 
            style={{ color: iconColor }} 
          />
        </div>

        <div>
          <p className="text-sm text-gray-500 dark:text-zinc-400">{title}</p>

          <h2 className="text-sm font-bold text-gray-900 dark:text-white">
            {isLoading ? tCommon('admin.page_overview.risk_by_dept_loading') : value}
          </h2>

          <p className="text-sm text-gray-400 dark:text-zinc-500">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}