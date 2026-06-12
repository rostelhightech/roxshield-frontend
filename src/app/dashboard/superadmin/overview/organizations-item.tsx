import { ChevronRight } from "lucide-react";

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
    if (score >= 70) return 'text-red-400 bg-red-500/10';
    if (score >= 30) return 'text-orange-400 bg-orange-500/10';
    return 'text-green-400 bg-green-500/10';
  };

  return (
    <div className="flex cursor-pointer hover:bg-[#1a1f36] hover:rounded-lg px-2 transition-colors duration-200 items-center justify-between border-b border-white/5 py-5">
      <div>
        <h4 className="font-semibold text-sm">{name}</h4>
        <p className="text-sm text-zinc-500">
          {city}
          {employeesCount !== undefined && (
            <span className="ml-2">• {employeesCount} employés</span>
          )}
        </p>
      </div>

      <div className="flex items-center gap-4">
        {riskScore !== undefined && (
          <span className={`rounded-full px-3 py-1 text-sm ${getRiskColor(riskScore)}`}>
            {riskScore}% risque
          </span>
        )}

        <span className="rounded-full bg-white/5 px-3 py-1 text-sm">
          {plan}
        </span>

        <ChevronRight />
      </div>
    </div>
  );
}