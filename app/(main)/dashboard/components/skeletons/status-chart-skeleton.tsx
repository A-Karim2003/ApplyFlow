import { Skeleton } from "@/components/ui/skeleton";
import { DashboardCard } from "../dashboard-card";
import { STATUS_OPTIONS } from "@/lib/constants";

// Explicit percentage heights matching Recharts chart scale
const SKELETON_BAR_HEIGHTS = [25, 65, 25, 65, 65, 25];

export function StatusChartSkeleton() {
  return (
    <DashboardCard
      title="Applications by status"
      description="Where every opportunity sits in your pipeline"
    >
      <div className="flex h-64 w-full select-none pt-2">
        {/* Y-Axis numbers */}
        <div className="flex flex-col justify-between pb-7 pr-3 pt-1 text-[12px] text-muted-foreground">
          <span>4</span>
          <span>3</span>
          <span>2</span>
          <span>1</span>
          <span>0</span>
        </div>

        {/* Chart area */}
        <div className="relative flex h-full flex-1 flex-col justify-between">
          {/* Dashed Grid Lines */}
          <div className="pointer-events-none absolute inset-x-0 bottom-7 top-1 flex flex-col justify-between">
            <div className="border-b border-dashed border-border" />
            <div className="border-b border-dashed border-border" />
            <div className="border-b border-dashed border-border" />
            <div className="border-b border-dashed border-border" />
            <div className="border-b border-dashed border-border" />
          </div>

          {/* Bars column (h-[calc(100%-28px)] guarantees height for child percentages) */}
          <div className="relative z-10 flex h-[calc(100%-28px)] w-full items-end pb-1">
            {STATUS_OPTIONS.map((status, i) => (
              <div
                key={status.value}
                className="flex h-full flex-1 items-end justify-center px-2"
              >
                <Skeleton
                  className="w-full max-w-14 rounded-b-none rounded-t-md"
                  style={{
                    height: `${SKELETON_BAR_HEIGHTS[i % SKELETON_BAR_HEIGHTS.length]}%`,
                  }}
                />
              </div>
            ))}
          </div>

          {/* Static X-Axis Labels */}
          <div className="flex h-7 w-full items-center text-[12px] text-muted-foreground">
            {STATUS_OPTIONS.map((status) => (
              <span key={status.value} className="flex-1 truncate text-center">
                {status.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </DashboardCard>
  );
}
