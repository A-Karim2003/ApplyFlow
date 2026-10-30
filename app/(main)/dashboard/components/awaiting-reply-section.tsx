import { getAwaitingReply } from "@/lib/data/dashboard/sections/awaiting-reply";

import { SectionError } from "./section-error";
import { AwaitingReply } from "./awaiting-reply";

export async function AwaitingReplySection() {
  const result = await getAwaitingReply();
  if (!result.success) return <SectionError message={result.error} />;

  return <AwaitingReply applications={result.data} />;
}
