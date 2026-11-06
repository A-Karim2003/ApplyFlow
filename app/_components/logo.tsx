import Image from "next/image";
import { cn } from "@/lib/utils";

export default function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("w-56", className)}>
      <Image
        src="/logo-dark.png"
        alt="ApplyFlow"
        width={984}
        height={253}
        sizes="400px"
        quality={100}
        className="h-auto w-full dark:hidden"
      />
      <Image
        src="/logo-light.png"
        alt="ApplyFlow"
        width={915}
        height={272}
        sizes="400px"
        quality={100}
        className="hidden h-auto w-full dark:block"
      />
    </div>
  );
}
