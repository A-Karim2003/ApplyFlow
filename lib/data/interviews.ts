import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { interviews as interviewsTable } from "../../db/schema/interviews";

export type Interview = InferSelectModel<typeof interviewsTable>;
export type NewInterview = InferInsertModel<typeof interviewsTable>;

export async function getInterviews(
  applicationId: Interview["applicationId"],
): Promise<Interview[]> {
  throw new Error("Not implemented yet.");
}
