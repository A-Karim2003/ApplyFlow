import { companiesTable } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { Transaction } from "./applications";
import { ApplicationFormValues } from "@/lib/validations/applications";

//? Returns the company id to use, reusing a matching company or creating a new one (runs inside the transaction)
export async function resolveCompanyId(
  tx: Transaction,
  userId: string,
  company: ApplicationFormValues["company"],
): Promise<{ companyId: number; companyCreated: boolean }> {
  //? Reuse the selected existing company's ID
  if (company.type === "existing") {
    return { companyId: company.id, companyCreated: false };
  }

  //? For new companies, check whether a company needs to be created or reused
  let companyId: number | undefined;

  //* 1. Check for an existing company by Companies House number
  if (company.companyHouseNumber) {
    const newCompany = await tx
      .select({ id: companiesTable.id })
      .from(companiesTable)
      .where(
        and(
          eq(companiesTable.companyHouseNumber, company.companyHouseNumber),
          eq(companiesTable.userId, userId),
        ),
      );

    if (newCompany.length > 0) {
      companyId = newCompany[0].id;
    }
  }

  //* 2. If no match was found, check by company name
  if (companyId === undefined) {
    const newCompany = await tx
      .select({ id: companiesTable.id })
      .from(companiesTable)
      .where(
        and(
          sql`LOWER(TRIM(${companiesTable.name})) = LOWER(TRIM(${company.name}))`,
          eq(companiesTable.userId, userId),
        ),
      );

    if (newCompany.length > 0) {
      companyId = newCompany[0].id;
    }
  }

  //* 3. If neither lookup found a match, insert a new company
  if (companyId === undefined) {
    const [insertedCompany] = await tx
      .insert(companiesTable)
      .values({
        userId,
        name: company.name,
        companyHouseNumber: company.companyHouseNumber ?? null,
        industry: "other",
      })
      .returning({ id: companiesTable.id });

    if (!insertedCompany) throw new Error("COMPANY_INSERT_FAILED");

    return { companyId: insertedCompany.id, companyCreated: true };
  }

  return { companyId, companyCreated: false };
}
