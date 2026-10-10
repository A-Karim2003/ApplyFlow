"use server";

import {
  and,
  eq,
  type InferInsertModel,
  type InferSelectModel,
} from "drizzle-orm";
import { applicationsTable, applicationStatusHistoryTable } from "@/db/schema";
import { requireSession } from "@/lib/data/session";
import { Result } from "@/types";
import { db } from "@/db";
import { revalidatePath, updateTag } from "next/cache";

export type NewApplication = InferInsertModel<typeof applicationsTable>;
export type Application = InferSelectModel<typeof applicationsTable>;

export type UpdateApplicationProp = {
  id: Application["id"];
  newStatus: Application["status"];
};

export async function updateApplicationStatus({
  id,
  newStatus,
}: UpdateApplicationProp): Promise<Result<Application>> {
  const session = await requireSession();

  try {
    const result = await db.transaction(async (tx) => {
      //? Get current application status before updating
      const [currentApplicationStatus] = await tx
        .select({ status: applicationsTable.status })
        .from(applicationsTable)
        .where(
          and(
            eq(applicationsTable.id, id),
            eq(applicationsTable.userId, session.user.id),
          ),
        );

      if (!currentApplicationStatus) throw new Error("NOT_FOUND");

      //? Update the application status
      const result = await tx
        .update(applicationsTable)
        .set({ status: newStatus })
        .where(
          and(
            eq(applicationsTable.id, id),
            eq(applicationsTable.userId, session.user.id),
          ),
        )
        .returning();

      if (result.length === 0) throw new Error("UPDATE_FAILED");

      //? Update the application status history
      await tx.insert(applicationStatusHistoryTable).values({
        applicationId: id,
        previousStatus: currentApplicationStatus.status,
        status: newStatus,
      });

      return result;
    });

    updateTag(`applications-${session.user.id}`);
    revalidatePath("/applications");
    return { success: true, data: result[0] };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Could not update application status" };
  }
}

export type UpdateApplicationDetailsProp = {
  applicationId: Application["id"];
  values: Partial<
    Pick<
      NewApplication,
      | "jobTitle"
      | "jobType"
      | "source"
      | "location"
      | "workMode"
      | "jobUrl"
      | "salaryMin"
      | "salaryMax"
      | "applicationDeadline"
      | "appliedAt"
      | "notes"
    >
  >;
};

export async function updateApplicationDetails({
  applicationId,
  values,
}: UpdateApplicationDetailsProp): Promise<Result<Application>> {
  const session = await requireSession();

  try {
    const [result] = await db
      .update(applicationsTable)
      .set(values)
      .where(
        and(
          eq(applicationsTable.id, applicationId),
          eq(applicationsTable.userId, session.user.id),
        ),
      )
      .returning();

    if (!result) return { success: false, error: "Not found" };

    updateTag(`applications-${session.user.id}`);
    revalidatePath("/applications");
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Could not update application" };
  }
}

export async function deleteApplication(
  applicationId: Application["id"],
): Promise<Result<Application>> {
  const session = await requireSession();

  try {
    const [result] = await db
      .delete(applicationsTable)
      .where(
        and(
          eq(applicationsTable.id, applicationId),
          eq(applicationsTable.userId, session.user.id),
        ),
      )
      .returning();

    if (!result) return { success: false, error: "Not found" };

    updateTag(`applications-${session.user.id}`);
    revalidatePath("/applications");
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Could not delete application" };
  }
}
