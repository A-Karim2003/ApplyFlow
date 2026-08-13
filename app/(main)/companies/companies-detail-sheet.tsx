"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

import type { Application, CompanyRecord } from "@/lib/data/companies";

import { StatusBadge } from "@/app/_components/status-badge";
import CompanyLogo from "@/app/_components/company-logo";

import {
  formatEnumLabel,
  formatLocation,
  formatSalaryRange,
} from "@/lib/utils";

import { ExternalLinkIcon, MapPinIcon, StickyNoteIcon } from "lucide-react";
import Link from "next/link";

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
                <MapPinIcon className="size-4 shrink-0" />
                <span className="truncate">
                  {formatLocation(company.location)}
                </span>
              </div>

              {company.website ? (
                <Link
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 hover:underline"
                >
                  <ExternalLinkIcon className="size-4 shrink-0" />
                  <span className="truncate">{company.website}</span>
                </Link>
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

                {applications.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No applications tracked for this company yet.
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {applications.map((app) => (
                      <Card
                        key={app.id}
                        className="flex items-center justify-between gap-3 p-3"
                      >
                        <div className="min-w-0 flex-1 space-y-1.5">
                          <div className="flex flex-col gap-0.5">
                            <span className="truncate text-sm font-medium">
                              {app.jobTitle}
                            </span>
                            <span className="truncate text-xs text-muted-foreground">
                              {formatSalaryRange(app.salaryMin, app.salaryMax)}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-1.5">
                            <Badge
                              variant="secondary"
                              className="gap-1 px-2 py-0.5 text-[11px] font-medium"
                            >
                              <span className="text-muted-foreground">
                                Type
                              </span>
                              {formatEnumLabel(app.jobType)}
                            </Badge>
                            <Badge
                              variant="secondary"
                              className="gap-1 px-2 py-0.5 text-[11px] font-medium"
                            >
                              <span className="text-muted-foreground">
                                Source
                              </span>
                              {formatEnumLabel(app.source)}
                            </Badge>
                            <Badge
                              variant="secondary"
                              className="gap-1 px-2 py-0.5 text-[11px] font-medium"
                            >
                              <span className="text-muted-foreground">
                                Mode
                              </span>
                              {formatEnumLabel(app.workMode)}
                            </Badge>
                          </div>
                        </div>

                        <StatusBadge status={app.status} />
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
