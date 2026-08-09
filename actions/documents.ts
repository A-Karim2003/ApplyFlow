"use server";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { documentsTable } from "@/db/schema/documents";

export type Document = InferSelectModel<typeof documentsTable>;
export type NewDocument = InferInsertModel<typeof documentsTable>;

export async function createDocument(data: NewDocument): Promise<Document> {
  throw new Error("Not implemented yet.");
}

export async function updateDocument(
  id: Document["id"],
  data: Partial<NewDocument>,
): Promise<Document> {
  throw new Error("Not implemented yet.");
}

export async function deleteDocument(id: Document["id"]): Promise<void> {
  throw new Error("Not implemented yet.");
}
