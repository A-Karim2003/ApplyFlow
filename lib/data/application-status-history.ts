import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { applicationStatusHistoryTable } from "../../db/schema/applications";

export type ApplicationStatusHistory = InferSelectModel<
  typeof applicationStatusHistoryTable
>;
export type NewApplicationStatusHistory = InferInsertModel<
  typeof applicationStatusHistoryTable
>;

export async function getApplicationStatusHistory(
  applicationId: ApplicationStatusHistory["applicationId"],
): Promise<ApplicationStatusHistory[]> {
  throw new Error("Not implemented yet.");
}
