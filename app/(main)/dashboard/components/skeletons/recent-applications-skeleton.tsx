import Link from "next/link";

import { Skeleton } from "@/components/ui/skeleton";

import { DashboardCard } from "../dashboard-card";

const ROWS = 8; //? keep in step with .limit() in recent.ts

export function RecentApplicationsSkeleton() {
  return (
    <DashboardCard
      className="h-full"
      title="Recent applications"
      description="Sorted by the date you applied (or added the job)"
      action={
        <Link
          href="/applications"
          className="text-sm font-medium text-primary hover:underline"
        >
          View all
        </Link>
      }
    >
      <ul className="flex h-full flex-col justify-between" aria-hidden>
        {Array.from({ length: ROWS }).map((_, i) => (
          <li
            key={i}
            className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
          >
            <Skeleton className="size-10 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1 space-y-1.5">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
            </div>
            <div className="hidden w-full max-w-44 items-center justify-between gap-2 sm:flex">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="hidden h-3 w-16 md:block" />
          </li>
        ))}
      </ul>
    </DashboardCard>
  );
}
