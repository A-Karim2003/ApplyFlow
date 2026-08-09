"use server";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { user } from "@/db/schema/auth-schema";

export type User = InferSelectModel<typeof user>;
export type NewUser = InferInsertModel<typeof user>;

export async function createUser(data: NewUser): Promise<User> {
  throw new Error("Not implemented yet.");
}

export async function updateUser(
  id: User["id"],
  data: Partial<NewUser>,
): Promise<User> {
  throw new Error("Not implemented yet.");
}

export async function deleteUser(id: User["id"]): Promise<void> {
  throw new Error("Not implemented yet.");
}
