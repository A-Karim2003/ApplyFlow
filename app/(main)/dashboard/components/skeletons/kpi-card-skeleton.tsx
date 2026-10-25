export function KpiCardsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="animate-pulse rounded-2xl border bg-card p-5">
          {/* Icon and optional link indicator */}
          <div className="flex items-start justify-between">
            <div className="size-9 rounded-lg bg-muted" />
          </div>

          {/* Value */}
          <div className="mt-4 h-9 w-20 rounded bg-muted" />

          {/* Label */}
          <div className="mt-1 h-5 w-32 rounded bg-muted" />

          {/* Subtitle */}
          <div className="mt-3 h-4 w-36 rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}
