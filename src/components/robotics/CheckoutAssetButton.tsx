"use client";

import { useState, useTransition } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { createCheckout } from "@/app/actions/checkouts";

interface CheckoutAssetButtonProps {
  assetId: string;
  assetName: string;
}

export function CheckoutAssetButton({
  assetId,
  assetName,
}: CheckoutAssetButtonProps) {
  const [open, setOpen] = useState(false);
  const [dueAt, setDueAt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Default due date to 7 days from now
  const defaultDue = new Date();
  defaultDue.setDate(defaultDue.getDate() + 7);
  const defaultDueStr = defaultDue.toISOString().split("T")[0];

  function handleSubmit() {
    if (!dueAt) {
      setError("Please select a due date.");
      return;
    }
    const dueDate = new Date(dueAt);
    if (dueDate <= new Date()) {
      setError("Due date must be in the future.");
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        await createCheckout({ assetId, dueAt: dueDate });
        setOpen(false);
        setDueAt("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to check out asset.");
      }
    });
  }

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        className="text-xs"
        onClick={() => {
          setError(null);
          setDueAt(defaultDueStr);
          setOpen(true);
        }}
        aria-label={`Check out ${assetName}`}
      >
        <LogOut className="h-3 w-3 mr-1" />
        Checkout
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Check Out Asset</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Asset</p>
              <p className="text-sm font-medium">{assetName}</p>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="due-date"
                className="text-sm font-medium text-foreground"
              >
                Due Date
              </label>
              <input
                id="due-date"
                type="date"
                value={dueAt}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDueAt(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" size="sm" disabled={isPending}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={isPending}
              aria-label="Confirm checkout"
            >
              {isPending ? "Checking out…" : "Confirm Checkout"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
