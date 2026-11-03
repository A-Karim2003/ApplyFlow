import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Bounce, ToastContainer } from "react-toastify";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "../_components/app-sidebar";
import { RoutePageHeader } from "../_components/route-page-header";
import { getSession } from "@/lib/data/session";
import { getProfile } from "@/lib/data/profile";
import { getAvatarUrl } from "@/lib/s3/avatar/avatar-url";

import { PageHeaderSkeleton } from "../_components/page-header-skeleton";

export const instant = false;

// nothing inside renders until the session check passes
async function AuthedContent({
  children,
  profile,
}: {
  children: React.ReactNode;
  profile: { firstName: string; lastName: string } | null;
}) {
  const session = await getSession();
  if (!session) redirect("/sign-in");

  const displayName = profile?.firstName || "there";
  const todayLabel = new Date().toLocaleDateString("en-GB", {
    timeZone: "Europe/London",
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

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const profileResult = await getProfile();
  const profile = profileResult.success ? profileResult.data : null;
  const firstName = profile?.firstName ?? "";
  const lastName = profile?.lastName ?? "";
  const name = `${firstName} ${lastName}`.trim() || "User";
  const initials =
    firstName || lastName
      ? `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase()
      : (session?.user.email[0]?.toUpperCase() ?? "U");

  //? signed per render, outside the cache: uploaded photo, then Google photo
  const avatarUrl =
    (await getAvatarUrl(profile?.image ?? null)) ?? session?.user.image;

  return (
    <SidebarProvider>
      <AppSidebar
        user={
          session
            ? {
                name,
                email: session.user.email,
                image: avatarUrl,
                initials,
              }
            : null
        }
      />
      <SidebarInset className="overflow-x-hidden">
        <Suspense fallback={<PageHeaderSkeleton />}>
          <AuthedContent profile={profile}>{children}</AuthedContent>
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
