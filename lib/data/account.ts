import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { account } from "../../db/schema/auth-schema";

export type Account = InferSelectModel<typeof account>;
export type NewAccount = InferInsertModel<typeof account>;

export async function getAccounts(
  userId: Account["userId"],
): Promise<Account[]> {
  throw new Error("Not implemented yet.");
}
