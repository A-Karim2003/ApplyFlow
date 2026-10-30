import type { AwaitingReplyApplication } from "@/lib/data/dashboard/sections/awaiting-reply";
import CompanyLogo from "@/app/_components/company-logo";

import { DashboardCard } from "./dashboard-card";
import { daysSince, shortDate } from "../helpers";

export function AwaitingReply({
  applications,
}: {
  applications: AwaitingReplyApplication[];
}) {
  return (
    <DashboardCard
      className="flex-1 pb-1"
      title="Awaiting a reply"
      description="Still on Applied status for over 2 weeks"
    >
      {applications.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          Nothing waiting. You&apos;re all caught up.
        </p>
      ) : (
        <ul className="space-y-4 overflow-scroll">
          {applications.map((application) => (
            <li key={application.id} className="flex items-center gap-3">
              <CompanyLogo name={application.companyName} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {application.companyName}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {application.jobTitle}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">
                  {daysSince(application.lastApplied)} days
                </p>
                <p className="text-xs text-muted-foreground">
                  Since {shortDate(application.lastApplied)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </DashboardCard>
  );
}
