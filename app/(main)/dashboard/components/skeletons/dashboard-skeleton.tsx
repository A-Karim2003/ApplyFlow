import { Skeleton } from "@/components/ui/skeleton";

import { AwaitingReplySkeleton } from "./awaiting-reply-skeleton";
import { KpiCardsSkeleton } from "./kpi-card-skeleton";
import { RecentActivitySkeleton } from "./recent-activity-skeleton";
import { RecentApplicationsSkeleton } from "./recent-applications-skeleton";
import { SourceBreakdownSkeleton } from "./source-breakdown-skeleton";
import { StatusChartSkeleton } from "./status-chart-skeleton";
import { TimelineChartSkeleton } from "./timeline-chart-skeleton";
import { UpcomingInterviewsSkeleton } from "./upcoming-interviews-skeleton";

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-8 w-72" />
      </div>

      <KpiCardsSkeleton />

      <div className="grid gap-4 lg:grid-cols-2">
        <StatusChartSkeleton />
        <TimelineChartSkeleton />
      </div>

      <div className="grid gap-4 lg:h-150 lg:grid-cols-3">
        <div className="h-full min-h-0 lg:col-span-2">
          <RecentApplicationsSkeleton />
        </div>
        <div className="flex h-full flex-col gap-4">
          <UpcomingInterviewsSkeleton />
          <AwaitingReplySkeleton />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SourceBreakdownSkeleton />
        <RecentActivitySkeleton />
      </div>
    </div>
  );
}
