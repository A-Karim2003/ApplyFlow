import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { user } from "../../db/schema/auth-schema";

export type User = InferSelectModel<typeof user>;
export type NewUser = InferInsertModel<typeof user>;

export async function getUser(id: User["id"]): Promise<User | null> {
  throw new Error("Not implemented yet.");
}

export async function getUserByEmail(
  email: User["email"],
): Promise<User | null> {
  throw new Error("Not implemented yet.");
}
