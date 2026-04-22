"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle, Package } from "lucide-react";
import { approveMaterialRequest, issueMaterialRequest } from "@/app/actions/boms";
import { useRouter } from "next/navigation";

export function RequestActions({
  requestId,
  status,
  requestedQty,
  unit,
}: {
  requestId: string;
  status: string;
  requestedQty: number;
  unit: string;
}) {
  const [approveQty, setApproveQty] = useState(String(requestedQty));
  const [issueQty, setIssueQty] = useState(String(requestedQty));
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [approveOpen, setApproveOpen] = useState(false);
  const [issueOpen, setIssueOpen] = useState(false);
  const router = useRouter();

  async function handleApprove() {
    setLoading("approve");
    setError(null);
    try {
      await approveMaterialRequest({ requestId, approvedQty: parseFloat(approveQty) });
      setApproveOpen(false);
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to approve");
    } finally {
      setLoading(null);
    }
  }

  async function handleIssue() {
    setLoading("issue");
    setError(null);
    try {
      await issueMaterialRequest({ requestId, issuedQty: parseFloat(issueQty) });
      setIssueOpen(false);
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to issue");
    } finally {
      setLoading(null);
    }
  }

  if (status === "ISSUED" || status === "REJECTED") return null;

  return (
    <div className="flex gap-2">
      {status === "PENDING_ADMIN_APPROVAL" && (
        <Dialog open={approveOpen} onOpenChange={setApproveOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
              Approve
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Approve Request</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1">
                <Label>Approved Quantity ({unit})</Label>
                <Input
                  type="number"
                  min="0"
                  step="any"
                  value={approveQty}
                  onChange={(e) => setApproveQty(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Requested: {requestedQty} {unit}
                </p>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button
                onClick={handleApprove}
                disabled={!!loading}
                className="w-full"
              >
                {loading === "approve" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Confirm Approve
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {["APPROVED", "PARTIALLY_ISSUED"].includes(status) && (
        <Dialog open={issueOpen} onOpenChange={setIssueOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Package className="mr-1.5 h-3.5 w-3.5" />
              Issue
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Issue Materials</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1">
                <Label>Quantity to Issue ({unit})</Label>
                <Input
                  type="number"
                  min="0.001"
                  step="any"
                  value={issueQty}
                  onChange={(e) => setIssueQty(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Requested: {requestedQty} {unit}
                </p>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button
                onClick={handleIssue}
                disabled={!!loading}
                className="w-full"
              >
                {loading === "issue" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Issue Materials
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
