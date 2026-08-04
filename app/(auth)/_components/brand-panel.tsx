import Logo from "@/app/_components/logo";

type BrandPanelProps = {
  headline: string;
  subtext: string;
};

export function BrandPanel({ headline, subtext }: BrandPanelProps) {
  return (
    <div className="relative hidden overflow-hidden bg-primary p-10 lg:flex lg:flex-col">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(currentColor 1.5px, transparent 1.5px)",
          backgroundSize: "22px 22px",
          color: "var(--color-primary-foreground)",
          opacity: 0.1,
        }}
      />

      <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-primary-foreground/10 blur-3xl" />

      {/* Logo */}
      <Logo />

      {/* Headline block */}
      <div className="relative z-10 mt-auto mb-2 max-w-sm text-primary-foreground">
        <h2 className="text-3xl font-bold leading-tight text-balance">
          {headline}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-primary-foreground/80">
          {subtext}
        </p>
      </div>
    </div>
  );
}
