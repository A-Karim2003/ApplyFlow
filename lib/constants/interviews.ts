import { interviewOutcome, interviewType } from "@/db/schema";

/*========================Interview Type========================*/

type InterviewType = (typeof interviewType.enumValues)[number];

const INTERVIEW_TYPES: Record<InterviewType, string> = {
  phone_screen: "Phone screen",
  online_assessment: "Online assessment",
  technical_interview: "Technical interview",
  coding_interview: "Coding interview",
  system_design_interview: "System design interview",
  behavioural_interview: "Behavioural interview",
  hiring_manager_interview: "Hiring manager interview",
  team_interview: "Team interview",
  final_interview: "Final interview",
};

export const INTERVIEW_TYPE_OPTIONS = interviewType.enumValues.map(
  (type) => ({
    label: INTERVIEW_TYPES[type],
    value: type,
  }),
);

/*=======================Interview Outcome=======================*/

type InterviewOutcome = (typeof interviewOutcome.enumValues)[number];

const INTERVIEW_OUTCOMES: Record<InterviewOutcome, string> = {
  pending: "Pending",
  passed: "Passed",
  failed: "Failed",
};

export const INTERVIEW_OUTCOME_OPTIONS = interviewOutcome.enumValues.map(
  (outcome) => ({
    label: INTERVIEW_OUTCOMES[outcome],
    value: outcome,
  }),
);