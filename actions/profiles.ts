"use server";

import { eq } from "drizzle-orm";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";

import { db } from "@/db";
import { profilesTable } from "@/db/schema";
import { PROFILECACHETAG } from "@/lib/data/profile";
import { requireSession } from "@/lib/data/session";
import {
  updateProfileSchema,
  type UpdateProfileInput,
} from "@/lib/validations/profile";
import { Result } from "@/types";

export type Profile = InferSelectModel<typeof profilesTable>;
export type NewProfile = InferInsertModel<typeof profilesTable>;

export async function updateProfile(
  input: UpdateProfileInput,
): Promise<Result<Profile>> {
  const session = await requireSession();

  const parsed = updateProfileSchema.safeParse(input);
  if (!parsed.success)
    return { success: false, error: "Invalid profile details." };

  try {
    const [profile] = await db
      .update(profilesTable)
      .set({
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        bio: parsed.data.bio || null,
      })
      .where(eq(profilesTable.userId, session.user.id))
      .returning();

    if (!profile) return { success: false, error: "Profile not found" };

    //? Refreshes the sidebar name and header greeting
    updateTag(PROFILECACHETAG(session.user.id));
    revalidatePath("/account");

    return { success: true, data: profile };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Could not update profile" };
  }
}
