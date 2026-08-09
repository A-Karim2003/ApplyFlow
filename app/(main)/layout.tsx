import { getSession } from "@/actions/auth-actions";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/sign-in");

  return <main>{children}</main>;
}
