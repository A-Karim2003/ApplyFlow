import { Skeleton } from "@/components/ui/skeleton";

import { DashboardCard } from "../dashboard-card";

const ROWS = 5;

export function RecentActivitySkeleton() {
  return (
    <DashboardCard
      title="Recent Activity"
      description="The latest changes in your pipeline"
    >
      <ul className="space-y-6">
        {Array.from({ length: ROWS }, (_, index) => (
          <li key={index} className="flex items-center gap-3">
            <Skeleton className="size-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/4" />
            </div>
          </li>
        ))}
      </ul>
    </DashboardCard>
  );
}
