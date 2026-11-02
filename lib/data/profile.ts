import { eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { profilesTable } from "@/db/schema";
import { Result } from "@/types";
import { db } from "@/db";

import { requireSession } from "./session";

export const PROFILECACHETAG = (userId: string) => `profile-${userId}`;

export type ProfileDetails = {
  firstName: string;
  lastName: string;
  bio: string | null;
};

async function getProfileCached(
  userId: string,
): Promise<ProfileDetails | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag(PROFILECACHETAG(userId));

  const [profile] = await db
    .select({
      firstName: profilesTable.firstName,
      lastName: profilesTable.lastName,
      bio: profilesTable.bio,
    })
    .from(profilesTable)
    .where(eq(profilesTable.userId, userId));

  return profile ?? null;
}

export async function getProfile(): Promise<Result<ProfileDetails>> {
  const session = await requireSession();

  try {
    const profile = await getProfileCached(session.user.id);
    if (!profile) {
      return { success: false, error: "Profile not found" };
    }

    return { success: true, data: profile };
  } catch (error) {
    console.error("getProfile failed:", error);
    return { success: false, error: "Failed to fetch profile" };
  }
}
