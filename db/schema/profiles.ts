import { pgTable } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export type NewProfile = typeof profilesTable.$inferInsert;
export type SelectProfile = typeof profilesTable.$inferSelect;

export const profilesTable = pgTable("profiles", (t) => ({
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),

  userId: t
    .text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),

  firstName: t.text("first_name").notNull(),
  lastName: t.text("last_name").notNull(),
  bio: t.text("bio"),

  createdAt: t.timestamp("created_at").defaultNow().notNull(),
  updatedAt: t
    .timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}));
