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

import type { Application, Company } from "@/lib/data/companies";

import {
  MapPinIcon,
  SearchIcon,
  BriefcaseIcon,
  ExternalLinkIcon,
  PlusIcon,
} from "lucide-react";
import CompanyLogo from "@/app/_components/company-logo";

import { CompanyDetailSheet } from "./companies-detail-sheet";
import { StatusBadge } from "@/app/_components/status-badge";
import { formatEnumLabel, formatLocation } from "@/lib/utils";
import { useMemo, useState } from "react";
import { CompanyFormModal } from "./company-form-modal";

interface CompaniesGridProps {
  companies: Company[];
  applications: Application[];
}

export function CompaniesGrid({ companies, applications }: CompaniesGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCompany, setActiveCompany] = useState<Company | null>(null);

  const applicationsPerCompany = useMemo(() => {
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
      formatLocation(company.location).toLowerCase().includes(search)
    );
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center w-full">
        <InputGroup className="max-w-sm ">
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>

        <CompanyFormModal>
          <Button>
            <PlusIcon data-icon="inline-start" />
            Add company
          </Button>
        </CompanyFormModal>
      </div>

      {filteredCompanies.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCompanies.map((company) => {
            const applicationList =
              applicationsPerCompany.get(company.id) ?? [];

            const uniqueStatuses = [
              ...new Set(applicationList.map((app) => app.status)),
            ];

            return (
              <Card key={company.id} className="flex flex-col">
                <CardHeader className="flex flex-row items-start gap-3 pb-3">
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

                <CardContent className="flex flex-1 flex-col gap-2.5 pt-0">
                  {/* Location */}
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPinIcon className="size-4 shrink-0" />
                    <span className="truncate">
                      {formatLocation(company.location)}
                    </span>
                  </div>

                  {/* Website */}
                  {company.website && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <ExternalLinkIcon className="size-4 shrink-0" />
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noreferrer"
                        className="truncate underline-offset-4 hover:underline"
                      >
                        Visit website
                      </a>
                    </div>
                  )}

                  {/* Applications count*/}
                  <div className="flex items-center gap-1.5 text-sm">
                    <BriefcaseIcon className="size-4 shrink-0 text-muted-foreground" />
                    <span className="font-medium">
                      {applicationList.length}{" "}
                      {applicationList.length === 1
                        ? "application"
                        : "applications"}
                    </span>
                    <span className="text-muted-foreground">tracked</span>
                  </div>

                  {/* Status badges */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {uniqueStatuses.length > 0 ? (
                      <>
                        {uniqueStatuses.slice(0, 3).map((status) => (
                          <StatusBadge key={status} status={status} />
                        ))}
                        {uniqueStatuses.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{uniqueStatuses.length - 3}
                          </Badge>
                        )}
                      </>
                    ) : (
                      <Badge variant="outline">No applications yet</Badge>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="pt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setActiveCompany(company)}
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
        company={activeCompany}
        applications={
          activeCompany
            ? (applicationsPerCompany.get(activeCompany.id) ?? [])
            : []
        }
        open={activeCompany !== null}
        onOpenChange={(open) => {
          if (!open) setActiveCompany(null);
        }}
      />
    </div>
  );
}
