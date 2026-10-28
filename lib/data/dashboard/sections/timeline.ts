import { and, count, eq, gte, ne, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { db } from "@/db";
import { applicationsTable } from "@/db/schema/applications";
import type { Result } from "@/types";

import { APPLICATIONSCACHETAG } from "../../applications";
import { requireSession } from "../../session";
import { appliedOn, dateDaysAgo } from "../shared";

export type Timeline = {
  unit: "week" | "month";
  points: { label: string; count: number }[];
};

//? Bucket a date falls in: Monday of its week ("YYYY-MM-DD") or its month ("YYYY-MM")

function bucketKey(inputDate: Date, weekly: boolean) {
  //* Monthly bucket key
  if (!weekly) return inputDate.toISOString().slice(0, 7);

  //* Weekly bucket key
  const date = new Date(inputDate);
  date.setUTCDate(date.getUTCDate() - ((date.getUTCDay() + 6) % 7));
  return date.toISOString().slice(0, 10);
}

async function getTimelineCached(
  userId: string,
  days: number | null,
): Promise<Timeline> {
  "use cache";
  cacheLife("minutes");
  cacheTag(APPLICATIONSCACHETAG(userId));

  const fromDate = days === null ? null : dateDaysAgo(days);
  const today = dateDaysAgo(0);

  //? One row per date with the number of submitted applications, oldest first
  const rows = await db
    .select({ date: sql<string>`${appliedOn}::text`, count: count() })
    .from(applicationsTable)
    .where(
      and(
        eq(applicationsTable.userId, userId),
        ne(applicationsTable.status, "wishlist"),
        fromDate ? gte(appliedOn, fromDate) : undefined,
      ),
    )
    .groupBy(appliedOn)
    .orderBy(appliedOn);

  //? Chart starts at the range start, or for "all time" at the first application
  const startDate = fromDate ?? rows[0]?.date ?? today;
  const weekly = days !== null && days <= 90;

  //? One empty bucket per week/month: walk every day, repeated keys collapse
  const buckets = new Map<string, number>();
  for (
    const day = new Date(`${startDate}T00:00:00Z`);
    day <= new Date(`${today}T00:00:00Z`);
    day.setUTCDate(day.getUTCDate() + 1)
  ) {
    buckets.set(bucketKey(day, weekly), 0);
  }

  //? Add each date's count to its bucket
  for (const row of rows) {
    const key = bucketKey(new Date(`${row.date}T00:00:00Z`), weekly);
    if (buckets.has(key)) buckets.set(key, buckets.get(key)! + row.count);
  }

  //? Show the year on long ranges so months aren't ambiguous (tied to RANGES: 365d and all time)
  const showYear = days === null || days >= 365;

  const points = [...buckets].map(([key, total]) => ({
    label: new Date(weekly ? key : `${key}-01`).toLocaleDateString("en-GB", {
      ...(weekly
        ? { day: "numeric", month: "short" }
        : { month: "short", year: showYear ? "2-digit" : undefined }),
      timeZone: "UTC",
    }),
    count: total,
  }));

  return { unit: weekly ? "week" : "month", points };
}

export async function getTimeline(
  days: number | null,
): Promise<Result<Timeline>> {
  const session = await requireSession();

  try {
    const data = await getTimelineCached(session.user.id, days);
    return { success: true, data };
  } catch {
    return { success: false, error: "Failed to fetch applications over time" };
  }
}
