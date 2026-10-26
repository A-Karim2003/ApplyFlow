import { getStatusCounts } from "@/lib/data/dashboard/sections/status";

import { SectionError } from "./section-error";
import { StatusChart } from "./status-chart";
import { STATUS_COLOURS, STATUS_OPTIONS } from "@/lib/constants";

export async function StatusChartSection({ days }: { days: number | null }) {
  const result = await getStatusCounts(days);

  if (!result.success) return <SectionError message={result.error} />;
  console.log(result.data);

  const data = STATUS_OPTIONS.map((status) => ({
    label: status.label,
    count: result.data[status.value],
    colour: STATUS_COLOURS[status.value],
  }));

  return <StatusChart data={data} />;
}
