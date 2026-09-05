"use client";

import { useState } from "react";
import { LayoutGrid, List, Search } from "lucide-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  APPLICATION_JOB_TYPE_FILTER,
  APPLICATION_SORT_OPTIONS,
  APPLICATION_STATUS_FILTER,
  APPLICATION_WORK_MODE_FILTER,
  type ApplicationSortKey,
  type ApplicationStatus,
  type JobType,
  type WorkMode,
} from "@/lib/constants";

type ApplicationFilters = {
  status: ApplicationStatus | "all";
  jobType: JobType | "all";
  workMode: WorkMode | "all";
};

const FILTER_CONFIGS = [
  { key: "status", ...APPLICATION_STATUS_FILTER },
  { key: "jobType", ...APPLICATION_JOB_TYPE_FILTER },
  { key: "workMode", ...APPLICATION_WORK_MODE_FILTER },
] as const satisfies {
  key: keyof ApplicationFilters;
  label: string;
  options: { label: string; value: string }[];
}[];

export function ApplicationsWorkspace() {
  const [query, setQuery] = useState<string>("");
  const [filters, setFilters] = useState<ApplicationFilters>({
    status: "all",
    jobType: "all",
    workMode: "all",
  });

  const [sort, setSort] = useState<ApplicationSortKey>("recent");

  return (
    <Tabs defaultValue="kanban" className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 border-y py-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
          <InputGroup className="w-full sm:max-w-xs">
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search title, company, location..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </InputGroup>

          {FILTER_CONFIGS.map((filter) => {
            // used for rendering selected option
            const selectedOption = filter.options.find(
              (option) => option.value === filters[filter.key],
            );

            return (
              <Select
                key={filter.key}
                value={filters[filter.key]}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, [filter.key]: value }))
                }
              >
                <SelectTrigger className="w-full sm:w-55">
                  <SelectValue>
                    {filter.label}: {selectedOption?.label}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {filter.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            );
          })}

          <Select
            value={sort}
            onValueChange={(value) => setSort(value as ApplicationSortKey)}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue>
                Sort:{" "}
                {
                  APPLICATION_SORT_OPTIONS.find(
                    (option) => option.value === sort,
                  )?.label
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {APPLICATION_SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <TabsList className="w-full shrink-0 sm:w-auto">
          <TabsTrigger value="kanban">
            <LayoutGrid data-icon="inline-start" />
            Kanban
          </TabsTrigger>
          <TabsTrigger value="list">
            <List data-icon="inline-start" />
            List
          </TabsTrigger>
        </TabsList>
      </div>
    </Tabs>
  );
}
