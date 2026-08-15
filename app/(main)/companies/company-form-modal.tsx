"use client";

import { useEffect, useState, type ReactElement, type ReactNode } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

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

import { Textarea } from "@/components/ui/textarea";
import { INDUSTRY_OPTIONS } from "@/lib/constants";
import { industryEnum } from "@/db/schema";
import { createCompany, updateCompany } from "@/actions/companies";
import type { Company } from "@/lib/data/companies";

const FormSchema = z.object({
  name: z.string().trim().min(1, "Company name is required").max(200),
  website: z.url("Enter a valid URL").optional().or(z.literal("")),
  industry: z.enum(industryEnum.enumValues, {
    error: "Industry is required",
  }),
  location: z.string().trim().max(200).optional(),
  notes: z.string().trim().max(2000).optional(),
});

type FormValues = z.infer<typeof FormSchema>;

const EMPTY_VALUES: Partial<FormValues> = {
  name: "",
  website: "",
  location: "",
  notes: "",
};

function getDefaultValues(company?: Company): Partial<FormValues> {
  if (!company) return EMPTY_VALUES;

  return {
    name: company.name,
    website: company.website ?? "",
    industry: company.industry,
    location: company.location ?? "",
    notes: company.notes ?? "",
  };
}

interface CompanyFormModalProps {
  children?: ReactNode;
  company?: Company;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CompanyFormModal({
  children,
  company,
  open,
  onOpenChange,
}: CompanyFormModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const isEditing = Boolean(company);
  const isControlled = open !== undefined;
  const dialogOpen = isControlled ? open : internalOpen;
  const setDialogOpen = onOpenChange ?? setInternalOpen;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: "onSubmit",
    defaultValues: EMPTY_VALUES,
  });

  useEffect(() => {
    if (dialogOpen) {
      reset(getDefaultValues(company));
    }
  }, [company, dialogOpen, reset]);

  async function onSubmit(data: FormValues) {
    setFormError(null);

    try {
      // TODO: remove try/catch once updateCompany/deleteCompany return Result without throwing
      const result = isEditing
        ? await updateCompany(company!.id, {
            name: data.name,
            industry: data.industry,
            website: data.website?.trim() || undefined,
            location: data.location?.trim() || undefined,
            notes: data.notes?.trim() ?? "",
          })
        : await createCompany({
            name: data.name,
            industry: data.industry,
            website: data.website?.trim() || undefined,
            location: data.location?.trim() || undefined,
            notes: data.notes?.trim() ?? "",
          });

      if (!result.success) {
        setFormError(result.error);
        return;
      }
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Something went wrong",
      );
      return;
    }

    reset(getDefaultValues(company));
    setDialogOpen(false);
  }

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(nextOpen) => {
        setDialogOpen(nextOpen);
        if (!nextOpen) {
          reset(getDefaultValues(company));
          setFormError(null);
        }
      }}
    >
      {!isControlled && children ? (
        <DialogTrigger render={children as ReactElement} />
      ) : null}

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">
            {isEditing ? "Edit company" : "Add company"}
          </DialogTitle>
          <DialogDescription>
            Manually add a company to track roles, contacts, and notes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="company-name">Name</FieldLabel>
              <Input
                id="company-name"
                placeholder="e.g. Google"
                aria-invalid={!!errors.name || undefined}
                disabled={isSubmitting}
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="company-website">
                  Website{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </FieldLabel>
                <Input
                  id="company-website"
                  type="url"
                  inputMode="url"
                  placeholder="https://…"
                  aria-invalid={!!errors.website || undefined}
                  disabled={isSubmitting}
                  {...register("website")}
                />
                {errors.website && (
                  <p className="text-xs text-destructive">
                    {errors.website.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="company-industry">Industry</FieldLabel>
                <Controller
                  name="industry"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger id="company-industry" className="w-full">
                        <SelectValue placeholder="Select an industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {INDUSTRY_OPTIONS.map((industry) => (
                            <SelectItem
                              key={industry.value}
                              value={industry.value}
                            >
                              {industry.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.industry && (
                  <p className="text-xs text-destructive">
                    {errors.industry.message}
                  </p>
                )}
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="company-location">
                Location{" "}
                <span className="text-muted-foreground">(optional)</span>
              </FieldLabel>
              <Input
                id="company-location"
                placeholder="e.g. San Francisco, CA"
                disabled={isSubmitting}
                {...register("location")}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="company-notes">
                Notes <span className="text-muted-foreground">(optional)</span>
              </FieldLabel>
              <Textarea
                id="company-notes"
                rows={3}
                placeholder="Contacts, referrals, application reminders…"
                disabled={isSubmitting}
                {...register("notes")}
              />
              <FieldDescription>
                Anything that helps you remember this company.
              </FieldDescription>
            </Field>

            {formError && (
              <p className="text-center text-sm text-destructive wrap-break-word">
                {formError}
              </p>
            )}
          </FieldGroup>

          <DialogFooter className="mt-6">
            <DialogClose
              render={
                <Button type="button" variant="outline" disabled={isSubmitting}>
                  Cancel
                </Button>
              }
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? isEditing
                  ? "Saving…"
                  : "Adding…"
                : isEditing
                  ? "Save changes"
                  : "Add company"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
