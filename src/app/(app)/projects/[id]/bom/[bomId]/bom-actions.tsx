"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CheckCircle, XCircle, Send } from "lucide-react";
import { submitBom, approveBom, rejectBom } from "@/app/actions/boms";
import { useRouter } from "next/navigation";

export function BomActions({
  bomId,
  projectId,
  status,
  canSubmit,
  canApprove,
}: {
  bomId: string;
  projectId: string;
  status: string;
  canSubmit: boolean;
  canApprove: boolean;
}) {
  const [loading, setLoading] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleAction(action: "submit" | "approve" | "reject") {
    setLoading(action);
    setError(null);
    try {
      if (action === "submit") await submitBom(bomId);
      if (action === "approve") await approveBom(bomId, notes || undefined);
      if (action === "reject") await rejectBom(bomId, notes || undefined);
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Action failed");
    } finally {
      setLoading(null);
    }
  }

  if (status === "APPROVED" || status === "REJECTED") return null;

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <p className="text-sm font-medium">Actions</p>

      {canApprove && status === "SUBMITTED" && (
        <div className="space-y-2">
          <Textarea
            placeholder="Notes for approval / rejection (optional)…"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="text-sm"
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => handleAction("approve")}
              disabled={!!loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading === "approve" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="mr-2 h-4 w-4" />
              )}
              Approve
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleAction("reject")}
              disabled={!!loading}
            >
              {loading === "reject" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <XCircle className="mr-2 h-4 w-4" />
              )}
              Reject
            </Button>
          </div>
        </div>
      )}

      {canSubmit && status === "DRAFT" && (
        <Button
          size="sm"
          onClick={() => handleAction("submit")}
          disabled={!!loading}
        >
          {loading === "submit" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Send className="mr-2 h-4 w-4" />
          )}
          Submit for Approval
        </Button>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
