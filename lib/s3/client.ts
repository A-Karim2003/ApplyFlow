import { S3Client } from "@aws-sdk/client-s3";
import { awsCredentialsProvider } from "@vercel/oidc-aws-credentials-provider";

const region = process.env.AWS_REGION;
const roleArn = process.env.AWS_APPLYFLOW_ROLE_ARN;

const isVercel = process.env.VERCEL === "1";

if (!region) throw new Error("AWS_REGION is not defined.");

if (isVercel && !roleArn) {
  throw new Error("AWS_APPLYFLOW_ROLE_ARN is not defined.");
}

export const s3Client = new S3Client({
  region,
  // Use Vercel OIDC provider in production when AWS_PROFILE is not set
  credentials: isVercel
    ? awsCredentialsProvider({
        roleArn: process.env.AWS_APPLYFLOW_ROLE_ARN!,
      })
    : undefined, // Defaults to standard credential chain (reads AWS_PROFILE)
});
