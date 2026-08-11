"use client";

import { usePathname } from "next/navigation";
import { Plus, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "./page-header";
import { AddApplicationForm } from "./add-application-form";

type RoutePageHeaderProps = {
  userName: string;
  todayLabel: string;
};

type HeaderConfig = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

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
      action: (
        <AddApplicationForm>
          <Button>
            <Plus data-icon="inline-start" />
            Add application
          </Button>
        </AddApplicationForm>
      ),
    };
  }

  if (matchesRoute(pathname, "/applications")) {
    return {
      title: "Applications",
      description: "Track every role you've applied to across its lifecycle.",
      action: (
        <AddApplicationForm>
          <Button>
            <Plus data-icon="inline-start" />
            Add application
          </Button>
        </AddApplicationForm>
      ),
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
      action: (
        <Button variant="outline">
          <Upload data-icon="inline-start" />
          Upload document
        </Button>
      ),
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

  return (
    <PageHeader
      title={header.title}
      description={header.description}
      action={header.action}
    />
  );
}
