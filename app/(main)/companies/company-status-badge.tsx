import { Badge } from "@/components/ui/badge";
import type { CompanyApplicationStatus } from "@/lib/data/companies";

import { formatEnumLabel } from "@/lib/utils";

const STATUS_VARIANTS: Record<
  CompanyApplicationStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  wishlist: "outline",
  applied: "secondary",
  online_assessment: "secondary",
  interview: "default",
  offer: "default",
  rejected: "destructive",
};

export function CompanyStatusBadge({
  status,
}: {
  status: CompanyApplicationStatus;
}) {
  return (
    <Badge variant={STATUS_VARIANTS[status]}>{formatEnumLabel(status)}</Badge>
  );
}
