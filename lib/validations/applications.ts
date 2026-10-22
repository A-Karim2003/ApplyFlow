import { z } from "zod";
import {
  APPLICATION_SOURCE_OPTIONS,
  JOB_TYPE_OPTIONS,
  STATUS_OPTIONS,
  WORK_MODE_OPTIONS,
} from "@/lib/constants";

/*
  The company is one of two shapes:
  "type" tells the server which one it got.
  existing -> only the id is needed.
  new -> only the name is needed (plus the Companies House number when picked from search);
         the id is created in the db when the application is saved.
 */
export const companySchema = z.discriminatedUnion(
  "type",
  [
    z.object({ type: z.literal("existing"), id: z.number().int().positive() }),
    z.object({
      type: z.literal("new"),
      name: z.string().trim().min(1, "Company name is required"),
      companyHouseNumber: z.string().optional(),
    }),
  ],
  { error: "Company is required" },
);

//? "" is what an empty date input gives; anything else must be yyyy-MM-dd
const optionalDate = z
  .union([z.iso.date("Enter a valid date"), z.literal("")], {
    error: "Enter a valid date",
  })
  .optional();

export const createApplicationSchema = z
  .object({
    jobTitle: z.string().trim().min(1, "Job title is required"),
    company: companySchema,
    status: z.enum(STATUS_OPTIONS.map((option) => option.value)),
    jobType: z.enum(
      JOB_TYPE_OPTIONS.map((option) => option.value),
      { error: "Job type is required" },
    ),
    source: z.enum(
      APPLICATION_SOURCE_OPTIONS.map((option) => option.value),
      { error: "Source is required" },
    ),
    workMode: z
      .enum(WORK_MODE_OPTIONS.map((option) => option.value))
      .optional(),
    location: z.string().optional(),
    jobUrl: z.union([z.url("Enter a valid URL"), z.literal("")]).optional(),
    //? Salary columns are integers, so reject decimals. Empty input -> undefined (see setValueAs in the form)
    salaryMin: z.number().int("Whole numbers only").nonnegative().optional(),
    salaryMax: z.number().int("Whole numbers only").nonnegative().optional(),
    appliedAt: optionalDate,
    applicationDeadline: optionalDate,
    resumeId: z.number().int().positive().optional(),
    coverLetterId: z.number().int().positive().optional(),
    notes: z.string().optional(),
  })
  .refine(
    (data) =>
      data.salaryMin === undefined ||
      data.salaryMax === undefined ||
      data.salaryMin <= data.salaryMax,
    {
      message: "Min salary must be ≤ max salary",
      path: ["salaryMax"],
    },
  );

export type ApplicationFormValues = z.infer<typeof createApplicationSchema>;
export type CompanyValue = z.infer<typeof companySchema>;
