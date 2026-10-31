import { DashboardView } from "./components/dashboard-view";
import { parseRangeKey } from "./components/range-filter";

type Props = { searchParams: Promise<{ range?: string | string[] }> };

export default async function DashboardPage({ searchParams }: Props) {
  const dateRange = await searchParams;
  const rangeKey = parseRangeKey(dateRange.range);

  return <DashboardView rangeKey={rangeKey} />;
}
