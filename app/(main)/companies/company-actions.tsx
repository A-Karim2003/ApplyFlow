"use client";

import { useState, useTransition } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVerticalIcon } from "lucide-react";
import { CompanyFormModal } from "@/app/(main)/companies/company-form-modal";
import { deleteCompany } from "@/actions/companies";
import type { Application, Company } from "@/lib/data/companies";

interface CompanyActionsProps {
  company: Company;
  applications: Application[];
  onDeleted?: () => void;
}

export default function CompanyActions({
  company,
  applications,
  onDeleted,
}: CompanyActionsProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, startDelete] = useTransition();

  function handleDelete() {
    setDeleteError(null);
    startDelete(async () => {
      try {
        const result = await deleteCompany(company.id);
        if (!result.success) {
          setDeleteError(result.error);
          return;
        }
        setDeleteOpen(false);
        onDeleted?.();
      } catch (error) {
        setDeleteError(
          error instanceof Error ? error.message : "Something went wrong",
        );
      }
    });
  }

  return (
    <>
      <CompanyFormModal
        company={company}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon-sm">
              <EllipsisVerticalIcon />
              <span className="sr-only">Company actions</span>
            </Button>
          }
        />
        {/* Actions */}
        <DropdownMenuContent align="end" sideOffset={6}>
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setDeleteOpen(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Company Alert */}
      <AlertDialog
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open);
          if (!open) setDeleteError(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete company {company.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              {applications.length > 0
                ? `This permanently removes ${company.name} and its ${applications.length} tracked ${applications.length === 1 ? "application" : "applications"}. This action cannot be undone.`
                : `This permanently removes ${company.name}. This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {deleteError && (
            <p className="text-sm text-destructive wrap-break-word">
              {deleteError}
            </p>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isDeleting}
              onClick={handleDelete}
            >
              {isDeleting ? "Deleting…" : "Delete company"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
