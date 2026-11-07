"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "./client";
import { generateObjectKey } from "./object-key";
import { getSession } from "../data/session";
import { Result } from "@/types";
import { db } from "@/db";
import { documentsTable } from "@/db/schema/documents";
import { and, eq } from "drizzle-orm";

const UPLOAD_URL_EXPIRY_SECONDS = 60; // presigned URL valid for 60 seconds

export type PresignedUploadResult = {
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
    const existingDocument = await db
      .select({ id: documentsTable.id })
      .from(documentsTable)
      .where(
        and(
          eq(documentsTable.userId, session.user.id),
          eq(documentsTable.filename, filename),
        ),
      )
      .limit(1);

    if (existingDocument.length > 0) {
      return {
        success: false,
        error: `You already have a document called ${filename}`,
      };
    }

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
