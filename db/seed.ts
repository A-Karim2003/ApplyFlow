import "dotenv/config";
import { db } from "@/db";
import {
  applicationsTable,
  applicationStatusHistoryTable,
  companiesTable,
  interviewsTable,
  user,
} from "@/db/schema";
import { eq } from "drizzle-orm";

type CompanyInsert = typeof companiesTable.$inferInsert;
type ApplicationInsert = typeof applicationsTable.$inferInsert;
type StatusHistoryInsert = typeof applicationStatusHistoryTable.$inferInsert;
type InterviewInsert = typeof interviewsTable.$inferInsert;

type ApplicationStatus = ApplicationInsert["status"];
type JobType = ApplicationInsert["jobType"];
type ApplicationSource = ApplicationInsert["source"];
type WorkMode = NonNullable<ApplicationInsert["workMode"]>;
type Industry = CompanyInsert["industry"];
type InterviewType = InterviewInsert["interviewType"];
type InterviewOutcome = NonNullable<InterviewInsert["outcome"]>;

interface StatusStep {
  status: ApplicationStatus;
  daysAgo: number;
  hourUtc?: number;
}

interface InterviewSeed {
  daysOffset: number; // Negative = days ago, positive = days in future
  hourUtc: number;
  minuteUtc?: number;
  interviewerName: string | null;
  interviewType: InterviewType;
  outcome: InterviewOutcome;
  notes: string | null;
}

interface ApplicationSeed {
  companyName: string;
  jobTitle: string;
  jobType: JobType;
  jobUrl: string;
  location: string;
  workMode: WorkMode;
  source: ApplicationSource;
  salaryMin: number | null;
  salaryMax: number | null;
  deadlineDaysOffset: number | null;
  notes: string | null;
  steps: StatusStep[];
  interviews?: InterviewSeed[];
}

// Read the clock inside a helper rather than at module top level
function getNow(): Date {
  return new Date();
}

function dateFromOffset(
  base: Date,
  daysOffset: number,
  hourUtc = 10,
  minuteUtc = 0,
): Date {
  const result = new Date(base.getTime());
  result.setUTCDate(result.getUTCDate() + daysOffset);
  result.setUTCHours(hourUtc, minuteUtc, 0, 0);
  return result;
}

// Shift weekend dates onto a weekday so future interviews fall within working hours
function weekdayFromOffset(
  base: Date,
  daysOffset: number,
  hourUtc = 10,
  minuteUtc = 0,
): Date {
  const result = dateFromOffset(base, daysOffset, hourUtc, minuteUtc);
  const day = result.getUTCDay();
  if (day === 6) {
    result.setUTCDate(result.getUTCDate() + 2);
  } else if (day === 0) {
    result.setUTCDate(result.getUTCDate() + 1);
  }
  return result;
}

function toIsoDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

