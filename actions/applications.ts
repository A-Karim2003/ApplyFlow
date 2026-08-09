"use server";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  applicationStatusHistoryTable,
  applicationsTable,
} from "@/db/schema/applications";

export type Application = InferSelectModel<typeof applicationsTable>;
export type NewApplication = InferInsertModel<typeof applicationsTable>;
export type ApplicationEvent = InferSelectModel<
  typeof applicationStatusHistoryTable
>;
export type NewApplicationEvent = InferInsertModel<
  typeof applicationStatusHistoryTable
>;

export type ApplicationFilters = {
  userId?: Application["userId"];
  companyId?: Application["companyId"];
  status?: Application["status"];
};

export async function createApplication(
  data: NewApplication,
): Promise<Application> {
  throw new Error("Not implemented yet.");
}

export async function updateApplicationStatus(
  id: Application["id"],
  newStatus: Application["status"],
): Promise<Application> {
  throw new Error("Not implemented yet.");
}

export async function deleteApplication(id: Application["id"]): Promise<void> {
  throw new Error("Not implemented yet.");
}
