import type { InferSelectModel } from "drizzle-orm";
import {
  companiesTable as companies,
  companiesTable,
} from "../../db/schema/companies";
import { getSession } from "./session";
import { db } from "@/db";
import { Result } from "@/types";

export type Company = InferSelectModel<typeof companies>;

export async function getCompanies(): Promise<Result<Company[]>> {
  const session = await getSession();
  if (!session) return { success: false, error: "Not authenticated" };

  try {
    const companies = await db.select().from(companiesTable);
    return { success: true, data: companies };
  } catch {
    return { success: false, error: "Failed to fetch companies" };
  }
}
