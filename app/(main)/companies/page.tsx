import { getCompaniesPageData } from "@/lib/data";
import { CompaniesGrid } from "./companies-grid";

export default async function CompaniesPage() {
  const result = await getCompaniesPageData();

  if (!result.success) {
    throw new Error(result.error);
  }

  return (
    <section className="flex flex-col">
      <div className="px-4 pb-8 pt-6 md:px-8">
        <CompaniesGrid
          companies={result.data.companies}
          applications={result.data.applications}
        />
      </div>
    </section>
  );
}
