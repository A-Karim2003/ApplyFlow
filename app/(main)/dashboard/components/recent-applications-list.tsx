import Link from "next/link";

import type { RecentApplication } from "@/lib/data/dashboard/sections/recent";

import { DashboardCard } from "./dashboard-card";
import { relativeDay } from "../helpers";
import { JOB_TYPES } from "@/lib/constants";
import CompanyLogo from "@/app/_components/company-logo";
import { StatusBadge } from "@/app/_components/status-badge";

export function RecentApplications({
  applications,
}: {
  applications: RecentApplication[];
}) {
  return (
    <DashboardCard
      className="h-full min-h-0"
      title="Recent applications"
      description="Sorted by the date you applied (or added the job)"
      action={
        <Link
          href="/applications"
          className="text-sm font-medium text-primary hover:underline"
        >
          View all
        </Link>
      }
    >
      {applications.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No applications yet
        </p>
      ) : (
        <ul className="h-full flex flex-col justify-between">
          {applications.map((application) => (
            <li
              key={application.id}
              className="border-b border-muted last:border-0 flex items-center gap-3 py-3 first:pt-0 last:pb-0"
            >
              <CompanyLogo name={application.companyName} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {application.jobTitle}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {application.companyName}
                  {application.location && ` · ${application.location}`}
                </p>
              </div>
              <div className="max-w-44 w-full flex flex-wrap items-center justify-between gap-2 ">
                <span className="hidden rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground sm:inline">
                  {JOB_TYPES[application.jobType]}
                </span>

                <StatusBadge status={application.status} abbreviate={true} />
              </div>

              <span className="hidden w-24 text-right text-xs text-muted-foreground md:inline">
                {relativeDay(application.date)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </DashboardCard>
  );
}
