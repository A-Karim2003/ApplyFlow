// app/(main)/layout.tsx
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Bounce, ToastContainer } from "react-toastify";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "../_components/app-sidebar";
import { RoutePageHeader } from "../_components/route-page-header";
import { getSession } from "@/lib/data/session";
import { PageHeaderSkeleton } from "../_components/page-header-skeleton";

// nothing inside renders until the session check passes
async function AuthedContent({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/sign-in");

  const displayName = session.user.name?.split(" ")[0] ?? "there";
  const todayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <RoutePageHeader userName={displayName} todayLabel={todayLabel} />
      {children}
    </>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-x-hidden">
        <Suspense fallback={<PageHeaderSkeleton />}>
          <AuthedContent>{children}</AuthedContent>
        </Suspense>
      </SidebarInset>
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        closeOnClick={false}
        transition={Bounce}
      />
    </SidebarProvider>
  );
}
