import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "../auth";
import { cache } from "react";

export type Session = NonNullable<
  Awaited<ReturnType<typeof auth.api.getSession>>
>;

export const getSession = cache(async (): Promise<Session | null> => {
  try {
    return await auth.api.getSession({ headers: await headers() });
  } catch {
    return null;
  }
});

export async function requireSession() {
  const session = await getSession();
  if (!session) {
    redirect("/sign-in");
  }
  return session;
}
