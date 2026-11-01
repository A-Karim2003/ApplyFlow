import { Suspense } from "react";

import { DashboardView } from "./components/dashboard-view";
import { parseRangeKey } from "./components/range-filter";
import { DashboardSkeleton } from "./components/skeletons/dashboard-skeleton";

type Props = { searchParams: Promise<{ range?: string | string[] }> };

export default function DashboardPage({ searchParams }: Props) {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent searchParams={searchParams} />
    </Suspense>
  );
}

async function DashboardContent({ searchParams }: Props) {
  const { range } = await searchParams;

  return <DashboardView rangeKey={parseRangeKey(range)} />;
}
