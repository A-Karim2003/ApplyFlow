import { Skeleton } from "@/components/ui/skeleton";

// varied card counts per column so it reads as a board, not a grid of clones
const COLUMN_CARD_COUNTS = [2, 3, 2, 1, 1, 1];

export default function Loading() {
  return (
    <section
      className="flex flex-col"
      aria-busy="true"
      aria-label="Loading applications"
    >
      <div className="px-4 pb-8 pt-6 md:px-8">
        <div className="flex flex-col gap-5">
          {/* toolbar:  */}
          <div className="flex flex-col gap-3 border-y py-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
              <Skeleton className="h-9 w-full sm:max-w-xs" />
              <Skeleton className="h-9 w-full sm:w-55" />
              <Skeleton className="h-9 w-full sm:w-55" />
              <Skeleton className="h-9 w-full sm:w-55" />
              <Skeleton className="h-9 w-full sm:w-40" />
            </div>
            <Skeleton className="h-9 w-full sm:w-48" />
          </div>

          {/* kanban: horizontally scrolling columns, same as KanbanBoard */}
          <div className="flex gap-4 overflow-x-auto p-1 pb-4">
            {COLUMN_CARD_COUNTS.map((cardCount, column) => (
              <div
                key={column}
                className="flex w-72 shrink-0 flex-col gap-3 rounded-xl border p-3"
              >
                <Skeleton className="h-5 w-24" />
                {Array.from({ length: cardCount }).map((_, card) => (
                  <Skeleton key={card} className="h-24 w-full rounded-lg" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
