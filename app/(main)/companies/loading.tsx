import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// varied text and badge widths across cards so it reads as real company data
const SKELETON_CARDS = [
  {
    nameWidth: "w-32",
    industryWidth: "w-20",
    badges: ["w-16", "w-20", "w-14"],
  },
  { nameWidth: "w-40", industryWidth: "w-28", badges: ["w-20", "w-16"] },
  {
    nameWidth: "w-28",
    industryWidth: "w-24",
    badges: ["w-14", "w-24", "w-18"],
  },
  { nameWidth: "w-36", industryWidth: "w-16", badges: ["w-28"] },
  { nameWidth: "w-32", industryWidth: "w-24", badges: ["w-18", "w-16"] },
  {
    nameWidth: "w-44",
    industryWidth: "w-32",
    badges: ["w-20", "w-14", "w-16"],
  },
];

export default function Loading() {
  return (
    <section
      className="flex flex-col"
      aria-busy="true"
      aria-label="Loading companies"
    >
      {/* same outer padding as CompaniesPage */}
      <div className="px-4 pb-8 pt-6 md:px-8">
        <div className="flex flex-col gap-6">
          {/* toolbar: search input + Add company button */}
          <div className="flex w-full items-center justify-between">
            <Skeleton className="h-9 w-full max-w-sm" />
            <Skeleton className="h-9 w-32" />
          </div>

          {/* 3-column grid matching CompaniesGrid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SKELETON_CARDS.map((card, index) => (
              <Card key={index} className="flex flex-col">
                {/* Header: Company logo avatar + name & industry */}
                <CardHeader className="flex flex-row items-start gap-3 pb-3">
                  <Skeleton className="size-11 shrink-0 rounded-lg" />
                  <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <Skeleton className={`h-5 ${card.nameWidth}`} />
                    <Skeleton className={`h-4 ${card.industryWidth}`} />
                  </div>
                </CardHeader>

                {/* Content: Location, Website, Tracked Count, Status Badges */}
                <CardContent className="flex flex-1 flex-col gap-2.5 pt-0">
                  {/* Location row */}
                  <div className="flex items-center gap-1.5">
                    <Skeleton className="size-4 shrink-0 rounded-xs" />
                    <Skeleton className="h-4 w-28" />
                  </div>

                  {/* Website row */}
                  <div className="flex items-center gap-1.5">
                    <Skeleton className="size-4 shrink-0 rounded-xs" />
                    <Skeleton className="h-4 w-24" />
                  </div>

                  {/* Applications tracked count */}
                  <div className="flex items-center gap-1.5">
                    <Skeleton className="size-4 shrink-0 rounded-xs" />
                    <Skeleton className="h-4 w-36" />
                  </div>

                  {/* Status badges */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {card.badges.map((badgeWidth, bIndex) => (
                      <Skeleton
                        key={bIndex}
                        className={`h-5 ${badgeWidth} rounded-full`}
                      />
                    ))}
                  </div>
                </CardContent>

                {/* Footer: View details button */}
                <CardFooter className="pt-3">
                  <Skeleton className="h-8 w-full rounded-md" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
