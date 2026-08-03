import {
  pgEnum,
  pgTable,
  integer,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { applicationsTable } from "./applications";

const interviewOutcome = pgEnum("interview_outcome", [
  "pending",
  "passed",
  "failed",
]);

const interviewType = pgEnum("interview_type", [
  "phone_screen",
  "online_assessment",
  "technical_interview",
  "coding_interview",
  "system_design_interview",
  "behavioural_interview",
  "hiring_manager_interview",
  "team_interview",
  "final_interview",
]);

export const interviews = pgTable(
  "interviews",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

    applicationId: integer("application_id")
      .notNull()
      .references(() => applicationsTable.id, {
        onDelete: "cascade",
      }),

    scheduledAt: timestamp("scheduled_at").notNull(),

    interviewerName: text("interviewer_name"),
    interviewType: interviewType("interview_type").notNull(),

    notes: text("notes"),
    outcome: interviewOutcome("outcome").default("pending").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("interviews_application_id_idx").on(table.applicationId)],
);
