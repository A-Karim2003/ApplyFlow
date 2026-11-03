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
import { deleteObject } from "@/lib/s3/delete-object";

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

export async function updateProfileImage(key: string): Promise<Result<null>> {
  const session = await requireSession();

  //? key comes from the client: it must sit under this user's avatar prefix
  if (!key.startsWith(`users/${session.user.id}/avatar/`)) {
    return { success: false, error: "Invalid image" };
  }

  try {
    const [profile] = await db
      .select({ image: profilesTable.image })
      .from(profilesTable)
      .where(eq(profilesTable.userId, session.user.id));

    if (!profile) return { success: false, error: "Profile not found" };

    //? delete old object first: a failed delete never loses the only pointer to it
    if (profile.image && profile.image !== key) {
      try {
        await deleteObject(profile.image);
      } catch (error) {
        console.error("Failed to delete old avatar:", error);
      }
    }

    await db
      .update(profilesTable)
      .set({ image: key })
      .where(eq(profilesTable.userId, session.user.id));

    updateTag(PROFILECACHETAG(session.user.id));
    revalidatePath("/account");
    return { success: true, data: null };
  } catch (error) {
    console.error("updateProfileImage failed:", error);
    return { success: false, error: "Could not update profile image" };
  }
}

export async function removeProfileImage(): Promise<Result<null>> {
  const session = await requireSession();

  try {
    const [profile] = await db
      .select({ image: profilesTable.image })
      .from(profilesTable)
      .where(eq(profilesTable.userId, session.user.id));

    if (!profile) return { success: false, error: "Profile not found" };

    if (!profile.image) return { success: true, data: null };

    try {
      await deleteObject(profile.image);
    } catch (error) {
      console.error("Failed to delete avatar:", error);
    }

    await db
      .update(profilesTable)
      .set({ image: null })
      .where(eq(profilesTable.userId, session.user.id));

    updateTag(PROFILECACHETAG(session.user.id));
    revalidatePath("/account");
    return { success: true, data: null };
  } catch (error) {
    console.error("removeProfileImage failed:", error);
    return { success: false, error: "Could not remove profile image" };
  }
}
