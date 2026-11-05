import { pgEnum, pgTable, index, unique } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const documentTypeEnum = pgEnum("document_type", [
  "cv",
  "cover_letter",
  "other",
]);

export const documentsTable = pgTable(
  "documents",
  (t) => ({
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),

    userId: t
      .text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    filename: t.text("filename").notNull(),

    documentType: documentTypeEnum("document_type").notNull(),

    storageKey: t.text("storage_key").notNull(),

    fileType: t.text("file_type"),

    fileSize: t.integer("file_size"),

    createdAt: t.timestamp("created_at").defaultNow().notNull(),
  }),
  (table) => [
    index("documents_user_id_idx").on(table.userId),
    unique("documents_user_id_filename_unique").on(
      table.userId,
      table.filename,
    ),
  ],
);
