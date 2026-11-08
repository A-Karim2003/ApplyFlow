// application-details-dialog.tsx
"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarPlus, MapPin, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { STATUS_COLUMN_STYLES } from "@/lib/constants";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import CompanyLogo from "@/app/_components/company-logo";
import {
  STATUS_OPTIONS,
  JOB_TYPE_OPTIONS,
  WORK_MODE_OPTIONS,
  APPLICATION_SOURCE_OPTIONS,
  type ApplicationStatus,
} from "@/lib/constants/applications";
import { cn } from "@/lib/utils";
import { type ApplicationWithCompany } from "@/lib/data/applications";
import {
  type UpdateApplicationProp,
  updateApplicationDetails,
  deleteApplication,
} from "@/actions/applications/applications";
import { toast } from "react-toastify";
import SpinnerEllipsis from "@/components/shadcn-space/spinner/spinner-05";
import { DatePicker } from "./date-picker";
import { DatePickerWithPresets } from "./date-picker-with-presets";

const applicationDetailsSchema = z
  .object({
    jobTitle: z.string().min(1, "Job title is required"),
    companyId: z.coerce.number().int().positive("Company is required"),
    jobType: z.enum(JOB_TYPE_OPTIONS.map((option) => option.value)),
    source: z.enum(APPLICATION_SOURCE_OPTIONS.map((option) => option.value)),
    location: z.string().optional(),
    workMode: z
      .enum(WORK_MODE_OPTIONS.map((option) => option.value))
      .optional(),
    jobUrl: z.union([z.url("Enter a valid URL"), z.literal("")]).optional(),
    salaryMin: z.coerce.number().nonnegative().optional(),
    salaryMax: z.coerce.number().nonnegative().optional(),
    applicationDeadline: z.string().optional(),
    appliedAt: z.string().optional(),
    notes: z.string().optional(),
  })
  .refine(
    (data) =>
      !data.salaryMin || !data.salaryMax || data.salaryMin <= data.salaryMax,
    {
      message: "Min salary must be ≤ max salary",
      path: ["salaryMax"],
    },
  );

type ApplicationDetailsFormInput = z.input<typeof applicationDetailsSchema>;
type ApplicationDetailsForm = z.output<typeof applicationDetailsSchema>;

