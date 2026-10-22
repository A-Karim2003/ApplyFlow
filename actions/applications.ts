"use server";

import {
  and,
  eq,
  inArray,
  sql,
  type InferInsertModel,
  type InferSelectModel,
} from "drizzle-orm";
import {
  applicationDocumentsTable,
  applicationsTable,
  applicationStatusHistoryTable,
  companiesTable,
  documentsTable,
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

export async function createApplication(
  application: ApplicationFormValues,
): Promise<Result<Application>> {
  const session = await requireSession();

  //? validate input
  const parsed = createApplicationSchema.safeParse(application);
  if (!parsed.success) {
    return { success: false, error: "Invalid application data" };
  }

  const applicationInput = parsed.data;

  try {
    //? Check the chosen existing company belongs to the user
    if (applicationInput.company.type === "existing") {
      const company = await db
        .select({
          id: companiesTable.id,
        })
        .from(companiesTable)
        .where(
          and(
            eq(companiesTable.id, applicationInput.company.id),
            eq(companiesTable.userId, session.user.id),
          ),
        );

      if (company.length === 0) {
        return { success: false, error: "Company not found" };
      }
    }

    //? Check the chosen CV / cover letter belong to the user and are the right type
    const documentIds = [
      applicationInput.resumeId,
      applicationInput.coverLetterId,
    ].filter((id) => id !== undefined);

    if (documentIds.length > 0) {
      const documents = await db
        .select({
          id: documentsTable.id,
          documentType: documentsTable.documentType,
        })
        .from(documentsTable)
        .where(
          and(
            inArray(documentsTable.id, documentIds),
            eq(documentsTable.userId, session.user.id),
          ),
        );

      for (const document of documents) {
        //? check whether a the documents has the correct type (cv or cover_letter)
        if (
          document.id === applicationInput.resumeId &&
          document.documentType !== "cv"
        ) {
          return { success: false, error: "Selected CV not found" };
        }

        if (
          document.id === applicationInput.coverLetterId &&
          document.documentType !== "cover_letter"
        ) {
          return { success: false, error: "Selected cover letter not found" };
        }
      }

      //? checks the selected documents belongs to the user
      if (documents.length !== documentIds.length) {
        return { success: false, error: "Selected document not found" };
      }
    }

    //* This transaction creates company (if new), application, status history, document links
    const addedApplication = await db.transaction(async (tx) => {
      let companyId: number | undefined;
      let companyCreated = false;

      if (applicationInput.company.type === "existing") {
        //? Reuse the selected existing company's ID
        companyId = applicationInput.company.id;
      } else {
        //? For new companies, check whether a company needs to be created or reused

        //* 1. Check for an existing company by Companies House number
        if (applicationInput.company.companyHouseNumber) {
          const newCompany = await tx
            .select({ id: companiesTable.id })
            .from(companiesTable)
            .where(
              and(
                eq(
                  companiesTable.companyHouseNumber,
                  applicationInput.company.companyHouseNumber,
                ),
                eq(companiesTable.userId, session.user.id),
              ),
            );

          if (newCompany.length > 0) {
            companyId = newCompany[0].id;
          }
        }

        //* 2. If no match was found, check by company name
        if (companyId === undefined) {
          const newCompany = await tx
            .select({ id: companiesTable.id })
            .from(companiesTable)
            .where(
              and(
                sql`LOWER(TRIM(${companiesTable.name})) = LOWER(TRIM(${applicationInput.company.name}))`,
                eq(companiesTable.userId, session.user.id),
              ),
            );

          if (newCompany.length > 0) {
            companyId = newCompany[0].id;
          }
        }

        //* 3. If neither lookup found a match, insert a new company
        if (companyId === undefined) {
          const [insertedCompany] = await tx
            .insert(companiesTable)
            .values({
              userId: session.user.id,
              name: applicationInput.company.name,
              companyHouseNumber:
                applicationInput.company.companyHouseNumber ?? null,
              industry: "other",
            })
            .returning({ id: companiesTable.id });

          if (!insertedCompany) throw new Error("COMPANY_INSERT_FAILED");

          companyId = insertedCompany.id;
          companyCreated = true;
        }
      }

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
    updateTag(`applications-${session.user.id}`); // swap for APPLICATIONSCACHETAG once it exists
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
const emptyToNull = (value?: string) => value?.trim() || null;
