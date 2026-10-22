import { pgTable, index, unique, pgEnum } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const industryEnum = pgEnum("industry", [
  "technology",
  "finance",
  "fintech",
  "healthcare",
  "ecommerce",
  "consulting",
  "education",
  "media_entertainment",
  "gaming",
  "manufacturing",
  "retail",
  "telecommunications",
  "energy",
  "government",
  "nonprofit",
  "real_estate",
  "transportation",
  "hospitality",
  "other",
]);

export const companiesTable = pgTable(
  "companies",
  (t) => ({
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),

    userId: t
      .text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    name: t.text("name").notNull(),
    companyHouseNumber: t.text("company_house_number"),
    website: t.text("website"),
    industry: industryEnum("industry").notNull(),
    location: t.text("location"),
    notes: t.text("notes"),

    createdAt: t.timestamp("created_at").defaultNow().notNull(),
    updatedAt: t
      .timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  }),
  (table) => [
    index("companies_user_id_idx").on(table.userId),
    unique("companies_user_name_unique").on(table.userId, table.name),
  ],
);
