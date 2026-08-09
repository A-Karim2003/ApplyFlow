"use server";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { session } from "@/db/schema/auth-schema";

export type Session = InferSelectModel<typeof session>;
export type NewSession = InferInsertModel<typeof session>;

export async function createSession(data: NewSession): Promise<Session> {
  throw new Error("Not implemented yet.");
}

export async function updateSession(
  id: Session["id"],
  data: Partial<NewSession>,
): Promise<Session> {
  throw new Error("Not implemented yet.");
}

export async function deleteSession(id: Session["id"]): Promise<void> {
  throw new Error("Not implemented yet.");
}
