import { documentTypeEnum } from "@/db/schema";

/*=========================Document Type==========================*/

type DocumentType = (typeof documentTypeEnum.enumValues)[number];

const DOCUMENT_TYPES: Record<DocumentType, string> = {
  cv: "CV",
  cover_letter: "Cover letter",
  other: "Other",
};

export const DOCUMENT_TYPE_OPTIONS = documentTypeEnum.enumValues.map(
  (documentType) => ({
    label: DOCUMENT_TYPES[documentType],
    value: documentType,
  }),
);
