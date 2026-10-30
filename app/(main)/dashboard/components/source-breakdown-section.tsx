import { getSourceBreakdown } from "@/lib/data/dashboard/sections/source-breakdown";

import { SectionError } from "./section-error";
import { SourceBreakdown } from "./source-breakdown";

export async function SourceBreakdownSection({
  days,
}: {
  days: number | null;
}) {
  const result = await getSourceBreakdown(days);
  if (!result.success) return <SectionError message={result.error} />;

  console.log(result.data);

  return <SourceBreakdown data={result.data} />;
}
