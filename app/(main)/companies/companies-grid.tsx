"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group";

import type { Application, CompanyRecord } from "@/lib/data/companies";

import { MapPinIcon, SearchIcon, BriefcaseIcon } from "lucide-react";
import CompanyLogo from "@/app/_components/company-logo";

import { CompanyDetailSheet } from "./companies-detail-sheet";
import { CompanyStatusBadge } from "./company-status-badge";
import { formatEnumLabel, formatLocation } from "@/lib/utils";
import { useMemo, useState } from "react";

interface CompaniesGridProps {
  companies: CompanyRecord[];
  applications: Application[];
}

export function CompaniesGrid({ companies, applications }: CompaniesGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [active, setActive] = useState<CompanyRecord | null>(null);

  const appsByCompany = useMemo(() => {
    const map = new Map<number, Application[]>();

    applications.forEach((application) => {
      const applicationList = map.get(application.companyId) ?? [];
      applicationList.push(application);
      map.set(application.companyId, applicationList);
    });

    return map;
  }, [applications]);

  const filteredCompanies = companies.filter((company) => {
    const search = searchQuery.toLowerCase();
    return (
      company.name.toLowerCase().includes(search) ||
      formatEnumLabel(company.industry).toLowerCase().includes(search) ||
      formatLocation(company.location).toLowerCase().includes(search) ||
      (company.website?.toLowerCase().includes(search) ?? false)
    );
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="max-w-sm">
        <InputGroup>
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>
      </div>

      {filteredCompanies.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCompanies.map((company) => {
            const applicationList = appsByCompany.get(company.id) ?? [];

            return (
              <Card key={company.id} className="flex flex-col">
                <CardHeader className="flex flex-row items-start gap-3">
                  <CompanyLogo
                    name={company.name}
                    className="size-11 text-base"
                  />
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="truncate font-serif text-lg font-semibold leading-tight">
                      {company.name}
                    </span>
                    <span className="truncate text-sm text-muted-foreground">
                      {formatEnumLabel(company.industry)}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col gap-3">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPinIcon className="size-4 shrink-0" />
                    <span className="truncate">
                      {formatLocation(company.location)}
                    </span>
                  </div>

                  {company.website ? (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <BriefcaseIcon className="size-4 shrink-0" />
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noreferrer"
                        className="truncate underline-offset-4 hover:underline"
                      >
                        {company.website}
                      </a>
                    </div>
                  ) : null}

                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <BriefcaseIcon className="size-4 shrink-0" />
                    <span>
                      {applicationList.length}{" "}
                      {applicationList.length === 1
                        ? "application"
                        : "applications"}{" "}
                      tracked
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {applicationList.slice(0, 3).map((app) => (
                      <CompanyStatusBadge key={app.id} status={app.status} />
                    ))}
                    {applicationList.length === 0 ? (
                      <Badge variant="outline">No applications yet</Badge>
                    ) : null}
                  </div>
                </CardContent>

                <CardFooter className="gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setActive(company)}
                  >
                    View details
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">
          No companies match your search yet.
        </div>
      )}

      <CompanyDetailSheet
        company={active}
        applications={active ? (appsByCompany.get(active.id) ?? []) : []}
        open={active !== null}
        onOpenChange={(open) => {
          if (!open) setActive(null);
        }}
      />
    </div>
  );
}
