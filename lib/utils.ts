import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function formatEnumLabel(value: string | null | undefined) {
  if (!value?.trim()) return "Not set";

  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function formatLocation(location: string | null | undefined) {
  return location?.trim() || "Location not set";
}

export function formatSalaryRange(
  minSalary: number | null | undefined,
  maxSalary: number | null | undefined,
) {
  if (minSalary == null && maxSalary == null) {
    return "Salary not listed";
  }

  const formatter = new Intl.NumberFormat("en-UK", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  });

  if (minSalary != null && maxSalary != null) {
    return `${formatter.format(minSalary)} - ${formatter.format(maxSalary)}`;
  }

  if (minSalary != null) {
    return `From ${formatter.format(minSalary)}`;
  }

  return `Up to ${formatter.format(maxSalary ?? 0)}`;
}
