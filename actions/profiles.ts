"use server";

import { db } from "@/db";
import { NewProfile, profilesTable } from "@/db/schema/index";

export async function createProfile(data: NewProfile) {
  await db.insert(profilesTable).values({ ...data });
}
