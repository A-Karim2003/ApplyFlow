import { and, asc, eq, gte, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { db } from "@/db";
import {
  applicationsTable,
  companiesTable,
  interviewsTable,
} from "@/db/schema";
import { APPLICATIONSCACHETAG } from "../../applications";
import { COMPANIESCACHETAG } from "../../companies";
import { Result } from "@/types";
import { requireSession } from "../../session";

export type UpcomingInterview = {
  id: number;
  companyName: string;
  interviewType: (typeof interviewsTable.$inferSelect)["interviewType"];
  scheduledAt: Date;
};

async function getUpcomingInterviewsCached(userId: string) {
  "use cache";
  cacheLife("minutes");
  cacheTag(APPLICATIONSCACHETAG(userId), COMPANIESCACHETAG(userId));

  return db
    .select({
      id: interviewsTable.id,
      companyName: companiesTable.name,
      interviewType: interviewsTable.interviewType,
      scheduledAt: interviewsTable.scheduledAt,
    })
    .from(interviewsTable)
    .innerJoin(
      applicationsTable,
      eq(interviewsTable.applicationId, applicationsTable.id),
    )
    .innerJoin(
      companiesTable,
      eq(applicationsTable.companyId, companiesTable.id),
    )
    .where(
      and(
        eq(applicationsTable.userId, userId),
        //* Application moved on to offer/rejected are no longer relevant
        eq(applicationsTable.status, "interview"),
        //* Returns interviews scheduled now or in the future, excluding past interviews.
        gte(interviewsTable.scheduledAt, sql`now()`),
      ),
    )
    .orderBy(asc(interviewsTable.scheduledAt));
}

export async function getUpcomingInterviews(): Promise<
  Result<UpcomingInterview[]>
> {
  const session = await requireSession();

  try {
    return {
      success: true,
      data: await getUpcomingInterviewsCached(session.user.id),
    };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      error: "Failed to fetch upcoming interviews",
    };
  }
}
