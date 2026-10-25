import { AlertCircle } from "lucide-react";

export function SectionError({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-2xl border bg-card p-5"
    >
      <AlertCircle
        aria-hidden="true"
        className="mt-0.5 size-5 shrink-0 text-destructive"
      />

      <div className="space-y-1">
        <p className="text-sm font-medium">Unable to load this section</p>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
