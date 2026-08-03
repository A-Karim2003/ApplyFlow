import { pgTable, index } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const companiesTable = pgTable(
  "companies",
  (t) => ({
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),

    userId: t
      .text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    name: t.text("name").notNull(),
    website: t.text("website"),
    industry: t.text("industry"),
    location: t.text("location"),
    notes: t.text("notes"),

    createdAt: t.timestamp("created_at").defaultNow().notNull(),
    updatedAt: t
      .timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  }),
  (table) => [index("companies_user_id_idx").on(table.userId)],
);
