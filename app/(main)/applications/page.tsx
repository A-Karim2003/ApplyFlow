import { getApplicationsPageData } from "@/lib/data/applications";
import { ApplicationsWorkspace } from "./application-workspace";

export default async function ApplicationsPage() {
  const result = await getApplicationsPageData();

  if (!result.success) {
    throw new Error(result.error);
  }

  return (
    <section className="flex flex-col">
      <div className="px-4 pb-8 pt-6 md:px-8">
        <ApplicationsWorkspace applications={result.data.applications} />
      </div>
    </section>
  );
}
