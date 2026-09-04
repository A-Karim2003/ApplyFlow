import { FileIcon } from "lucide-react";
import { DOCUMENT_TYPE_OPTIONS } from "@/lib/constants";
import type { Document } from "@/lib/data/documents";

export function DocumentsEmptyState({
  documentTypeFilter,
}: {
  documentTypeFilter: Document["documentType"] | "all";
}) {
  const filterLabel = DOCUMENT_TYPE_OPTIONS.find(
    (option) => option.value === documentTypeFilter,
  )?.label.toLowerCase();

  const message =
    documentTypeFilter === "all"
      ? "Upload your first resume, cover letter or certificate."
      : documentTypeFilter === "other"
        ? "No other documents yet."
        : `No ${filterLabel ?? "documents"} yet.`;

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
      <FileIcon className="mb-3 size-10 text-muted-foreground/60" />
      <p className="text-sm font-medium">No documents found</p>
      <p className="mt-1 text-xs text-muted-foreground">{message}</p>
    </div>
  );
}
