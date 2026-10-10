"use client";

import { useState, useTransition } from "react";
import { toast } from "react-toastify";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddApplicationForm } from "./add-application-form";
import { getAddApplicationFormData } from "@/actions/applications/get-add-application-form-data";
import type { Company } from "@/lib/data/companies";
import type { Document } from "@/lib/data/documents";
import SpinnerEllipsis from "@/components/shadcn-space/spinner/spinner-05";

type Props = {
  className?: string;
  size?: React.ComponentProps<typeof Button>["size"];
};

export function AddApplicationButton({ className, size }: Props) {
  const [open, setOpen] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await getAddApplicationFormData();
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      setCompanies(result.data.companies);
      setDocuments(result.data.documents);
      setOpen(true);
    });
  }

  return (
    <AddApplicationForm
      open={open}
      onOpenChange={setOpen}
      companies={companies}
      documents={documents}
    >
      <Button
        className={className}
        size={size}
        onClick={handleClick}
        disabled={isPending}
      >
        {isPending ? <SpinnerEllipsis /> : <Plus data-icon="inline-start" />}
        {isPending ? "Loading" : "Add application"}
      </Button>
    </AddApplicationForm>
  );
}
