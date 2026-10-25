import { and, count, eq, gte, lt, sql } from "drizzle-orm";

import { db } from "@/db";
import { applicationsTable } from "@/db/schema/applications";
import type { ApplicationStatus } from "../applications";

//* Statuses that mean the company has replied (a rejection is still a reply)
//* used for KPI card and "Where you apply" section
export const REPLIED: ApplicationStatus[] = [
  "online_assessment",
  "interview",
  "offer",
  "rejected",
];

//? Date an application counts under: applied date, else the day it was added
export const appliedOn = sql`
  coalesce(
    ${applicationsTable.appliedAt},
    ${applicationsTable.createdAt}::date
  )
`;

//? "YYYY-MM-DD" for n days ago
export const dateDaysAgo = (days: number) =>
  new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 10);

//? Applications per status whose date falls in [from, to). null means no range limits
export async function getApplicationStatusCounts(
  userId: string,
  from: string | null,
  to: string | null,
): Promise<Record<ApplicationStatus, number>> {
  const statusCounts = await db
    .select({ status: applicationsTable.status, total: count() })
    .from(applicationsTable)
    .where(
      and(
        eq(applicationsTable.userId, userId),
        from ? gte(appliedOn, from) : undefined, //? and() ignores undefined
        to ? lt(appliedOn, to) : undefined,
      ),
    )
    .groupBy(applicationsTable.status);

  const counts: Record<ApplicationStatus, number> = {
    wishlist: 0,
    applied: 0,
    online_assessment: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
  };

  for (const statusCount of statusCounts) {
    counts[statusCount.status] = statusCount.total;
  }
  return counts;
}
