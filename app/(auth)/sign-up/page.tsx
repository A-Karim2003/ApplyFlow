import { BrandPanel } from "../_components/brand-panel";
import { SignupForm } from "../_components/signup-form";

export default function SignUpPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-border bg-card shadow-sm lg:grid-cols-2 lg:min-h-160">
        <BrandPanel
          headline="Stop spending hours applying, start getting interviews"
          subtext="Users booked 552 interviews in the last month"
        />
        <div className="flex items-center justify-center px-6 py-14 sm:px-12">
          <SignupForm />
        </div>
      </div>
    </main>
  );
}
