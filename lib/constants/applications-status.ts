import {
  applicationSourceEnum,
  applicationStatusEnum,
  jobTypeEnum,
  workModeEnum,
} from "@/db/schema";

/*=======================Application Status=======================*/
export type ApplicationStatus =
  (typeof applicationStatusEnum.enumValues)[number];

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  wishlist: "Wishlist",
  applied: "Applied",
  online_assessment: "Online Assessment",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
};

export const STATUS_OPTIONS = applicationStatusEnum.enumValues.map(
  (status) => ({
    label: STATUS_LABELS[status],
    value: status,
  }),
);
/*============================Job Type=============================*/

export type JobType = (typeof jobTypeEnum.enumValues)[number];

const JOB_TYPES: Record<JobType, string> = {
  full_time: "Full-time",
  part_time: "Part-time",
  internship: "Internship",
  placement: "Placement",
  graduate: "Graduate",
  contract: "Contract",
};

export const JOB_TYPE_OPTIONS = jobTypeEnum.enumValues.map((type) => ({
  label: JOB_TYPES[type],
  value: type,
}));

/*===========================Work Mode=============================*/

export type WorkMode = (typeof workModeEnum.enumValues)[number];

const WORK_MODES: Record<WorkMode, string> = {
  remote: "Remote",
  hybrid: "Hybrid",
  onsite: "On-site",
};

export const WORK_MODE_OPTIONS = workModeEnum.enumValues.map((mode) => ({
  label: WORK_MODES[mode],
  value: mode,
}));

/*========================Application Source========================*/

type ApplicationSource = (typeof applicationSourceEnum.enumValues)[number];

const APPLICATION_SOURCES: Record<ApplicationSource, string> = {
  linkedin: "LinkedIn",
  indeed: "Indeed",
  company_website: "Company website",
  referral: "Referral",
  university: "University",
  other: "Other",
};

export const APPLICATION_SOURCE_OPTIONS = applicationSourceEnum.enumValues.map(
  (source) => ({
    label: APPLICATION_SOURCES[source],
    value: source,
  }),
);

export type ApplicationSortKey = "recent" | "oldest" | "company";

export const APPLICATION_SORT_OPTIONS: {
  label: string;
  value: ApplicationSortKey;
}[] = [
  { label: "Date applied (newest)", value: "recent" },
  { label: "Date applied (oldest)", value: "oldest" },
  { label: "Company (A-Z)", value: "company" },
];

export const APPLICATION_STATUS_FILTER = {
  label: "Status",
  options: [{ label: "All", value: "all" }, ...STATUS_OPTIONS],
};

export const APPLICATION_JOB_TYPE_FILTER = {
  label: "Job type",
  options: [{ label: "All", value: "all" }, ...JOB_TYPE_OPTIONS],
};

export const APPLICATION_WORK_MODE_FILTER = {
  label: "Work mode",
  options: [{ label: "All", value: "all" }, ...WORK_MODE_OPTIONS],
};
