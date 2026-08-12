"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/status-badge";
import type { Application, Company } from "@/lib/data";
import { MapPinIcon, StickyNoteIcon } from "lucide-react";
import CompanyLogo from "@/app/_components/company-logo";

interface CompanyDetailSheetProps {
  company: Company | null;
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
                <CompanyLogo
                  name={company.name}
                  accent={company.accent}
                  className="size-12 text-lg"
                />
                <div className="flex flex-col gap-0.5">
                  <SheetTitle className="font-serif text-xl">
                    {company.name}
                  </SheetTitle>
                  <SheetDescription>{company.industry}</SheetDescription>
                </div>
              </div>
            </SheetHeader>

            <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 pb-6">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPinIcon className="size-4" />
                {company.location}
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-foreground">
                  Roles ({applications.length})
                </h3>
                <div className="flex flex-col gap-2">
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between rounded-lg border border-border bg-card p-3"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium">
                          {app.jobTitle}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {app.salary}
                        </span>
                      </div>
                      <StatusBadge status={app.status} />
                    </div>
                  ))}
                  {applications.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No applications tracked for this company yet.
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              <div className="flex flex-col gap-2">
                <h3 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                  <StickyNoteIcon className="size-4" />
                  Notes
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {company.notes}
                </p>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
