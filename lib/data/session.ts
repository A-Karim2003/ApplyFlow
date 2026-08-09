import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { session } from "../../db/schema/auth-schema";

export type Session = InferSelectModel<typeof session>;
export type NewSession = InferInsertModel<typeof session>;

export async function getSession(id: Session["id"]): Promise<Session | null> {
  throw new Error("Not implemented yet.");
}

export async function getSessionsByUserId(
  userId: Session["userId"],
): Promise<Session[]> {
  throw new Error("Not implemented yet.");
}
