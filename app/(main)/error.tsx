"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function MainError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center px-4 text-center">
      <h2 className="text-lg font-semibold text-foreground text-balance">
        Couldn&apos;t load this section
      </h2>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground text-balance">
        Something went wrong fetching your data. Give it another try.
      </p>

      {error.digest && (
        <p className="mt-2 text-xs text-muted-foreground">
          Error ID: {error.digest}
        </p>
      )}

      <Button
        size="sm"
        variant="outline"
        className="mt-6 gap-2 text-sm font-medium"
        onClick={() => retry()}
      >
        <RotateCcw className="size-3.5" />
        Try again
      </Button>
    </div>
  );
}
