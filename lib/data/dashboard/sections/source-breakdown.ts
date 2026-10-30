import { and, count, eq, gte, inArray, ne, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { db } from "@/db";
import { applicationsTable } from "@/db/schema/applications";
import { Application, APPLICATIONSCACHETAG } from "@/lib/data/applications";
import { requireSession } from "@/lib/data/session";
import { Result } from "@/types";

import { appliedOn, dateDaysAgo, REPLIED } from "../shared";
import { APPLICATION_SOURCE_OPTIONS } from "@/lib/constants";

export type SourceStat = {
  source: Application["source"];
  count: number;
  replies: number;
};

async function getSourceBreakdownCached(
  userId: string,
  days: number | null,
): Promise<SourceStat[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(APPLICATIONSCACHETAG(userId));
  const fromDate = days === null ? null : dateDaysAgo(days);

  const rows = await db
    .select({
      source: applicationsTable.source,
      count: count(),
      replies:
        sql<number>`count(*) filter (where ${inArray(applicationsTable.status, REPLIED)})`.mapWith(
          Number,
        ),
    })
    .from(applicationsTable)
    .where(
      and(
        eq(applicationsTable.userId, userId),
        ne(applicationsTable.status, "wishlist"),
        fromDate ? gte(appliedOn, fromDate) : undefined,
      ),
    )
    .groupBy(applicationsTable.source);

  //? Every source always shows, even with no applications
  const rowBySource = new Map(rows.map((row) => [row.source, row]));

  return APPLICATION_SOURCE_OPTIONS.map(
    ({ value }) =>
      rowBySource.get(value) ?? { source: value, count: 0, replies: 0 },
  ).sort((a, b) => b.count - a.count);
}

export async function getSourceBreakdown(
  days: number | null,
): Promise<Result<SourceStat[]>> {
  const session = await requireSession();
  try {
    return {
      success: true,
      data: await getSourceBreakdownCached(session.user.id, days),
    };
  } catch {
    return { success: false, error: "Failed to fetch source breakdown" };
  }
}
