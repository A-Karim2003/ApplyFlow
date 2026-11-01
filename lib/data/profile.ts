import { eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { profilesTable } from "@/db/schema";
import { Result } from "@/types";
import { db } from "@/db";

import { requireSession } from "./session";

export const PROFILECACHETAG = (userId: string) => `profile-${userId}`;

async function getProfileCached(
  userId: string,
): Promise<{ firstName: string; lastName: string } | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag(PROFILECACHETAG(userId));

  const [profile] = await db
    .select({
      firstName: profilesTable.firstName,
      lastName: profilesTable.lastName,
    })
    .from(profilesTable)
    .where(eq(profilesTable.userId, userId));

  return profile ?? null;
}

export async function getProfile(): Promise<
  Result<{ firstName: string; lastName: string }>
> {
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