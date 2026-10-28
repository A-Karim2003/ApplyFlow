import { DashboardCard } from "../dashboard-card";

export function TimelineChartSkeleton() {
  return (
    <DashboardCard
      title="Applications over time"
      description="Applications sent over the selected period"
    >
      <div
        className="flex h-64 animate-pulse flex-col justify-between pb-7 pt-1"
        aria-hidden
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="border-b border-dashed border-border" />
        ))}
      </div>
    </DashboardCard>
  );
}
