import { cn } from "@/lib/utils";
import Image from "next/image";

type LogoProps = {
  className?: string;
};

export default function Logo({ className }: LogoProps) {
  return (
    <div className={cn("relative w-100 aspect-[3.89/1]", className)}>
      <Image
        src="/logo.png"
        alt="ApplyFlow"
        fill
        className="object-contain object-left"
        priority
      />
    </div>
  );
}
