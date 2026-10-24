import { DashboardView } from "./components/dashboard-view";
import { getMockDashboardData } from "./components/mock-data";
import { parseRangeKey } from "./components/range-filter";

type Props = { searchParams: Promise<{ range?: string | string[] }> };

export default async function DashboardPage({ searchParams }: Props) {
  const rangeKey = parseRangeKey((await searchParams).range);

  return (
    <DashboardView
      data={getMockDashboardData(new Date())}
      rangeKey={rangeKey}
    />
  );
}
