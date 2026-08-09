import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { verification } from "../../db/schema/auth-schema";

export type Verification = InferSelectModel<typeof verification>;
export type NewVerification = InferInsertModel<typeof verification>;

export async function getVerification(
  identifier: Verification["identifier"],
): Promise<Verification | null> {
  throw new Error("Not implemented yet.");
}
