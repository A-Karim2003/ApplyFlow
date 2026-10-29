import { desc, eq, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { db } from "@/db";
import { applicationsTable } from "@/db/schema/applications";
import { companiesTable } from "@/db/schema/companies";
import type { Result } from "@/types";

import { Application, APPLICATIONSCACHETAG } from "../../applications";
import { requireSession } from "../../session";
import { appliedOn } from "../shared";
import { COMPANIESCACHETAG } from "../../companies";

export type RecentApplication = {
  id: Application["id"];
  jobTitle: Application["jobTitle"];
  companyName: string;
  location: Application["location"];
  jobType: Application["jobType"];
  status: Application["status"];
  date: string;
};

async function getRecentApplicationsCached(
  userId: string,
): Promise<RecentApplication[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(APPLICATIONSCACHETAG(userId), COMPANIESCACHETAG(userId));
  return db
    .select({
      id: applicationsTable.id,
      jobTitle: applicationsTable.jobTitle,
      companyName: companiesTable.name,
      location: applicationsTable.location,
      jobType: applicationsTable.jobType,
      status: applicationsTable.status,
      date: sql<string>`${appliedOn}::text`,
    })
    .from(applicationsTable)
    .innerJoin(
      companiesTable,
      eq(applicationsTable.companyId, companiesTable.id),
    )
    .where(eq(applicationsTable.userId, userId))
    .orderBy(desc(appliedOn), desc(applicationsTable.createdAt)) //? createdAt for scenarios where 2 applications are applied on the same day
    .limit(8);
}

export async function getRecentApplications(): Promise<
  Result<RecentApplication[]>
> {
  const session = await requireSession(); //? outside the cache: reads cookies

  try {
    const data = await getRecentApplicationsCached(session.user.id);
    return { success: true, data };
  } catch {
    return { success: false, error: "Failed to fetch recent applications" };
  }
}
