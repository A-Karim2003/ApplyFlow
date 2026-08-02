import { pgTable } from "drizzle-orm/pg-core";

export const profilesTable = pgTable("profiles", (t) => ({
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  user_id: t
    .integer()
    .notNull()
    .references(() => usersTable.id),
  first_name: t.text().notNull(),
  last_name: t.text().notNull(),
  bio: t.text(),
  created_at: t.timestamp().defaultNow(),
  updated_at: t.timestamp().defaultNow(),
}));
