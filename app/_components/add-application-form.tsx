"use client";

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
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Textarea } from "@/components/ui/textarea";
import {
  APPLICATION_SOURCE_OPTIONS,
  STATUS_OPTIONS,
  JOB_TYPE_OPTIONS,
  WORK_MODE_OPTIONS,
} from "@/lib/constants/";
import type { Company } from "@/lib/data/companies";
import type { Document } from "@/lib/data/documents";

type AddApplicationFormProps = {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companies: Company[];
  documents: Document[];
};

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

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
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

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto p-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="job-title">
                  Job title <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="job-title"
                  placeholder="e.g. Software Engineer, New Grad"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="company">
                  Company <span className="text-destructive">*</span>
                </FieldLabel>
                <Select>
                  <SelectTrigger id="company" className="w-full">
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {companies.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field>
                  <FieldLabel htmlFor="status">Status</FieldLabel>
                  <Select defaultValue="wishlist">
                    <SelectTrigger id="status" className="w-full">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {STATUS_OPTIONS.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel htmlFor="job-type">
                    Job type <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Select>
                    <SelectTrigger id="job-type" className="w-full">
                      <SelectValue placeholder="Job type" />
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
                </Field>
              </div>

              <Field>
                <FieldLabel>Work mode (optional)</FieldLabel>
                <ToggleGroup defaultValue={["remote"]} className="w-full gap-2">
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
              </Field>

              <Field>
                <FieldLabel htmlFor="location">
                  Location{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </FieldLabel>
                <Input id="location" placeholder="e.g. London, UK" />
              </Field>

              <Field>
                <FieldLabel htmlFor="source">
                  Source <span className="text-destructive">*</span>
                </FieldLabel>
                <Select>
                  <SelectTrigger id="source" className="w-full">
                    <SelectValue placeholder="Where did you find this role?" />
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
                />
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
                  />
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
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field>
                  <FieldLabel htmlFor="applied-at">
                    Date applied{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </FieldLabel>
                  <Input id="applied-at" type="date" />
                </Field>

                <Field>
                  <FieldLabel htmlFor="deadline">
                    Deadline{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </FieldLabel>
                  <Input id="deadline" type="date" />
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="resume">
                  Resume{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </FieldLabel>
                <Select>
                  <SelectTrigger id="resume" className="w-full">
                    <SelectValue placeholder="Attach a resume" />
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
              </Field>

              <Field>
                <FieldLabel htmlFor="cover-letter">
                  Cover letter{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </FieldLabel>
                <Select>
                  <SelectTrigger id="cover-letter" className="w-full">
                    <SelectValue placeholder="Attach a cover letter" />
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
            <Button type="submit" className="flex-1">
              Add application
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
