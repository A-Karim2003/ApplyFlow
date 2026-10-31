import { Suspense } from "react";

import { StatusChartSection } from "./sections/status-chart-section";
import { KpiCardsSection } from "./sections/kpi-cards-section";
import { ApplicationOvertimeSection } from "./sections/application-overtime-section";
import { KpiCardsSkeleton } from "./skeletons/kpi-card-skeleton";

import { StatusChartSkeleton } from "./skeletons/status-chart-skeleton";
import { RangeFilter, RANGES, type RangeKey } from "./range-filter";
import { TimelineChartSkeleton } from "./skeletons/timeline-chart-skeleton";
import { RecentApplicationsSection } from "./sections/recent-application-section";
import { RecentApplicationsSkeleton } from "./skeletons/recent-applications-skeleton";
import { AwaitingReplySection } from "./sections/awaiting-reply-section";
import { AwaitingReplySkeleton } from "./skeletons/awaiting-reply-skeleton";
import { SourceBreakdownSkeleton } from "./skeletons/source-breakdown-skeleton";
import { SourceBreakdownSection } from "./sections/source-breakdown-section";
import { UpcomingInterviewsSection } from "./sections/upcoming-interviews-section";
import { UpcomingInterviewsSkeleton } from "./skeletons/upcoming-interviews-skeleton";

export function DashboardView({ rangeKey }: { rangeKey: RangeKey }) {
  const selectedRange = RANGES.find((range) => range.key === rangeKey)!;

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <RangeFilter value={rangeKey} selectedRange={selectedRange} />
      </div>

      <Suspense key={rangeKey} fallback={<KpiCardsSkeleton />}>
        <KpiCardsSection
          days={selectedRange.days}
          label={selectedRange.label}
        />
      </Suspense>

      <div className="grid gap-4 lg:grid-cols-2">
        <Suspense key={`status-${rangeKey}`} fallback={<StatusChartSkeleton />}>
          <StatusChartSection days={selectedRange.days} />
        </Suspense>

        <Suspense
          key={`timeline-${rangeKey}`}
          fallback={<TimelineChartSkeleton />}
        >
          <ApplicationOvertimeSection days={selectedRange.days} />
        </Suspense>
      </div>

      <div className="grid gap-4 lg:grid-cols-3 lg:h-150">
        <div className="lg:col-span-2 h-full min-h-0">
          <Suspense fallback={<RecentApplicationsSkeleton />}>
            <RecentApplicationsSection />
          </Suspense>
        </div>

        <div className="flex flex-col gap-4 h-full">
          <Suspense fallback={<UpcomingInterviewsSkeleton />}>
            <UpcomingInterviewsSection />
          </Suspense>

          <Suspense fallback={<AwaitingReplySkeleton />}>
            <AwaitingReplySection />
          </Suspense>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Suspense
          key={`source-${rangeKey}`}
          fallback={<SourceBreakdownSkeleton />}
        >
          <SourceBreakdownSection days={selectedRange.days} />
        </Suspense>
      </div>
    </div>
  );
}
