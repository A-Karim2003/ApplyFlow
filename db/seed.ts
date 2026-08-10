import dotenv from "dotenv";
import { existsSync } from "node:fs";
import {
  companiesTable,
  applicationsTable,
  applicationStatusHistoryTable,
  documentsTable,
  interviews,
} from "@/db/schema";

const envPath = existsSync(".env") ? ".env" : ".env.local";
dotenv.config({ path: envPath });

const SEED_USER_ID = "B4MHUOBhkZ3tAm0U2ErriJtfaStw99C9";

async function seed() {
  const { db } = await import("@/db");

  // 2. Companies
  const companies = await db
    .insert(companiesTable)
    .values([
      {
        userId: SEED_USER_ID,
        name: "Google",
        website: "https://google.com",
        industry: "technology",
        location: "Mountain View, CA",
        notes:
          "Referred by Amina from the alumni network. L3 new-grad pipeline closes in March.",
      },
      {
        userId: SEED_USER_ID,
        name: "Stripe",
        website: "https://stripe.com",
        industry: "fintech",
        location: "Remote (US)",
        notes:
          "Strong emphasis on systems design. Prep payment-ledger case study.",
      },
      {
        userId: SEED_USER_ID,
        name: "Figma",
        website: "https://figma.com",
        industry: "technology",
        location: "San Francisco, CA",
        notes: "Design-engineering hybrid role. They loved the portfolio site.",
      },
      {
        userId: SEED_USER_ID,
        name: "Notion",
        website: "https://notion.so",
        industry: "technology",
        location: "Hybrid · New York",
        notes:
          "Waiting on take-home feedback. Follow up if no reply by Friday.",
      },
      {
        userId: SEED_USER_ID,
        name: "Linear",
        website: "https://linear.app",
        industry: "technology",
        location: "Remote (Global)",
        notes: "Small team, fast process. Recruiter very responsive.",
      },
    ])
    .returning();

  const [google, stripe, figma, notion, linear] = companies;

  // 3. Documents
  const docs = await db
    .insert(documentsTable)
    .values([
      {
        userId: SEED_USER_ID,
        filename: "Abdoulkarim_Resume_2026.pdf",
        documentType: "cv",
        storageKey: "seed/resume-main.pdf",
        fileType: "application/pdf",
        fileSize: 284_000,
      },
      {
        userId: SEED_USER_ID,
        filename: "CoverLetter_Figma.docx",
        documentType: "cover_letter",
        storageKey: "seed/cover-figma.docx",
        fileType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        fileSize: 48_000,
      },
    ])
    .returning();

  const [resume, coverLetter] = docs;

  // 4. Applications
  const apps = await db
    .insert(applicationsTable)
    .values([
      {
        userId: SEED_USER_ID,
        companyId: google.id,
        resumeDocumentId: resume.id,
        jobTitle: "Software Engineer, New Grad",
        jobType: "graduate",
        jobUrl: "https://careers.google.com/jobs/123",
        location: "Mountain View, CA",
        workMode: "onsite",
        salaryMin: 135_000,
        salaryMax: 155_000,
        status: "interview",
        appliedAt: "2026-06-18",
      },
      {
        userId: SEED_USER_ID,
        companyId: stripe.id,
        resumeDocumentId: resume.id,
        jobTitle: "Frontend Engineer",
        jobType: "full_time",
        location: "Remote (US)",
        workMode: "remote",
        salaryMin: 128_000,
        salaryMax: 150_000,
        status: "online_assessment",
        appliedAt: "2026-07-02",
      },
      {
        userId: SEED_USER_ID,
        companyId: figma.id,
        resumeDocumentId: resume.id,
        coverLetterDocumentId: coverLetter.id,
        jobTitle: "Product Engineer",
        jobType: "full_time",
        location: "San Francisco, CA",
        workMode: "hybrid",
        salaryMin: 130_000,
        salaryMax: 160_000,
        status: "interview",
        appliedAt: "2026-06-28",
      },
      {
        userId: SEED_USER_ID,
        companyId: notion.id,
        jobTitle: "Software Engineer, Frontend",
        jobType: "full_time",
        location: "New York, NY",
        workMode: "hybrid",
        salaryMin: 125_000,
        salaryMax: 145_000,
        status: "applied",
        appliedAt: "2026-07-20",
      },
      {
        userId: SEED_USER_ID,
        companyId: linear.id,
        jobTitle: "Full-Stack Engineer",
        jobType: "full_time",
        location: "Remote (Global)",
        workMode: "remote",
        salaryMin: 120_000,
        salaryMax: 140_000,
        status: "offer",
        appliedAt: "2026-05-30",
      },
      {
        userId: SEED_USER_ID,
        companyId: stripe.id,
        jobTitle: "Platform Engineer",
        jobType: "full_time",
        location: "Remote (US)",
        workMode: "remote",
        salaryMin: 135_000,
        salaryMax: 165_000,
        status: "wishlist",
      },
    ])
    .returning();

  // 5. Status history (one row per current status, simulating the journey)
  await db.insert(applicationStatusHistoryTable).values(
    apps
      .filter((a) => a.status !== "wishlist")
      .map((a) => ({
        applicationId: a.id,
        previousStatus: "applied" as const,
        status: a.status,
      })),
  );

  // 6. Interviews (tied to the two "interview" status applications)
  const googleApp = apps.find((a) => a.companyId === google.id)!;
  const figmaApp = apps.find((a) => a.companyId === figma.id)!;

  await db.insert(interviews).values([
    {
      applicationId: googleApp.id,
      scheduledAt: new Date("2026-08-06T10:00:00Z"),
      interviewerName: null,
      interviewType: "system_design_interview",
      outcome: "pending",
    },
    {
      applicationId: figmaApp.id,
      scheduledAt: new Date("2026-08-07T14:30:00Z"),
      interviewerName: null,
      interviewType: "technical_interview",
      outcome: "pending",
    },
  ]);

  console.log("Seed complete.");
}

seed()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .then(() => process.exit(0));
