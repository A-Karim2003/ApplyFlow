CREATE TYPE "public"."application_source" AS ENUM('linkedin', 'indeed', 'company_website', 'referral', 'university', 'other');--> statement-breakpoint
ALTER TABLE "applications" ALTER COLUMN "job_type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "source" "application_source" NOT NULL;