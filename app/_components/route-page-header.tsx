"use client";

import { usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "react-toastify";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "./page-header";
import { AddApplicationForm } from "./add-application-form";
import { getAddApplicationFormData } from "@/actions/applications/get-add-application-form-data";
import type { Company } from "@/lib/data/companies";
import type { Document } from "@/lib/data/documents";
import SpinnerEllipsis from "@/components/shadcn-space/spinner/spinner-05";

type RoutePageHeaderProps = {
  userName: string;
  todayLabel: string;
};

type HeaderConfig = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

function AddApplicationHeaderAction() {
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
      <Button onClick={handleClick} disabled={isPending}>
        {isPending ? <SpinnerEllipsis /> : <Plus data-icon="inline-start" />}
        {isPending ? "Loading" : "Add application"}
      </Button>
    </AddApplicationForm>
  );
}

function matchesRoute(pathname: string, route: string): boolean {
  return pathname === route || pathname.startsWith(`${route}/`);
}

function getHeaderConfig(
  pathname: string,
  userName: string,
  todayLabel: string,
): HeaderConfig {
  if (matchesRoute(pathname, "/dashboard")) {
    return {
      title: `Good morning, ${userName}`,
      description: todayLabel,
    };
  }

  if (matchesRoute(pathname, "/applications")) {
    return {
      title: "Applications",
      description: "Track every role you've applied to across its lifecycle.",
    };
  }

  if (matchesRoute(pathname, "/companies")) {
    return {
      title: "Companies",
      description:
        "Every company in your pipeline, with contacts, notes, and open roles.",
    };
  }

  if (matchesRoute(pathname, "/documents")) {
    return {
      title: "Documents",
      description:
        "Your resumes, cover letters, and certificates in one vault.",
    };
  }

  if (matchesRoute(pathname, "/account")) {
    return {
      title: "Account",
      description: "Manage your profile, security, and workspace settings.",
    };
  }

  return {
    title: "ApplyFlow",
    description: "Keep your job search organized from one place.",
  };
}

export function RoutePageHeader({
  userName,
  todayLabel,
}: RoutePageHeaderProps) {
  const pathname = usePathname();
  const header = getHeaderConfig(pathname, userName, todayLabel);
  const action =
    header.action ??
    (matchesRoute(pathname, "/dashboard") ? (
      <AddApplicationHeaderAction />
    ) : undefined);

  return (
    <PageHeader
      title={header.title}
      description={header.description}
      action={action}
    />
  );
}
