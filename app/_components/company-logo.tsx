import { cn } from "@/lib/utils";
import { initials } from "@/lib/utils";

function getColorForName(name: string) {
  const firstChar = name.trim().charAt(0).toUpperCase();
  const charCode = firstChar.charCodeAt(0);

  // A-Z → 0-25. Anything outside that range (numbers, symbols, empty) falls back to a fixed hue.
  const isLetter = charCode >= 65 && charCode <= 90;
  const index = isLetter ? charCode - 65 : 0;

  const hue = (index * 360) / 26;

  return `oklch(0.55 0.13 ${hue})`;
}

export default function CompanyLogo({
  name,
  accent,
  className,
}: {
  name: string;
  accent?: string;
  className?: string;
}) {
  const backgroundColor = accent ?? getColorForName(name);

  return (
    <span
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-lg text-sm font-semibold text-primary-foreground",
        className,
      )}
      style={{
        backgroundColor,
      }}
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}
