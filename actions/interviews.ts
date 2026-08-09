"use server";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { interviews as interviewsTable } from "@/db/schema/interviews";

export type Interview = InferSelectModel<typeof interviewsTable>;
export type NewInterview = InferInsertModel<typeof interviewsTable>;

export async function createInterview(data: NewInterview): Promise<Interview> {
  throw new Error("Not implemented yet.");
}

export async function updateInterview(
  id: Interview["id"],
  data: Partial<NewInterview>,
): Promise<Interview> {
  throw new Error("Not implemented yet.");
}

export async function deleteInterview(id: Interview["id"]): Promise<void> {
  throw new Error("Not implemented yet.");
}
