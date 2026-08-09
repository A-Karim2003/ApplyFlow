"use server";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { companiesTable } from "@/db/schema/companies";

export type Company = InferSelectModel<typeof companiesTable>;
export type NewCompany = InferInsertModel<typeof companiesTable>;

export async function createCompany(data: NewCompany): Promise<Company> {
  throw new Error("Not implemented yet.");
}

export async function updateCompany(
  id: Company["id"],
  data: Partial<NewCompany>,
): Promise<Company> {
  throw new Error("Not implemented yet.");
}

export async function deleteCompany(id: Company["id"]): Promise<void> {
  throw new Error("Not implemented yet.");
}
