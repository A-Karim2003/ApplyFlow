"use client";

import { useMemo, useOptimistic, useState, useTransition } from "react";
import { FilterX, LayoutGrid, List, Search, SearchX } from "lucide-react";
import { toast } from "react-toastify";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  type UpdateApplicationProp,
  updateApplicationStatus,
} from "@/actions/applications/applications";
import { ApplicationsPageData } from "@/lib/data/applications";
import { cn } from "@/lib/utils";
import KanbanBoard from "./kanban-board";
import ListView from "./applicationsTable/list-view";
import ApplicationDetailsDialog from "./application-details-dialog";
import { Button } from "@/components/ui/button";
import {
  ApplicationForInterview,
  ScheduleInterviewDialog,
} from "../(interview)/schedule-interview-dialog";

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

export function ApplicationsWorkspace({ applications }: ApplicationsPageData) {
  // selectedApplicationId and dialogOpen are for managing the application details dialog (modal)
  const [selectedApplicationId, setSelectedApplicationId] = useState<
    number | null
  >(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  //* This controls both whether the dialog is open and which application it belongs to.
  const [interviewDialog, setInterviewDialog] = useState<{
    open: boolean;
    application: ApplicationForInterview;
  }>({
    open: false,
    application: {
      applicationId: null,
      jobTitle: null,
      jobType: null,
      companyName: null,
    },
  });

  const [query, setQuery] = useState<string>("");
  const [filters, setFilters] = useState<ApplicationFilters>({
    status: "all",
    jobType: "all",
    workMode: "all",
  });
  const [sort, setSort] = useState<ApplicationSortKey>("recent");

  const [isPending, startTransition] = useTransition();

  const [optimisticApplications, applyOptimisticMove] = useOptimistic(
    applications,
    (state, { id, newStatus }: UpdateApplicationProp) => {
      return state.map((item) =>
        item.application.id === id
          ? { ...item, application: { ...item.application, status: newStatus } }
          : item,
      );
    },
  );

  function moveApplication({ id, newStatus }: UpdateApplicationProp) {
    //? Same-status move: nothing changed, so skip the update, history row and dialog
    const currentStatus = applications.find((app) => app.application.id === id)
      ?.application.status;
    if (currentStatus === newStatus) return;

    startTransition(async () => {
      applyOptimisticMove({ id, newStatus });

      const result = await updateApplicationStatus({ id, newStatus });

      if (!result.success)
        toast.error("Unable to update status. Please try again.");

      if (result.success && result.data.status === "interview") {
        const { id: applicationId, jobTitle, jobType } = result.data;
        const companyData = applications.find(
          (app) => app.application.id === applicationId,
        )?.company;

        setInterviewDialog({
          open: true,
          application: {
            applicationId: applicationId,
            jobTitle: jobTitle,
            jobType: jobType,
            companyName: companyData?.name ?? null,
          },
        });
      }
    });
  }

  //* Checks if filter exist for rendering clear filter button
  const hasActiveFilters =
    query !== "" ||
    filters.status !== "all" ||
    filters.jobType !== "all" ||
    filters.workMode !== "all";

  function clearFilters() {
    setQuery("");
    setFilters({ status: "all", jobType: "all", workMode: "all" });
    setSort("recent");
  }

  const filteredAndSorted = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const filtered = optimisticApplications.filter(
      ({ application, company }) => {
        /*
            returns application if the search Query matches  any
            applications job title, company name, or location
        */
        const matchesQuery =
          normalizedQuery === "" ||
          application.jobTitle.toLowerCase().includes(normalizedQuery) ||
          company.name.toLowerCase().includes(normalizedQuery) ||
          (application.location?.toLowerCase().includes(normalizedQuery) ??
            false);

        /*
            returns application if the filter matches the application's status
        */

        const matchesStatus =
          filters.status === "all" || application.status === filters.status;
        const matchesJobType =
          filters.jobType === "all" || application.jobType === filters.jobType;
        const matchesWorkMode =
          filters.workMode === "all" ||
          application.workMode === filters.workMode;

        //   Returns only the application that matches the entire filter
        return (
          matchesQuery && matchesStatus && matchesJobType && matchesWorkMode
        );
      },
    );

    return [...filtered].sort((a, b) => {
      if (sort === "company")
        return a.company.name.localeCompare(b.company.name);

      const aDate = a.application.appliedAt
        ? new Date(a.application.appliedAt).getTime()
        : 0;
      const bDate = b.application.appliedAt
        ? new Date(b.application.appliedAt).getTime()
        : 0;

      return sort === "recent" ? bDate - aDate : aDate - bDate;
    });
  }, [optimisticApplications, query, filters, sort]);

  const selectedApplication = useMemo(
    () =>
      filteredAndSorted.find(
        (a) => a.application.id === selectedApplicationId,
      ) ?? null,
    [filteredAndSorted, selectedApplicationId],
  );

  function openApplication(id: number) {
    setSelectedApplicationId(id);
    setDialogOpen(true);
  }

  //? Opens the schedule modal for the application shown in the details dialog
  function openScheduleInterview() {
    //* if an application is selected, that means the details dialog is open
    if (!selectedApplication) return;
    
    const { application, company } = selectedApplication;

    setInterviewDialog({
      open: true,
      application: {
        applicationId: application.id,
        jobTitle: application.jobTitle,
        jobType: application.jobType,
        companyName: company.name,
      },
    });
  }
  return (
    <>
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

            {hasActiveFilters && (
              <Button
                size="sm"
                variant="outline"
                className="text-muted-foreground hover:text-foreground"
                onClick={clearFilters}
              >
                <FilterX data-icon="inline-start" />
                Clear filters
              </Button>
            )}
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

        {/*=======Render Kanban Board & List=======*/}
        {filteredAndSorted.length === 0 ? (
          <Empty className="rounded-xl border border-dashed">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <SearchX />
              </EmptyMedia>
              <EmptyTitle>No applications found</EmptyTitle>
              <EmptyDescription>
                Try adjusting your search or filters to find what you&apos;re
                looking for.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div aria-busy={isPending} className={cn(isPending && "opacity-90")}>
            <TabsContent value="kanban" className="mt-0">
              <KanbanBoard
                applications={filteredAndSorted}
                onMove={moveApplication}
                onOpenApplication={openApplication}
              />
            </TabsContent>
            <TabsContent value="list" className="mt-0">
              <ListView
                applications={filteredAndSorted}
                onMove={moveApplication}
                onOpenApplication={openApplication}
              />
            </TabsContent>
          </div>
        )}
      </Tabs>

      <ApplicationDetailsDialog
        application={selectedApplication}
        companies={Array.from(
          new Map(
            applications.map(({ company }) => [company.id, company]),
          ).values(),
        )}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onStatusChange={moveApplication}
        onScheduleInterview={openScheduleInterview}
      />

      <ScheduleInterviewDialog
        open={interviewDialog.open}
        application={interviewDialog.application}
        //* Only closes; the id is overwritten on the next open anyway
        onOpenChange={(open) =>
          setInterviewDialog((prev) => ({ ...prev, open }))
        }
      />
    </>
  );
}
