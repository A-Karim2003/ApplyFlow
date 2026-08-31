"use server";

import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "./client";
import { getSession } from "../data/session";
import { db } from "@/db";
import { documentsTable } from "@/db/schema/documents";
import { and, eq } from "drizzle-orm";
import { Result } from "@/types";

export type PresignedViewResult = {
  presignedUrl: string;
};

const VIEW_URL_EXPIRY_SECONDS = 60 * 5; // 5 min

export async function generatePresignedViewUrl(
  documentId: number,
): Promise<Result<PresignedViewResult>> {
  const session = await getSession();

  if (!session) return { success: false, error: "Not authenticated" };

  // Return the storage key for the document belonging to the user
  try {
    const result = await db
      .select({
        storageKey: documentsTable.storageKey,
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
    });

    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: VIEW_URL_EXPIRY_SECONDS,
    });

    return { success: true, data: { presignedUrl } };
  } catch {
    return { success: false, error: "Failed to generate view URL" };
  }
}
