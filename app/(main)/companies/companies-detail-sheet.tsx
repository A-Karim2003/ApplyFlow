"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

import type { Application, CompanyRecord } from "@/lib/data/companies";

import { CompanyStatusBadge } from "./company-status-badge";
import CompanyLogo from "@/app/_components/company-logo";

import {
  formatEnumLabel,
  formatLocation,
  formatSalaryRange,
} from "@/lib/utils";

import { ExternalLinkIcon, MapPinIcon, StickyNoteIcon } from "lucide-react";

interface CompanyDetailSheetProps {
  company: CompanyRecord | null;
  applications: Application[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CompanyDetailSheet({
  company,
  applications,
  open,
  onOpenChange,
}: CompanyDetailSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 sm:max-w-md">
        {company && (
          <>
            <SheetHeader>
              <div className="flex items-center gap-3">
                <CompanyLogo name={company.name} className="size-12 text-lg" />
                <div className="flex flex-col gap-0.5">
                  <SheetTitle className="font-serif text-xl">
                    {company.name}
                  </SheetTitle>
                  <SheetDescription>
                    {formatEnumLabel(company.industry)}
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>

            <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 pb-6">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPinIcon className="size-4" />
                {formatLocation(company.location)}
              </div>

              {company.website ? (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 hover:underline"
                >
                  <ExternalLinkIcon className="size-4" />
                  {company.website}
                </a>
              ) : null}

              {company.notes ? (
                <div className="flex flex-col gap-2">
                  <h3 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                    <StickyNoteIcon className="size-4" />
                    Notes
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {company.notes}
                  </p>
                </div>
              ) : null}

              <Separator />

              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-foreground">
                  Applications ({applications.length})
                </h3>
                <div className="flex flex-col gap-2">
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between rounded-lg border border-border bg-card p-3"
                    >
                      <div className="flex min-w-0 flex-col gap-0.5">
                        <span className="truncate text-sm font-medium">
                          {app.jobTitle}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                          {formatSalaryRange(app.salaryMin, app.salaryMax)}
                        </span>
                      </div>
                      <CompanyStatusBadge status={app.status} />
                    </div>
                  ))}
                  {applications.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No applications tracked for this company yet.
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
