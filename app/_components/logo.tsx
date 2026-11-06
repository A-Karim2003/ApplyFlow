"use client";

import { cn } from "@/lib/utils";
import { ThemedImage } from "./homepage/themed-image";

type LogoProps = {
  className?: string;
};

export default function Logo({ className }: LogoProps) {
  return (
    <div
      className={cn(
        "relative flex aspect-[3.89/1] w-100 items-center justify-center",
        className,
      )}
    >
      <ThemedImage
        lightSrc="/logo-light.png"
        darkSrc="/logo-dark.png"
        alt="ApplyFlow"
        width={915}
        height={272}
        darkWidth={984}
        darkHeight={253}
        sizes="250px"
      />
    </div>
  );
}
