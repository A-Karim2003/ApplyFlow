import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { companiesTable as companies } from "../../db/schema/companies";

export type Company = InferSelectModel<typeof companies>;
export type NewCompany = InferInsertModel<typeof companies>;

export async function getCompanies(
  userId: Company["userId"],
): Promise<Company[]> {
  throw new Error("Not implemented yet.");
}
