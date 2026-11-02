"use client";

import Logo from "@/app/_components/logo";
import { useTheme } from "next-themes";

type BrandPanelProps = {
  headline?: string;
  subtext?: string;
};

export function BrandPanel({ headline, subtext }: BrandPanelProps) {
  const { resolvedTheme } = useTheme();
  return (
    <div className="relative hidden overflow-hidden bg-primary p-10 lg:flex lg:flex-col">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(currentColor 1.5px, transparent 1.5px)",
          backgroundSize: "22px 22px",
          color: "var(--color-primary-foreground)",
          opacity: 0.1,
        }}
      />

      <Logo theme={resolvedTheme == "dark" ? "dark" : "light"} />

      <div className="mt-auto mb-2 w-full text-center text-primary-foreground">
        <h2 className="text-3xl font-bold leading-tight text-balance">
          {headline}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-primary-foreground/80">
          {subtext}
        </p>
      </div>
    </div>
  );
}
