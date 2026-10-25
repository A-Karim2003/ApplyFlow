import Link from "next/link";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type Kpi = {
  label: string;
  value: string;
  sub: string;
  icon: LucideIcon;
  href?: string;
  tone?: "up" | "down" | "neutral";
};

const TONE_CLASSES = {
  up: "text-emerald-600 dark:text-emerald-400",
  down: "text-red-600 dark:text-red-400",
  neutral: "text-muted-foreground",
};

export function KpiCards({ items }: { items: Kpi[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const content = (
          <>
            <div className="flex items-start justify-between">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <item.icon className="size-4" />
              </div>
              {item.href && (
                <ArrowUpRight className="size-4 text-muted-foreground" />
              )}
            </div>
            <h3 className="mt-4 text-3xl font-semibold tracking-tight">
              {item.value}
            </h3>
            <p className="text-sm">{item.label}</p>
            <p
              className={cn(
                "mt-3 text-xs",
                TONE_CLASSES[item.tone ?? "neutral"],
              )}
            >
              {item.sub}
            </p>
          </>
        );

        const className = "rounded-2xl border bg-card p-5 text-card-foreground";

        return item.href ? (
          <Link
            key={item.label}
            href={item.href}
            className={cn(className, "transition-colors hover:bg-accent/40")}
          >
            {content}
          </Link>
        ) : (
          <div key={item.label} className={className}>
            {content}
          </div>
        );
      })}
    </div>
  );
}
