import { Progress } from "@/components/ui/progress";

interface Props {
  title: string;
  value: number;
}

export function MetricProgress({
  title,
  value,
}: Props) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between">
        <span>{title}</span>
        <span>{value}%</span>
      </div>

      <Progress
        value={value}
        className="h-2"
      />
    </div>
  );
}