async function seed() {
  const seedUserEmail = "abdoulkarim03.dev@gmail.com";

  if (!seedUserEmail) {
    console.error(
      "Error: SEED_USER_EMAIL environment variable is missing. Set SEED_USER_EMAIL (e.g. abdoulkarim03.dev@gmail.com) and re-run.",
    );
    process.exit(1);
  }

  const now = getNow();
  console.log(`Starting database seed for "${seedUserEmail}"...`);

  await db.transaction(async (tx) => {
    // 1. Look up the target user by email without creating or modifying users
    const [targetUser] = await tx
      .select({ id: user.id, email: user.email })
      .from(user)
      .where(eq(user.email, seedUserEmail))
      .limit(1);

    if (!targetUser) {
      throw new Error(
        `No user found matching SEED_USER_EMAIL="${seedUserEmail}".`,
      );
    }

    const targetUserId = targetUser.id;
    console.log(`✓ Target user resolved (${targetUserId})`);

    // 2. Delete existing application data for this user in foreign-key-safe order.
    // Deleting applications cascades to application_status_history, interviews, and application_documents.
    await tx
      .delete(applicationsTable)
      .where(eq(applicationsTable.userId, targetUserId));

    await tx
      .delete(companiesTable)
      .where(eq(companiesTable.userId, targetUserId));

    console.log(
      "✓ Cleared existing applications and companies for target user",
    );

    // 3. Seed 24 UK employers across fintech, healthtech, SaaS, consultancy, retail tech, and public sector
    const companySeeds: Array<{
      name: string;
      website: string;
      industry: Industry;
      location: string;
      companyHouseNumber: string | null;
      notes: string | null;
      createdDaysAgo: number;
    }> = [
      {
        name: "Monzo Bank",
        website: "https://monzo.com",
        industry: "fintech",
        location: "London, UK",
        companyHouseNumber: "09446231",
        notes:
          "Go microservices, Kafka, and distributed banking infrastructure.",
        createdDaysAgo: 68,
      },
      {
        name: "Starling Bank",
        website: "https://www.starlingbank.com",
        industry: "fintech",
        location: "London, UK",
        companyHouseNumber: "09092149",
        notes:
          "Java and TypeScript stack; strong internal engineering culture.",
        createdDaysAgo: 66,
      },
      {
        name: "Wise",
        website: "https://wise.com",
        industry: "fintech",
        location: "London, UK",
        companyHouseNumber: "07209813",
        notes:
          "Cross-border payments platform. Product-focused engineering interviews.",
        createdDaysAgo: 65,
      },
      {
        name: "Checkout.com",
        website: "https://www.checkout.com",
        industry: "fintech",
        location: "London, UK",
        companyHouseNumber: "08037323",
        notes: "Enterprise payment processing across C#, .NET, and AWS.",
        createdDaysAgo: 68,
      },
      {
        name: "Cleo AI",
        website: "https://web.meetcleo.com",
        industry: "fintech",
        location: "London, UK",
        companyHouseNumber: null,
        notes:
          "AI financial assistant scale-up using Ruby, TypeScript, and React.",
        createdDaysAgo: 35,
      },
      {
        name: "GoCardless",
        website: "https://gocardless.com",
        industry: "fintech",
        location: "London, UK",
        companyHouseNumber: "07495895",
        notes:
          "Direct bank payment network; strong emphasis on system reliability.",
        createdDaysAgo: 69,
      },
      {
        name: "Accurx",
        website: "https://www.accurx.com",
        industry: "healthcare",
        location: "London, UK",
        companyHouseNumber: "10184077",
        notes: "NHS communication platform. Uses C#, TypeScript, and React.",
        createdDaysAgo: 45,
      },
      {
        name: "Cera Care",
        website: "https://ceracare.co.uk",
        industry: "healthcare",
        location: "London, UK",
        companyHouseNumber: null,
        notes: "Digital-first home healthcare analytics and scheduling tools.",
        createdDaysAgo: 25,
      },
      {
        name: "Huma Therapeutics",
        website: "https://huma.com",
        industry: "healthcare",
        location: "London, UK",
        companyHouseNumber: null,
        notes: "Remote patient monitoring and digital biomarkers platform.",
        createdDaysAgo: 32,
      },
      {
        name: "Northrow HealthTech",
        website: "https://northrow-healthtech.example.co.uk",
        industry: "healthcare",
        location: "Manchester, UK",
        companyHouseNumber: null,
        notes:
          "Manchester-based clinical workflow startup building with Next.js.",
        createdDaysAgo: 20,
      },
      {
        name: "PostHog",
        website: "https://posthog.com",
        industry: "technology",
        location: "Remote, UK",
        companyHouseNumber: null,
        notes:
          "Open-source product analytics suite; fully remote engineering team.",
        createdDaysAgo: 18,
      },
      {
        name: "Incident.io",
        website: "https://incident.io",
        industry: "technology",
        location: "London, UK",
        companyHouseNumber: "13178412",
        notes:
          "Fast-growing SaaS scale-up building incident management workflows in Go and React.",
        createdDaysAgo: 40,
      },
      {
        name: "Gearset",
        website: "https://gearset.com",
        industry: "technology",
        location: "Cambridge, UK",
        companyHouseNumber: "09684664",
        notes:
          "DevOps SaaS company in Cambridge with structured graduate mentoring.",
        createdDaysAgo: 30,
      },
      {
        name: "Cloudflare UK",
        website: "https://www.cloudflare.com",
        industry: "technology",
        location: "London, UK",
        companyHouseNumber: null,
        notes:
          "Edge networking, Workers runtime, and distributed systems engineering.",
        createdDaysAgo: 58,
      },
      {
        name: "Synthesia",
        website: "https://www.synthesia.io",
        industry: "technology",
        location: "London, UK",
        companyHouseNumber: null,
        notes:
          "Generative AI video platform; heavy TypeScript, WebGL, and Python stack.",
        createdDaysAgo: 46,
      },
      {
        name: "Skyscanner",
        website: "https://www.skyscanner.net",
        industry: "technology",
        location: "Edinburgh, UK",
        companyHouseNumber: null,
        notes:
          "High-throughput travel search architecture and graduate rotational squads.",
        createdDaysAgo: 48,
      },
      {
        name: "BJSS",
        website: "https://www.bjss.com",
        industry: "consulting",
        location: "Manchester, UK",
        companyHouseNumber: "02777575",
        notes:
          "Technology consultancy delivering enterprise cloud and NHS digital programmes.",
        createdDaysAgo: 38,
      },
      {
        name: "Kainos",
        website: "https://www.kainos.com",
        industry: "consulting",
        location: "Bristol, UK",
        companyHouseNumber: null,
        notes:
          "Digital services partner for UK public sector and commercial clients.",
        createdDaysAgo: 34,
      },
      {
        name: "Thoughtworks UK",
        website: "https://www.thoughtworks.com",
        industry: "consulting",
        location: "Manchester, UK",
        companyHouseNumber: null,
        notes: "Strong focus on pair programming, TDD, and clean architecture.",
        createdDaysAgo: 62,
      },
      {
        name: "Softwire",
        website: "https://www.softwire.com",
        industry: "consulting",
        location: "Cambridge, UK",
        companyHouseNumber: null,
        notes:
          "Bespoke software engineering consultancy with high graduate retention.",
        createdDaysAgo: 60,
      },
      {
        name: "Ocado Technology",
        website: "https://www.ocadogroup.com/technology",
        industry: "ecommerce",
        location: "London, UK",
        companyHouseNumber: "03875000",
        notes:
          "Automated warehouse fulfilment platforms and real-time control software.",
        createdDaysAgo: 60,
      },
      {
        name: "THG Ingenuity",
        website: "https://www.thgingenuity.com",
        industry: "ecommerce",
        location: "Manchester, UK",
        companyHouseNumber: null,
        notes:
          "Global e-commerce logistics and storefront platform engineering.",
        createdDaysAgo: 52,
      },
      {
        name: "Deliveroo",
        website: "https://deliveroo.co.uk",
        industry: "retail",
        location: "London, UK",
        companyHouseNumber: null,
        notes:
          "Real-time dispatch algorithms, rider logistics, and consumer web apps.",
        createdDaysAgo: 66,
      },
      {
        name: "Government Digital Service (GDS)",
        website:
          "https://www.gov.uk/government/organisations/government-digital-service",
        industry: "government",
        location: "Bristol, UK",
        companyHouseNumber: null,
        notes:
          "Builds GOV.UK core platforms, digital identity, and accessibility tooling.",
        createdDaysAgo: 28,
      },
    ];

    const insertedCompanies = await tx
      .insert(companiesTable)
      .values(
        companySeeds.map((company) => {
          const createdAt = dateFromOffset(now, -company.createdDaysAgo, 9, 0);
          return {
            userId: targetUserId,
            name: company.name,
            website: company.website,
            industry: company.industry,
            location: company.location,
            companyHouseNumber: company.companyHouseNumber,
            notes: company.notes,
            createdAt,
            updatedAt: createdAt,
          };
        }),
      )
      .returning();

    const companyByName = Object.fromEntries(
      insertedCompanies.map((company) => [company.name, company]),
    );

    // 4. Define 35 applications matching the exact target status distribution
    const applicationSeeds: ApplicationSeed[] = [
      // ------------------------------------------------------------------
      // WISHLIST (6) - future deadlines, applied_at is null
      // ------------------------------------------------------------------
      {
        companyName: "Cloudflare UK",
        jobTitle: "Junior Platform Engineer",
        jobType: "full_time",
        jobUrl: "https://careers.cloudflare.example.com/jobs/jr-platform-uk-01",
        location: "London, UK",
        workMode: "hybrid",
        source: "company_website",
        salaryMin: 48000,
        salaryMax: 55000,
        deadlineDaysOffset: 14,
        notes:
          "Review Workers runtime architecture and Linux networking before applying.",
        steps: [{ status: "wishlist", daysAgo: 15, hourUtc: 11 }],
      },
      {
        companyName: "PostHog",
        jobTitle: "Junior Full-Stack Engineer",
        jobType: "full_time",
        jobUrl: "https://posthog.example.com/careers/junior-fullstack-uk",
        location: "Remote, UK",
        workMode: "remote",
        source: "linkedin",
        salaryMin: 45000,
        salaryMax: 54000,
        deadlineDaysOffset: 21,
        notes:
          "Prepare a short cover note highlighting TypeScript and PostgreSQL projects.",
        steps: [{ status: "wishlist", daysAgo: 12, hourUtc: 16 }],
      },
      {
        companyName: "Synthesia",
        jobTitle: "Graduate Frontend Engineer",
        jobType: "graduate",
        jobUrl: "https://synthesia.example.com/jobs/grad-frontend-2027",
        location: "London, UK",
        workMode: "hybrid",
        source: "linkedin",
        salaryMin: 42000,
        salaryMax: 50000,
        deadlineDaysOffset: 10,
        notes:
          "Focus CV on React performance optimisation and strict TypeScript patterns.",
        steps: [{ status: "wishlist", daysAgo: 9, hourUtc: 14 }],
      },
      {
        companyName: "Government Digital Service (GDS)",
        jobTitle: "Junior Software Developer",
        jobType: "full_time",
        jobUrl: "https://civilservicejobs.example.gov.uk/gds-jr-dev-882",
        location: "Bristol, UK",
        workMode: "hybrid",
        source: "company_website",
        salaryMin: 34000,
        salaryMax: 41000,
        deadlineDaysOffset: 18,
        notes:
          "Requires Civil Service Success Profiles statement of suitability.",
        steps: [{ status: "wishlist", daysAgo: 7, hourUtc: 10 }],
      },
      {
        companyName: "Cera Care",
        jobTitle: "Graduate Data Engineer",
        jobType: "graduate",
        jobUrl: "https://ceracare.example.co.uk/careers/grad-data-eng",
        location: "London, UK",
        workMode: "remote",
        source: "indeed",
        salaryMin: null,
        salaryMax: null,
        deadlineDaysOffset: 25,
        notes: null,
        steps: [{ status: "wishlist", daysAgo: 5, hourUtc: 13 }],
      },
      {
        companyName: "Kainos",
        jobTitle: "Graduate Software Engineer",
        jobType: "graduate",
        jobUrl: "https://kainos.example.com/early-careers/grad-swe-bristol",
        location: "Bristol, UK",
        workMode: "hybrid",
        source: "university",
        salaryMin: 30000,
        salaryMax: 35000,
        deadlineDaysOffset: 12,
        notes: "Recommended by university careers fair team.",
        steps: [{ status: "wishlist", daysAgo: 3, hourUtc: 15 }],
      },

      // ------------------------------------------------------------------
      // APPLIED (10) - 6 applied >14 days ago (2 >30 days), 4 within last 14 days
      // ------------------------------------------------------------------
      {
        companyName: "Starling Bank",
        jobTitle: "Graduate Software Engineer",
        jobType: "graduate",
        jobUrl: "https://starlingbank.example.com/careers/grad-swe-london",
        location: "London, UK",
        workMode: "hybrid",
        source: "company_website",
        salaryMin: 42000,
        salaryMax: 48000,
        deadlineDaysOffset: null,
        notes:
          "Submitted tailored CV and cover letter; awaiting initial screening.",
        steps: [
          { status: "wishlist", daysAgo: 42, hourUtc: 10 },
          { status: "applied", daysAgo: 40, hourUtc: 14 },
        ],
      },
      {
        companyName: "Ocado Technology",
        jobTitle: "Graduate Backend Engineer",
        jobType: "graduate",
        jobUrl: "https://ocadotech.example.com/jobs/grad-backend-2027",
        location: "London, UK",
        workMode: "hybrid",
        source: "university",
        salaryMin: 38000,
        salaryMax: 44000,
        deadlineDaysOffset: null,
        notes: "Completed numeric and logical reasoning tests on submission.",
        steps: [
          { status: "wishlist", daysAgo: 37, hourUtc: 9 },
          { status: "applied", daysAgo: 35, hourUtc: 11 },
        ],
      },
      {
        companyName: "BJSS",
        jobTitle: "Graduate Software Engineer",
        jobType: "graduate",
        jobUrl: "https://bjss.example.com/academy/manchester-grad-swe",
        location: "Manchester, UK",
        workMode: "hybrid",
        source: "linkedin",
        salaryMin: 32000,
        salaryMax: 37000,
        deadlineDaysOffset: null,
        notes:
          "Autumn academy intake; consultancy rotation across cloud and web.",
        steps: [
          { status: "wishlist", daysAgo: 29, hourUtc: 12 },
          { status: "applied", daysAgo: 27, hourUtc: 16 },
        ],
      },
      {
        companyName: "Huma Therapeutics",
        jobTitle: "Junior Backend Engineer",
        jobType: "full_time",
        jobUrl: "https://huma.example.com/careers/junior-backend-node",
        location: "London, UK",
        workMode: "hybrid",
        source: "linkedin",
        salaryMin: 40000,
        salaryMax: 47000,
        deadlineDaysOffset: null,
        notes: null,
        steps: [
          { status: "wishlist", daysAgo: 24, hourUtc: 10 },
          { status: "applied", daysAgo: 22, hourUtc: 15 },
        ],
      },
      {
        companyName: "Gearset",
        jobTitle: "Graduate Full-Stack Developer",
        jobType: "graduate",
        jobUrl: "https://gearset.example.com/jobs/graduate-fullstack-cambridge",
        location: "Cambridge, UK",
        workMode: "onsite",
        source: "company_website",
        salaryMin: 40000,
        salaryMax: 46000,
        deadlineDaysOffset: null,
        notes: "Direct application with portfolio link.",
        steps: [{ status: "applied", daysAgo: 19, hourUtc: 11 }],
      },
      {
        companyName: "Cleo AI",
        jobTitle: "Junior Product Engineer",
        jobType: "full_time",
        jobUrl: "https://meetcleo.example.com/careers/jr-product-engineer",
        location: "London, UK",
        workMode: "hybrid",
        source: "referral",
        salaryMin: 45000,
        salaryMax: 52000,
        deadlineDaysOffset: null,
        notes: "Referred by a former placement colleague.",
        steps: [
          { status: "wishlist", daysAgo: 18, hourUtc: 10 },
          { status: "applied", daysAgo: 16, hourUtc: 13 },
        ],
      },
      {
        companyName: "Northrow HealthTech",
        jobTitle: "Junior TypeScript Developer",
        jobType: "full_time",
        jobUrl: "https://northrow-healthtech.example.co.uk/jobs/jr-ts-dev",
        location: "Manchester, UK",
        workMode: "remote",
        source: "indeed",
        salaryMin: 31000,
        salaryMax: 38000,
        deadlineDaysOffset: null,
        notes:
          "Small product squad building patient intake portals in Next.js.",
        steps: [
          { status: "wishlist", daysAgo: 12, hourUtc: 9 },
          { status: "applied", daysAgo: 11, hourUtc: 14 },
        ],
      },
      {
        companyName: "Monzo Bank",
        jobTitle: "Junior Data Platform Engineer",
        jobType: "full_time",
        jobUrl: "https://monzo.example.com/careers/jr-data-platform",
        location: "London, UK",
        workMode: "hybrid",
        source: "company_website",
        salaryMin: 48000,
        salaryMax: 55000,
        deadlineDaysOffset: null,
        notes: null,
        steps: [{ status: "applied", daysAgo: 8, hourUtc: 10 }],
      },
      {
        companyName: "Government Digital Service (GDS)",
        jobTitle: "Graduate DevOps Engineer",
        jobType: "graduate",
        jobUrl: "https://civilservicejobs.example.gov.uk/gds-grad-devops-410",
        location: "Bristol, UK",
        workMode: "hybrid",
        source: "other",
        salaryMin: 33000,
        salaryMax: 39000,
        deadlineDaysOffset: null,
        notes: "Focuses on AWS infrastructure, Terraform, and CI/CD pipelines.",
        steps: [
          { status: "wishlist", daysAgo: 7, hourUtc: 11 },
          { status: "applied", daysAgo: 5, hourUtc: 16 },
        ],
      },
      {
        companyName: "Skyscanner",
        jobTitle: "Junior Frontend Engineer",
        jobType: "full_time",
        jobUrl: "https://skyscanner.example.net/jobs/jr-frontend-edinburgh",
        location: "Edinburgh, UK",
        workMode: "hybrid",
        source: "linkedin",
        salaryMin: 36000,
        salaryMax: 43000,
        deadlineDaysOffset: null,
        notes: "Applied for design systems and web performance squad.",
        steps: [
          { status: "wishlist", daysAgo: 3, hourUtc: 10 },
          { status: "applied", daysAgo: 2, hourUtc: 12 },
        ],
      },

      // ------------------------------------------------------------------
      // ONLINE ASSESSMENT (4) - 3 include an online_assessment interview row
      // ------------------------------------------------------------------
      {
        companyName: "Checkout.com",
        jobTitle: "Graduate Payment Systems Engineer",
        jobType: "graduate",
        jobUrl: "https://checkout.example.com/careers/grad-payments-eng",
        location: "London, UK",
        workMode: "hybrid",
        source: "company_website",
        salaryMin: 46000,
        salaryMax: 53000,
        deadlineDaysOffset: null,
        notes:
          "HackerRank assessment link received; 90 minutes for two medium DSA problems.",
        steps: [
          { status: "wishlist", daysAgo: 26, hourUtc: 10 },
          { status: "applied", daysAgo: 24, hourUtc: 13 },
          { status: "online_assessment", daysAgo: 15, hourUtc: 9 },
        ],
        interviews: [
          {
            daysOffset: -10,
            hourUtc: 11,
            interviewerName: "Automated HackerRank Platform",
            interviewType: "online_assessment",
            outcome: "passed",
            notes:
              "Passed all test cases on both graph and sliding-window questions.",
          },
        ],
      },
      {
        companyName: "Deliveroo",
        jobTitle: "Junior Backend Engineer",
        jobType: "full_time",
        jobUrl: "https://deliveroo.example.co.uk/careers/jr-backend-london",
        location: "London, UK",
        workMode: "hybrid",
        source: "linkedin",
        salaryMin: 47000,
        salaryMax: 54000,
        deadlineDaysOffset: null,
        notes: "Karat technical assessment scheduled for this week.",
        steps: [
          { status: "applied", daysAgo: 21, hourUtc: 11 },
          { status: "online_assessment", daysAgo: 12, hourUtc: 15 },
        ],
        interviews: [
          {
            daysOffset: 3,
            hourUtc: 14,
            interviewerName: "Karat Assessment Engineer",
            interviewType: "online_assessment",
            outcome: "pending",
            notes: "60-minute live coding and API rate-limiting exercise.",
          },
        ],
      },
      {
        companyName: "Kainos",
        jobTitle: "Junior Cloud Platform Engineer",
        jobType: "full_time",
        jobUrl: "https://kainos.example.com/jobs/jr-cloud-platform-bristol",
        location: "Bristol, UK",
        workMode: "hybrid",
        source: "indeed",
        salaryMin: null,
        salaryMax: null,
        deadlineDaysOffset: null,
        notes: "Codility take-home test due within seven days.",
        steps: [
          { status: "wishlist", daysAgo: 16, hourUtc: 10 },
          { status: "applied", daysAgo: 14, hourUtc: 12 },
          { status: "online_assessment", daysAgo: 7, hourUtc: 16 },
        ],
      },
      {
        companyName: "Gearset",
        jobTitle: "Junior C# & TypeScript Engineer",
        jobType: "full_time",
        jobUrl: "https://gearset.example.com/careers/jr-csharp-ts",
        location: "Cambridge, UK",
        workMode: "hybrid",
        source: "company_website",
        salaryMin: 41000,
        salaryMax: 47000,
        deadlineDaysOffset: null,
        notes:
          "Practical debugging and refactoring exercise sent by recruitment team.",
        steps: [
          { status: "applied", daysAgo: 11, hourUtc: 10 },
          { status: "online_assessment", daysAgo: 4, hourUtc: 14 },
        ],
        interviews: [
          {
            daysOffset: 2,
            hourUtc: 10,
            interviewerName: "Hannah Evans",
            interviewType: "online_assessment",
            outcome: "pending",
            notes: "Timed repository refactoring submission.",
          },
        ],
      },

      // ------------------------------------------------------------------
      // INTERVIEW (5) - every app has >=1 interview, all 5 have a future pending interview
      // ------------------------------------------------------------------
      {
        companyName: "Monzo Bank",
        jobTitle: "Graduate Backend Engineer",
        jobType: "graduate",
        jobUrl: "https://monzo.example.com/careers/grad-backend-2027",
        location: "London, UK",
        workMode: "hybrid",
        source: "company_website",
        salaryMin: 48000,
        salaryMax: 55000,
        deadlineDaysOffset: null,
        notes:
          "Passed recruiter screen; preparing distributed systems and Go concurrency notes.",
        steps: [
          { status: "wishlist", daysAgo: 45, hourUtc: 9 },
          { status: "applied", daysAgo: 43, hourUtc: 13 },
          { status: "online_assessment", daysAgo: 34, hourUtc: 11 },
          { status: "interview", daysAgo: 20, hourUtc: 15 },
        ],
        interviews: [
          {
            daysOffset: -16,
            hourUtc: 11,
            interviewerName: "claire patel",
            interviewType: "phone_screen",
            outcome: "passed",
            notes:
              "Covered placement experience, API design, and motivation for fintech.",
          },
          {
            daysOffset: 8,
            hourUtc: 10,
            minuteUtc: 30,
            interviewerName: "Marcus Thorne",
            interviewType: "technical_interview",
            outcome: "pending",
            notes: "Pair programming and backend architecture discussion.",
          },
        ],
      },
      {
        companyName: "Starling Bank",
        jobTitle: "Junior Full-Stack Developer",
        jobType: "full_time",
        jobUrl: "https://starlingbank.example.com/careers/jr-fullstack-dev",
        location: "London, UK",
        workMode: "hybrid",
        source: "linkedin",
        salaryMin: 44000,
        salaryMax: 51000,
        deadlineDaysOffset: null,
        notes:
          "Take-home React and Java task reviewed positively by the hiring panel.",
        steps: [
          { status: "applied", daysAgo: 38, hourUtc: 10 },
          { status: "online_assessment", daysAgo: 28, hourUtc: 14 },
          { status: "interview", daysAgo: 14, hourUtc: 16 },
        ],
        interviews: [
          {
            daysOffset: 10,
            hourUtc: 14,
            interviewerName: "Priya Nair",
            interviewType: "coding_interview",
            outcome: "pending",
            notes:
              "Live extension of the take-home payment dashboard exercise.",
          },
        ],
      },
      {
        companyName: "Accurx",
        jobTitle: "Graduate Product Engineer",
        jobType: "graduate",
        jobUrl: "https://accurx.example.com/careers/grad-product-eng",
        location: "London, UK",
        workMode: "hybrid",
        source: "referral",
        salaryMin: 42000,
        salaryMax: 48000,
        deadlineDaysOffset: null,
        notes:
          "Strong mission alignment around NHS clinical messaging workflows.",
        steps: [
          { status: "wishlist", daysAgo: 33, hourUtc: 10 },
          { status: "applied", daysAgo: 31, hourUtc: 12 },
          { status: "interview", daysAgo: 12, hourUtc: 15 },
        ],
        interviews: [
          {
            daysOffset: -9,
            hourUtc: 15,
            interviewerName: "Sophie Al-Mansoor",
            interviewType: "phone_screen",
            outcome: "passed",
            notes:
              "Initial product sense and behavioural discussion went smoothly.",
          },
          {
            daysOffset: 13,
            hourUtc: 11,
            interviewerName: "Daniel Gallagher",
            interviewType: "system_design_interview",
            outcome: "pending",
            notes:
              "Design a resilient patient notification service with audit logging.",
          },
        ],
      },
      {
        companyName: "Incident.io",
        jobTitle: "Graduate Software Engineer",
        jobType: "graduate",
        jobUrl: "https://incident.example.io/careers/graduate-swe",
        location: "London, UK",
        workMode: "onsite",
        source: "company_website",
        salaryMin: 47000,
        salaryMax: 55000,
        deadlineDaysOffset: null,
        notes:
          "Fast-moving recruitment process; prepare questions on Slack bot latency.",
        steps: [
          { status: "wishlist", daysAgo: 29, hourUtc: 9 },
          { status: "applied", daysAgo: 27, hourUtc: 11 },
          { status: "online_assessment", daysAgo: 19, hourUtc: 14 },
          { status: "interview", daysAgo: 8, hourUtc: 17 },
        ],
        interviews: [
          {
            daysOffset: 16,
            hourUtc: 15,
            interviewerName: "Tom Whittaker",
            interviewType: "hiring_manager_interview",
            outcome: "pending",
            notes:
              "Deep dive into past full-stack projects and incident response trade-offs.",
          },
        ],
      },
      {
        companyName: "Skyscanner",
        jobTitle: "Graduate Distributed Systems Engineer",
        jobType: "graduate",
        jobUrl: "https://skyscanner.example.net/early-careers/grad-dist-sys",
        location: "Edinburgh, UK",
        workMode: "hybrid",
        source: "university",
        salaryMin: 37000,
        salaryMax: 44000,
        deadlineDaysOffset: null,
        notes: "Final assessment centre round scheduled for later this month.",
        steps: [
          { status: "applied", daysAgo: 35, hourUtc: 10 },
          { status: "online_assessment", daysAgo: 25, hourUtc: 13 },
          { status: "interview", daysAgo: 11, hourUtc: 16 },
        ],
        interviews: [
          {
            daysOffset: -6,
            hourUtc: 10,
            interviewerName: "Callum MacLeod",
            interviewType: "coding_interview",
            outcome: "passed",
            notes:
              "Implemented flight-route graph traversal and discussed time complexity.",
          },
          {
            daysOffset: 19,
            hourUtc: 10,
            interviewerName: "Fiona Campbell",
            interviewType: "final_interview",
            outcome: "pending",
            notes: "Final engineering manager and values alignment interview.",
          },
        ],
      },

      // ------------------------------------------------------------------
      // OFFER (2) - full progression with past passed interviews
      // ------------------------------------------------------------------
      {
        companyName: "Wise",
        jobTitle: "Graduate Software Engineer",
        jobType: "graduate",
        jobUrl: "https://wise.example.com/jobs/grad-software-engineer-london",
        location: "London, UK",
        workMode: "hybrid",
        source: "company_website",
        salaryMin: 48000,
        salaryMax: 54000,
        deadlineDaysOffset: null,
        notes:
          "Written offer received (£51,000 base plus RSUs and relocation stipend).",
        steps: [
          { status: "wishlist", daysAgo: 64, hourUtc: 9 },
          { status: "applied", daysAgo: 62, hourUtc: 12 },
          { status: "online_assessment", daysAgo: 50, hourUtc: 10 },
          { status: "interview", daysAgo: 35, hourUtc: 14 },
          { status: "offer", daysAgo: 10, hourUtc: 16 },
        ],
        interviews: [
          {
            daysOffset: -30,
            hourUtc: 11,
            interviewerName: "Aleksandr Kask",
            interviewType: "technical_interview",
            outcome: "passed",
            notes:
              "Built a currency conversion service with idempotent retry logic.",
          },
          {
            daysOffset: -18,
            hourUtc: 14,
            interviewerName: "Rachel Sterling",
            interviewType: "final_interview",
            outcome: "passed",
            notes:
              "Product engineering case study on reducing cross-border transfer fees.",
          },
        ],
      },
      {
        companyName: "Softwire",
        jobTitle: "Graduate Software Consultant",
        jobType: "graduate",
        jobUrl:
          "https://softwire.example.com/careers/graduate-consultant-cambridge",
        location: "Cambridge, UK",
        workMode: "hybrid",
        source: "university",
        salaryMin: 40000,
        salaryMax: 45000,
        deadlineDaysOffset: null,
        notes:
          "Verbal and written offer received; strong structured training programme.",
        steps: [
          { status: "applied", daysAgo: 58, hourUtc: 10 },
          { status: "online_assessment", daysAgo: 46, hourUtc: 15 },
          { status: "interview", daysAgo: 31, hourUtc: 11 },
          { status: "offer", daysAgo: 6, hourUtc: 15 },
        ],
        interviews: [
          {
            daysOffset: -25,
            hourUtc: 10,
            interviewerName: "Oliver Wright",
            interviewType: "coding_interview",
            outcome: "passed",
            notes:
              "Solved algorithmic puzzles and discussed clean code refactoring.",
          },
          {
            daysOffset: -14,
            hourUtc: 15,
            interviewerName: "Eleanor Hughes",
            interviewType: "behavioural_interview",
            outcome: "passed",
            notes:
              "Client communication scenarios and teamwork examples from placement.",
          },
        ],
      },

      // ------------------------------------------------------------------
      // REJECTED (8) - 3 after applied, 3 after online_assessment, 2 after interview
      // ------------------------------------------------------------------
      {
        companyName: "Checkout.com",
        jobTitle: "Graduate Backend Engineer",
        jobType: "graduate",
        jobUrl: "https://checkout.example.com/careers/grad-backend-dotnet",
        location: "London, UK",
        workMode: "hybrid",
        source: "linkedin",
        salaryMin: 45000,
        salaryMax: 52000,
        deadlineDaysOffset: null,
        notes: "Role filled internally before initial screening stage.",
        steps: [
          { status: "wishlist", daysAgo: 68, hourUtc: 10 },
          { status: "applied", daysAgo: 66, hourUtc: 14 },
          { status: "rejected", daysAgo: 48, hourUtc: 9 },
        ],
      },
      {
        companyName: "Cloudflare UK",
        jobTitle: "Junior Systems Engineer",
        jobType: "full_time",
        jobUrl: "https://careers.cloudflare.example.com/jobs/jr-systems-london",
        location: "London, UK",
        workMode: "onsite",
        source: "company_website",
        salaryMin: null,
        salaryMax: null,
        deadlineDaysOffset: null,
        notes:
          "Rejected at CV screening; looking for deeper kernel networking experience.",
        steps: [
          { status: "applied", daysAgo: 54, hourUtc: 11 },
          { status: "rejected", daysAgo: 39, hourUtc: 16 },
        ],
      },
      {
        companyName: "THG Ingenuity",
        jobTitle: "Graduate Full-Stack Engineer",
        jobType: "graduate",
        jobUrl:
          "https://thgingenuity.example.com/careers/grad-fullstack-manchester",
        location: "Manchester, UK",
        workMode: "onsite",
        source: "indeed",
        salaryMin: 28000,
        salaryMax: 34000,
        deadlineDaysOffset: null,
        notes: "Automated rejection email after headcount freeze on cohort.",
        steps: [
          { status: "wishlist", daysAgo: 49, hourUtc: 10 },
          { status: "applied", daysAgo: 47, hourUtc: 15 },
          { status: "rejected", daysAgo: 30, hourUtc: 11 },
        ],
      },
      {
        companyName: "Deliveroo",
        jobTitle: "Graduate Software Engineer",
        jobType: "graduate",
        jobUrl: "https://deliveroo.example.co.uk/early-careers/grad-swe",
        location: "London, UK",
        workMode: "hybrid",
        source: "company_website",
        salaryMin: 45000,
        salaryMax: 52000,
        deadlineDaysOffset: null,
        notes:
          "Ran out of time on the dynamic programming question in the online test.",
        steps: [
          { status: "wishlist", daysAgo: 65, hourUtc: 9 },
          { status: "applied", daysAgo: 63, hourUtc: 13 },
          { status: "online_assessment", daysAgo: 52, hourUtc: 10 },
          { status: "rejected", daysAgo: 44, hourUtc: 14 },
        ],
        interviews: [
          {
            daysOffset: -47,
            hourUtc: 13,
            interviewerName: "Automated HackerRank Platform",
            interviewType: "online_assessment",
            outcome: "failed",
            notes:
              "Completed 2 of 3 problems; edge cases timed out on question 3.",
          },
        ],
      },
      {
        companyName: "Ocado Technology",
        jobTitle: "Junior Platform Engineer",
        jobType: "full_time",
        jobUrl: "https://ocadotech.example.com/jobs/jr-platform-eng",
        location: "London, UK",
        workMode: "hybrid",
        source: "linkedin",
        salaryMin: 39000,
        salaryMax: 45000,
        deadlineDaysOffset: null,
        notes:
          "Did not meet the cut-off score on the Codility concurrency challenge.",
        steps: [
          { status: "applied", daysAgo: 56, hourUtc: 10 },
          { status: "online_assessment", daysAgo: 45, hourUtc: 12 },
          { status: "rejected", daysAgo: 37, hourUtc: 15 },
        ],
        interviews: [
          {
            daysOffset: -40,
            hourUtc: 10,
            interviewerName: "Codility Assessment",
            interviewType: "online_assessment",
            outcome: "failed",
            notes: "Scored 68% overall; review thread-safety patterns.",
          },
        ],
      },
      {
        companyName: "Synthesia",
        jobTitle: "Graduate AI Product Engineer",
        jobType: "graduate",
        jobUrl: "https://synthesia.example.com/jobs/grad-ai-product-eng",
        location: "London, UK",
        workMode: "hybrid",
        source: "referral",
        salaryMin: 44000,
        salaryMax: 52000,
        deadlineDaysOffset: null,
        notes:
          "Feedback noted strong frontend work but preferred more Python ML pipeline depth.",
        steps: [
          { status: "wishlist", daysAgo: 44, hourUtc: 11 },
          { status: "applied", daysAgo: 42, hourUtc: 14 },
          { status: "online_assessment", daysAgo: 33, hourUtc: 10 },
          { status: "rejected", daysAgo: 25, hourUtc: 16 },
        ],
      },
      {
        companyName: "GoCardless",
        jobTitle: "Graduate Backend Engineer",
        jobType: "graduate",
        jobUrl: "https://gocardless.example.com/careers/grad-backend-london",
        location: "London, UK",
        workMode: "hybrid",
        source: "company_website",
        salaryMin: 44000,
        salaryMax: 50000,
        deadlineDaysOffset: null,
        notes:
          "Close decision after technical round; constructive feedback on database indexing.",
        steps: [
          { status: "wishlist", daysAgo: 69, hourUtc: 10 },
          { status: "applied", daysAgo: 67, hourUtc: 12 },
          { status: "online_assessment", daysAgo: 55, hourUtc: 14 },
          { status: "interview", daysAgo: 41, hourUtc: 11 },
          { status: "rejected", daysAgo: 22, hourUtc: 15 },
        ],
        interviews: [
          {
            daysOffset: -36,
            hourUtc: 10,
            interviewerName: "Rebecca Lin",
            interviewType: "phone_screen",
            outcome: "passed",
            notes: "Good discussion on webhook delivery guarantees.",
          },
          {
            daysOffset: -26,
            hourUtc: 14,
            interviewerName: "Samir Verma",
            interviewType: "technical_interview",
            outcome: "failed",
            notes:
              "Missed composite index optimisation during PostgreSQL query review.",
          },
        ],
      },
      {
        companyName: "Thoughtworks UK",
        jobTitle: "Graduate Consultant Developer",
        jobType: "graduate",
        jobUrl:
          "https://thoughtworks.example.com/careers/grad-consultant-manchester",
        location: "Manchester, UK",
        workMode: "hybrid",
        source: "university",
        salaryMin: 35000,
        salaryMax: 41000,
        deadlineDaysOffset: null,
        notes:
          "Enjoyed the pair-programming session; narrow rejection at the final panel.",
        steps: [
          { status: "applied", daysAgo: 60, hourUtc: 9 },
          { status: "interview", daysAgo: 42, hourUtc: 13 },
          { status: "rejected", daysAgo: 19, hourUtc: 17 },
        ],
        interviews: [
          {
            daysOffset: -35,
            hourUtc: 11,
            interviewerName: "Liam O'Connor",
            interviewType: "coding_interview",
            outcome: "passed",
            notes:
              "TDD Mars Rover kata in TypeScript with clean unit test coverage.",
          },
          {
            daysOffset: -23,
            hourUtc: 15,
            interviewerName: "Amira Hassan",
            interviewType: "team_interview",
            outcome: "failed",
            notes:
              "Panel prioritised candidates with prior Agile consulting exposure.",
          },
        ],
      },
    ];

    // 5. Build application rows with consistent backdated timestamps
    const applicationValues: ApplicationInsert[] = applicationSeeds.map(
      (seedItem) => {
        const company = companyByName[seedItem.companyName];
        if (!company) {
          throw new Error(`Missing seeded company: ${seedItem.companyName}`);
        }

        const firstStep = seedItem.steps[0];
        const lastStep = seedItem.steps[seedItem.steps.length - 1];
        const appliedStep = seedItem.steps.find(
          (step) => step.status === "applied",
        );

        const createdAt = dateFromOffset(
          now,
          -firstStep.daysAgo,
          firstStep.hourUtc ?? 10,
        );
        const updatedAt = dateFromOffset(
          now,
          -lastStep.daysAgo,
          lastStep.hourUtc ?? 15,
        );
        const appliedAt = appliedStep
          ? toIsoDateString(
              dateFromOffset(
                now,
                -appliedStep.daysAgo,
                appliedStep.hourUtc ?? 12,
              ),
            )
          : null;
        const applicationDeadline =
          seedItem.deadlineDaysOffset !== null
            ? toIsoDateString(
                dateFromOffset(now, seedItem.deadlineDaysOffset, 17, 0),
              )
            : null;

        return {
          userId: targetUserId,
          companyId: company.id,
          jobTitle: seedItem.jobTitle,
          jobType: seedItem.jobType,
          jobUrl: seedItem.jobUrl,
          location: seedItem.location,
          workMode: seedItem.workMode,
          salaryMin: seedItem.salaryMin,
          salaryMax: seedItem.salaryMax,
          applicationDeadline,
          status: lastStep.status,
          appliedAt,
          notes: seedItem.notes,
          source: seedItem.source,
          createdAt,
          updatedAt,
        };
      },
    );

    const insertedApplications = await tx
      .insert(applicationsTable)
      .values(applicationValues)
      .returning();

    // 6. Build explicit status history rows and interview rows
    const statusHistoryValues: StatusHistoryInsert[] = [];
    const interviewValues: InterviewInsert[] = [];

    insertedApplications.forEach((insertedApp, index) => {
      const seedItem = applicationSeeds[index];

      seedItem.steps.forEach((step, stepIndex) => {
        const previousStatus =
          stepIndex === 0 ? null : seedItem.steps[stepIndex - 1].status;
        const stepTimestamp = dateFromOffset(
          now,
          -step.daysAgo,
          step.hourUtc ?? 10,
          stepIndex * 7,
        );

        statusHistoryValues.push({
          applicationId: insertedApp.id,
          previousStatus,
          status: step.status,
          createdAt: stepTimestamp,
        });
      });

      if (seedItem.interviews) {
        for (const interviewItem of seedItem.interviews) {
          const scheduledAt =
            interviewItem.daysOffset > 0
              ? weekdayFromOffset(
                  now,
                  interviewItem.daysOffset,
                  interviewItem.hourUtc,
                  interviewItem.minuteUtc ?? 0,
                )
              : dateFromOffset(
                  now,
                  interviewItem.daysOffset,
                  interviewItem.hourUtc,
                  interviewItem.minuteUtc ?? 0,
                );

          const recordCreatedAt =
            interviewItem.daysOffset > 0
              ? dateFromOffset(now, -4, 11, 0)
              : dateFromOffset(now, interviewItem.daysOffset - 3, 10, 0);

          interviewValues.push({
            applicationId: insertedApp.id,
            scheduledAt,
            interviewerName: interviewItem.interviewerName,
            interviewType: interviewItem.interviewType,
            notes: interviewItem.notes,
            outcome: interviewItem.outcome,
            createdAt: recordCreatedAt,
            updatedAt: recordCreatedAt,
          });
        }
      }
    });

    const insertedHistory = await tx
      .insert(applicationStatusHistoryTable)
      .values(statusHistoryValues)
      .returning();

    const insertedInterviews = await tx
      .insert(interviewsTable)
      .values(interviewValues)
      .returning();

    // 7. Log final counts per table and per status
    const countsByStatus = insertedApplications.reduce<
      Record<ApplicationStatus, number>
    >(
      (acc, app) => {
        acc[app.status] = (acc[app.status] ?? 0) + 1;
        return acc;
      },
      {
        wishlist: 0,
        applied: 0,
        online_assessment: 0,
        interview: 0,
        offer: 0,
        rejected: 0,
      },
    );

    console.log("\n--- Seed Summary ---");
    console.log(
      `Companies inserted:                  ${insertedCompanies.length}`,
    );
    console.log(
      `Applications inserted:               ${insertedApplications.length}`,
    );
    console.log(
      `Application status history inserted: ${insertedHistory.length}`,
    );
    console.log(
      `Interviews inserted:                 ${insertedInterviews.length}`,
    );
    console.log("\nApplications by final status:");
    for (const [status, count] of Object.entries(countsByStatus)) {
      console.log(`  - ${status}: ${count}`);
    }
  });

  console.log("\nSeed completed successfully.");
}

seed().catch((error) => {
  console.error("\nSeed failed:");
  console.error(error);
  process.exit(1);
});
