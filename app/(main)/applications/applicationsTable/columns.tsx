"use client";

import {
  createColumnHelper,
  createPaginatedRowModel,
  rowPaginationFeature,
  tableFeatures,
} from "@tanstack/react-table";
import { type ApplicationWithCompany } from "@/lib/data/applications";
import { formatDate, formatEnumLabel } from "@/lib/utils";
import { StatusBadge } from "@/app/_components/status-badge";
import CompanyLogo from "@/app/_components/company-logo";

export const features = tableFeatures({
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
});

const columnHelper = createColumnHelper<
  typeof features,
  ApplicationWithCompany
>();

export const columns = columnHelper.columns([
  columnHelper.accessor("application.jobTitle", {
    id: "jobTitle",
    header: "Job Title",
    cell: (info) => (
      <span className="font-medium text-foreground">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor("company.name", {
    id: "company",
    header: "Company",
    cell: (info) => (
      <span className="flex items-center gap-2">
        <CompanyLogo
          name={info.getValue()}
          className="size-6 rounded-md text-[0.6rem]"
        />
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("application.status", {
    id: "status",
    header: "Status",
    cell: (info) => <StatusBadge status={info.getValue()} />,
  }),
  columnHelper.accessor("application.appliedAt", {
    id: "dateApplied",
    header: "Date Applied",
    cell: (info) => (
      <span className="tabular-nums text-muted-foreground">
        {info.getValue() ? formatDate(info.getValue()!) : "Date not set"}
      </span>
    ),
  }),
  columnHelper.accessor("application.workMode", {
    id: "workMode",
    header: "Work Mode",
    cell: (info) => {
      const value = info.getValue();
      return (
        <span className="text-muted-foreground">
          {value ? formatEnumLabel(value) : "Not set"}
        </span>
      );
    },
  }),
  columnHelper.accessor("application.location", {
    id: "location",
    header: "Location",
    cell: (info) => (
      <span className="text-muted-foreground">
        {info.getValue() ?? "Location not set"}
      </span>
    ),
  }),
]);
