import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton className="h-8 w-36" />
      <Skeleton className="h-32 rounded-xl" />
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-[350px] rounded-xl" />
        <div className="space-y-6">
          <Skeleton className="h-[200px] rounded-xl" />
          <Skeleton className="h-[250px] rounded-xl" />
        </div>
      </div>
    </div>
  );
}
