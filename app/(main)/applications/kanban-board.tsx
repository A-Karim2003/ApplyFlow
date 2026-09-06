"use client";

import * as React from "react";
import { STATUS_STYLES } from "@/app/_components/status-badge";
import {
  STATUS_OPTIONS,
  STATUS_COLUMN_STYLES,
  type ApplicationStatus,
} from "@/lib/constants/applications-status";

import { type UpdateApplicationProp } from "@/actions/applications";

import { cn } from "@/lib/utils";

import {
  type ApplicationWithCompany,
  type Application,
} from "@/lib/data/applications";
import { KanbanApplicationCard } from "./kanban-application-card";

type KanbanBoardProps = {
  applications: ApplicationWithCompany[];
  onMove: ({ id, newStatus }: UpdateApplicationProp) => void;
};

export default function KanbanBoard({
  applications,
  onMove,
}: KanbanBoardProps) {
  const [dragOver, setDragOver] = React.useState<ApplicationStatus | null>(
    null,
  );
  const [draggingId, setDraggingId] = React.useState<Application["id"] | null>(
    null,
  );

  function handleDrop(status: ApplicationStatus) {
    if (draggingId != null) onMove(draggingId, status);
    setDraggingId(null);
    setDragOver(null);
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {STATUS_OPTIONS.map(({ value: status, label }) => {
        const items = applications.filter(
          (a) => a.application.status === status,
        );
        const columnStyle = STATUS_COLUMN_STYLES[status];
        const isOver = dragOver === status;

        return (
          <section
            key={status}
            onDragOver={(e) => {
              e.preventDefault();
              if (dragOver !== status) setDragOver(status);
            }}
            onDragLeave={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                setDragOver((current) => (current === status ? null : current));
              }
            }}
            onDrop={() => handleDrop(status)}
            className={cn(
              "flex w-72 shrink-0 flex-col overflow-hidden rounded-xl transition-shadow",
              isOver &&
                cn(
                  "ring-2 ring-offset-2 ring-offset-background",
                  columnStyle.ring,
                ),
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
                isOver ? columnStyle.bodyOver : columnStyle.body,
              )}
            >
              {items.length > 0 ? (
                items.map((item) => (
                  <div
                    key={item.application.id}
                    draggable
                    onDragStart={() => setDraggingId(item.application.id)}
                    onDragEnd={() => {
                      setDraggingId(null);
                      setDragOver(null);
                    }}
                    className={cn(
                      "transition-opacity",
                      draggingId === item.application.id && "opacity-40",
                    )}
                  >
                    <KanbanApplicationCard application={item} />
                  </div>
                ))
              ) : (
                <div
                  className={cn(
                    "flex flex-col items-center justify-center gap-0.5 rounded-lg border border-dashed py-6 text-center transition-colors",
                    isOver
                      ? columnStyle.dropBorderOver
                      : columnStyle.dropBorder,
                    isOver ? "text-foreground/70" : "text-muted-foreground/70",
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
