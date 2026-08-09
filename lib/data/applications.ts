import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  applicationStatusHistoryTable as applicationEvents,
  applicationsTable as applications,
} from "../../db/schema/applications";

export type Application = InferSelectModel<typeof applications>;
export type NewApplication = InferInsertModel<typeof applications>;

export type ApplicationFilters = {
  userId?: Application["userId"];
  companyId?: Application["companyId"];
  status?: Application["status"];
};

export async function getApplications(
  filters: ApplicationFilters,
): Promise<Application[]> {
  throw new Error("Not implemented yet.");
}

export type ApplicationEvent = InferSelectModel<typeof applicationEvents>;
export type NewApplicationEvent = InferInsertModel<typeof applicationEvents>;
