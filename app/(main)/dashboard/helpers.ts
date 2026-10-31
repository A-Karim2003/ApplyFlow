import { differenceInCalendarDays, format, parseISO } from "date-fns";

//? Takes a "YYYY-MM-DD"
export function relativeDay(applicatonDate: string) {
  const date = parseISO(applicatonDate);
  const days = differenceInCalendarDays(new Date(), date);

  if (days > 30) return format(date, "d MMM");
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

export function daysSince(value: string) {
  return differenceInCalendarDays(new Date(), parseISO(value));
}

export function shortDate(value: string) {
  return format(parseISO(value), "d MMM");
}
/*===================== FOR INTERVIEWS SECTION ====================*/
const LONDON = "Europe/London";

export function interviewTiming(scheduledAt: Date) {
  const days = differenceInCalendarDays(scheduledAt, new Date());

  const time = scheduledAt.toLocaleTimeString("en-GB", {
    timeZone: LONDON,
    hour: "2-digit",
    minute: "2-digit",
  });

  if (days <= 0) return { dayLabel: "Today", whenLabel: time };

  const date = scheduledAt.toLocaleDateString("en-GB", {
    timeZone: LONDON,
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  return {
    dayLabel: days === 1 ? "Tomorrow" : `In ${days} days`,
    whenLabel: `${date} · ${time}`,
  };
}
