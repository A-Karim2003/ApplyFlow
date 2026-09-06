// components/applications/kanban-application-card.tsx
import CompanyLogo from "@/app/_components/company-logo";
import type { ApplicationWithCompany } from "@/lib/data/applications";
import { formatDate } from "@/lib/utils";
import { MapPin, Calendar } from "lucide-react";

export function KanbanApplicationCard({
  application,
}: {
  application: ApplicationWithCompany;
}) {
  const { application: app, company } = application;

  return (
    <article className="group flex cursor-grab flex-col gap-3 rounded-lg border bg-card p-3 shadow-xs transition-shadow hover:shadow-sm active:cursor-grabbing">
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
    </article>
  );
}
