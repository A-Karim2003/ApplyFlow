"use server";

import {
  and,
  eq,
  type InferInsertModel,
  type InferSelectModel,
} from "drizzle-orm";

import {
  applicationDocumentsTable,
  applicationsTable,
  applicationStatusHistoryTable,
} from "@/db/schema";

import { requireSession } from "@/lib/data/session";
import { Result } from "@/types";
import { db } from "@/db";
import { revalidatePath, updateTag } from "next/cache";
import {
  ApplicationFormValues,
  createApplicationSchema,
} from "@/lib/validations/applications";
import { COMPANIESCACHETAG } from "@/lib/data/companies";
import { APPLICATIONDOCUMENTSCACHETAG } from "@/lib/data/documents";
import { resolveCompanyId } from "./resolve-company-id";
import { checkOwnership } from "./ownership-check";
import { APPLICATIONSCACHETAG } from "@/lib/data/applications";

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
    updateTag(APPLICATIONSCACHETAG(session.user.id));
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

    updateTag(APPLICATIONSCACHETAG(session.user.id));
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

    updateTag(APPLICATIONSCACHETAG(session.user.id));
    revalidatePath("/applications");
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Could not delete application" };
  }
}

export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

//? Trims a string and turns empty input into null so the db stores NULL, not ""
const emptyToNull = (value?: string) => value?.trim() || null;

export async function createApplication(
  application: ApplicationFormValues,
): Promise<Result<Application>> {
  const session = await requireSession();

  //? validate input
  const parsed = createApplicationSchema.safeParse(application);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const applicationInput = parsed.data;

  try {
    const documentIds = [
      applicationInput.resumeId,
      applicationInput.coverLetterId,
    ].filter((id) => id !== undefined);

    //? Check the chosen company and documents belong to the user
    const ownershipError = await checkOwnership(
      session.user.id,
      applicationInput,
      documentIds,
    );

    if (ownershipError) return { success: false, error: ownershipError };

    //* This transaction creates company (if new), application, status history, document links
    const addedApplication = await db.transaction(async (tx) => {
      const { companyId, companyCreated } = await resolveCompanyId(
        tx,
        session.user.id,
        applicationInput.company,
      );

      //? Insert the application
      const [application] = await tx
        .insert(applicationsTable)
        .values({
          ...applicationInput,
          location: emptyToNull(applicationInput.location),
          jobUrl: emptyToNull(applicationInput.jobUrl),
          notes: emptyToNull(applicationInput.notes),
          appliedAt: emptyToNull(applicationInput.appliedAt),
          applicationDeadline: emptyToNull(
            applicationInput.applicationDeadline,
          ),
          userId: session.user.id,
          companyId: companyId,
        })
        .returning();

      if (!application) throw new Error("APPLICATION_INSERT_FAILED");

      //? Record the initial status in the history table
      await tx.insert(applicationStatusHistoryTable).values({
        applicationId: application.id,
        status: applicationInput.status,
      });

      //? Link the chosen documents to the application
      if (documentIds.length > 0) {
        await tx.insert(applicationDocumentsTable).values(
          documentIds.map((documentId) => ({
            applicationId: application.id,
            documentId: documentId,
          })),
        );
      }
      return { application, companyCreated };
    });

    //? Refresh cached data now the commit has succeeded
    //TODO swap for APPLICATIONSCACHETAG once it exists
    updateTag(APPLICATIONSCACHETAG(session.user.id));
    revalidatePath("/applications");

    if (addedApplication.companyCreated) {
      updateTag(COMPANIESCACHETAG(session.user.id));
      revalidatePath("/companies");
    }

    if (documentIds.length > 0) {
      updateTag(APPLICATIONDOCUMENTSCACHETAG(session.user.id));
      revalidatePath("/documents");
    }

    //? Return the new application
    return { success: true, data: addedApplication.application };
  } catch (error) {
    console.error("createApplication failed:", error);
    return { success: false, error: "Could not create application" };
  }
}
