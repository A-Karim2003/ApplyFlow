import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — ApplyFlow",
  description: "How ApplyFlow collects, uses and protects your personal data.",
};

const CONTACT_EMAIL = "abdoulkarim03.dev@gmail.com";
const LAST_UPDATED = "8 November 2026";

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16 lg:py-24">
      <Link
        href="/"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to ApplyFlow
      </Link>

      <h1 className="mt-8 font-serif text-4xl font-semibold tracking-tight">
        Privacy Policy
      </h1>

      <p className="mt-2 text-sm text-muted-foreground">
        Last updated: {LAST_UPDATED}
      </p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <p>
          This Privacy Policy explains how ApplyFlow collects, uses, stores and
          protects personal data when you use the application. It also explains
          your rights and how to contact ApplyFlow regarding your personal data.
        </p>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-foreground">
            Who operates ApplyFlow?
          </h2>
          <p>
            ApplyFlow is operated by AbdoulKarim Kourouma, who is the data
            controller responsible for determining how your personal data is
            processed.
          </p>
          <p>
            For privacy-related enquiries, contact{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-foreground underline underline-offset-4"
            >
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-foreground">
            What data is collected?
          </h2>
          <p>ApplyFlow collects the following information:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <span className="text-foreground">Account information:</span> Your
              name and email address. Account registration and authentication
              are assisted by Better Auth. If you sign in using Google,
              ApplyFlow receives your Google profile information, including your
              profile picture. If you register using email and password, your
              password is securely hashed before storage and is never stored as
              plain text.
            </li>
            <li>
              <span className="text-foreground">Application data:</span> job
              applications, company details, interview information, notes and
              other information you choose to add.
            </li>
            <li>
              <span className="text-foreground">Uploaded files:</span> documents
              and profile pictures you upload, which are stored in private
              Amazon S3 storage.
            </li>
            <li>
              <span className="text-foreground">Session information:</span>{" "}
              authentication cookies used to keep you signed in. Your theme
              preference is stored in your browser.
            </li>
            <li>
              <span className="text-foreground">Technical information:</span>{" "}
              limited technical information may be processed by the hosting and
              infrastructure providers to operate, secure and troubleshoot the
              application.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-foreground">
            How is your data used?
          </h2>
          <p>Personal data is processed to:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Create and manage your account.</li>
            <li>Authenticate users and maintain secure sessions.</li>
            <li>
              Store and display your job applications, interviews and documents.
            </li>
            <li>
              Provide dashboard statistics and application tracking features.
            </li>
            <li>
              Maintain application security and troubleshoot technical issues.
            </li>
            <li>
              Respond to privacy requests and comply with legal obligations.
            </li>
          </ul>
          <p>
            Personal data is not sold, used for advertising or used to train
            artificial intelligence models.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-foreground">
            Legal basis for processing
          </h2>
          <p>
            Under UK data protection law, ApplyFlow relies on the following
            legal bases where applicable:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <span className="text-foreground">Contract:</span> processing
              necessary to provide the application and its features, including
              account management and storing your records.
            </li>
            <li>
              <span className="text-foreground">Legitimate interests:</span>{" "}
              processing necessary to maintain security, prevent misuse,
              troubleshoot issues and improve the reliability of ApplyFlow.
            </li>
            <li>
              <span className="text-foreground">Legal obligation:</span>{" "}
              processing necessary to comply with applicable legal requirements.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-foreground">
            Google sign-in
          </h2>
          <p>
            ApplyFlow offers optional sign-in through Google. When you choose
            this option, ApplyFlow requests basic Google profile information,
            including your name, email address and profile picture.
          </p>
          <p>
            ApplyFlow does not request access to Gmail, Google Drive, contacts
            or other Google services.
          </p>
          <p>
            Google authentication is used to identify your account and provide
            access to ApplyFlow. Google data is not sold, used for advertising
            or used to train artificial intelligence models.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-foreground">
            Where is your data stored?
          </h2>
          <p>
            ApplyFlow uses third-party infrastructure providers to operate the
            application:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Vercel, for application hosting.</li>
            <li>Neon, for database storage.</li>
            <li>
              Amazon Web Services (AWS S3), for uploaded documents and images.
            </li>
            <li>Google, for optional authentication.</li>
            <li>
              Companies House (UK government), for company name searches in the
              company picker. Only the search text you type is sent.
            </li>
          </ul>
          <p>
            These providers process information as necessary to deliver their
            respective services. Access to personal data is restricted to what
            is necessary to operate and maintain ApplyFlow.
          </p>
          <p>
            Some providers may process personal data outside the United Kingdom.
            Where international transfers are subject to UK data protection law,
            appropriate transfer safeguards are used.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-foreground">
            Data security
          </h2>
          <p>
            ApplyFlow uses technical and organisational measures intended to
            protect personal data against unauthorised access, alteration,
            disclosure or loss. These include authentication controls, access
            restrictions and secure handling of uploaded files.
          </p>
          <p>No online service can guarantee absolute security.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-foreground">
            Data retention and deletion
          </h2>
          <p>
            Personal data is retained for as long as your account remains active
            or as long as necessary to provide the service and meet applicable
            legal obligations.
          </p>
          <p>
            To request deletion of your account and associated personal data,
            contact{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-foreground underline underline-offset-4"
            >
              {CONTACT_EMAIL}
            </a>
            . Requests will be handled in accordance with applicable data
            protection requirements.
          </p>
          <p>
            Some information may remain temporarily in backups or technical
            records before being deleted through normal retention processes.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-foreground">
            Your data protection rights
          </h2>
          <p>Under UK data protection law, you may have the right to:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Request access to your personal data.</li>
            <li>Request correction of inaccurate or incomplete information.</li>
            <li>Request deletion of your personal data.</li>
            <li>Request restriction of certain processing activities.</li>
            <li>
              Object to processing carried out under legitimate interests.
            </li>
            <li>
              Request a copy of your data in a portable format, where
              applicable.
            </li>
          </ul>
          <p>
            To exercise these rights, contact{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-foreground underline underline-offset-4"
            >
              {CONTACT_EMAIL}
            </a>
            .
          </p>
          <p>
            You also have the right to lodge a complaint with the Information
            Commissioner{"'"}s Office (ICO):{" "}
            <a
              href="https://ico.org.uk/make-a-complaint/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline underline-offset-4"
            >
              ico.org.uk
            </a>
            .
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-foreground">
            Changes to this policy
          </h2>
          <p>
            This Privacy Policy may be updated to reflect changes to ApplyFlow,
            its infrastructure or applicable data protection requirements. The
            date at the top of this page indicates when the policy was last
            updated.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-foreground">Contact</h2>
          <p>
            For questions about this Privacy Policy or how personal data is
            handled, contact ApplyFlow at{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-foreground underline underline-offset-4"
            >
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
