import { Skeleton } from "@/components/ui/skeleton";

export default function TrainingLoading() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton className="h-8 w-36" />
      <Skeleton className="h-5 w-64" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-52 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
