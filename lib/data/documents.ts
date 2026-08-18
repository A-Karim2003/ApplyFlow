import { desc, eq, type InferSelectModel } from "drizzle-orm";
import { documentsTable } from "@/db/schema/";
import { db } from "@/db";
import { getSession } from "./session";
import { Result } from "@/types";

export type Document = InferSelectModel<typeof documentsTable>;

export async function getDocumentsPageData(): Promise<Result<Document[]>> {
  const session = await getSession();
  if (!session) return { success: false, error: "Not authenticated" };

  try {
    const documents = await db
      .select()
      .from(documentsTable)
      .where(eq(documentsTable.userId, session.user.id))
      .orderBy(desc(documentsTable.createdAt));

    return { success: true, data: documents };
  } catch {
    return { success: false, error: "Failed to fetch documents page data" };
  }
}
