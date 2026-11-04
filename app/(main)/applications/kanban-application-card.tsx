import CompanyLogo from "@/app/_components/company-logo";
import { Card } from "@/components/ui/card";
import type { ApplicationWithCompany } from "@/lib/data/applications";
import { cn, formatDate } from "@/lib/utils";
import { MapPin, Calendar } from "lucide-react";

import { useDraggable } from "@dnd-kit/react";

export function KanbanApplicationCard({
  application,
  onOpenApplication,
}: {
  application: ApplicationWithCompany;
  onOpenApplication: (id: number) => void;
}) {
  const { application: app, company } = application;

  //? Create draggable elements
  const { isDragging, ref } = useDraggable({
    id: app.id,
    data: {
      status: application.application.status,
    },
  });

  return (
    <Card
      ref={ref}
      className={cn(
        "min-h-32 flex cursor-pointer flex-col justify-center gap-3 rounded-lg p-2 shadow-xs transition-shadow hover:shadow-sm",
        isDragging && "scale-105 rotate-2 shadow-lg",
      )}
      onClick={() => onOpenApplication(app.id)}
    >
      <div className="flex flex-col gap-2">
        <h3 className="text-pretty text-sm font-semibold leading-snug text-foreground">
          {app.jobTitle}
        </h3>
        <div className="flex items-center gap-2">
          <CompanyLogo
            name={company.name}
            className="size-6 rounded-md text-[0.6rem]"
          />
          <span className="truncate text-xs font-medium text-foreground/80">
            {company.name}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between border-t pt-2.5 text-xs text-muted-foreground">
        <span className="inline-flex min-w-0 items-center gap-1">
          <MapPin className="size-3.5 shrink-0" />
          <span className="truncate">{app.location ?? "Location not set"}</span>
        </span>
        <span className="inline-flex shrink-0 items-center gap-1">
          <Calendar className="size-3.5" />
          {app.appliedAt ? formatDate(app.appliedAt) : "Date not set"}
        </span>
      </div>
    </Card>
  );
}
