"use client";

import {
  STATUS_OPTIONS,
  ApplicationStatus,
} from "@/lib/constants/applications-status";

import { type UpdateApplicationProp } from "@/actions/applications/applications";

import { type ApplicationWithCompany } from "@/lib/data/applications";

import KanbanColumn from "./kanban-column";
import { DragDropProvider } from "@dnd-kit/react";

type KanbanBoardProps = {
  applications: ApplicationWithCompany[];
  onMove: ({ id, newStatus }: UpdateApplicationProp) => void;
  onOpenApplication: (id: number) => void;
};

export default function KanbanBoard({
  applications,
  onMove,
  onOpenApplication,
}: KanbanBoardProps) {
  const applicationsByStatus = applications.reduce(
    (groups, application) => {
      const status = application.application.status;

      //* initalises group based on status
      if (!groups[status]) groups[status] = [];

      groups[status].push(application);

      return groups;
    },
    {} as Record<ApplicationStatus, ApplicationWithCompany[]>,
  );

  return (
    <DragDropProvider
      onDragEnd={(event) => {
        if (event.canceled) return;

        const applicationId = Number(event.operation.source?.id);
        const applicationStatus = event.operation.source?.data?.status;
        const columnStatus = event.operation.target?.id as ApplicationStatus;

        /*
        When application card is dropped, check if target is a 
        valid droppable target and different from the current status of the application.

        */
        if (
          !applicationId ||
          !columnStatus ||
          applicationStatus === columnStatus
        )
          return;

        onMove({ id: applicationId, newStatus: columnStatus });
      }}
    >
      <div className="column-grid-container p-1 pb-4 ">
        {" "}
        {STATUS_OPTIONS.map(({ value: status, label }) => (
          <KanbanColumn
            key={status}
            status={status}
            label={label}
            applications={applicationsByStatus[status] ?? []}
            onOpenApplication={onOpenApplication}
          />
        ))}
      </div>
    </DragDropProvider>
  );
}
