import { getApplicationsPageData } from "@/lib/data/applications";
import { ApplicationsWorkspace } from "./application-workspace";
import { getCompanies } from "@/lib/data/companies";

export default async function ApplicationsPage() {
  const [applicationsResult, companiesResult] = await Promise.all([
    getApplicationsPageData(),
    getCompanies(),
  ]);

  if (!applicationsResult.success) {
    throw new Error(applicationsResult.error);
  }

  if (!companiesResult.success) {
    throw new Error(companiesResult.error);
  }

  const companies = companiesResult.data.map((company) => ({
    id: company.id,
    name: company.name,
  }));

  return (
    <section className="flex flex-col">
      <div className="px-4 pb-8 pt-6 md:px-8">
        <ApplicationsWorkspace
          applications={applicationsResult.data.applications}
          companies={companies}
        />
      </div>
    </section>
  );
}
