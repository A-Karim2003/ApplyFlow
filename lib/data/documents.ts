import { desc, eq, type InferSelectModel } from "drizzle-orm";
import { applicationDocumentsTable, documentsTable } from "@/db/schema/";
import { db } from "@/db";
import { getSession } from "./session";
import { Result } from "@/types";

export type Document = InferSelectModel<typeof documentsTable>;
export type ApplicationDocument = InferSelectModel<
  typeof applicationDocumentsTable
>;

export type DocumentsPageData = {
  documents: Document[];
  applicationDocuments: Omit<ApplicationDocument, "createdAt">[];
};

export async function getDocumentsPageData(): Promise<
  Result<DocumentsPageData>
> {
  const session = await getSession();
  if (!session) return { success: false, error: "Not authenticated" };

  try {
    const [documents, applicationDocuments] = await Promise.all([
      db
        .select()
        .from(documentsTable)
        .where(eq(documentsTable.userId, session.user.id))
        .orderBy(desc(documentsTable.createdAt)),

      //* join used to extract userId from documentsTable (application_documents has none)
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
        .where(eq(documentsTable.userId, session.user.id)),
    ]);

    return { success: true, data: { documents, applicationDocuments } };
  } catch {
    return { success: false, error: "Failed to fetch documents page data" };
  }
}
