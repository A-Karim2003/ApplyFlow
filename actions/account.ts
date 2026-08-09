"use server";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { account } from "@/db/schema/auth-schema";

export type Account = InferSelectModel<typeof account>;
export type NewAccount = InferInsertModel<typeof account>;

export async function createAccount(data: NewAccount): Promise<Account> {
  throw new Error("Not implemented yet.");
}

export async function updateAccount(
  id: Account["id"],
  data: Partial<NewAccount>,
): Promise<Account> {
  throw new Error("Not implemented yet.");
}

export async function deleteAccount(id: Account["id"]): Promise<void> {
  throw new Error("Not implemented yet.");
}
