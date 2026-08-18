import "dotenv/config";
import { db } from "@/db";
import {
  applicationDocumentsTable,
  applicationsTable,
  applicationStatusHistoryTable,
  companiesTable,
  documentsTable,
  interviewsTable,
  user,
} from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

const SEED_USER_ID = "wgZV35elYSi3hQFCqbvIx7cmXInxoZpb";

async function seed() {
  console.log("Starting database seed...");

  await db.transaction(async (tx) => {
    // --------------------------------------------------
    // 1. Verify the Better Auth user exists
    // --------------------------------------------------

    const [seedUser] = await tx
      .select({ id: user.id })
      .from(user)
      .where(eq(user.id, SEED_USER_ID))
      .limit(1);

    if (!seedUser) {
      throw new Error(
        `Seed user "${SEED_USER_ID}" does not exist in the user table.`,
      );
    }

    console.log("✓ Seed user found");

    // --------------------------------------------------
    // 2. Remove existing seed data
    // --------------------------------------------------
    // This makes the seed script safely re-runnable.
    //
    // We only delete records belonging to this user.
    // Nothing belonging to another user is touched.
    //
    // Note: application_documents rows are cleaned up automatically
    // via ON DELETE CASCADE when applications or documents are deleted,
    // so no explicit delete is needed for that table here.

    const existingApplications = await tx
      .select({ id: applicationsTable.id })
      .from(applicationsTable)
      .where(eq(applicationsTable.userId, SEED_USER_ID));

    const applicationIds = existingApplications.map((app) => app.id);

    if (applicationIds.length > 0) {
      await tx
        .delete(interviewsTable)
        .where(inArray(interviewsTable.applicationId, applicationIds));

      await tx
        .delete(applicationStatusHistoryTable)
        .where(
          inArray(applicationStatusHistoryTable.applicationId, applicationIds),
        );

      await tx
        .delete(applicationsTable)
        .where(inArray(applicationsTable.id, applicationIds));
    }

    await tx
      .delete(documentsTable)
      .where(eq(documentsTable.userId, SEED_USER_ID));

    await tx
      .delete(companiesTable)
      .where(eq(companiesTable.userId, SEED_USER_ID));

    console.log("✓ Existing seed data cleared");

    // --------------------------------------------------
    // 3. Companies
    // --------------------------------------------------

    const companies = await tx
      .insert(companiesTable)
      .values([
        {
          userId: SEED_USER_ID,
          name: "Google",
          website: "https://www.google.com",
          industry: "technology",
          location: "London, UK",
          notes:
            "Graduate software engineering opportunity. Strong focus on problem solving and algorithms.",
        },
        {
          userId: SEED_USER_ID,
          name: "Monzo",
          website: "https://monzo.com",
          industry: "fintech",
          location: "London, UK",
          notes:
            "Interested in backend and full-stack engineering opportunities.",
        },
        {
          userId: SEED_USER_ID,
          name: "Microsoft",
          website: "https://www.microsoft.com",
          industry: "technology",
          location: "London, UK",
          notes:
            "Graduate software engineering role. Review technical interview topics before interview.",
        },
        {
          userId: SEED_USER_ID,
          name: "Sage",
          website: "https://www.sage.com",
          industry: "technology",
          location: "Newcastle upon Tyne, UK",
          notes:
            "Graduate software engineering programme. Good opportunity for cloud and backend experience.",
        },
        {
          userId: SEED_USER_ID,
          name: "Revolut",
          website: "https://www.revolut.com",
          industry: "fintech",
          location: "London, UK",
          notes:
            "Competitive graduate engineering programme with multiple technical stages.",
        },
        {
          userId: SEED_USER_ID,
          name: "Amazon",
          website: "https://www.amazon.jobs",
          industry: "technology",
          location: "London, UK",
          notes:
            "Graduate software development role. Prepare STAR examples and DSA questions.",
        },
      ])
      .returning();

    const companyByName = Object.fromEntries(
      companies.map((company) => [company.name, company]),
    );

    console.log(`✓ Created ${companies.length} companies`);

    // --------------------------------------------------
    // 4. Documents
    // --------------------------------------------------

    const documents = await tx
      .insert(documentsTable)
      .values([
        {
          userId: SEED_USER_ID,
          filename: "Abdoulkarim_Kourouma_CV.pdf",
          documentType: "cv",
          storageKey: "seed/cv/Abdoulkarim_Kourouma_CV.pdf",
          fileType: "application/pdf",
          fileSize: 284_000,
        },
        {
          userId: SEED_USER_ID,
          filename: "Google_Cover_Letter.pdf",
          documentType: "cover_letter",
          storageKey: "seed/cover-letters/google.pdf",
          fileType: "application/pdf",
          fileSize: 92_000,
        },
        {
          userId: SEED_USER_ID,
          filename: "Monzo_Cover_Letter.pdf",
          documentType: "cover_letter",
          storageKey: "seed/cover-letters/monzo.pdf",
          fileType: "application/pdf",
          fileSize: 88_000,
        },
      ])
      .returning();

    const resume = documents.find(
      (document) => document.documentType === "cv",
    )!;

    const googleCoverLetter = documents.find(
      (document) => document.filename === "Google_Cover_Letter.pdf",
    )!;

    const monzoCoverLetter = documents.find(
      (document) => document.filename === "Monzo_Cover_Letter.pdf",
    )!;

    console.log(`✓ Created ${documents.length} documents`);

    // --------------------------------------------------
    // 5. Applications
    // --------------------------------------------------
    // Note: resume/cover letter are no longer stored as FK columns on
    // applications. They're linked via the application_documents join
    // table in step 5a below.

    const applications = await tx
      .insert(applicationsTable)
      .values([
        {
          userId: SEED_USER_ID,
          companyId: companyByName.Google.id,
          jobTitle: "Graduate Software Engineer",
          jobType: "graduate",
          jobUrl: "https://careers.google.com/",
          source: "company_website",
          location: "London, UK",
          workMode: "hybrid",
          salaryMin: 55_000,
          salaryMax: 65_000,
          status: "interview",
          appliedAt: "2026-06-15",
          notes:
            "Reached interview stage. Review DSA and system design fundamentals.",
        },

        {
          userId: SEED_USER_ID,
          companyId: companyByName.Monzo.id,
          jobTitle: "Graduate Software Engineer",
          jobType: "graduate",
          jobUrl: "https://monzo.com/careers/",
          source: "linkedin",
          location: "London, UK",
          workMode: "hybrid",
          salaryMin: 50_000,
          salaryMax: 60_000,
          status: "online_assessment",
          appliedAt: "2026-07-01",
          notes: "Online assessment received. Complete before the deadline.",
        },

        {
          userId: SEED_USER_ID,
          companyId: companyByName.Microsoft.id,
          jobTitle: "Software Engineer Graduate",
          jobType: "graduate",
          jobUrl: "https://careers.microsoft.com/",
          source: "company_website",
          location: "London, UK",
          workMode: "hybrid",
          salaryMin: 50_000,
          salaryMax: 60_000,
          status: "applied",
          appliedAt: "2026-07-20",
          notes: "Application submitted. Waiting for response.",
        },

        {
          userId: SEED_USER_ID,
          companyId: companyByName.Sage.id,
          jobTitle: "Graduate Software Engineer",
          jobType: "graduate",
          jobUrl: "https://www.sage.com/en-gb/company/careers/",
          source: "university",
          location: "Newcastle upon Tyne, UK",
          workMode: "hybrid",
          salaryMin: 35_000,
          salaryMax: 42_000,
          status: "offer",
          appliedAt: "2026-05-12",
          notes:
            "Offer received. Compare package and development opportunities.",
        },

        {
          userId: SEED_USER_ID,
          companyId: companyByName.Revolut.id,
          jobTitle: "Graduate Software Engineer",
          jobType: "graduate",
          jobUrl: "https://www.revolut.com/careers/",
          source: "linkedin",
          location: "London, UK",
          workMode: "onsite",
          salaryMin: 45_000,
          salaryMax: 55_000,
          status: "rejected",
          appliedAt: "2026-05-28",
          notes:
            "Rejected after online assessment. Review performance before applying again.",
        },

        {
          userId: SEED_USER_ID,
          companyId: companyByName.Amazon.id,
          jobTitle: "Software Development Engineer",
          jobType: "graduate",
          jobUrl: "https://www.amazon.jobs/",
          source: "company_website",
          location: "London, UK",
          workMode: "hybrid",
          salaryMin: 50_000,
          salaryMax: 60_000,
          status: "wishlist",
          notes:
            "Strong target role. Tailor CV before applying and prepare Amazon Leadership Principles examples.",
        },

        {
          userId: SEED_USER_ID,
          companyId: companyByName.Monzo.id,
          jobTitle: "Backend Engineer",
          jobType: "full_time",
          jobUrl: "https://monzo.com/careers/",
          source: "referral",
          location: "London, UK",
          workMode: "hybrid",
          salaryMin: 55_000,
          salaryMax: 70_000,
          status: "interview",
          appliedAt: "2026-06-25",
          notes:
            "Technical interview scheduled. Focus on backend architecture and PostgreSQL.",
        },
      ])
      .returning();

    console.log(`✓ Created ${applications.length} applications`);

    const googleApplication = applications.find(
      (application) =>
        application.companyId === companyByName.Google.id &&
        application.jobTitle === "Graduate Software Engineer",
    )!;

    const monzoGraduateApplication = applications.find(
      (application) =>
        application.companyId === companyByName.Monzo.id &&
        application.jobTitle === "Graduate Software Engineer",
    )!;

    const microsoftApplication = applications.find(
      (application) => application.companyId === companyByName.Microsoft.id,
    )!;

    const sageApplication = applications.find(
      (application) => application.companyId === companyByName.Sage.id,
    )!;

    const revolutApplication = applications.find(
      (application) => application.companyId === companyByName.Revolut.id,
    )!;

    const amazonApplication = applications.find(
      (application) => application.companyId === companyByName.Amazon.id,
    )!;

    const monzoBackendApplication = applications.find(
      (application) => application.jobTitle === "Backend Engineer",
    )!;

    // --------------------------------------------------
    // 5a. Application <-> Document links
    // --------------------------------------------------
    // Every application below reuses the same CV. Google and Monzo
    // (graduate role) also have a tailored cover letter attached.
    // Amazon (wishlist) intentionally has no documents linked yet.

    await tx.insert(applicationDocumentsTable).values([
      { applicationId: googleApplication.id, documentId: resume.id },
      {
        applicationId: googleApplication.id,
        documentId: googleCoverLetter.id,
      },

      { applicationId: monzoGraduateApplication.id, documentId: resume.id },
      {
        applicationId: monzoGraduateApplication.id,
        documentId: monzoCoverLetter.id,
      },

      { applicationId: microsoftApplication.id, documentId: resume.id },
      { applicationId: sageApplication.id, documentId: resume.id },
      { applicationId: revolutApplication.id, documentId: resume.id },
      { applicationId: monzoBackendApplication.id, documentId: resume.id },
      // amazonApplication: no documents linked (wishlist, not yet tailored)
    ]);

    console.log("✓ Linked documents to applications");

    // --------------------------------------------------
    // 6. Status history
    // --------------------------------------------------

    await tx.insert(applicationStatusHistoryTable).values([
      // Google:
      // wishlist → applied → online assessment → interview
      {
        applicationId: googleApplication.id,
        previousStatus: null,
        status: "wishlist",
      },
      {
        applicationId: googleApplication.id,
        previousStatus: "wishlist",
        status: "applied",
      },
      {
        applicationId: googleApplication.id,
        previousStatus: "applied",
        status: "online_assessment",
      },
      {
        applicationId: googleApplication.id,
        previousStatus: "online_assessment",
        status: "interview",
      },

      // Monzo Graduate:
      // wishlist → applied → online assessment
      {
        applicationId: monzoGraduateApplication.id,
        previousStatus: null,
        status: "wishlist",
      },
      {
        applicationId: monzoGraduateApplication.id,
        previousStatus: "wishlist",
        status: "applied",
      },
      {
        applicationId: monzoGraduateApplication.id,
        previousStatus: "applied",
        status: "online_assessment",
      },

      // Microsoft:
      // wishlist → applied
      {
        applicationId: microsoftApplication.id,
        previousStatus: null,
        status: "wishlist",
      },
      {
        applicationId: microsoftApplication.id,
        previousStatus: "wishlist",
        status: "applied",
      },

      // Sage:
      // wishlist → applied → online assessment → interview → offer
      {
        applicationId: sageApplication.id,
        previousStatus: null,
        status: "wishlist",
      },
      {
        applicationId: sageApplication.id,
        previousStatus: "wishlist",
        status: "applied",
      },
      {
        applicationId: sageApplication.id,
        previousStatus: "applied",
        status: "online_assessment",
      },
      {
        applicationId: sageApplication.id,
        previousStatus: "online_assessment",
        status: "interview",
      },
      {
        applicationId: sageApplication.id,
        previousStatus: "interview",
        status: "offer",
      },

      // Revolut:
      // wishlist → applied → online assessment → rejected
      {
        applicationId: revolutApplication.id,
        previousStatus: null,
        status: "wishlist",
      },
      {
        applicationId: revolutApplication.id,
        previousStatus: "wishlist",
        status: "applied",
      },
      {
        applicationId: revolutApplication.id,
        previousStatus: "applied",
        status: "online_assessment",
      },
      {
        applicationId: revolutApplication.id,
        previousStatus: "online_assessment",
        status: "rejected",
      },

      // Monzo Backend:
      // wishlist → applied → interview
      {
        applicationId: monzoBackendApplication.id,
        previousStatus: null,
        status: "wishlist",
      },
      {
        applicationId: monzoBackendApplication.id,
        previousStatus: "wishlist",
        status: "applied",
      },
      {
        applicationId: monzoBackendApplication.id,
        previousStatus: "applied",
        status: "interview",
      },
    ]);

    console.log("✓ Created application status history");

    // --------------------------------------------------
    // 7. Interviews
    // --------------------------------------------------

    await tx.insert(interviewsTable).values([
      {
        applicationId: googleApplication.id,
        scheduledAt: new Date("2026-08-12T10:00:00+01:00"),
        interviewerName: "James Wilson",
        interviewType: "technical_interview",
        notes:
          "Technical interview covering algorithms, data structures and practical problem solving.",
        outcome: "pending",
      },
      {
        applicationId: monzoBackendApplication.id,
        scheduledAt: new Date("2026-08-14T14:00:00+01:00"),
        interviewerName: "Sarah Ahmed",
        interviewType: "system_design_interview",
        notes:
          "Discuss backend architecture, PostgreSQL and designing a scalable service.",
        outcome: "pending",
      },
      {
        applicationId: sageApplication.id,
        scheduledAt: new Date("2026-05-30T11:00:00+01:00"),
        interviewerName: "Michael Brown",
        interviewType: "behavioural_interview",
        notes: "Final-stage behavioural interview before offer.",
        outcome: "passed",
      },
    ]);

    console.log("✓ Created interviews");
  });

  console.log("\nSeed completed successfully.");
}

seed().catch((error) => {
  console.error("\nSeed failed:");
  console.error(error);
  process.exit(1);
});
