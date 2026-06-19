"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { updateBookingStatus } from "@/app/actions/bookings";
import { Check, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface BookingActionsProps {
  bookingId: string;
  status: string;
  isOwner: boolean;
  canManage: boolean;
}

export function BookingActions({
  bookingId,
  status,
  isOwner,
  canManage,
}: BookingActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleAction(newStatus: "CONFIRMED" | "CANCELLED") {
    setLoading(true);
    try {
      await updateBookingStatus({ bookingId, status: newStatus });
      router.refresh();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Action failed",
        description: err instanceof Error ? err.message : "Action failed",
      });
    } finally {
      setLoading(false);
    }
  }

  if (status === "CANCELLED" || status === "COMPLETED") return null;

  return (
    <div className="flex gap-1">
      {canManage && status === "PENDING" && (
        <Button
          size="sm"
          variant="outline"
          disabled={loading}
          onClick={() => handleAction("CONFIRMED")}
          title="Confirm"
        >
          <Check className="h-3 w-3" />
        </Button>
      )}
      {(isOwner || canManage) && (
        <Button
          size="sm"
          variant="ghost"
          disabled={loading}
          onClick={() => handleAction("CANCELLED")}
          title="Cancel"
          className="text-destructive hover:text-destructive"
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}
