import type { InferSelectModel } from "drizzle-orm";
import { desc, eq } from "drizzle-orm";
import { companiesTable } from "../../db/schema/companies";
import { applicationsTable } from "../../db/schema/applications";
import { getSession } from "./session";
import { db } from "@/db";
import { Result } from "@/types";

export type Company = InferSelectModel<typeof companiesTable>;
export type Application = InferSelectModel<typeof applicationsTable>;
export type CompanyRecord = Company;
export type CompanyApplicationStatus = Application["status"];

export type CompaniesPageData = {
  companies: Company[];
  applications: Application[];
};

export async function getCompanies(): Promise<Result<Company[]>> {
  const session = await getSession();
  if (!session) return { success: false, error: "Not authenticated" };

  try {
    const companies = await db
      .select()
      .from(companiesTable)
      .where(eq(companiesTable.userId, session.user.id));
    return { success: true, data: companies };
  } catch {
    return { success: false, error: "Failed to fetch companies" };
  }
}

export async function getCompaniesPageData(): Promise<
  Result<CompaniesPageData>
> {
  const session = await getSession();
  if (!session) return { success: false, error: "Not authenticated" };

  try {
    const [companies, applications] = await Promise.all([
      db
        .select()
        .from(companiesTable)
        .where(eq(companiesTable.userId, session.user.id))
        .orderBy(desc(companiesTable.createdAt)),
      db
        .select()
        .from(applicationsTable)
        .where(eq(applicationsTable.userId, session.user.id))
        .orderBy(desc(applicationsTable.createdAt)),
    ]);

    return { success: true, data: { companies, applications } };
  } catch {
    return { success: false, error: "Failed to fetch companies page data" };
  }
}
