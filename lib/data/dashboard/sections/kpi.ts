import { and, desc, eq, gte } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { db } from "@/db";
import { applicationsTable } from "@/db/schema/applications";
import { companiesTable } from "@/db/schema/companies";
import type { Result } from "@/types";

import {
  APPLICATIONSCACHETAG,
  type ApplicationStatus,
} from "../../applications";
import { requireSession } from "../../session";
import {
  REPLIED,
  appliedOn,
  getApplicationStatusCounts,
  dateDaysAgo,
} from "../shared";

export type StatCards = {
  totalApplications: number;
  previousTotalApplications: number | null; //* null for "all time"
  interviewCount: number;
  offers: number;
  offerCompanies: string[]; //? latest two, for the card subtitle
  responseRate: number | null; //? null when nothing submitted
  previousResponseRate: number | null;
};

//* This functions counts number of applications for each status, excluding wishlist and applied
function calculateSubmissionMetrics(
  countsByStatus: Record<ApplicationStatus, number>,
) {
  const repliedCount = REPLIED.reduce(
    (sum, status) => sum + countsByStatus[status],
    0,
  );
  return {
    totalSubmissions: repliedCount + countsByStatus.applied,
    repliedCount,
  };
}

const calculateResponseRate = (
  repliedCount: number,
  totalSubmissions: number,
) =>
  totalSubmissions === 0
    ? null
    : Math.round((repliedCount / totalSubmissions) * 100);

async function getStatCardsCached(
  userId: string,
  days: number | null,
): Promise<StatCards> {
  "use cache";
  cacheLife("minutes");
  cacheTag(APPLICATIONSCACHETAG(userId));

  //* returns the date from [days] days ago
  const fromDate = days === null ? null : dateDaysAgo(days);

  const [
    currentPeriodCounts,
    previousPeriodCounts,
    allTimeCounts,
    recentOfferCompanies,
  ] = await Promise.all([
    //* returns all applications from a certain date to now
    getApplicationStatusCounts(userId, fromDate, null),

    //* Equal-length window before the current one; none for "all time"
    days === null
      ? null
      : getApplicationStatusCounts(userId, dateDaysAgo(days * 2), fromDate),

    getApplicationStatusCounts(userId, null, null),

    //* returns company names of the 2 lastest offers
    db
      .select({ name: companiesTable.name })
      .from(applicationsTable)
      .innerJoin(
        companiesTable,
        eq(applicationsTable.companyId, companiesTable.id),
      )
      .where(
        and(
          eq(applicationsTable.userId, userId),
          eq(applicationsTable.status, "offer"),
          fromDate ? gte(appliedOn, fromDate) : undefined,
        ),
      )
      .orderBy(desc(appliedOn))
      .limit(2),
  ]);

  const currentPeriodMetrics = calculateSubmissionMetrics(currentPeriodCounts);

  const previousPeriodMetrics = previousPeriodCounts
    ? calculateSubmissionMetrics(previousPeriodCounts)
    : null;

  return {
    totalApplications: currentPeriodMetrics.totalSubmissions,
    previousTotalApplications: previousPeriodMetrics
      ? previousPeriodMetrics.totalSubmissions
      : null,
    interviewCount: allTimeCounts.interview,
    offers: currentPeriodCounts.offer,
    offerCompanies: recentOfferCompanies.map((r) => r.name),
    responseRate: calculateResponseRate(
      currentPeriodMetrics.repliedCount,
      currentPeriodMetrics.totalSubmissions,
    ),
    previousResponseRate: previousPeriodMetrics
      ? calculateResponseRate(
          previousPeriodMetrics.repliedCount,
          previousPeriodMetrics.totalSubmissions,
        )
      : null,
  };
}

export async function getStatCards(
  days: number | null,
): Promise<Result<StatCards>> {
  const session = await requireSession();

  try {
    const data = await getStatCardsCached(session.user.id, days);
    return { success: true, data };
  } catch {
    return { success: false, error: "Failed to fetch stat cards" };
  }
}
