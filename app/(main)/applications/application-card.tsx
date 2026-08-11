import CompanyLogo from "@/app/_components/company-logo";
import { companies, type Application } from "@/lib/data";
import { MapPin, Calendar } from "lucide-react";

//TODO: get Application from infered types.
//TODO: get company from DB
export function ApplicationCard({ application }: { application: Application }) {
  const company = companies.find((c) => c.id === application.companyId);

  return (
    <article className="group flex cursor-grab flex-col gap-3 rounded-lg border bg-card p-3 shadow-xs transition-shadow hover:shadow-sm active:cursor-grabbing">
      <div className="flex flex-col gap-2">
        <h3 className="text-pretty text-sm font-semibold leading-snug text-foreground">
          {application.jobTitle}
        </h3>
        <div className="flex items-center gap-2">
          <CompanyLogo
            name={application.company}
            accent={company?.accent}
            className="size-6 rounded-md text-[0.6rem]"
          />
          <span className="truncate text-xs font-medium text-foreground/80">
            {application.company}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between border-t pt-2.5 text-xs text-muted-foreground">
        <span className="inline-flex min-w-0 items-center gap-1">
          <MapPin className="size-3.5 shrink-0" />
          <span className="truncate">{application.location}</span>
        </span>
        <span className="inline-flex shrink-0 items-center gap-1">
          <Calendar className="size-3.5" />
          {application.dateApplied}
        </span>
      </div>
    </article>
  );
}
