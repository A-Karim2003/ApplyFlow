"use client";

import {
  createColumnHelper,
  createPaginatedRowModel,
  rowPaginationFeature,
  tableFeatures,
  metaHelper,
} from "@tanstack/react-table";
import { type ApplicationWithCompany } from "@/lib/data/applications";
import { type UpdateApplicationProp } from "@/actions/applications/applications";

import { cn, formatDate, formatEnumLabel } from "@/lib/utils";
import { STATUS_STYLES, StatusBadge } from "@/app/_components/status-badge";
import CompanyLogo from "@/app/_components/company-logo";
import {
  STATUS_OPTIONS,
  type ApplicationStatus,
} from "@/lib/constants/applications";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

type ApplicationTableMeta = {
  onStatusChange: (props: UpdateApplicationProp) => void;
  onOpenApplication: (id: number) => void;
};

export const features = tableFeatures({
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
  tableMeta: metaHelper<ApplicationTableMeta>(),
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
    cell: (info) => {
      const status = info.getValue();
      const applicationId = info.row.original.application.id;
      const onStatusChange = info.table.options.meta?.onStatusChange;

      return (
        <div onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  className={cn(
                    "flex w-40 cursor-pointer items-center justify-between rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap",
                    STATUS_STYLES[status].pill,
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        "size-1.5 rounded-full",
                        STATUS_STYLES[status].dot,
                      )}
                      aria-hidden
                    />
                    {formatEnumLabel(status)}
                  </span>
                  <ChevronDown className="size-3.5 shrink-0 opacity-70" />
                </button>
              }
            />
            <DropdownMenuContent align="start">
              {STATUS_OPTIONS.map(({ value }) => (
                <DropdownMenuItem
                  key={value}
                  disabled={value === status}
                  onClick={() =>
                    onStatusChange?.({ id: applicationId, newStatus: value })
                  }
                >
                  {" "}
                  <StatusBadge status={value as ApplicationStatus} />{" "}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
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
