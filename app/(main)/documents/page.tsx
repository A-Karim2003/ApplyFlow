import { getDocumentsPageData } from "@/lib/data/documents";
import { DocumentsLibrary } from "./documents.library";

export default async function DocumentsPage() {
  const result = await getDocumentsPageData();

  if (!result.success) throw new Error(result.error);

  return (
    <div className="flex flex-col">
      <div className="px-4 pb-8 pt-6 md:px-8">
        <DocumentsLibrary documents={result.data} />
      </div>
    </div>
  );
}
