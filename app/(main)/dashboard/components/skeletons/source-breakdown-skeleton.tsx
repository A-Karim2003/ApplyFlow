import { Skeleton } from "@/components/ui/skeleton";

import { DashboardCard } from "../dashboard-card";

const ROWS = 4;

export function SourceBreakdownSkeleton() {
  return (
    <DashboardCard
      title="Where you apply"
      description="Applications sent by source, and how many got a reply"
    >
      <ul className="space-y-4">
        {Array.from({ length: ROWS }, (_, index) => (
          <li key={index}>
            <div className="mb-1.5 flex items-baseline justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-28" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
          </li>
        ))}
      </ul>
    </DashboardCard>
  );
}
