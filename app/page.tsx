import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Media, MediaFrame } from "./_components/homepage/media-frame";
import { ApplicationsTabs } from "./_components/homepage/applications-tabs";
import { ThemedImage } from "./_components/homepage/themed-image";
import ThemeToggle from "./_components/homepage/theme-toggle";

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
    media: {
      lightSrc: "/application_images/applications-kanban-light.png",
      darkSrc: "/application_images/applications-kanban-dark.png",
      alt: "Applications Kanban board",
      width: 1401,
      height: 1004,
    },
  },
  {
    label: "Companies",
    heading: "Keep every company in view.",
    body: "Keep company details alongside each application, instead of scattered across folders and inboxes.",
    bullets: [
      "One company record, many applications",
      "Company details available from every application",
      "Notes, links and deadlines in one place",
    ],
    media: {
      lightSrc: "/company_images/companies-light.png",
      darkSrc: "/company_images/companies-dark.png",
      alt: "Companies in ApplyFlow",
      width: 2800,
      height: 2000,
    },
  },
  {
    label: "Interviews",
    heading: "Never miss an interview.",
    body: "Schedule interviews when an application moves forward, and see what's coming up the moment you open your dashboard.",
    bullets: [
      "Schedule an interview from the application itself",
      "Upcoming interviews listed on your dashboard",
      "Every interview kept with its application",
    ],
    media: {
      lightSrc: "/interview_images/interviews-light.png",
      darkSrc: "/interview_images/interviews-dark.png",
      alt: "Scheduling an interview in ApplyFlow",
      width: 2800,
      height: 2000,
    },
  },
  {
    label: "Documents",
    heading: "Send the right documents every time.",
    body: "Keep the documents you sent alongside each application, instead of scattered across folders and inboxes.",
    bullets: [
      "Attach the CV and cover letter you used",
      "Keep documents with the application they belong to",
      "Notes, links and deadlines on every application",
    ],
    media: {
      lightSrc: "/document_images/documents-light.png",
      darkSrc: "/document_images/documents-dark.png",
      alt: "Documents in ApplyFlow",
      width: 2800,
      height: 2000,
    },
  },
];

const HERO_IMAGE: Media = {
  lightSrc: "/dashboard_images/dashboard-light.png",
  darkSrc: "/dashboard_images/dashboard-dark.png",
  alt: "ApplyFlow dashboard showing applications by status",
  width: 2800,
  height: 2000,
};

export default function Home() {
  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="mx-auto flex max-w-360 w-full items-center justify-between px-6 py-4">
          <Logo />
          <div className="flex items-center gap-2">
            <ThemeToggle />
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
          <div className="relative md:mb-[25%]">
            <div className="overflow-hidden rounded-xl border bg-card">
              <MediaFrame media={HERO_IMAGE} priority />
            </div>

            <div className="absolute z-10 -right-6 bottom-0 hidden w-[45%] translate-y-[70%] overflow-hidden rounded-xl border border-foreground/20 bg-card shadow-2xl md:block">
              <ThemedImage
                lightSrc="/dashboard_images/partial-dashboard-light.png"
                darkSrc="/dashboard_images/partial-dashboard-dark.png"
                alt="Additional dashboard details in ApplyFlow"
                width={2054}
                height={1599}
                sizes="45vw"
              />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-360 w-full px-6">
          {FEATURES.map((feature, index) => (
            <FeatureSection
              key={feature.label}
              feature={feature}
              flip={index % 2 === 1}
              mediaContent={index === 0 ? <ApplicationsTabs /> : undefined}
            />
          ))}
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex max-w-360 w-full items-center justify-between px-6 py-8 text-sm text-muted-foreground">
          <Logo />
        </div>
      </footer>
    </>
  );
}
