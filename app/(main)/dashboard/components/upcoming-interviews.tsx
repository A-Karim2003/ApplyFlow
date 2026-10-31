import CompanyLogo from "@/app/_components/company-logo";
import { INTERVIEW_TYPE_OPTIONS } from "@/lib/constants";
import type { UpcomingInterview } from "@/lib/data/dashboard/sections/upcoming-interviews";

import { DashboardCard } from "./dashboard-card";
import { interviewTiming } from "../helpers";

export function UpcomingInterviews({
  interviews,
}: {
  interviews: UpcomingInterview[];
}) {
  return (
    <DashboardCard
      title="Upcoming interviews"
      description="Your next conversations"
      className="flex-1 overflow-scroll"
    >
      {interviews.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          No interviews scheduled
        </p>
      ) : (
        <ul className="space-y-4 overflow-scroll">
          {interviews.map((interview) => {
            const { dayLabel, whenLabel } = interviewTiming(
              interview.scheduledAt,
            );

            return (
              <li key={interview.id} className="flex items-center gap-3">
                <CompanyLogo name={interview.companyName} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {interview.companyName}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {
                      INTERVIEW_TYPE_OPTIONS.find(
                        (option) => option.value === interview.interviewType,
                      )?.label
                    }
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{dayLabel}</p>
                  <p className="text-xs text-muted-foreground">{whenLabel}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </DashboardCard>
  );
}
