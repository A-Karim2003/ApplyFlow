import { cn } from "@/lib/utils";

import type { ApplicationStatus } from "@/lib/constants/applications-status";

const STATUS_STYLES: Record<ApplicationStatus, { dot: string; pill: string }> =
  {
    wishlist: {
      dot: "bg-muted-foreground",
      pill: "bg-muted text-muted-foreground",
    },
    applied: {
      dot: "bg-[var(--chart-2)]",
      pill: "bg-secondary text-secondary-foreground",
    },
    online_assessment: {
      dot: "bg-[var(--chart-5)]",
      pill: "bg-[color-mix(in_oklch,var(--chart-5)_16%,var(--card))] text-[color-mix(in_oklch,var(--chart-5)_60%,var(--foreground))]",
    },
    interview: {
      dot: "bg-primary",
      pill: "bg-[color-mix(in_oklch,var(--primary)_14%,var(--card))] text-[color-mix(in_oklch,var(--primary)_55%,var(--foreground))]",
    },
    offer: {
      dot: "bg-primary-foreground",
      pill: "bg-primary text-primary-foreground",
    },
    rejected: {
      dot: "bg-destructive",
      pill: "bg-destructive/10 text-destructive",
    },
  };
function formatStatus(status: ApplicationStatus) {
  return status;
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
