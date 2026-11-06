"use client";

import { useRef } from "react";
import type { ReactNode } from "react";
import { motion, useInView } from "motion/react";
import { Check } from "lucide-react";
import { MediaFrame, type Media } from "./media-frame";

export type Feature = {
  label: string;
  heading: string;
  body: string;
  bullets: string[];
  media: Media;
};

export function FeatureSection({
  feature,
  flip,
  mediaContent,
}: {
  feature: Feature;
  flip: boolean;
  mediaContent?: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  //* Check if the element is in view by 10%
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <article
      ref={ref}
      className="grid items-center gap-10 border-t py-16 lg:grid-cols-2 lg:gap-16 lg:py-24"
    >
      <motion.div
        initial={{ opacity: 0, x: flip ? 40 : -40 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`space-y-5 ${flip ? "lg:order-2" : ""}`}
      >
        <span className="inline-block rounded-full border bg-muted px-3 py-1 text-xs tracking-wider text-muted-foreground uppercase">
          {feature.label}
        </span>
        <h2 className="font-serif text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {feature.heading}
        </h2>
        <p className="max-w-md text-muted-foreground">{feature.body}</p>
        <ul className="space-y-3">
          {feature.bullets.map((bullet) => (
            <li
              key={bullet}
              className="flex items-start gap-3 text-sm text-muted-foreground"
            >
              <Check className="mt-0.5 size-4 shrink-0" />
              {bullet}
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: flip ? -40 : 40 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.08 }}
        className={flip ? "lg:order-1" : ""}
      >
        {mediaContent ?? (
          <MediaFrame
            media={feature.media}
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        )}
      </motion.div>
    </article>
  );
}
