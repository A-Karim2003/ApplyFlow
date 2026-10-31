import { z } from "zod";
import { interviewOutcome, interviewType } from "@/db/schema";

//* Form shape (date + time separate). The server action gets its own schema with scheduledAt.

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

export type ScheduleInterviewValues = z.infer<typeof scheduleInterviewSchema>;
