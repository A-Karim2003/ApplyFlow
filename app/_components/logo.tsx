import Image from "next/image";

export default function Logo() {
  return (
    <div className="relative w-100 aspect-[3.89/1]">
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
