"use server";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { verification } from "@/db/schema/auth-schema";

export type Verification = InferSelectModel<typeof verification>;
export type NewVerification = InferInsertModel<typeof verification>;

export async function createVerification(
  data: NewVerification,
): Promise<Verification> {
  throw new Error("Not implemented yet.");
}

export async function updateVerification(
  id: Verification["id"],
  data: Partial<NewVerification>,
): Promise<Verification> {
  throw new Error("Not implemented yet.");
}

export async function deleteVerification(
  id: Verification["id"],
): Promise<void> {
  throw new Error("Not implemented yet.");
}
