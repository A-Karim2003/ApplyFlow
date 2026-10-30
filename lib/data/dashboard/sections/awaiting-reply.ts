import { asc, and, eq, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { db } from "@/db";
import {
  applicationsTable,
  applicationStatusHistoryTable,
  companiesTable,
} from "@/db/schema";
import { Application, APPLICATIONSCACHETAG } from "@/lib/data/applications";
import { COMPANIESCACHETAG } from "@/lib/data/companies";
import { requireSession } from "@/lib/data/session";
import { Result } from "@/types";

import { dateDaysAgo } from "../shared";

const AWAITING_REPLY_DAYS = 14;

export type AwaitingReplyApplication = {
  id: Application["id"];
  jobTitle: Application["jobTitle"];
  companyName: string;
  lastApplied: string; //? "YYYY-MM-DD", when it last entered "applied"
};

//? Latest time each application entered "applied" (restarts if it was moved away and back)
const enteredAppliedOn = sql`max(${applicationStatusHistoryTable.createdAt})::date`;

async function getAwaitingReplyCached(
  userId: string,
): Promise<AwaitingReplyApplication[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(APPLICATIONSCACHETAG(userId), COMPANIESCACHETAG(userId));

  const cutoff = dateDaysAgo(AWAITING_REPLY_DAYS);

  /*
    Select all the applications that have been in the "applied" status for more than 14 days
   */

  return db
    .select({
      id: applicationsTable.id,
      jobTitle: applicationsTable.jobTitle,
      companyName: companiesTable.name,
      lastApplied: sql<string>`${enteredAppliedOn}::text`,
    })
    .from(applicationsTable)
    .innerJoin(
      companiesTable,
      eq(applicationsTable.companyId, companiesTable.id),
    )
    .innerJoin(
      applicationStatusHistoryTable,
      eq(applicationStatusHistoryTable.applicationId, applicationsTable.id),
    )
    .where(
      and(
        eq(applicationsTable.userId, userId),
        eq(applicationsTable.status, "applied"),
        eq(applicationStatusHistoryTable.status, "applied"),
      ),
    )
    .groupBy(applicationsTable.id, companiesTable.name) 
    .having(sql`${enteredAppliedOn} <= ${cutoff}`)
    .orderBy(asc(enteredAppliedOn));
}

export async function getAwaitingReply(): Promise<
  Result<AwaitingReplyApplication[]>
> {
  const session = await requireSession();

  try {
    return {
      success: true,
      data: await getAwaitingReplyCached(session.user.id),
    };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      error: "Failed to fetch applications awaiting a reply",
    };
  }
}
