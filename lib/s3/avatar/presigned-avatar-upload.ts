"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { Result } from "@/types";
import { requireSession } from "../../data/session";
import { avatarUploadSchema } from "../../validations/profile";
import { s3Client } from "../client";
import { generateAvatarKey } from "../object-key";

const AVATAR_UPLOAD_EXPIRY_SECONDS = 60;

type AvatarUploadResult = { presignedUrl: string; key: string };

export async function createAvatarUploadUrl(input: {
  contentType: string;
  size: number;
}): Promise<Result<AvatarUploadResult>> {
  const session = await requireSession();

  const parsedInput = avatarUploadSchema.safeParse(input);
  if (!parsedInput.success) {
    return { success: false, error: "Use a JPG, PNG or WebP image under 2MB." };
  }
  const { contentType, size } = parsedInput.data;

  try {
    const key = generateAvatarKey(session.user.id);

    const command = new PutObjectCommand({
      Bucket: process.env.APPLYFLOW_BUCKET,
      Key: key,
      ContentType: contentType,
      ContentLength: size,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: AVATAR_UPLOAD_EXPIRY_SECONDS,
    });

    return { success: true, data: { presignedUrl, key } };
  } catch (error) {
    console.error("createAvatarUploadUrl failed:", error);
    return { success: false, error: "Failed to generate upload URL" };
  }
}
