import { desc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { db } from "@/db";
import {
  applicationsTable,
  applicationStatusHistoryTable,
  companiesTable,
} from "@/db/schema";
import { APPLICATIONSCACHETAG } from "@/lib/data/applications";
import { COMPANIESCACHETAG } from "@/lib/data/companies";
import { requireSession } from "@/lib/data/session";
import { Result } from "@/types";

import type { ApplicationStatus } from "@/lib/constants/applications";

const RECENT_ACTIVITY_LIMIT = 5;

export type RecentActivityItem = {
  id: number;
  companyName: string;
  status: ApplicationStatus; //? the status it moved *to*
  previousStatus: ApplicationStatus | null; //? null = the initial row on create
  createdAt: Date;
};
async function getRecentActivityCached(
  userId: string,
): Promise<RecentActivityItem[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(APPLICATIONSCACHETAG(userId), COMPANIESCACHETAG(userId));

  //? Latest status changes across all applications, newest first
  return db
    .select({
      id: applicationStatusHistoryTable.id,
      companyName: companiesTable.name,
      status: applicationStatusHistoryTable.status,
      previousStatus: applicationStatusHistoryTable.previousStatus,
      createdAt: applicationStatusHistoryTable.createdAt,
    })
    .from(applicationStatusHistoryTable)
    .innerJoin(
      applicationsTable,
      eq(applicationStatusHistoryTable.applicationId, applicationsTable.id),
    )
    .innerJoin(
      companiesTable,
      eq(applicationsTable.companyId, companiesTable.id),
    )
    .where(eq(applicationsTable.userId, userId))
    .orderBy(desc(applicationStatusHistoryTable.createdAt))
    .limit(RECENT_ACTIVITY_LIMIT);
}

export async function getRecentActivity(): Promise<
  Result<RecentActivityItem[]>
> {
  const session = await requireSession();

  try {
    return {
      success: true,
      data: await getRecentActivityCached(session.user.id),
    };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Failed to fetch recent activity" };
  }
}
