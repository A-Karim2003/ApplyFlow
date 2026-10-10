import type { InferSelectModel } from "drizzle-orm";
import { desc, eq } from "drizzle-orm";
import { companiesTable } from "../../db/schema/companies";
import { applicationsTable } from "../../db/schema/applications";
import { getSession, requireSession } from "./session";
import { db } from "@/db";
import { Result } from "@/types";
import { cacheLife, cacheTag } from "next/cache";

export type Company = InferSelectModel<typeof companiesTable>;
export type Application = InferSelectModel<typeof applicationsTable>;
export type CompanyApplicationStatus = Application["status"];

export type CompaniesPageData = {
  companies: Company[];
  applications: Application[];
};

export const COMPANIESCACHETAG = (userId: Company["userId"]) =>
  `companies-${userId}`;

async function getCompaniesCached(
  userId: Company["userId"],
): Promise<Company[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(COMPANIESCACHETAG(userId));

  return db
    .select()
    .from(companiesTable)
    .where(eq(companiesTable.userId, userId));
}

export async function getCompanies(): Promise<Result<Company[]>> {
  const session = await requireSession();

  try {
    const companies = await getCompaniesCached(session.user.id);
    return { success: true, data: companies };
  } catch {
    return { success: false, error: "Failed to fetch companies" };
  }
}

async function getCompaniesPageDataCached(
  userId: string,
): Promise<CompaniesPageData> {
  "use cache";
  cacheLife("minutes");
  cacheTag(COMPANIESCACHETAG(userId), `applications-${userId}`);

  const [companies, applications] = await Promise.all([
    db
      .select()
      .from(companiesTable)
      .where(eq(companiesTable.userId, userId))
      .orderBy(desc(companiesTable.createdAt)),
    db
      .select()
      .from(applicationsTable)
      .where(eq(applicationsTable.userId, userId))
      .orderBy(desc(applicationsTable.createdAt)),
  ]);

  return { companies, applications };
}

export async function getCompaniesPageData(): Promise<
  Result<CompaniesPageData>
> {
  const session = await getSession();
  if (!session) return { success: false, error: "Not authenticated" };

  try {
    const data = await getCompaniesPageDataCached(session.user.id);
    return { success: true, data };
  } catch {
    return { success: false, error: "Failed to fetch companies page data" };
  }
}