type ApplicationDetailsDialogProps = {
  application: ApplicationWithCompany | null;
  companies: { id: number; name: string }[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (props: UpdateApplicationProp) => void;
  onScheduleInterview: () => void;
};

export default function ApplicationDetailsDialog({
  application,
  companies,
  open,
  onOpenChange,
  onStatusChange,
  onScheduleInterview,
}: ApplicationDetailsDialogProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, startDeleteTransition] = useTransition();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, dirtyFields, isSubmitting },
  } = useForm<ApplicationDetailsFormInput, unknown, ApplicationDetailsForm>({
    resolver: zodResolver(applicationDetailsSchema),
    values: application
      ? {
          jobTitle: application.application.jobTitle,
          companyId: application.application.companyId,
          jobType: application.application.jobType,
          source: application.application.source,
          location: application.application.location ?? "",
          workMode: application.application.workMode ?? undefined,
          jobUrl: application.application.jobUrl ?? "",
          salaryMin: application.application.salaryMin ?? undefined,
          salaryMax: application.application.salaryMax ?? undefined,
          applicationDeadline:
            application.application.applicationDeadline ?? "",
          appliedAt: application.application.appliedAt ?? "",
          notes: application.application.notes ?? "",
        }
      : undefined,
  });

  if (!application) return null;

  const { application: app, company } = application;
  const status = app.status as ApplicationStatus;

  async function submit(values: ApplicationDetailsForm) {
    const changedValues = Object.fromEntries(
      Object.entries(dirtyFields).map(([key]) => [
        key,
        values[key as keyof ApplicationDetailsForm],
      ]),
    ) as Partial<ApplicationDetailsForm>;

    if (Object.keys(changedValues).length === 0) return; // nothing to save

    try {
      const result = await updateApplicationDetails({
        applicationId: app.id,
        values: changedValues,
      });

      if (result.success) {
        reset(values);
        toast.success("Application updated");
      } else {
        toast.error(result.error ?? "Could not update application");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    }
  }

  function handleDeleteApplication() {
    startDeleteTransition(async () => {
      try {
        const result = await deleteApplication(app.id);

        if (result.success) {
          onOpenChange(false);
          toast.success("Application deleted");
        } else {
          toast.error(result.error ?? "Could not delete application");
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong. Please try again.");
      }
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) setConfirmDelete(false);
        onOpenChange(open);
      }}
    >
      <DialogContent className="max-h-[calc(100vh-4rem)] sm:w-[90%] sm:max-w-[90%] md:w-[80%] md:max-w-[80%] lg:w-[80%] lg:max-w-7xl overflow-y-auto p-0">
        <div className="flex min-w-0 flex-col gap-6 p-4 sm:p-6">
          <DialogHeader className="pr-8">
            <div className="flex min-w-0 flex-col gap-4 sm:justify-between">
              <div className="flex min-w-0 flex-1 gap-3">
                <CompanyLogo
                  name={company.name}
                  className="size-12 rounded-xl text-lg"
                />
                <div className="min-w-0 flex-1">
                  <DialogTitle className="text-2xl text-balance">
                    {app.jobTitle}
                  </DialogTitle>
                  <DialogDescription className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="font-medium text-foreground">
                      {company.name}
                    </span>
                    {app.location && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="size-3.5" />
                        {app.location}
                      </span>
                    )}
                  </DialogDescription>
                </div>
              </div>

              <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:shrink-0 sm:justify-end">
                {status === "interview" && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-amber-100 text-amber-800 hover:bg-amber-200 sm:flex-none"
                    onClick={onScheduleInterview}
                  >
                    <CalendarPlus data-icon="inline-start" />
                    Schedule interview
                  </Button>
                )}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex-1 text-destructive hover:text-destructive sm:flex-none"
                  onClick={() => setConfirmDelete(true)}
                >
                  <Trash2 data-icon="inline-start" /> Delete
                </Button>
              </div>
            </div>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-1.5 rounded-xl border bg-muted/40 p-2 sm:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-6">
            {STATUS_OPTIONS.map((step, index) => {
              const active = status === step.value;
              const styles = STATUS_COLUMN_STYLES[step.value];

              return (
                <button
                  key={step.value}
                  type="button"
                  onClick={() =>
                    onStatusChange({
                      id: app.id,
                      newStatus: step.value as ApplicationStatus,
                    })
                  }
                  className={cn(
                    "group relative flex min-w-0 items-center gap-2 rounded-lg border px-2.5 py-2 text-left text-xs font-semibold transition-all",
                    active
                      ? cn(styles.bodyOver, styles.border, "shadow-xs")
                      : "border-transparent text-muted-foreground hover:border-border hover:bg-card/70",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-6 shrink-0 place-items-center rounded-full border text-[10px] font-bold transition-colors",
                      active
                        ? cn(styles.header, styles.border, "text-foreground")
                        : "border-border bg-background text-muted-foreground group-hover:border-muted-foreground/50",
                    )}
                  >
                    {index + 1}
                  </span>
                  <span
                    className={cn(
                      "min-w-0 truncate",
                      active && "text-foreground",
                    )}
                  >
                    {step.label}
                  </span>
                </button>
              );
            })}
          </div>

          <form
            onSubmit={handleSubmit(submit)}
            className="flex min-w-0 flex-col gap-6"
          >
            <section className="flex flex-col gap-4">
              <h3 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                Application details
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="jobTitle">Job title</Label>
                  <Input
                    id="jobTitle"
                    aria-invalid={!!errors.jobTitle}
                    {...register("jobTitle")}
                  />
                  {errors.jobTitle && (
                    <p className="text-xs text-destructive">
                      {errors.jobTitle.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Company</Label>
                  <Controller
                    control={control}
                    name="companyId"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          aria-invalid={!!errors.companyId}
                          className="w-full"
                        >
                          <SelectValue placeholder="Select company">
                            {companies.find((c) => c.id === field.value)?.name}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {companies.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.companyId && (
                    <p className="text-xs text-destructive">
                      {errors.companyId.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Job type</Label>
                  <Controller
                    control={control}
                    name="jobType"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue>
                            {
                              JOB_TYPE_OPTIONS.find(
                                (jobType) => jobType.value === field.value,
                              )?.label
                            }
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {JOB_TYPE_OPTIONS.map((o) => (
                            <SelectItem key={o.value} value={o.value}>
                              {o.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" {...register("location")} />
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Source</Label>
                  <Controller
                    control={control}
                    name="source"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue>
                            {
                              APPLICATION_SOURCE_OPTIONS.find(
                                (source) => source.value === field.value,
                              )?.label
                            }
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {APPLICATION_SOURCE_OPTIONS.map((o) => (
                            <SelectItem key={o.value} value={o.value}>
                              {o.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="jobUrl">Job URL</Label>
                  <Input
                    id="jobUrl"
                    type="url"
                    placeholder="https://..."
                    aria-invalid={!!errors.jobUrl}
                    {...register("jobUrl")}
                  />
                  {errors.jobUrl && (
                    <p className="text-xs text-destructive">
                      {errors.jobUrl.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="salaryMin">Salary min</Label>
                  <Input
                    id="salaryMin"
                    type="number"
                    {...register("salaryMin")}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="salaryMax">Salary max</Label>
                  <Input
                    id="salaryMax"
                    type="number"
                    aria-invalid={!!errors.salaryMax}
                    {...register("salaryMax")}
                  />
                  {errors.salaryMax && (
                    <p className="text-xs text-destructive">
                      {errors.salaryMax.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Date applied</Label>
                  <Controller
                    control={control}
                    name="appliedAt"
                    render={({ field }) => (
                      <DatePicker
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Application deadline</Label>
                  <Controller
                    control={control}
                    name="applicationDeadline"
                    render={({ field }) => (
                      <DatePickerWithPresets
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Work mode</Label>
                  <Controller
                    control={control}
                    name="workMode"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select work mode">
                            {
                              WORK_MODE_OPTIONS.find(
                                (workMode) => workMode.value === field.value,
                              )?.label
                            }
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {WORK_MODE_OPTIONS.map((o) => (
                            <SelectItem key={o.value} value={o.value}>
                              {o.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </section>

            <section className="flex flex-col gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Track recruiter conversations, follow-ups, prep links..."
                className="min-h-24 resize-y"
                {...register("notes")}
              />
            </section>

            <DialogFooter>
              {confirmDelete ? (
                <div className="flex w-full items-center justify-between gap-3">
                  <span className="text-sm text-muted-foreground">
                    Delete this application permanently?
                  </span>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setConfirmDelete(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      disabled={isDeleting}
                      onClick={handleDeleteApplication}
                    >
                      {isDeleting && <SpinnerEllipsis />}
                      {isDeleting ? "Deleting" : "Delete"}
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      onOpenChange(false);
                      reset();
                    }}
                  >
                    Close
                  </Button>
                  <Button type="submit" disabled={!isDirty || isSubmitting}>
                    Save changes
                    {isSubmitting && <SpinnerEllipsis />}
                  </Button>
                </>
              )}
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
