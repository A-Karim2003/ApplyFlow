import type { ReactNode } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-10 flex flex-col gap-4 border-b bg-background/80 px-4 py-4 backdrop-blur-sm md:px-8 md:py-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <SidebarTrigger className="mt-1.5" />
          <div className="flex flex-col gap-1">
            <h1 className="text-balance font-serif text-2xl font-semibold tracking-tight md:text-[1.75rem]">
              {title}
            </h1>
            {description ? (
              <p className="text-pretty text-sm text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>
        </div>
        {action && (
          <div className="flex shrink-0 items-center gap-2">{action}</div>
        )}
      </div>
    </header>
  );
}
