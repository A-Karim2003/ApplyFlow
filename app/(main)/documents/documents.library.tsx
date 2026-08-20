"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
  FileTextIcon,
  FileIcon,
  MoreVerticalIcon,
  DownloadIcon,
  LinkIcon,
  Trash2Icon,
  UploadIcon,
} from "lucide-react";
import { useMemo, useState } from "react";

import type { Document, DocumentsPageData } from "@/lib/data/documents";
import { DOCUMENT_TYPE_OPTIONS } from "@/lib/constants";
import { formatFileSize } from "@/lib/utils";
import UploadDocumentModal from "./upload-document-modal";
import { DocumentsEmptyState } from "./document-empty-state";

const CATEGORY_ICON = {
  cv: FileTextIcon,
  cover_letter: FileIcon,
  other: FileIcon,
} as const;

export function DocumentsLibrary({
  documents,
  applicationDocuments,
}: DocumentsPageData) {
  const [documentTypeFilter, setDocumentTypeFilter] = useState<
    Document["documentType"] | "all"
  >("all");

  const filteredDocuments = useMemo(() => {
    return documents.filter(
      (document) =>
        documentTypeFilter === "all" ||
        document.documentType === documentTypeFilter,
    );
  }, [documents, documentTypeFilter]);

  //? For each document, find the list of linked applications
  const linkedApplicationsByDocumentId = useMemo(() => {
    const docAppMap = new Map<number, typeof applicationDocuments>();

    applicationDocuments.forEach((application) => {
      const list = docAppMap.get(application.documentId) || [];
      list.push(application);
      docAppMap.set(application.documentId, list);
    });

    return docAppMap;
  }, [applicationDocuments]);

  function handleUpload() {
    // Implementation for handling document upload
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          value={documentTypeFilter}
          onValueChange={(filter) => setDocumentTypeFilter(filter)}
        >
          <TabsList>
            <TabsTrigger value="all">All Documents</TabsTrigger>
            {DOCUMENT_TYPE_OPTIONS.map((documentType) => (
              <TabsTrigger key={documentType.value} value={documentType.value}>
                {documentType.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <UploadDocumentModal onUpload={handleUpload}>
          <Button>
            <UploadIcon data-icon="inline-start" />
            Upload document
          </Button>
        </UploadDocumentModal>
      </div>

      {filteredDocuments.length === 0 ? (
        <DocumentsEmptyState documentTypeFilter={documentTypeFilter} />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredDocuments.map((document) => {
            const Icon = CATEGORY_ICON[document.documentType];
            const linkedApplications =
              linkedApplicationsByDocumentId.get(document.id) || [];
            const typeLabel =
              DOCUMENT_TYPE_OPTIONS.find(
                (option) => option.value === document.documentType,
              )?.label ?? document.documentType;

            return (
              <Card key={document.id}>
                <CardContent className="flex flex-col gap-3 pt-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex size-11 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                      <Icon className="size-5" />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                          >
                            <MoreVerticalIcon />
                            <span className="sr-only">Document actions</span>
                          </Button>
                        }
                      />
                      <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                          <DropdownMenuItem>
                            <DownloadIcon />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <LinkIcon />
                            Link to application
                          </DropdownMenuItem>
                          <DropdownMenuItem variant="destructive">
                            <Trash2Icon />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span
                      className="truncate text-sm font-semibold"
                      title={document.filename}
                    >
                      {document.filename}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {document.fileType} · {formatFileSize(document.fileSize)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Badge variant="secondary" className="w-fit">
                      {typeLabel}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Linked to {linkedApplications.length} application
                      {linkedApplications.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
