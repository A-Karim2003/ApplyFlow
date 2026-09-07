"use client";

import { STATUS_STYLES } from "@/app/_components/status-badge";
import {
  STATUS_OPTIONS,
  STATUS_COLUMN_STYLES,
} from "@/lib/constants/applications-status";

import { type UpdateApplicationProp } from "@/actions/applications";

import { cn } from "@/lib/utils";

import { type ApplicationWithCompany } from "@/lib/data/applications";
import { KanbanApplicationCard } from "./kanban-application-card";

type KanbanBoardProps = {
  applications: ApplicationWithCompany[];
  onMove: ({ id, newStatus }: UpdateApplicationProp) => void;
};

export default function KanbanBoard({
  applications,
  onMove,
}: KanbanBoardProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {STATUS_OPTIONS.map(({ value: status, label }) => {
        const items = applications.filter(
          (a) => a.application.status === status,
        );
        const columnStyle = STATUS_COLUMN_STYLES[status];

        return (
          // section represents a column for each status
          <section
            key={status}
            className={cn(
              "flex w-72 shrink-0 flex-col overflow-hidden rounded-xl border transition-shadow",
              columnStyle.border,
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
                {items.length}
              </span>
            </header>

            <div
              className={cn(
                "flex min-h-112 flex-1 flex-col gap-2.5 p-3 transition-colors",
                columnStyle.body,
              )}
            >
              {items.length > 0 ? (
                items.map((item) => (
                  <KanbanApplicationCard
                    key={item.application.id}
                    application={item}
                  />
                ))
              ) : (
                <div
                  className={cn(
                    "flex flex-col items-center justify-center gap-0.5 rounded-lg border border-dashed py-6 text-center transition-colors",
                    columnStyle.dropBorder,
                    "text-muted-foreground/70",
                  )}
                >
                  <span className="text-sm font-medium">Drop jobs here</span>
                  <span className="text-xs">or drag a card to update</span>
                </div>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
