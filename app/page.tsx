import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Media, MediaFrame } from "./_components/homepage/media-frame";

import { Hero } from "./_components/homepage/hero";
import {
  Feature,
  FeatureSection,
} from "./_components/homepage/feature-section";
import Logo from "./_components/logo";

const FEATURES: Feature[] = [
  {
    label: "Applications",
    heading: "See your whole search at a glance.",
    body: "Every application sits on one board, from wishlist to offer. Drag a card to move it and the change is logged automatically.",
    bullets: [
      "Drag and drop between status columns",
      "Every status change recorded with its date",
      "Filter and sort without leaving the board",
    ],
    media: { src: "", alt: "Kanban board", width: 1400, height: 900 },
  },
  {
    label: "Interviews",
    heading: "Never lose an interview date.",
    body: "Schedule interviews against an application and see what's coming up on your dashboard, with the type and interviewer attached.",
    bullets: [
      "Schedule from any application",
      "Upcoming interviews surfaced on the dashboard",
      "Record the outcome once it's done",
    ],
    media: {
      src: "",
      alt: "Interview scheduling modal",
      width: 1400,
      height: 900,
    },
  },
  {
    label: "Dashboard",
    heading: "Know what's gone quiet.",
    body: "See how many applications you've sent, where they stand, and which ones are still waiting for a reply.",
    bullets: [
      "Applications over time for any date range",
      "Status breakdown at a glance",
      "A list of applications awaiting a reply",
    ],
    media: { src: "", alt: "Dashboard", width: 1400, height: 900 },
  },
  {
    label: "Companies and documents",
    heading: "Everything for each application, in one place.",
    body: "Keep company details and the documents you sent alongside each application, instead of scattered across folders and inboxes.",
    bullets: [
      "One company record, many applications",
      "Attach the CV and cover letter you used",
      "Notes, links and deadlines on every application",
    ],
    media: {
      src: "",
      alt: "Application details",
      width: 1400,
      height: 900,
    },
  },
];

//TODO: Hero screenshot (Kanban board).

const HERO_IMAGE: Media = {
  src: "",
  alt: "ApplyFlow applications board",
  width: 1600,
  height: 1000,
};

export default function Home() {
  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="mx-auto flex max-w-360 w-full items-center justify-between px-6 py-4">
          <Logo />
          <div className="flex items-center gap-2">
            <Link
              href={"/sign-in"}
              className={buttonVariants({ variant: "ghost" })}
            >
              Sign in
            </Link>
            <Link href={"/sign-up"} className={buttonVariants()}>
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-x-hidden">
        <Hero signUpHref={"/sign-up"} signInHref={"/sign-in"} />

        <section className="mx-auto max-w-360 w-full px-6 pb-16">
          <MediaFrame media={HERO_IMAGE} />
        </section>

        <section className="mx-auto max-w-360 w-full px-6">
          {FEATURES.map((feature, index) => (
            <FeatureSection
              key={feature.label}
              feature={feature}
              flip={index % 2 === 1}
            />
          ))}
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex max-w-360 w-full items-center justify-between px-6 py-8 text-sm text-muted-foreground">
          <span>ApplyFlow</span>
        </div>
      </footer>
    </>
  );
}
