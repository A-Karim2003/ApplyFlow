"use server";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { profilesTable } from "@/db/schema/index";

export type Profile = InferSelectModel<typeof profilesTable>;
export type NewProfile = InferInsertModel<typeof profilesTable>;

export async function createProfile(data: NewProfile): Promise<Profile> {
  throw new Error("Not implemented yet.");
}

export async function updateProfile(
  userId: Profile["userId"],
  data: Partial<NewProfile>,
): Promise<Profile> {
  throw new Error("Not implemented yet.");
}

export async function deleteProfile(userId: Profile["userId"]): Promise<void> {
  throw new Error("Not implemented yet.");
}
