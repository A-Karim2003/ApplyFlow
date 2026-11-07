"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { buttonVariants } from "@/components/ui/button";

//* Signature strip: your real statuses, one highlighted
const STATUSES = [
  "wishlist",
  "applied",
  "online assessment",
  "interview",
  "offer",
];
const HIGHLIGHTED_STATUS = "interview";

export function Hero({
  signUpHref,
  signInHref,
}: {
  signUpHref: string;
  signInHref: string;
}) {
  // scroll position relative to sectionRef
  const sectionRef = useRef<HTMLElement>(null);

  //? Scroll progress across this section: 0 at its top, 1 once it has left the viewport
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    //* - progress starts when top of the target meets top of the viewport
    //* - progress ends when bottom of the target meets top of the viewport
    offset: ["start start", "end start"],
  });

  //? Frame starts flat and slightly small, tilts back as you scroll
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 15]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);

  return (
    <section ref={sectionRef} className="overflow-hidden px-6 py-16 lg:py-24">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-10 text-center">
        <div className="space-y-5">
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-7xl">
            Track every application, from wishlist to offer.
          </h1>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
            A Kanban board for your applications, interview scheduling, and a
            dashboard that shows what needs your attention.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href={signUpHref} className={buttonVariants({ size: "lg" })}>
            Create account
          </Link>
          <Link
            href={signInHref}
            className={buttonVariants({ size: "lg", variant: "outline" })}
          >
            Sign in
          </Link>
        </div>

        <ol className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 font-mono text-xs text-muted-foreground">
          {STATUSES.map((status, index) => (
            <li key={status} className="flex items-center gap-2">
              {status === HIGHLIGHTED_STATUS && (
                <span className="size-1.5 rounded-full bg-primary" />
              )}
              <span
                className={
                  status === HIGHLIGHTED_STATUS ? "text-foreground" : ""
                }
              >
                {status}
              </span>
              {index < STATUSES.length - 1 && <span aria-hidden>→</span>}
            </li>
          ))}
        </ol>

        <div className="flex w-full justify-center perspective-[1500px]">
          <motion.div
            className="w-full overflow-hidden rounded-2xl border bg-card shadow-xl"
            style={{ transformOrigin: "center top", rotateX, scale }}
          >
            <video
              className="aspect-1920/1048 w-full"
              src="/demo/demo.mp4"
              poster="/demo/poster.jpg"
              controls
              playsInline
              preload="metadata"
              muted
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
