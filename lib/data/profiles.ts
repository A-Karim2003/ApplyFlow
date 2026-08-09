import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { profilesTable as profiles } from "../../db/schema/profiles";

export type Profile = InferSelectModel<typeof profiles>;
export type NewProfile = InferInsertModel<typeof profiles>;

export async function getProfile(
  userId: Profile["userId"],
): Promise<Profile | null> {
  throw new Error("Not implemented yet.");
}
