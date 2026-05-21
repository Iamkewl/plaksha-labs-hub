"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, RotateCcw, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[AdminError]", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center p-4">
      <Card className="w-full max-w-md border-red-500/20">
        <CardContent className="pb-6 pt-8 text-center space-y-4">
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" aria-hidden="true" />
            </div>
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-foreground">
              Admin page error
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {error.message === "Unauthorized"
                ? "You don't have admin access. Contact your administrator."
                : "Something went wrong loading the admin panel."}
            </p>
            {error.digest && (
              <p className="font-mono text-xs text-muted-foreground/60">
                Ref: {error.digest}
              </p>
            )}
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={() => reset()}>
              <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
              Retry
            </Button>
            <Link href="/dashboard">
              <Button size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
