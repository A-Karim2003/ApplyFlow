import { Skeleton } from "@/components/ui/skeleton";

import { DashboardCard } from "../dashboard-card";

export function UpcomingInterviewsSkeleton() {
  return (
    <DashboardCard
      title="Upcoming interviews"
      description="Your next conversations"
      className="flex-1 overflow-scroll"
    >
      <ul className="space-y-4">
        {Array.from({ length: 4 }, (_, index) => (
          <li key={index} className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-lg" />
            <div className="min-w-0 flex-1 space-y-1.5">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-20" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="ml-auto h-4 w-16" />
              <Skeleton className="ml-auto h-3 w-24" />
            </div>
          </li>
        ))}
      </ul>
    </DashboardCard>
  );
}
