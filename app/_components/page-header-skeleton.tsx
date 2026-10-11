import { SidebarTrigger } from "@/components/ui/sidebar";

export function PageHeaderSkeleton() {
  return (
    <header className="sticky top-0 z-10 flex flex-col gap-4 border-b bg-background/80 px-4 py-4 backdrop-blur-sm md:px-8 md:py-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <SidebarTrigger className="mt-1.5" />
          <div className="flex flex-col gap-1">
            <div className="h-8 w-48 animate-pulse rounded bg-muted" />
            <div className="h-5 w-72 max-w-full animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>
    </header>
  );
}
