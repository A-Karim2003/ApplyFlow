"use server";

import { db } from "@/db";
import { getSession } from "../data/session";
import { documentsTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { Result } from "@/types";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./client";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

type PresignedDownloadResult = {
  presignedUrl: string;
};

const DOWNLOAD_URL_EXPIRY_SECONDS = 60;

export async function generatePresignedDownloadUrl(
  documentId: number,
): Promise<Result<PresignedDownloadResult>> {
  const session = await getSession();

  if (!session) return { success: false, error: "Not authenticated" };

  try {
    const result = await db
      .select({
        storageKey: documentsTable.storageKey,
        filename: documentsTable.filename,
      })
      .from(documentsTable)
      .where(
        and(
          eq(documentsTable.id, documentId),
          eq(documentsTable.userId, session.user.id),
        ),
      );

    if (result.length === 0)
      return { success: false, error: "Document not found" };

    const command = new GetObjectCommand({
      Bucket: process.env.APPLYFLOW_BUCKET,
      Key: result[0].storageKey,
      ResponseContentDisposition: `attachment; filename="${result[0].filename}"`,
    });

    // Generate the presigned URL
    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: DOWNLOAD_URL_EXPIRY_SECONDS,
    });

    return { success: true, data: { presignedUrl } };
  } catch (error) {
    console.error(
      "Error occurred while generating presigned download URL:",
      error,
    );
    return { success: false, error: "Error occurred while fetching document" };
  }
}
