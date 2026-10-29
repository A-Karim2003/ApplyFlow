import { getRecentApplications } from "@/lib/data/dashboard/sections/recent";

import { SectionError } from "./section-error";
import { RecentApplications } from "./recent-applications-list";

export async function RecentApplicationsSection() {
  const result = await getRecentApplications();
  if (!result.success) return <SectionError message={result.error} />;

  return <RecentApplications applications={result.data} />;
}
