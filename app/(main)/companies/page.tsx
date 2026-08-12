import { companies, applications } from "@/lib/data";

export default function CompaniesPage() {
  return (
    <section className="flex flex-col">
      <div className="px-4 pb-8 pt-6 md:px-8">
        <CompaniesGrid companies={companies} applications={applications} />
      </div>
    </section>
  );
}
