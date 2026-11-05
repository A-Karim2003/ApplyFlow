import { asc, eq, type InferSelectModel } from "drizzle-orm";
import { applicationDocumentsTable, documentsTable } from "@/db/schema/";
import { db } from "@/db";
import { getSession } from "./session";
import { Result } from "@/types";
import { cacheLife, cacheTag } from "next/cache";

export type Document = InferSelectModel<typeof documentsTable>;
export type ApplicationDocument = InferSelectModel<
  typeof applicationDocumentsTable
>;

export type DocumentsPageData = {
  documents: Document[];
  applicationDocuments: Omit<ApplicationDocument, "createdAt">[];
};

export const DOCUMENTSCACHETAG = (userId: Document["userId"]) =>
  `documents-${userId}`;
export const APPLICATIONDOCUMENTSCACHETAG = (userId: Document["userId"]) =>
  `application-documents-${userId}`;

async function getDocumentsCached(userId: string): Promise<Document[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(DOCUMENTSCACHETAG(userId));

  return db
    .select()
    .from(documentsTable)
    .where(eq(documentsTable.userId, userId));
}

export async function getDocuments(): Promise<Result<Document[]>> {
  const session = await getSession();
  if (!session) return { success: false, error: "Not authenticated" };

  try {
    const documents = await getDocumentsCached(session.user.id);
    return { success: true, data: documents };
  } catch {
    return { success: false, error: "Failed to fetch documents" };
  }
}

async function getDocumentsPageDataCached(
  userId: string,
): Promise<DocumentsPageData> {
  "use cache";
  cacheLife("minutes");
  cacheTag(DOCUMENTSCACHETAG(userId), APPLICATIONDOCUMENTSCACHETAG(userId));

  const [documents, applicationDocuments] = await Promise.all([
    db
      .select()
      .from(documentsTable)
      .where(eq(documentsTable.userId, userId))
      .orderBy(asc(documentsTable.documentType)),
    db
      .select({
        applicationId: applicationDocumentsTable.applicationId,
        documentId: applicationDocumentsTable.documentId,
      })
      .from(applicationDocumentsTable)
      .innerJoin(
        documentsTable,
        eq(applicationDocumentsTable.documentId, documentsTable.id),
      )
      .where(eq(documentsTable.userId, userId)),
  ]);

  return { documents, applicationDocuments };
}

export async function getDocumentsPageData(): Promise<
  Result<DocumentsPageData>
> {
  const session = await getSession();
  if (!session) return { success: false, error: "Not authenticated" };

  try {
    const data = await getDocumentsPageDataCached(session.user.id);
    return { success: true, data };
  } catch {
    return { success: false, error: "Failed to fetch documents page data" };
  }
}
