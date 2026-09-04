import { pgTable, index, uniqueIndex, primaryKey } from "drizzle-orm/pg-core";
import { applicationsTable } from "./applications";
import { documentsTable } from "./documents";

export const applicationDocumentsTable = pgTable(
  "application_documents",
  (t) => ({
    applicationId: t
      .integer("application_id")
      .notNull()
      .references(() => applicationsTable.id, { onDelete: "cascade" }),

    documentId: t
      .integer("document_id")
      .notNull()
      .references(() => documentsTable.id, { onDelete: "cascade" }),

    createdAt: t.timestamp("created_at").defaultNow().notNull(),
  }),
  (table) => [
    primaryKey({ columns: [table.applicationId, table.documentId] }),
    uniqueIndex("application_documents_unique_idx").on(
      table.applicationId,
      table.documentId,
    ),
    index("application_documents_application_id_idx").on(table.applicationId),
  ],
);
