"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "./client";
import { generateObjectKey } from "./object-key";
import { getSession } from "../data/session";
import { Result } from "@/types";

const UPLOAD_URL_EXPIRY_SECONDS = 60; // presigned URL valid for 60 seconds

type PresignedUploadResult = {
  presignedUrl: string;
  key: string;
};

export async function generatePresignedUploadUrl(
  filename: string,
  contentType: string,
): Promise<Result<PresignedUploadResult>> {
  const session = await getSession();
  if (!session) return { success: false, error: "Not authenticated" };

  try {
    const key = generateObjectKey(session.user.id, filename);

    const command = new PutObjectCommand({
      Bucket: process.env.APPLYFLOW_BUCKET,
      Key: key,
      ContentType: contentType,
    });

    const url = await getSignedUrl(s3Client, command, {
      expiresIn: UPLOAD_URL_EXPIRY_SECONDS,
    });

    return { success: true, data: { presignedUrl: url, key } };
  } catch {
    return { success: false, error: "Failed to generate upload URL" };
  }
}
