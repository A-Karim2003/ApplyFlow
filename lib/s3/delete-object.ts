import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./client";

export async function deleteObject(storageKey: string) {
  const command = new DeleteObjectCommand({
    Bucket: process.env.APPLYFLOW_BUCKET,
    Key: storageKey,
  });
  await s3Client.send(command);
}
