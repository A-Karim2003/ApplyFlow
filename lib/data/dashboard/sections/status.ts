import { cacheLife, cacheTag } from "next/cache";

import type { Result } from "@/types";

import {
  APPLICATIONSCACHETAG,
  type ApplicationStatus,
} from "../../applications";
import { requireSession } from "../../session";
import { dateDaysAgo, getApplicationStatusCounts } from "../shared";

type StatusCounts = Record<ApplicationStatus, number>;

async function getStatusCountsCached(
  userId: string,
  days: number | null,
): Promise<StatusCounts> {
  "use cache";
  cacheLife("minutes");
  cacheTag(APPLICATIONSCACHETAG(userId));

  //? Cutoff computed inside the cache, never pass a Date in
  const fromDate = days === null ? null : dateDaysAgo(days);
  return getApplicationStatusCounts(userId, fromDate, null);
}

export async function getStatusCounts(
  days: number | null,
): Promise<Result<StatusCounts>> {
  const session = await requireSession();

  try {
    const data = await getStatusCountsCached(session.user.id, days);
    return { success: true, data };
  } catch {
    return { success: false, error: "Failed to fetch status breakdown" };
  }
}
