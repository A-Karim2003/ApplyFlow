"use server";

import { and, eq, InferSelectModel, InferInsertModel } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";

import { db } from "@/db";
import { applicationsTable, interviewsTable } from "@/db/schema";
import { requireSession } from "@/lib/data/session";
import { APPLICATIONSCACHETAG } from "@/lib/data/applications";
import { Result } from "@/types";
import {
  CreateInterviewInput,
  createInterviewSchema,
} from "@/lib/validations/interview";

export type Interview = InferSelectModel<typeof interviewsTable>;
export type NewInterview = InferInsertModel<typeof interviewsTable>;

export async function createInterview(
  input: CreateInterviewInput,
): Promise<Result<Interview>> {
  const session = await requireSession();

  const parsed = createInterviewSchema.safeParse(input);
  if (!parsed.success)
    return { success: false, error: "Invalid interview details." };

  //* confirm the application belongs to the user
  const [application] = await db
    .select({ id: applicationsTable.id })
    .from(applicationsTable)
    .where(
      and(
        eq(applicationsTable.id, parsed.data.applicationId),
        eq(applicationsTable.userId, session.user.id),
      ),
    );

  if (!application) return { success: false, error: "Application not found." };

  const [interview] = await db
    .insert(interviewsTable)
    .values(parsed.data)
    .returning();

  updateTag(APPLICATIONSCACHETAG(session.user.id));
  revalidatePath("/applications");

  return { success: true, data: interview };
}
