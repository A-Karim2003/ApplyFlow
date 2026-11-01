import { getRecentActivity } from "@/lib/data/dashboard/sections/recent-activity";

import { SectionError } from "../section-error";
import { RecentActivity } from "../recent-activity";

export async function RecentActivitySection() {
  const result = await getRecentActivity();
  if (!result.success) return <SectionError message={result.error} />;

  return <RecentActivity items={result.data} />;
}
