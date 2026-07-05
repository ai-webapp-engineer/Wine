import { Skeleton } from "@/components/ui/skeleton";
import { DASHBOARD_CHART_GRID_CLASS } from "@/lib/layout";
import { cn } from "@/lib/utils";

export function StatsGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div
      className={cn(
        "grid gap-4",
        count <= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
      )}
    >
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
          <Skeleton className="mb-3 h-4 w-24" />
          <Skeleton className="h-9 w-20" />
        </div>
      ))}
    </div>
  );
}

export function ChartGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className={DASHBOARD_CHART_GRID_CLASS}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
          <Skeleton className="mb-4 h-5 w-36" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      ))}
    </div>
  );
}
