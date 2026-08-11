import { cn } from "@/lib/utils";
import { initials } from "@/lib/utils";

export default function CompanyLogo({
  name,
  accent,
  className,
}: {
  name: string;
  accent?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-lg text-sm font-semibold text-primary-foreground",
        className,
      )}
      style={{
        backgroundColor: accent ?? "var(--primary)",
      }}
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}
