import { headers } from "next/headers";
import { auth } from "../auth";

export type Session = NonNullable<
  Awaited<ReturnType<typeof auth.api.getSession>>
>;

export async function getSession(): Promise<Session | null> {
  try {
    return await auth.api.getSession({
      headers: await headers(),
    });
  } catch {
    return null;
  }
}
