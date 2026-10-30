import type { SourceStat } from "@/lib/data/dashboard/sections/source-breakdown";
import { APPLICATION_SOURCES } from "@/lib/constants";

import { DashboardCard } from "./dashboard-card";

export function SourceBreakdown({ data }: { data: SourceStat[] }) {
  const max = Math.max(1, ...data.map((d) => d.count));

  return (
    <DashboardCard
      title="Where you apply"
      description="Applications sent by source, and how many got a reply"
    >
      {data.every((source) => source.count === 0) ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No applications sent in this period
        </p>
      ) : (
        <ul className="space-y-4">
          {data.map((source) => (
            <li key={source.source}>
              <div className="mb-1.5 flex items-baseline justify-between text-sm">
                <span className="font-medium">
                  {source.source
                    ? APPLICATION_SOURCES[source.source]
                    : "Not set"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {source.count} sent · {source.replies} replies
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-primary"
                  style={{ width: `${(source.count / max) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </DashboardCard>
  );
}
