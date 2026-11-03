import { randomUUID } from "crypto";

function sanitiseFilename(filename: string): string {
  return filename
    .replace(/[\\{}\^%`"<>~#|\x00-\x1F]/g, "_") // characters AWS says to avoid
    .replace(/_+/g, "_");
}
export function generateObjectKey(userId: string, filename: string): string {
  const documentUuid = randomUUID();
  const safeFilename = sanitiseFilename(filename);

  return `users/${userId}/documents/${documentUuid}/${safeFilename}`;
}

export function generateAvatarKey(userId: string): string {
  return `users/${userId}/avatar/${randomUUID()}`;
}
