import Link from "next/link";
import { cn } from "@/lib/utils";

//? Unknown or missing ?range= falls back to 6 months
export function parseRangeKey(value: string | string[] | undefined): RangeKey {
  const key = Array.isArray(value) ? value[0] : value;
  return RANGES.find((range) => range.key === key)?.key ?? "180d";
}

export const RANGES = [
  { key: "30d", label: "30 days", days: 30 },
  { key: "90d", label: "3 months", days: 90 },
  { key: "180d", label: "6 months", days: 180 },
  { key: "365d", label: "12 months", days: 365 },
  { key: "all", label: "All time", days: null },
] as const;

export type RangeKey = (typeof RANGES)[number]["key"];

export function RangeFilter({ value }: { value: RangeKey }) {
  return (
    <nav
      aria-label="Date range"
      className="flex w-fit max-w-full gap-1 overflow-x-auto rounded-lg border bg-card p-1"
    >
      {RANGES.map((range) => (
        <Link
          key={range.key}
          href={`?range=${range.key}`}
          replace
          scroll={false}
          aria-current={range.key === value ? "true" : undefined}
          className={cn(
            "shrink-0 rounded-md px-3 py-1 text-sm transition-colors",
            range.key === value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-accent",
          )}
        >
          {range.label}
        </Link>
      ))}
    </nav>
  );
}
