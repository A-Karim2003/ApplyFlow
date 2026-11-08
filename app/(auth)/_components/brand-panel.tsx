"use client";

import Image from "next/image";
import Link from "next/link";

type BrandPanelProps = {
  headline?: string;
  subtext?: string;
};

export function BrandPanel({ headline, subtext }: BrandPanelProps) {
  return (
    <div className="relative hidden overflow-hidden bg-primary p-10 lg:flex lg:flex-col dark:bg-brand-primary">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 text-primary-foreground dark:text-brand-primary-foreground"
        style={{
          backgroundImage:
            "radial-gradient(currentColor 1.5px, transparent 1.5px)",
          backgroundSize: "22px 22px",
          opacity: 0.3,
        }}
      />

      <Link href="/" aria-label="ApplyFlow homepage">
        <div className="aspect-984/253 ">
          <Image
            src="/logo-light.png"
            alt="ApplyFlow"
            width={915}
            height={272}
            sizes="400px"
            quality={100}
            className="h-auto w-full"
          />
        </div>
      </Link>

      <div className="mt-auto mb-2 w-full text-center text-primary-foreground dark:text-brand-primary-foreground">
        <h2 className="text-3xl font-bold leading-tight text-balance">
          {headline}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-primary-foreground/80 dark:text-brand-primary-foreground/80">
          {subtext}
        </p>
      </div>
    </div>
  );
}
