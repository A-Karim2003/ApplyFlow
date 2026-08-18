CREATE TABLE "application_documents" (
	"application_id" integer NOT NULL,
	"document_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "application_documents_application_id_document_id_pk" PRIMARY KEY("application_id","document_id")
);
--> statement-breakpoint
ALTER TABLE "applications" DROP CONSTRAINT "applications_resume_document_id_documents_id_fk";
--> statement-breakpoint
ALTER TABLE "applications" DROP CONSTRAINT "applications_cover_letter_document_id_documents_id_fk";
--> statement-breakpoint
ALTER TABLE "application_documents" ADD CONSTRAINT "application_documents_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application_documents" ADD CONSTRAINT "application_documents_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "application_documents_unique_idx" ON "application_documents" USING btree ("application_id","document_id");--> statement-breakpoint
CREATE INDEX "application_documents_application_id_idx" ON "application_documents" USING btree ("application_id");--> statement-breakpoint
ALTER TABLE "applications" DROP COLUMN "resume_document_id";--> statement-breakpoint
ALTER TABLE "applications" DROP COLUMN "cover_letter_document_id";