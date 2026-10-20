import { pgEnum, pgTable, index, check } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { companiesTable } from "./companies";
import { sql } from "drizzle-orm";

export const workModeEnum = pgEnum("work_mode", ["remote", "hybrid", "onsite"]);

export const applicationStatusEnum = pgEnum("application_status", [
  "wishlist",
  "applied",
  "online_assessment",
  "interview",
  "offer",
  "rejected",
]);

export const jobTypeEnum = pgEnum("job_type", [
  "full_time",
  "part_time",
  "internship",
  "placement",
  "graduate",
  "contract",
]);

export const applicationSourceEnum = pgEnum("application_source", [
  "linkedin",
  "indeed",
  "company_website",
  "referral",
  "university",
  "other",
]);

export const applicationsTable = pgTable(
  "applications",
  (t) => ({
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),

    userId: t
      .text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    companyId: t
      .integer("company_id")
      .notNull()
      .references(() => companiesTable.id, {
        onDelete: "restrict",
      }),

    jobTitle: t.text("job_title").notNull(),
    jobType: jobTypeEnum("job_type").notNull(),
    jobUrl: t.text("job_url"),
    source: applicationSourceEnum("source").notNull(),

    location: t.text("location"),
    workMode: workModeEnum("work_mode"),

    salaryMin: t.integer("salary_min"),
    salaryMax: t.integer("salary_max"),

    applicationDeadline: t.date("application_deadline"),

    status: applicationStatusEnum("status").notNull(),

    appliedAt: t.date("applied_at"), //* wishlisted jobs wont have this

    notes: t.text("notes"),

    createdAt: t.timestamp("created_at").defaultNow().notNull(),
    updatedAt: t
      .timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  }),
  (table) => [
    index("applications_user_id_idx").on(table.userId),
    index("applications_company_id_idx").on(table.companyId),
    index("applications_status_idx").on(table.status),
    index("applications_user_status_idx").on(table.userId, table.status),
    check("salary_range_check", sql`salary_min <= salary_max`),
  ],
);

export const applicationStatusHistoryTable = pgTable(
  "application_status_history",
  (t) => ({
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),

    applicationId: t
      .integer("application_id")
      .notNull()
      .references(() => applicationsTable.id, {
        onDelete: "cascade",
      }),

    previousStatus: applicationStatusEnum("previous_status"),

    status: applicationStatusEnum("status").notNull(),

    createdAt: t.timestamp("created_at").defaultNow().notNull(),
  }),
  (table) => [
    index("application_status_history_application_id_idx").on(
      table.applicationId,
    ),
  ],
);
