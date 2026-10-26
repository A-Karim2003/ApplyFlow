"use client";

import { useDroppable } from "@dnd-kit/react";
import { STATUS_STYLES } from "@/app/_components/status-badge";
import {
  STATUS_COLUMN_STYLES,
  type ApplicationStatus,
} from "@/lib/constants/applications";
import { cn } from "@/lib/utils";
import type { ApplicationWithCompany } from "@/lib/data/applications";
import { KanbanApplicationCard } from "./kanban-application-card";

type KanbanColumnProp = {
  status: ApplicationStatus;
  label: string;
  applications: ApplicationWithCompany[];
  onOpenApplication: (id: number) => void;
};

export default function KanbanColumn({
  status,
  label,
  applications,
  onOpenApplication,
}: KanbanColumnProp) {
  //? Create droppable elements
  const { isDropTarget, ref } = useDroppable({ id: status });
  const columnStyle = STATUS_COLUMN_STYLES[status];

  return (
    <section
      ref={ref}
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border transition-shadow column-grid-item",
        columnStyle.border,
        isDropTarget &&
          cn("ring-2 ring-offset-2 ring-offset-background", columnStyle.ring),
      )}
    >
      <header
        className={cn(
          "flex items-center gap-2 px-4 py-2.5",
          columnStyle.header,
        )}
      >
        <span
          className={cn("size-2 rounded-full", STATUS_STYLES[status].dot)}
          aria-hidden
        />
        <span className="text-xs font-semibold uppercase tracking-wide text-foreground/80">
          {label}
        </span>
        <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-card px-1.5 text-xs font-semibold tabular-nums text-muted-foreground shadow-xs">
          {applications.length}
        </span>
      </header>

      {/* Card list */}
      <div
        className={cn(
          "flex min-h-125 flex-1 flex-col gap-2.5 p-3 transition-colors max-h-150 h-full overflow-scroll",
          isDropTarget ? columnStyle.bodyOver : columnStyle.body,
        )}
      >
        {applications.length > 0 ? (
          applications.map((item) => (
            <KanbanApplicationCard
              key={item.application.id}
              application={item}
              onOpenApplication={onOpenApplication}
            />
          ))
        ) : (
          <div
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 rounded-lg border border-dashed py-6 text-center transition-colors",
              isDropTarget
                ? columnStyle.dropBorderOver
                : columnStyle.dropBorder,
              isDropTarget ? "text-foreground/70" : "text-muted-foreground/70",
            )}
          >
            <span className="text-sm font-medium">Drop jobs here</span>
            <span className="text-xs">Add one with “+ Add application”</span>
          </div>
        )}
      </div>
    </section>
  );
}
