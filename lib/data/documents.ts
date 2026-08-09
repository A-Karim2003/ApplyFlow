import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { documentsTable as documents } from "../../db/schema/documents";

export type Document = InferSelectModel<typeof documents>;
export type NewDocument = InferInsertModel<typeof documents>;

export async function getDocuments(
  userId: Document["userId"],
): Promise<Document[]> {
  throw new Error("Not implemented yet.");
}
