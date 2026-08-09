"use server";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { applicationStatusHistoryTable } from "@/db/schema/applications";

export type ApplicationStatusHistory = InferSelectModel<
  typeof applicationStatusHistoryTable
>;
export type NewApplicationStatusHistory = InferInsertModel<
  typeof applicationStatusHistoryTable
>;

export async function createApplicationStatusHistoryEntry(
  data: NewApplicationStatusHistory,
): Promise<ApplicationStatusHistory> {
  throw new Error("Not implemented yet.");
}

export async function deleteApplicationStatusHistoryEntry(
  id: ApplicationStatusHistory["id"],
): Promise<void> {
  throw new Error("Not implemented yet.");
}
