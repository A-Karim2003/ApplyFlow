import { getTimeline } from "@/lib/data/dashboard/sections/timeline";
import { SectionError } from "../section-error";
import { TimelineChart } from "../timeline-chart";

export async function ApplicationOvertimeSection({
  days,
}: {
  days: number | null;
}) {
  const result = await getTimeline(days);
  if (!result.success) return <SectionError message={result.error} />;
  return <TimelineChart points={result.data.points} unit={result.data.unit} />;
}
