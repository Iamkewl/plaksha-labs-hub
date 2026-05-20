"use client";

import { useState, useTransition } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  approveProcurementRequest,
  rejectProcurementRequest,
} from "@/app/actions/procurement";

interface RequestActionsProps {
  requestId: string;
  status: string;
}

export function RequestActions({ requestId, status }: RequestActionsProps) {
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [approvePending, startApproveTransition] = useTransition();
  const [rejectPending, startRejectTransition] = useTransition();

  const isPending = status === "pending" || status === "NEW";

  if (!isPending) return null;

  function handleApprove() {
    setError(null);
    startApproveTransition(async () => {
      try {
        await approveProcurementRequest(requestId);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to approve.");
      }
    });
  }

  function handleReject() {
    setError(null);
    startRejectTransition(async () => {
      try {
        await rejectProcurementRequest({ id: requestId, reason: reason.trim() || undefined });
        setRejectOpen(false);
        setReason("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to reject.");
      }
    });
  }

  return (
    <>
      <div className="flex items-center justify-end gap-2">
        <Button
          size="sm"
          variant="outline"
          className="text-xs"
          onClick={handleApprove}
          disabled={approvePending || rejectPending}
          aria-label="Approve request"
        >
          <Check className="h-3 w-3 mr-1" />
          {approvePending ? "Approving…" : "Approve"}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => {
            setError(null);
            setRejectOpen(true);
          }}
          disabled={approvePending || rejectPending}
          aria-label="Reject request"
        >
          <X className="h-3 w-3 mr-1" />
          Reject
        </Button>
      </div>

      {error && (
        <p className="text-xs text-destructive text-right mt-1">{error}</p>
      )}

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Reject Request</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <p className="text-sm text-muted-foreground">
              Optionally provide a reason for rejection.
            </p>
            <div className="space-y-1">
              <label
                htmlFor="reject-reason"
                className="text-sm font-medium text-foreground"
              >
                Reason
              </label>
              <textarea
                id="reject-reason"
                rows={3}
                placeholder="e.g. Insufficient budget, duplicate request…"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring placeholder:text-muted-foreground resize-none"
              />
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" size="sm" disabled={rejectPending}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleReject}
              disabled={rejectPending}
              aria-label="Confirm rejection"
            >
              {rejectPending ? "Rejecting…" : "Confirm Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
