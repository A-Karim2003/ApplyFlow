import { PageHeader } from "@/components/page-header";
import { DocumentsLibrary } from "@/components/documents/documents-library";
import { getDocuments } from "@/lib/data/documents";

export default async function DocumentsPage() {

  const documents = session ? await getDocuments()

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Documents"
        description="Your resumes, cover letters, and certificates in one vault."
      />
      <div className="px-4 pb-8 pt-6 md:px-8">
        <DocumentsLibrary documents={documents} />
      </div>
    </div>
  );
}
