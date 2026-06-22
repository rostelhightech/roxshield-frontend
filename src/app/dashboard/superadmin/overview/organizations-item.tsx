import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Props {
  name: string;
  city: string;
  plan: string;
  employeesCount?: number;
  riskScore?: number;
}

export function OrganizationItem({
  name,
  city,
  plan,
  employeesCount,
  riskScore,
}: Props) {
  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-500/10';
    if (score >= 30) return 'text-orange-700 dark:text-orange-400 bg-orange-100 dark:bg-orange-500/10';
    return 'text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-500/10';
  };

  const { t: tCommon } = useTranslation();

  return (
    <div className="flex cursor-pointer hover:bg-gray-100 dark:hover:bg-[#1a1f36] hover:rounded-lg px-2 transition-colors duration-200 items-center justify-between border-b border-gray-200 dark:border-white/5 py-5">
      <div>
        <h4 className="font-semibold text-sm text-gray-900 dark:text-white">{name}</h4>
        <p className="text-sm text-gray-500 dark:text-zinc-500">
          {city}
          {employeesCount !== undefined && (
            <span className="ml-2">• {employeesCount} ${tCommon('common.employes')}</span>
          )}
        </p>
      </div>

      <div className="flex items-center gap-4">
        {riskScore !== undefined && (
          <span className={`rounded-full px-3 py-1 text-sm font-medium ${getRiskColor(riskScore)}`}>
            {riskScore}% risque
          </span>
        )}

        <span className="rounded-full bg-gray-100 dark:bg-white/5 px-3 py-1 text-sm text-gray-700 dark:text-white">
          {plan}
        </span>

        <ChevronRight className="text-gray-400 dark:text-white" size={18} />
      </div>
    </div>
  );
}