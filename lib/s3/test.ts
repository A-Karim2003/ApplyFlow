"use server";

import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./client";

export async function testS3() {
  const command = new PutObjectCommand({
    Bucket: "applyflow-bucket",
    Key: "test.txt",
    Body: "S3 connection test",
    ContentType: "text/plain",
  });

  const response = await s3Client.send(command);
  console.log("S3 test successful:", response);
}

export async function deleteTestS3() {
  const command = new DeleteObjectCommand({
    Bucket: "applyflow-bucket",
    Key: "test.txt",
  });

  const response = await s3Client.send(command);
  console.log("S3 test deletion successful:", response);
}
