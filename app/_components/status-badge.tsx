import { cn, formatEnumLabel } from "@/lib/utils";

import type { ApplicationStatus } from "@/lib/constants/applications";

export const STATUS_STYLES: Record<
  ApplicationStatus,
  { dot: string; pill: string }
> = {
  wishlist: {
    dot: "bg-muted-foreground",
    pill: "bg-muted text-muted-foreground",
  },
  applied: {
    dot: "bg-[var(--status-applied)]",
    pill: "bg-[color-mix(in_oklch,var(--status-applied)_16%,var(--card))] text-[color-mix(in_oklch,var(--status-applied)_60%,var(--foreground))]",
  },
  online_assessment: {
    dot: "bg-[var(--chart-5)]",
    pill: "bg-[color-mix(in_oklch,var(--chart-5)_16%,var(--card))] text-[color-mix(in_oklch,var(--chart-5)_60%,var(--foreground))]",
  },
  interview: {
    dot: "bg-[var(--status-interview)]",
    pill: "bg-[color-mix(in_oklch,var(--status-interview)_14%,var(--card))] text-[color-mix(in_oklch,var(--status-interview)_55%,var(--foreground))]",
  },
  offer: {
    dot: "bg-[var(--chart-1)]",
    pill: "bg-[color-mix(in_oklch,var(--chart-1)_16%,var(--card))] text-[color-mix(in_oklch,var(--chart-1)_60%,var(--foreground))]",
  },
  rejected: {
    dot: "bg-destructive",
    pill: "bg-destructive/10 text-destructive",
  },
};

function formatStatus(status: ApplicationStatus) {
  return formatEnumLabel(status);
}

export function StatusBadge({
  status,
  className,
}: {
  status: ApplicationStatus;
  className?: string;
}) {
  const styles = STATUS_STYLES[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        styles.pill,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", styles.dot)} aria-hidden />
      {formatStatus(status)}
    </span>
  );
}
