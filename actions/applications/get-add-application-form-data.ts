"use server";

import { getCompanies, type Company } from "@/lib/data/companies";
import { getDocuments, type Document } from "@/lib/data/documents";
import { Result } from "@/types";

export type AddApplicationFormData = {
  companies: Company[];
  documents: Document[];
};

export async function getAddApplicationFormData(): Promise<
  Result<AddApplicationFormData>
> {
  const [companiesResult, documentsResult] = await Promise.all([
    getCompanies(),
    getDocuments(),
  ]);

  if (!companiesResult.success) return companiesResult;
  if (!documentsResult.success) return documentsResult;

  return {
    success: true,
    data: {
      companies: companiesResult.data,
      documents: documentsResult.data,
    },
  };
}
