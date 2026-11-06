import { ThemedImage } from "./themed-image";

export type Media = {
  lightSrc: string;
  darkSrc: string;
  alt: string;
  width: number;
  height: number;
  darkWidth?: number;
  darkHeight?: number;
};

export type MediaFrameProps = {
  media: Media;
  priority?: boolean;
  sizes?: string;
};

export function MediaFrame({
  priority = false,
  media,
  sizes,
}: MediaFrameProps) {
  return (
    <div className="overflow-hidden rounded-xl shadow-md bg-card">
      <ThemedImage
        lightSrc={media.lightSrc}
        darkSrc={media.darkSrc}
        alt={media.alt}
        width={media.width}
        height={media.height}
        darkWidth={media.darkWidth}
        darkHeight={media.darkHeight}
        priority={priority}
        sizes={sizes}
      />
    </div>
  );
}
