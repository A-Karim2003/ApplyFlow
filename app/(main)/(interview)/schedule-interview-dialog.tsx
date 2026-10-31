"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import ScheduleInterviewForm from "./schedule-interview-form";
import { JobType, JOB_TYPES } from "@/lib/constants";
import CompanyLogo from "@/app/_components/company-logo";

export type ApplicationForInterview = {
  applicationId: number | null;
  jobTitle: string | null;
  jobType: JobType | null;
  companyName: string | null;
};

type ScheduleInterviewDialogProps = {
  open: boolean;
  application: ApplicationForInterview;
  onOpenChange: (open: boolean) => void;
};

export function ScheduleInterviewDialog({
  open,
  application,
  onOpenChange,
}: ScheduleInterviewDialogProps) {
  if (application.applicationId === null) return null;

  const { applicationId, jobTitle, jobType, companyName } = application;

  //* "Acme · Graduate"; skips whichever part is missing
  const subtitle = [companyName, jobType && JOB_TYPES[jobType]]
    .filter(Boolean)
    .join(" · ");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:w-[90%] sm:max-w-[90%] md:w-[80%] md:max-w-[80%] lg:w-[80%] lg:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Schedule interview</DialogTitle>
          <DialogDescription>
            Optional. Skip and the application stays in Interview.
          </DialogDescription>
        </DialogHeader>

        {/*=======Which application this is for=======*/}
        <div className="flex items-center gap-3 rounded-lg border bg-muted/40 p-3">
          {companyName && <CompanyLogo name={companyName} />}
          <div className="min-w-0">
            <p className="truncate font-medium">
              {jobTitle ?? "Untitled role"}
            </p>
            {subtitle && (
              <p className="truncate text-sm text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <ScheduleInterviewForm
          applicationId={applicationId}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
