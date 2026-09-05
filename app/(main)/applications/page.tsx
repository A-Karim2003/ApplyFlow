import { ApplicationsWorkspace } from "./application-workspace";

export default async function ApplicationsPage() {
  return (
    <section className="flex flex-col">
      <div className="px-4 pb-8 pt-6 md:px-8">
        <ApplicationsWorkspace />
      </div>
    </section>
  );
}
