import { getSession } from "@/actions/auth-actions";
import { redirect } from "next/navigation";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "../_components/app-sidebar";
import { RoutePageHeader } from "../_components/route-page-header";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/sign-in");

  const displayName = session.user.name?.split(" ")[0] ?? "there";
  const todayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <RoutePageHeader userName={displayName} todayLabel={todayLabel} />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
