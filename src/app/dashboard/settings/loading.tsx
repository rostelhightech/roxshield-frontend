import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-10 w-[400px] rounded-lg" />
      <Skeleton className="h-[400px] rounded-xl" />
    </div>
  );
}
