import { BrandPanel } from "../_components/brand-panel";
import { LoginForm } from "../_components/login-form";

export default function SignInPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-border bg-card shadow-sm lg:grid-cols-2 lg:min-h-160">
        <BrandPanel
          headline="Your career workspace awaits"
          subtext="Manage applications, companies, interviews, and documents from one place."
        />
        <div className="flex items-center justify-center px-6 py-14 sm:px-12">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
