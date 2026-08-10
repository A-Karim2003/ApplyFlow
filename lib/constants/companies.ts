import { industryEnum } from "@/db/schema";

/*===========================Industry=============================*/

type Industry = (typeof industryEnum.enumValues)[number];

const INDUSTRIES: Record<Industry, string> = {
  technology: "Technology",
  finance: "Finance",
  fintech: "Fintech",
  healthcare: "Healthcare",
  ecommerce: "E-commerce",
  consulting: "Consulting",
  education: "Education",
  media_entertainment: "Media & entertainment",
  gaming: "Gaming",
  manufacturing: "Manufacturing",
  retail: "Retail",
  telecommunications: "Telecommunications",
  energy: "Energy",
  government: "Government",
  nonprofit: "Non-profit",
  real_estate: "Real estate",
  transportation: "Transportation",
  hospitality: "Hospitality",
  other: "Other",
};

export const INDUSTRY_OPTIONS = industryEnum.enumValues.map((industry) => ({
  label: INDUSTRIES[industry],
  value: industry,
}));