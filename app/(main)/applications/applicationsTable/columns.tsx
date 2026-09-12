"use client";

import {
  createColumnHelper,
  createPaginatedRowModel,
  rowPaginationFeature,
  tableFeatures,
} from "@tanstack/react-table";
import { type ApplicationWithCompany } from "@/lib/data/applications";
import { formatDate } from "@/lib/utils";

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
  }),
  columnHelper.accessor("company.name", {
    id: "company",
    header: "Company",
  }),
  columnHelper.accessor("application.status", {
    id: "status",
    header: "Status",
  }),
  columnHelper.accessor("application.appliedAt", {
    id: "dateApplied",
    header: "Date Applied",
    cell: (info) =>
      info.getValue() ? formatDate(info.getValue()!) : "Date not set",
  }),
  columnHelper.accessor("application.workMode", {
    id: "workMode",
    header: "Work Mode",
  }),
  columnHelper.accessor("application.location", {
    id: "location",
    header: "Location",
  }),
]);
