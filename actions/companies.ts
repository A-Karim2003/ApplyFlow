"use server";

import { and, eq, type InferInsertModel } from "drizzle-orm";
import { companiesTable } from "@/db/schema/companies";
import { requireSession } from "@/lib/data/session";
import { Result } from "@/types";
import { db } from "@/db";
import { revalidatePath, updateTag } from "next/cache";
import { COMPANIESCACHETAG, type Company } from "@/lib/data/companies";

export type NewCompany = InferInsertModel<typeof companiesTable>;

type CreateCompanyInput = Omit<NewCompany, "userId">;

export async function createCompany(
  data: CreateCompanyInput,
): Promise<Result<NewCompany>> {
  const session = await requireSession();

  try {
    const result = await db
      .insert(companiesTable)
      .values({ ...data, userId: session.user.id })
      .returning();

    updateTag(COMPANIESCACHETAG(session.user.id));
    revalidatePath("/companies");

    return { success: true, data: result[0] };
  } catch (error) {
    console.error("createCompany failed:", error);
    return { success: false, error: "Failed to create company" };
  }
}

export async function updateCompany(
  id: number,
  data: Omit<NewCompany, "userId">,
): Promise<Result<Company>> {
  const session = await requireSession();

  try {
    const result = await db
      .update(companiesTable)
      .set(data)
      .where(
        and(
          eq(companiesTable.id, id),
          eq(companiesTable.userId, session.user.id),
        ),
      )
      .returning();

    if (result.length === 0)
      return { success: false, error: "Company not found" };

    updateTag(COMPANIESCACHETAG(session.user.id));
    revalidatePath("/companies");

    return { success: true, data: result[0] };
  } catch (error) {
    console.error("updateCompany failed:", error);
    return { success: false, error: "Failed to update company" };
  }
}

export async function deleteCompany(id: number): Promise<Result<Company>> {
  const session = await requireSession();

  try {
    const result = await db
      .delete(companiesTable)
      .where(
        and(
          eq(companiesTable.id, id),
          eq(companiesTable.userId, session.user.id),
        ),
      )
      .returning();

    if (result.length === 0) {
      return { success: false, error: "Company not found" };
    }

    updateTag(COMPANIESCACHETAG(session.user.id));
    revalidatePath("/companies");
    return { success: true, data: result[0] };
  } catch (error) {
    console.error("deleteCompany failed:", error);
    return { success: false, error: "Failed to delete company" };
  }
}

export async function searchCompanies(query: string) {
  const API_KEY = process.env.COMPANIES_HOUSE_API_KEY;
  if (!API_KEY) throw new Error("Companies House API key is missing");

  if (query.length < 2) return [];

  const params = new URLSearchParams({
    q: query,
    items_per_page: "5",
  });

  const res = await fetch(
    `https://api.company-information.service.gov.uk/search/companies?${params}`,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(`${API_KEY}:`).toString("base64")}`,
      },
    },
  );

  const data = await res.json();
  return data.items || [];
}
