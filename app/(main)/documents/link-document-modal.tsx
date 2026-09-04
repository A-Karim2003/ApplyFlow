"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2Icon } from "lucide-react";
import {
  unlinkDocumentFromApplication,
  type LinkedApplication,
} from "@/actions/documents";

interface ViewLinkedApplicationsModalProps {
  documentId: number;
  applications: LinkedApplication[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUnlink: (applicationId: number) => void;
}

export function ViewLinkedApplicationsModal({
  documentId,
  applications,
  isOpen,
  onOpenChange,
  onUnlink,
}: ViewLinkedApplicationsModalProps) {
  const [loadingAppId, setLoadingAppId] = useState<number | null>(null);

  async function handleUnlink(applicationId: number) {
    setLoadingAppId(applicationId);
    try {
      const result = await unlinkDocumentFromApplication(
        documentId,
        applicationId,
      );
      if (result.success) {
        toast.success("Application unlinked successfully");
        onUnlink(applicationId);
      } else {
        toast.error(result.error || "Failed to unlink application");
      }
    } finally {
      setLoadingAppId(null);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Linked Applications</DialogTitle>
          <DialogDescription>
            Applications this document is linked to.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-64 border rounded-md p-3">
          {applications.length === 0 ? (
            <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
              No linked applications
            </div>
          ) : (
            <div className="space-y-2">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="flex items-start justify-between gap-3 p-2 rounded hover:bg-secondary"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {app.companyName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {app.jobTitle}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUnlink(app.id)}
                    disabled={loadingAppId === app.id}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                  >
                    <Trash2Icon className="size-4" />
                    <span className="text-xs ml-1">Unlink</span>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loadingAppId !== null}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
