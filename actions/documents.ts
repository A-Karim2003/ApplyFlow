"use server";

import {
  and,
  eq,
  type InferInsertModel,
  type InferSelectModel,
} from "drizzle-orm";
import { documentsTable } from "@/db/schema/documents";
import { requireSession } from "@/lib/data/session";
import { db } from "@/db";
import { revalidatePath, updateTag } from "next/cache";
import { Result } from "@/types";
import {
  applicationDocumentsTable,
  applicationsTable,
  companiesTable,
} from "@/db/schema";
import { deleteObject } from "@/lib/s3/delete-object";
import {
  APPLICATIONDOCUMENTSCACHETAG,
  DOCUMENTSCACHETAG,
} from "@/lib/data/documents";

export type Document = InferSelectModel<typeof documentsTable>;
export type NewDocument = InferInsertModel<typeof documentsTable>;

export async function createDocument(
  data: Omit<NewDocument, "userId">,
): Promise<Result<Document>> {
  const session = await requireSession();

  try {
    const result = await db
      .insert(documentsTable)
      .values({
        ...data,
        userId: session.user.id,
      })
      .returning();

    if (result.length === 0)
      return { success: false, error: "Document could not be uploaded" };

    updateTag(DOCUMENTSCACHETAG(session.user.id));
    revalidatePath("/documents");
    return { success: true, data: result[0] };
  } catch {
    return { success: false, error: "Failed to upload document" };
  }
}

export async function deleteDocument(id: number): Promise<Result<Document>> {
  const session = await requireSession();

  try {
    //? Guard document deletion if there are linked applications
    const links = await db
      .select({ applicationId: applicationDocumentsTable.applicationId })
      .from(applicationDocumentsTable)
      .innerJoin(
        documentsTable,
        eq(applicationDocumentsTable.documentId, documentsTable.id),
      )
      .where(
        and(
          eq(applicationDocumentsTable.documentId, id),
          eq(documentsTable.userId, session.user.id),
        ),
      );

    if (links.length > 0) {
      return {
        success: false,
        error: `This document is linked to ${links.length} application${links.length > 1 ? "s" : ""}. Unlink it before deleting.`,
      };
    }

    const result = await db
      .delete(documentsTable)
      .where(
        and(
          eq(documentsTable.id, id),
          eq(documentsTable.userId, session.user.id),
        ),
      )
      .returning();

    if (result.length === 0)
      return { success: false, error: "Document not found" };

    //? Once deleted from DB, delete the associated file from S3
    try {
      await deleteObject(result[0].storageKey);
    } catch (error) {
      console.error("Failed to delete S3 object (orphaned):", error);
    }

    updateTag(DOCUMENTSCACHETAG(session.user.id));
    updateTag(APPLICATIONDOCUMENTSCACHETAG(session.user.id));
    revalidatePath("/documents");
    return { success: true, data: result[0] };
  } catch {
    return { success: false, error: "Failed to delete document" };
  }
}

export type LinkedApplication = {
  id: number;
  companyId: number;
  companyName: string;
  jobTitle: string;
};

export async function getLinkedApplicationsForDocument(
  documentId: number,
): Promise<Result<LinkedApplication[]>> {
  const session = await requireSession();

  try {
    const applications = await db
      .select({
        id: applicationsTable.id,
        companyId: applicationsTable.companyId,
        companyName: companiesTable.name,
        jobTitle: applicationsTable.jobTitle,
      })
      .from(applicationDocumentsTable)
      .innerJoin(
        applicationsTable,
        eq(applicationDocumentsTable.applicationId, applicationsTable.id),
      )
      .innerJoin(
        companiesTable,
        eq(applicationsTable.companyId, companiesTable.id),
      )
      .innerJoin(
        documentsTable,
        eq(applicationDocumentsTable.documentId, documentsTable.id),
      )
      .where(
        and(
          eq(applicationDocumentsTable.documentId, documentId),
          eq(documentsTable.userId, session.user.id),
        ),
      );

    return { success: true, data: applications };
  } catch {
    return { success: false, error: "Failed to fetch linked applications" };
  }
}

export async function unlinkDocumentFromApplication(
  documentId: number,
  applicationId: number,
): Promise<Result<void>> {
  const session = await requireSession();

  try {
    //? Verify document belongs to user (extra safety check)
    const document = await db
      .select()
      .from(documentsTable)
      .where(
        and(
          eq(documentsTable.id, documentId),
          eq(documentsTable.userId, session.user.id),
        ),
      );

    if (document.length === 0) {
      return { success: false, error: "Document not found" };
    }

    //? Delete the link
    await db
      .delete(applicationDocumentsTable)
      .where(
        and(
          eq(applicationDocumentsTable.documentId, documentId),
          eq(applicationDocumentsTable.applicationId, applicationId),
        ),
      );

    updateTag(APPLICATIONDOCUMENTSCACHETAG(session.user.id));
    revalidatePath("/documents");
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Failed to unlink document" };
  }
}
