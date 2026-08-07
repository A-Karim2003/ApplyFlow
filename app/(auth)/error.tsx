"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function AuthError({
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
    <div className="mx-auto flex w-full max-w-sm flex-col items-center justify-center text-center h-screen">
      <div className="mb-6 flex size-12 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="size-6 text-destructive" />
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
        Something went wrong
      </h1>
      <p className="mt-1.5 text-sm text-muted-foreground text-balance">
        We couldn&apos;t load this page. This is usually temporary.
      </p>

      <div className="mt-8 flex w-full flex-col gap-3">
        <Button
          size="lg"
          className="h-11 w-full text-sm font-semibold"
          onClick={() => retry()}
        >
          Try again
        </Button>

        <Link
          href="/sign-in"
          className="inline-flex h-11 w-full items-center justify-center rounded-md border border-input bg-background text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
        >
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
