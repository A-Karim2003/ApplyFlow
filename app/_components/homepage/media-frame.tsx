import Image from "next/image";

export type Media = {
  src?: string;
  alt: string;
  width: number;
  height: number;
};

export type MediaFrameProps = {
  media: Media;
  priority?: boolean;
};

//* Renders the real image when src is set, otherwise a sized placeholder
export function MediaFrame({ priority = false, media }: MediaFrameProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      {media.src ? (
        <Image
          src={media.src}
          alt={media.alt}
          width={media.width}
          height={media.height}
          priority={priority}
          className="h-auto w-full"
        />
      ) : (
        <div
          className="flex flex-col items-center justify-center gap-1 bg-muted text-sm text-muted-foreground"
          style={{ aspectRatio: `${media.width} / ${media.height}` }}
        >
          <span>{media.alt}</span>
          <span className="text-xs">
            {media.width} × {media.height}
          </span>
        </div>
      )}
    </div>
  );
}
