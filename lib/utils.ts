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

export const wait = (seconds: number) =>
  new Promise((resolve) => setTimeout(resolve, seconds * 1000));

export function formatFileSize(bytes: number | null): string {
  if (bytes === null) return "Unknown size";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatDocumentType(fileType: string) {
  const normalizedFileType = fileType.toLowerCase();

  if (normalizedFileType.startsWith("image/")) return "Image";

  const documentTypeLabels: Record<string, string> = {
    "application/pdf": "PDF",
    "application/msword": "DOC",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "DOCX",
    "application/vnd.ms-excel": "XLS",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "XLSX",
    "application/vnd.ms-powerpoint": "PPT",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      "PPTX",
    "text/plain": "TXT",
    "text/csv": "CSV",
    "application/zip": "ZIP",
  };

  return (
    documentTypeLabels[normalizedFileType] ??
    fileType.split("/").at(-1)?.toUpperCase() ??
    fileType
  );
}

export function formatDate(date: Date | string) {
  const formatted = new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const time = new Date(date).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${formatted}, ${time}`;
}
