"use client";

import { useRef, useState, useTransition } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Document } from "@/lib/data/documents";
import { DOCUMENT_TYPE_OPTIONS } from "@/lib/constants";
import { formatFileSize } from "@/lib/utils";
import {
  UploadCloudIcon,
  FileTextIcon,
  FileIcon,
  ImageIcon,
  XIcon,
} from "lucide-react";

const ACCEPTED = ".pdf,.doc,.docx,.png,.jpg,.jpeg";
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

type DocType = Document["documentType"];

// What we know about a file before it's actually persisted. Once S3 +
// createDocument are wired up, the parent turns these into real
// Document rows (id, storageKey, createdAt come from the server).
export type PendingDocumentUpload = {
  filename: string;
  documentType: DocType;
  fileType: string;
  fileSize: number;
};

interface StagedFile {
  id: string;
  file: File;
  docType: DocType;
  status: "valid" | "error";
  error?: string;
}

function fileExtension(name: string) {
  const parts = name.split(".");
  return parts.length > 1 ? parts.pop()!.toUpperCase() : "FILE";
}

function iconForFile(file: File) {
  if (file.type.startsWith("image/")) return ImageIcon;
  if (file.type === "application/pdf") return FileTextIcon;
  return FileIcon;
}

//* This function helps guess the type of document e.g (CV, Cover Letter, Other)
//* based on the name of the document
function guessDocType(name: string): DocType {
  const lower = name.toLowerCase();
  if (lower.includes("cover")) return "cover_letter";
  if (lower.includes("cv") || lower.includes("resume")) return "cv";
  return "other";
}

interface UploadDocumentModalProps {
  children: React.ReactNode;
  onUpload: (docs: PendingDocumentUpload[]) => void;
}

export default function UploadDocumentModal({
  children,
  onUpload,
}: UploadDocumentModalProps) {
  const [open, setOpen] = useState(false);
  const [staged, setStaged] = useState<StagedFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function reset() {
    setStaged([]);
    setDragging(false);
  }

  function addFiles(fileList: FileList | null) {
    if (!fileList) return;

    const newStagedFiles: StagedFile[] = [];
    for (const file of Array.from(fileList)) {
      const oversize = file.size > MAX_BYTES;
      newStagedFiles.push({
        id: `${file.name}-${file.size}-${crypto.randomUUID()}`,
        file,
        docType: guessDocType(file.name),
        status: oversize ? "error" : "valid",
        error: oversize ? "Exceeds 10 MB limit" : undefined,
      });
    }
    setStaged((current) => [...current, ...newStagedFiles]);
  }

  function removeFile(id: string) {
    setStaged((current) => current.filter((f) => f.id !== id));
  }

  function updateDocType(id: string, docType: DocType) {
    setStaged((current) =>
      current.map((file) => (file.id === id ? { ...file, docType } : file)),
    );
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);

    addFiles(e.dataTransfer.files);
  }

  function handleUpload() {
    const valid = staged.filter((f) => f.status === "valid");
    if (valid.length === 0) return;

    // TODO: once S3 + createDocument are wired up, this becomes a real
    // async upload (presigned URL PUT, then createDocument server
    // action) instead of an immediate pass-through.
    startTransition(() => {
      const docs: PendingDocumentUpload[] = valid.map((item) => ({
        filename: item.file.name,
        documentType: item.docType,
        fileType: item.file.type || fileExtension(item.file.name),
        fileSize: item.file.size,
      }));

      onUpload(docs);
      setOpen(false);
      reset();
    });
  }

  const validCount = staged.filter((f) => f.status === "valid").length;

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) reset();
      }}
    >
      <DialogTrigger render={children as React.ReactElement} />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload documents</DialogTitle>
          <DialogDescription>
            Add resumes, cover letters, or other files. PDF, DOC, DOCX, or
            images up to 10 MB.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Dropzone */}
          <Button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                setDragging(false);
              }
            }}
            onDrop={handleDrop}
            className={cn(
              "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-8 text-center transition-colors",
              dragging
                ? "border-primary bg-accent"
                : "border-border bg-muted/40 hover:border-primary/50 hover:bg-accent/50",
            )}
          >
            <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
              <UploadCloudIcon className="size-5" />
            </span>
            <span className="text-sm font-medium text-foreground">
              Drag &amp; drop files here, or{" "}
              <span className="text-primary">browse</span>
            </span>
            <span className="text-xs text-muted-foreground">
              PDF, DOC, DOCX, PNG, JPG — max 10 MB each
            </span>
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPTED}
              multiple
              className="hidden"
              onChange={(e) => {
                addFiles(e.target.files);
                e.target.value = "";
              }}
            />
          </Button>

          {/* Staged file list */}
          {staged.length > 0 && (
            <ul className="flex max-h-64 flex-col gap-2 overflow-y-auto">
              {staged.map((item) => {
                const Icon = iconForFile(item.file);
                const isError = item.status === "error";
                return (
                  <li
                    key={item.id}
                    className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
                  >
                    <span
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-md",
                        isError
                          ? "bg-destructive/10 text-destructive"
                          : "bg-secondary text-secondary-foreground",
                      )}
                    >
                      <Icon className="size-4" />
                    </span>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <span
                        className="truncate text-sm font-medium"
                        title={item.file.name}
                      >
                        {item.file.name}
                      </span>
                      <span
                        className={cn(
                          "text-xs",
                          isError
                            ? "text-destructive"
                            : "text-muted-foreground",
                        )}
                      >
                        {isError
                          ? item.error
                          : `${fileExtension(item.file.name)} · ${formatFileSize(item.file.size)}`}
                      </span>
                    </div>

                    {!isError && (
                      <Select
                        value={item.docType}
                        onValueChange={(docType) =>
                          updateDocType(item.id, docType as DocType)
                        }
                      >
                        <SelectTrigger size="sm" className="w-36 shrink-0">
                          <SelectValue>
                            {(value: DocType) =>
                              DOCUMENT_TYPE_OPTIONS.find(
                                (option) => option.value === value,
                              )?.label
                            }
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {DOCUMENT_TYPE_OPTIONS.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8 shrink-0"
                      onClick={() => removeFile(item.id)}
                    >
                      <XIcon />
                      <span className="sr-only">Remove {item.file.name}</span>
                    </Button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <DialogFooter>
          <DialogClose
            render={
              <Button variant="outline" disabled={isPending}>
                Cancel
              </Button>
            }
          />
          <Button
            onClick={handleUpload}
            disabled={validCount === 0 || isPending}
          >
            {isPending
              ? "Uploading…"
              : validCount > 0
                ? `Upload ${validCount} file${validCount > 1 ? "s" : ""}`
                : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
