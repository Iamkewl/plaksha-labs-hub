"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw } from "lucide-react";
import Link from "next/link";

export default function LabsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[LabsError]", error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="h-7 w-7 text-destructive" aria-hidden="true" />
      </div>
      <h1 className="mt-5 text-xl font-semibold text-foreground">
        Failed to load labs
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        We could not load the labs listing. This is usually a temporary issue —
        please try again.
      </p>
      {error.digest && (
        <p className="mt-2 font-mono text-xs text-muted-foreground/60">
          Ref: {error.digest}
        </p>
      )}
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button variant="outline" size="sm" onClick={() => reset()}>
          <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
          Try again
        </Button>
        <Link href="/">
          <Button size="sm">Go home</Button>
        </Link>
      </div>
    </div>
  );
}
