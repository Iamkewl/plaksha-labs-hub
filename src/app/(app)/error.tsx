"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, RotateCcw, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[AppError]", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center p-4">
      <Card className="max-w-md w-full border-red-100">
        <CardContent className="pt-8 pb-6 text-center space-y-4">
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Page Error</h2>
            <p className="text-sm text-muted-foreground">
              {error.message === "Unauthorized"
                ? "You don't have permission to view this page."
                : "Something went wrong loading this page."}
            </p>
            {error.digest && (
              <p className="font-mono text-xs text-muted-foreground">
                Ref: {error.digest}
              </p>
            )}
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={() => reset()}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Retry
            </Button>
            <Link href="/dashboard">
              <Button size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
