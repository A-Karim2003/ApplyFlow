import {
  CalendarClock,
  CircleX,
  FileCheck,
  Heart,
  Send,
  Trophy,
  type LucideIcon,
} from "lucide-react";

import { STATUS_STYLES } from "@/app/_components/status-badge";
import type { ApplicationStatus } from "@/lib/constants";
import type { RecentActivityItem } from "@/lib/data/dashboard/sections/recent-activity";
import { cn } from "@/lib/utils";

import { DashboardCard } from "./dashboard-card";
import { activityTime } from "../helpers";

const STATUS_ICONS: Record<ApplicationStatus, LucideIcon> = {
  wishlist: Heart,
  applied: Send,
  online_assessment: FileCheck,
  interview: CalendarClock,
  offer: Trophy,
  rejected: CircleX,
};
import { formatEnumLabel } from "@/lib/utils";

function activityPhrase(item: RecentActivityItem) {
  //? Null previous status = the initial row, so the application was created at this status
  if (item.previousStatus === null) {
    if (item.status === "wishlist") return "added to wishlist";
    if (item.status === "applied") return "application submitted";
    return `added at ${formatEnumLabel(item.status)} stage`;
  }

  switch (item.status) {
    case "wishlist":
      return "moved back to wishlist";
    case "applied":
      return "application submitted";
    case "online_assessment":
      return "online assessment received";
    case "interview":
      return "moved to Interview";
    case "offer":
      return "sent you an Offer";
    case "rejected":
      return "marked as Rejected";
  }
}

export function RecentActivity({ items }: { items: RecentActivityItem[] }) {
  return (
    <DashboardCard
      title="Recent Activity"
      description="The latest changes in your pipeline"
    >
      {items.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No activity yet.
        </p>
      ) : (
        <ul>
          {items.map((item, index) => {
            const Icon = STATUS_ICONS[item.status];
            const isLast = index === items.length - 1;

            return (
              <li key={item.id} className="relative flex gap-3 pb-6 last:pb-0 ">
                {!isLast && (
                  <span
                    className="absolute top-8 bottom-0 left-4 w-px bg-border"
                    aria-hidden
                  />
                )}
                <div
                  className={cn(
                    "z-10 flex size-8 shrink-0 items-center justify-center rounded-full",
                    STATUS_STYLES[item.status].pill,
                  )}
                >
                  <Icon className="size-4" aria-hidden />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm">
                    <span className="font-semibold">{item.companyName}</span>{" "}
                    {activityPhrase(item)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activityTime(item.createdAt)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </DashboardCard>
  );
}
