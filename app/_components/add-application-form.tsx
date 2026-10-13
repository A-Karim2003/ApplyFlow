"use client";

import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Plus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldLabel,
  FieldGroup,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Textarea } from "@/components/ui/textarea";
import {
  APPLICATION_SOURCE_OPTIONS,
  STATUS_OPTIONS,
  JOB_TYPE_OPTIONS,
  WORK_MODE_OPTIONS,
} from "@/lib/constants/";
import {
  applicationSourceEnum,
  applicationStatusEnum,
  jobTypeEnum,
  workModeEnum,
} from "@/db/schema";
import type { Company } from "@/lib/data/companies";
import type { Document } from "@/lib/data/documents";
/*
  The company is one of two shapes:
  "type" tells the server which one it got.
  existing -> only the id is needed. 
  new -> only the name is needed and id will be retrieved from db once company is inserted.
 */

const companySchema = z.discriminatedUnion(
  "type",
  [
    z.object({ type: z.literal("existing"), id: z.number().int().positive() }),

    z.object({
      type: z.literal("new"),
      name: z.string().trim().min(1, "Company name is required"),
    }),
  ],
  { error: "Company is required" },
);

const addApplicationSchema = z
  .object({
    jobTitle: z.string().trim().min(1, "Job title is required"),
    company: companySchema,
    status: z.enum(applicationStatusEnum.enumValues),
    jobType: z.enum(jobTypeEnum.enumValues, { error: "Job type is required" }),
    source: z.enum(applicationSourceEnum.enumValues, {
      error: "Source is required",
    }),
    workMode: z.enum(workModeEnum.enumValues).optional(),
    location: z.string().optional(),
    jobUrl: z.union([z.url("Enter a valid URL"), z.literal("")]).optional(),
    //? Salary columns are integers, so reject decimals. Empty input -> undefined (see setValueAs)
    salaryMin: z.number().int("Whole numbers only").nonnegative().optional(),
    salaryMax: z.number().int("Whole numbers only").nonnegative().optional(),
    appliedAt: z.string().optional(),
    applicationDeadline: z.string().optional(),
    resumeId: z.number().int().positive().optional(),
    coverLetterId: z.number().int().positive().optional(),
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

type ApplicationFormValues = z.infer<typeof addApplicationSchema>;

//? "" -> undefined so an empty salary box isn't turned into 0
const toOptionalNumber = (value: unknown) =>
  value === "" || value == null ? undefined : Number(value);

type AddApplicationFormProps = {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companies: Company[];
  documents: Document[];
};

type CompanyOption = { id: number; label: string };

export function AddApplicationForm({
  children,
  open,
  onOpenChange,
  companies,
  documents,
}: AddApplicationFormProps) {
  const resumes = documents.filter(
    (document) => document.documentType === "cv",
  );
  const coverLetters = documents.filter(
    (document) => document.documentType === "cover_letter",
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    resetField, // Resets one specific field to its default value.
    setValue, // Sets one specific field to a value you choose.
    formState: { errors, isSubmitting },
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(addApplicationSchema),
    defaultValues: {
      jobTitle: "",
      company: undefined,
      status: "wishlist",
      jobType: undefined,
      source: undefined,
      workMode: undefined,
      location: "",
      jobUrl: "",
      salaryMin: undefined,
      salaryMax: undefined,
      appliedAt: "",
      applicationDeadline: "",
      resumeId: undefined,
      coverLetterId: undefined,
      notes: "",
    },
  });

  //* used for the combobox input
  const companyOptions = useMemo<CompanyOption[]>(
    () => companies.map((c) => ({ id: c.id, label: c.name })),
    [companies],
  );

  const [selectedCompany, setSelectedCompany] = useState<CompanyOption | null>(
    null,
  );
  const [companyQuery, setCompanyQuery] = useState("");
  const [isAddingCompany, setIsAddingCompany] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [confirmedNewCompany, setConfirmedNewCompany] = useState<string | null>(
    null,
  );

  function handleSelectCompany(option: CompanyOption | null) {
    setSelectedCompany(option);
    if (option) {
      setValue(
        "company",
        { type: "existing", id: option.id },
        { shouldValidate: true },
      );
    } else {
      resetField("company"); //? back to undefined
    }
  }

  // used to add a new company from the company house api
  function startAddingCompany() {
    //? Prefill with whatever the user had typed in the combobox
    setNewCompanyName(companyQuery.trim());
    setIsAddingCompany(true);
  }

  function confirmNewCompany() {
    const name = newCompanyName.trim();
    if (!name) return;
    setConfirmedNewCompany(name);
    setSelectedCompany(null);
    setIsAddingCompany(false);
    setCompanyQuery("");
    setValue("company", { type: "new", name }, { shouldValidate: true });
  }

  function backToPicking() {
    setIsAddingCompany(false);
    setNewCompanyName("");
  }

  function changeCompany() {
    setConfirmedNewCompany(null);
    setNewCompanyName("");
    setCompanyQuery("");
    resetField("company");
  }

  //? Single place that resets everything: Cancel, Escape, overlay click and successful submit
  function handleOpenChange(next: boolean) {
    if (!next) {
      reset();
      setSelectedCompany(null);
      setCompanyQuery("");
      setIsAddingCompany(false);
      setNewCompanyName("");
      setConfirmedNewCompany(null);
    }
    onOpenChange(next);
  }

  function submit(values: ApplicationFormValues) {
    //? TODO: call createApplication here (the company is resolved inside its transaction)
    console.log(values);
    handleOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      {children}
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b">
          <SheetTitle className="font-serif text-xl">
            Add job application
          </SheetTitle>
          <SheetDescription>
            Track a new opportunity in your pipeline. You can refine the details
            anytime.
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={handleSubmit(submit)}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex-1 overflow-y-auto p-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="job-title">
                  Job title <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="job-title"
                  placeholder="e.g. Software Engineer, New Grad"
                  aria-invalid={!!errors.jobTitle}
                  {...register("jobTitle")}
                />
                {errors.jobTitle && (
                  <FieldError>{errors.jobTitle.message}</FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="company">
                  Company <span className="text-destructive">*</span>
                </FieldLabel>

                {confirmedNewCompany ? (
                  //? Mode 3: a new company has been confirmed
                  <div className="flex items-center gap-2">
                    <Input
                      id="company"
                      value={confirmedNewCompany}
                      readOnly
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={changeCompany}
                    >
                      Change
                    </Button>
                  </div>
                ) : isAddingCompany ? (
                  //? Mode 2: inline add (Companies House search will slot in here later)
                  <div className="flex flex-col gap-2">
                    <Input
                      id="company"
                      autoFocus
                      value={newCompanyName}
                      onChange={(e) => setNewCompanyName(e.target.value)}
                      onKeyDown={(e) => {
                        //? Stop Enter from submitting the whole application form
                        if (e.key === "Enter") {
                          e.preventDefault();
                          confirmNewCompany();
                        }
                      }}
                      placeholder="Company name"
                    />
                    <div className="flex items-center justify-between gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={backToPicking}
                      >
                        <ArrowLeft data-icon="inline-start" /> Back
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        disabled={!newCompanyName.trim()}
                        onClick={confirmNewCompany}
                      >
                        Use this company
                      </Button>
                    </div>
                  </div>
                ) : (
                  //? Mode 1: pick from existing companies (max 5), last row is always "Add company"
                  <Combobox
                    items={companyOptions}
                    value={selectedCompany}
                    onValueChange={handleSelectCompany}
                    inputValue={companyQuery}
                    onInputValueChange={setCompanyQuery}
                    isItemEqualToValue={(a, b) => a.id === b.id}
                    limit={5}
                  >
                    <ComboboxInput
                      id="company"
                      placeholder="Search or select a company"
                      aria-invalid={!!errors.company}
                    />
                    <ComboboxContent>
                      <ComboboxEmpty>No matching companies.</ComboboxEmpty>
                      <ComboboxList>
                        {(item: CompanyOption) => (
                          <ComboboxItem key={item.id} value={item}>
                            {item.label}
                          </ComboboxItem>
                        )}
                      </ComboboxList>
                      <div className="border-t p-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                          onClick={startAddingCompany}
                        >
                          <Plus data-icon="inline-start" />
                          {companyQuery.trim()
                            ? `Add "${companyQuery.trim()}"`
                            : "Add company"}
                        </Button>
                      </div>
                    </ComboboxContent>
                  </Combobox>
                )}
                {errors.company && (
                  <FieldError>{errors.company.message}</FieldError>
                )}
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field>
                  <FieldLabel htmlFor="status">Status</FieldLabel>
                  <Controller
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger id="status" className="w-full">
                          <SelectValue placeholder="Status">
                            {
                              STATUS_OPTIONS.find(
                                (o) => o.value === field.value,
                              )?.label
                            }
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {STATUS_OPTIONS.map((status) => (
                              <SelectItem
                                key={status.value}
                                value={status.value}
                              >
                                {status.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="job-type">
                    Job type <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Controller
                    control={control}
                    name="jobType"
                    render={({ field }) => (
                      <Select
                        value={field.value ?? null}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="job-type"
                          className="w-full"
                          aria-invalid={!!errors.jobType}
                        >
                          <SelectValue placeholder="Job type">
                            {
                              JOB_TYPE_OPTIONS.find(
                                (o) => o.value === field.value,
                              )?.label
                            }
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {JOB_TYPE_OPTIONS.map((jobTypeOption) => (
                              <SelectItem
                                key={jobTypeOption.value}
                                value={jobTypeOption.value}
                              >
                                {jobTypeOption.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.jobType && (
                    <FieldError>{errors.jobType.message}</FieldError>
                  )}
                </Field>
              </div>

              <Field>
                <FieldLabel>Work mode (optional)</FieldLabel>
                {/* ToggleGroup value is an array; un-toggling gives [] -> undefined */}
                <Controller
                  control={control}
                  name="workMode"
                  render={({ field }) => (
                    <ToggleGroup
                      value={field.value ? [field.value] : []}
                      onValueChange={(value) => field.onChange(value[0])}
                      className="w-full gap-2"
                    >
                      {WORK_MODE_OPTIONS.map((workModeOption) => (
                        <ToggleGroupItem
                          key={workModeOption.value}
                          value={workModeOption.value}
                          className="flex-1 border border-input data-pressed:border-primary data-pressed:bg-primary data-pressed:text-primary-foreground"
                        >
                          {workModeOption.label}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  )}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="location">
                  Location{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </FieldLabel>
                <Input
                  id="location"
                  placeholder="e.g. London, UK"
                  {...register("location")}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="source">
                  Source <span className="text-destructive">*</span>
                </FieldLabel>
                <Controller
                  control={control}
                  name="source"
                  render={({ field }) => (
                    <Select
                      value={field.value ?? null}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        id="source"
                        className="w-full"
                        aria-invalid={!!errors.source}
                      >
                        <SelectValue placeholder="Where did you find this role?">
                          {
                            APPLICATION_SOURCE_OPTIONS.find(
                              (o) => o.value === field.value,
                            )?.label
                          }
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {APPLICATION_SOURCE_OPTIONS.map((source) => (
                            <SelectItem key={source.value} value={source.value}>
                              {source.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.source && (
                  <FieldError>{errors.source.message}</FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="job-url">
                  Job posting URL{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </FieldLabel>
                <Input
                  id="job-url"
                  type="url"
                  placeholder="https://…"
                  inputMode="url"
                  aria-invalid={!!errors.jobUrl}
                  {...register("jobUrl")}
                />
                {errors.jobUrl && (
                  <FieldError>{errors.jobUrl.message}</FieldError>
                )}
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field>
                  <FieldLabel htmlFor="salary-min">
                    Salary min{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </FieldLabel>
                  <Input
                    id="salary-min"
                    type="number"
                    placeholder="120000"
                    inputMode="numeric"
                    aria-invalid={!!errors.salaryMin}
                    {...register("salaryMin", { setValueAs: toOptionalNumber })}
                  />
                  {errors.salaryMin && (
                    <FieldError>{errors.salaryMin.message}</FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="salary-max">
                    Salary max{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </FieldLabel>
                  <Input
                    id="salary-max"
                    type="number"
                    placeholder="150000"
                    inputMode="numeric"
                    aria-invalid={!!errors.salaryMax}
                    {...register("salaryMax", { setValueAs: toOptionalNumber })}
                  />
                  {errors.salaryMax && (
                    <FieldError>{errors.salaryMax.message}</FieldError>
                  )}
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field>
                  <FieldLabel htmlFor="applied-at">
                    Date applied{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </FieldLabel>
                  <Input
                    id="applied-at"
                    type="date"
                    {...register("appliedAt")}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="deadline">
                    Deadline{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </FieldLabel>
                  <Input
                    id="deadline"
                    type="date"
                    {...register("applicationDeadline")}
                  />
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="resume">
                  Resume{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </FieldLabel>
                <Controller
                  control={control}
                  name="resumeId"
                  render={({ field }) => (
                    <Select
                      value={field.value ?? null}
                      onValueChange={(value) =>
                        field.onChange(value ?? undefined)
                      }
                    >
                      <SelectTrigger id="resume" className="w-full">
                        <SelectValue placeholder="Attach a resume">
                          {resumes.find((d) => d.id === field.value)?.filename}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {resumes.map((document) => (
                            <SelectItem key={document.id} value={document.id}>
                              {document.filename ?? document.id}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="cover-letter">
                  Cover letter{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </FieldLabel>
                <Controller
                  control={control}
                  name="coverLetterId"
                  render={({ field }) => (
                    <Select
                      value={field.value ?? null}
                      onValueChange={(value) =>
                        field.onChange(value ?? undefined)
                      }
                    >
                      <SelectTrigger id="cover-letter" className="w-full">
                        <SelectValue placeholder="Attach a cover letter">
                          {
                            coverLetters.find((d) => d.id === field.value)
                              ?.filename
                          }
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {coverLetters.map((document) => (
                            <SelectItem key={document.id} value={document.id}>
                              {document.filename ?? document.id}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="notes">
                  Notes{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </FieldLabel>
                <Textarea
                  id="notes"
                  placeholder="Referrals, contacts, prep reminders…"
                  rows={3}
                  {...register("notes")}
                />
                <FieldDescription>
                  Keep track of anything that will help you stay organized.
                </FieldDescription>
              </Field>
            </FieldGroup>
          </div>

          <SheetFooter className="flex-row gap-2 border-t">
            <SheetClose
              render={
                <Button type="button" variant="outline" className="flex-1">
                  Cancel
                </Button>
              }
            />
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting}
              onClick={() => reset()}
            >
              Add application
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
