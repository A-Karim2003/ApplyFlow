"use server";

import { and, eq, type InferInsertModel } from "drizzle-orm";
import { companiesTable } from "@/db/schema/companies";
import { requireSession } from "@/lib/data/session";
import { Result } from "@/types";
import { db } from "@/db";
import { revalidatePath } from "next/cache";
import type { Company } from "@/lib/data/companies";

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

    revalidatePath("/companies");
    return { success: true, data: result[0] };
  } catch (error) {
    console.error("deleteCompany failed:", error);
    return { success: false, error: "Failed to delete company" };
  }
}
