"use client";

import * as React from "react";
import Link from "next/link";
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
import { StatusBadge } from "@/components/status-badge";
import { CompanyDetailSheet } from "@/components/companies/company-detail-sheet";
import type { Application, Company } from "@/lib/data";
import { MapPinIcon, SearchIcon, BriefcaseIcon } from "lucide-react";
import CompanyLogo from "@/app/_components/company-logo";

interface CompaniesGridProps {
  companies: Company[];
  applications: Application[];
}

export function CompaniesGrid({ companies, applications }: CompaniesGridProps) {
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState<Company | null>(null);

  const appsByCompany = React.useMemo(() => {
    const map = new Map<string, Application[]>();
    for (const app of applications) {
      const list = map.get(app.companyId) ?? [];
      list.push(app);
      map.set(app.companyId, list);
    }
    return map;
  }, [applications]);

  const filtered = companies.filter((c) => {
    const q = query.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.industry.toLowerCase().includes(q) ||
      c.location.toLowerCase().includes(q)
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
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </InputGroup>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((company) => {
          const apps = appsByCompany.get(company.id) ?? [];
          return (
            <Card key={company.id} className="flex flex-col">
              <CardHeader className="flex flex-row items-start gap-3">
                <CompanyLogo
                  name={company.name}
                  accent={company.accent}
                  className="size-11 text-base"
                />
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="truncate font-serif text-lg font-semibold leading-tight">
                    {company.name}
                  </span>
                  <span className="truncate text-sm text-muted-foreground">
                    {company.industry}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-3">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPinIcon className="size-4 shrink-0" />
                  <span className="truncate">{company.location}</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <BriefcaseIcon className="size-4 shrink-0" />
                  <span>
                    {apps.length} {apps.length === 1 ? "role" : "roles"} tracked
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {apps.slice(0, 3).map((app) => (
                    <StatusBadge key={app.id} status={app.status} />
                  ))}
                  {apps.length === 0 && (
                    <Badge variant="outline">No applications yet</Badge>
                  )}
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
                <Button
                  variant="ghost"
                  size="sm"
                  nativeButton={false}
                  render={<Link href="/applications" />}
                >
                  Roles
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

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
