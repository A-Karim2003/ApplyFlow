import { getUpcomingInterviews } from "@/lib/data/dashboard/sections/upcoming-interviews";

import { SectionError } from "./section-error";
import { UpcomingInterviews } from "./upcoming-interviews";

export async function UpcomingInterviewsSection() {
  const result = await getUpcomingInterviews();
  if (!result.success) return <SectionError message={result.error} />;

  return <UpcomingInterviews interviews={result.data} />;
}
