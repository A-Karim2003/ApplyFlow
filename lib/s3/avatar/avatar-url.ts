import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "../client";

const AVATAR_VIEW_EXPIRY_SECONDS = 60 * 60; // 1 hour

export async function getAvatarUrl(key: string | null): Promise<string | null> {
  if (!key) return null;

  try {
    const command = new GetObjectCommand({
      Bucket: process.env.APPLYFLOW_BUCKET,
      Key: key,
    });
    return await getSignedUrl(s3Client, command, {
      expiresIn: AVATAR_VIEW_EXPIRY_SECONDS,
    });
  } catch (error) {
    console.error("getAvatarUrl failed:", error);
    return null; // caller falls back to the Google photo, then initials
  }
}
