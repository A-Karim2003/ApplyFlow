import { Briefcase, CalendarClock, TrendingUp, Trophy } from "lucide-react";

import { getStatCards } from "@/lib/data/dashboard/sections/kpi";

import { KpiCards, type Kpi } from "./kpi-cards";
import { SectionError } from "../components/section-error";

const toneOf = (totalChange: number | null): Kpi["tone"] =>
  totalChange === null || totalChange === 0
    ? "neutral"
    : totalChange > 0
      ? "up"
      : "down";

const signed = (value: number | null): string => {
  if (value === null) return "-";
  return value >= 0 ? `+${value}` : String(value);
};

export async function KpiCardsSection({
  days,
  label,
}: {
  days: number | null;
  label: string; //? e.g. "6 months", for the "vs previous" text
}) {
  const result = await getStatCards(days);
  if (!result.success) return <SectionError message={result.error} />;

  const data = result.data;

  const totalChange =
    data.previousTotalApplications === null
      ? null
      : data.totalApplications - data.previousTotalApplications;

  const rateChange =
    data.responseRate !== null && data.previousResponseRate !== null
      ? data.responseRate - data.previousResponseRate
      : null;

  const kpis: Kpi[] = [
    {
      label: "Total applications",
      value: String(data.totalApplications),
      sub:
        totalChange === null
          ? "All time"
          : `${signed(totalChange)} vs previous ${label}`,
      icon: Briefcase,
      href: "/applications",
      tone: toneOf(totalChange),
    },
    {
      label: "In interview stage",
      value: String(data.interviewCount),
      sub:
        data.interviewCount > 0
          ? data.interviewCompanies.join(", ")
          : "None yet",
      icon: CalendarClock,
    },
    {
      label: "Offers received",
      value: String(data.offers),
      sub: data.offers > 0 ? data.offerCompanies.join(", ") : "None yet",
      icon: Trophy,
    },
    {
      label: "Response rate",
      value: data.responseRate === null ? "-" : `${data.responseRate}%`,
      sub:
        data.responseRate === null
          ? "Nothing submitted yet"
          : data.previousResponseRate === null
            ? `${data.repliedCount} of ${data.totalApplications} got a reply`
            : `vs ${data.previousResponseRate}% in previous ${label}`,
      icon: TrendingUp,
      tone: toneOf(rateChange),
    },
  ];

  return <KpiCards items={kpis} />;
}
