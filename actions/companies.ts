"use server";

import type { InferInsertModel } from "drizzle-orm";
import { companiesTable } from "@/db/schema/companies";
import { getSession } from "@/lib/data/session";
import { Result } from "@/types";
import { db } from "@/db";
import { revalidatePath } from "next/cache";

export type NewCompany = InferInsertModel<typeof companiesTable>;

type CreateCompanyInput = Omit<NewCompany, "userId">;

export async function createCompany(
  data: CreateCompanyInput,
): Promise<Result<NewCompany>> {
  return { success: false, error: "testing" };

  const session = await getSession();
  if (!session) return { success: false, error: "User not authenticated" };

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
