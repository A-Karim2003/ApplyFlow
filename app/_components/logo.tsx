"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

type LogoProps = {
  className?: string;
  theme?: "light" | "dark";
};

export default function Logo({ className, theme }: LogoProps) {
  return (
    <div className={cn("relative w-100 aspect-[3.89/1]", className)}>
      <Image
        src={`/logo-${theme || "light"}.png`}
        alt="ApplyFlow"
        fill
        className="object-contain object-left"
        priority
      />
    </div>
  );
}
