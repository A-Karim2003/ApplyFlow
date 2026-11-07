import Image from "next/image";

type ThemedImageProps = {
  lightSrc: string;
  darkSrc: string;
  alt: string;
  width: number;
  height: number;
  darkWidth?: number;
  darkHeight?: number;
  priority?: boolean;
  sizes?: string;
};

export function ThemedImage({
  lightSrc,
  darkSrc,
  alt,
  width,
  height,
  darkWidth = width,
  darkHeight = height,
  priority = false,
  sizes = "100vw",
}: ThemedImageProps) {
  return (
    <>
      <Image
        src={lightSrc}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        preload={priority}
        className="h-auto w-full dark:hidden"
      />
      <Image
        src={darkSrc}
        alt={alt}
        width={darkWidth}
        height={darkHeight}
        sizes={sizes}
        className="hidden h-auto w-full dark:block"
      />
    </>
  );
}
