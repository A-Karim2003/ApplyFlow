import { z } from "zod";
import { interviewOutcome, interviewType } from "@/db/schema";

//* Form shape: date and time are separate fields
export const scheduleInterviewSchema = z.object({
  date: z.date({
    error: (issue) =>
      issue.input === undefined ? "Pick a date" : "Invalid date",
  }),
  time: z.string().min(1, "Pick a time"),
  interviewType: z.enum(interviewType.enumValues),
  outcome: z.enum(interviewOutcome.enumValues),
  interviewerName: z.string().trim().max(100),
  notes: z.string().trim().max(500),
});

//* Server shape: the browser has already combined date + time into one instant.
export const createInterviewSchema = z.object({
  applicationId: z.number().int().positive(),
  scheduledAt: z.date("Invalid date"),
  interviewType: z.enum(interviewType.enumValues),
  outcome: z.enum(interviewOutcome.enumValues),
  interviewerName: z.string().trim().max(100),
  notes: z.string().trim().max(500),
});

export type ScheduleInterviewValues = z.infer<typeof scheduleInterviewSchema>;
export type CreateInterviewInput = z.infer<typeof createInterviewSchema>;
