import { Skeleton } from "@/components/ui/skeleton";

import { DashboardCard } from "../dashboard-card";

const ROWS = 4;

export function AwaitingReplySkeleton() {
  return (
    <DashboardCard
      className="h-full"
      title="Awaiting a reply"
      description="Applied 2+ weeks ago with no response"
    >
      <ul className="space-y-4">
        {Array.from({ length: ROWS }, (_, index) => (
          <li key={index} className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
            </div>
            <div className="space-y-2">
              <Skeleton className="ml-auto h-4 w-14" />
              <Skeleton className="ml-auto h-3 w-16" />
            </div>
          </li>
        ))}
      </ul>
    </DashboardCard>
  );
}
