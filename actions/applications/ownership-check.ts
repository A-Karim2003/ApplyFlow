import "server-only";

import { db } from "@/db";
import { companiesTable, documentsTable } from "@/db/schema";
import { ApplicationFormValues } from "@/lib/validations/applications";
import { and, eq, inArray } from "drizzle-orm";

//? Returns an error message if the chosen company or documents don't belong to the user, otherwise null
export async function checkOwnership(
  userId: string,
  applicationInput: ApplicationFormValues,
  documentIds: number[],
): Promise<string | null> {
  //? Check the chosen existing company belongs to the user
  if (applicationInput.company.type === "existing") {
    const company = await db
      .select({
        id: companiesTable.id,
      })
      .from(companiesTable)
      .where(
        and(
          eq(companiesTable.id, applicationInput.company.id),
          eq(companiesTable.userId, userId),
        ),
      );

    if (company.length === 0) return "Company not found";
  }

  //? Check the chosen CV / cover letter belong to the user and are the right type
  if (documentIds.length > 0) {
    const documents = await db
      .select({
        id: documentsTable.id,
        documentType: documentsTable.documentType,
      })
      .from(documentsTable)
      .where(
        and(
          inArray(documentsTable.id, documentIds),
          eq(documentsTable.userId, userId),
        ),
      );

    for (const document of documents) {
      //? check whether a the documents has the correct type (cv or cover_letter)
      if (
        document.id === applicationInput.resumeId &&
        document.documentType !== "cv"
      ) {
        return "Selected CV not found";
      }

      if (
        document.id === applicationInput.coverLetterId &&
        document.documentType !== "cover_letter"
      ) {
        return "Selected cover letter not found";
      }
    }

    //? checks the selected documents belongs to the user
    if (documents.length !== documentIds.length) {
      return "Selected document not found";
    }
  }

  return null;
}
