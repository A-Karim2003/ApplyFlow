import { Suspense } from "react";

import { getProfile } from "@/lib/data/profile";
import { requireSession } from "@/lib/data/session";

import { AccountForm } from "./components/account-form";
import AccountSkeleton from "./components/skeleton/account-skeleton";

export default function AccountPage() {
  return (
    <div className="p-4 md:p-6">
      <Suspense fallback={<AccountSkeleton />}>
        <AccountContent />
      </Suspense>
    </div>
  );
}

async function AccountContent() {
  const [session, profileResult] = await Promise.all([
    requireSession(),
    getProfile(),
  ]);

  if (!profileResult.success)
    return <p className="text-sm text-destructive">{profileResult.error}</p>;

  const { firstName, lastName, bio } = profileResult.data;
  const initials =
    firstName || lastName
      ? `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase()
      : (session.user.email[0]?.toUpperCase() ?? "U");

  return (
    <AccountForm
      firstName={firstName}
      lastName={lastName}
      bio={bio ?? ""}
      email={session.user.email}
      image={session.user.image}
      initials={initials}
    />
  );
}
