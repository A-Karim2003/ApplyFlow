import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { documentsTable as documents } from "../../db/schema/documents";
import { db } from "@/db";
import { getSession } from "./session";

export type Document = InferSelectModel<typeof documents>;
export type NewDocument = InferInsertModel<typeof documents>;

export async function getDocuments(
  userId: Document["userId"],
): Promise<Document[]> {
  const session = await getSession();
  return db.select().from(documents).where(documents.userId.eq(userId));
}
