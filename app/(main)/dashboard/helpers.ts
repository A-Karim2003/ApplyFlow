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
