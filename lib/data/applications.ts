import type { InferSelectModel } from "drizzle-orm";
import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { Result } from "@/types";

import { applicationsTable } from "../../db/schema/applications";
import { companiesTable } from "../../db/schema/companies";
import { getSession } from "./session";

export type Application = InferSelectModel<typeof applicationsTable>;
export type Company = InferSelectModel<typeof companiesTable>;
export type ApplicationStatus = Application["status"];

export type ApplicationWithCompany = {
  application: Application;
  company: Company;
};

export type ApplicationsPageData = {
  applications: ApplicationWithCompany[];
};

export async function getApplicationsPageData(): Promise<
  Result<ApplicationsPageData>
> {
  const session = await getSession();
  if (!session) return { success: false, error: "Not authenticated" };

  try {
    const applications = await db
      .select({ application: applicationsTable, company: companiesTable })
      .from(applicationsTable)
      .innerJoin(
        companiesTable,
        eq(applicationsTable.companyId, companiesTable.id),
      )
      .where(eq(applicationsTable.userId, session.user.id))
      .orderBy(desc(applicationsTable.createdAt));

    return { success: true, data: { applications } };
  } catch {
    return { success: false, error: "Failed to fetch applications page data" };
  }
}
